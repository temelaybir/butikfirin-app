import { createClient } from '@/lib/supabase/client'
import { LoyaltyProgram, UserLoyaltyProgress, LoyaltyReward } from '@/types/supabase'

export class LoyaltyService {
  private supabase = createClient()

  // Tüm aktif sadakat programlarını getir
  async getActivePrograms() {
    try {
      const { data, error } = await this.supabase
        .from('loyalty_programs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get active programs error:', error)
      return { success: false, error }
    }
  }

  // Kullanıcının sadakat ilerlemesini getir
  async getUserProgress(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_loyalty_progress')
        .select(`
          *,
          loyalty_program:loyalty_programs(*)
        `)
        .eq('user_id', userId)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get user progress error:', error)
      return { success: false, error }
    }
  }

  // Sipariş sonrası sadakat puanı ekle
  async addPurchaseProgress(userId: string) {
    try {
      // Purchase count tipindeki programları getir
      const { data: programs, error: programError } = await this.supabase
        .from('loyalty_programs')
        .select('*')
        .eq('type', 'purchase_count')
        .eq('is_active', true)

      if (programError) throw programError

      for (const program of programs || []) {
        // Mevcut ilerlemeyi getir veya oluştur
        const { data: progress, error: progressError } = await this.supabase
          .from('user_loyalty_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('loyalty_program_id', program.id)
          .single()

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError
        }

        if (!progress) {
          // Yeni ilerleme kaydı oluştur
          await this.supabase
            .from('user_loyalty_progress')
            .insert({
              user_id: userId,
              loyalty_program_id: program.id,
              current_count: 1,
              last_action_date: new Date().toISOString()
            })
        } else {
          // Mevcut ilerlemeyi güncelle
          const newCount = progress.current_count + 1
          const isCompleted = newCount >= program.required_count

          if (isCompleted) {
            // Ödül oluştur
            await this.createReward(userId, program.id)

            // İlerlemeyi sıfırla
            await this.supabase
              .from('user_loyalty_progress')
              .update({
                current_count: 0,
                completed_count: progress.completed_count + 1,
                last_action_date: new Date().toISOString()
              })
              .eq('id', progress.id)
          } else {
            // Sadece sayacı artır
            await this.supabase
              .from('user_loyalty_progress')
              .update({
                current_count: newCount,
                last_action_date: new Date().toISOString()
              })
              .eq('id', progress.id)
          }
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Add purchase progress error:', error)
      return { success: false, error }
    }
  }

  // Google yorumu ekle
  async addGoogleReview(userId: string, reviewData: {
    rating: number
    review_text?: string
    reviewer_name?: string
    review_date?: string
  }) {
    try {
      // 5 yıldızlı yorumları kontrol et
      if (reviewData.rating !== 5) {
        return { success: true, message: 'Sadece 5 yıldızlı yorumlar sayılır' }
      }

      // Yorumu kaydet
      const { error: reviewError } = await this.supabase
        .from('google_reviews')
        .insert({
          user_id: userId,
          ...reviewData,
          verified: false // Admin onayı gerekli
        })

      if (reviewError) throw reviewError

      // Google review tipindeki programları getir
      const { data: programs, error: programError } = await this.supabase
        .from('loyalty_programs')
        .select('*')
        .eq('type', 'google_review')
        .eq('is_active', true)

      if (programError) throw programError

      for (const program of programs || []) {
        // Kullanıcının 5 yıldızlı yorum sayısını getir
        const { count, error: countError } = await this.supabase
          .from('google_reviews')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('rating', 5)
          .eq('verified', true)

        if (countError) throw countError

        // İlerlemeyi güncelle
        const { data: progress, error: progressError } = await this.supabase
          .from('user_loyalty_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('loyalty_program_id', program.id)
          .single()

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError
        }

        const currentCount = count || 0

        if (!progress) {
          // Yeni ilerleme kaydı oluştur
          await this.supabase
            .from('user_loyalty_progress')
            .insert({
              user_id: userId,
              loyalty_program_id: program.id,
              current_count: currentCount,
              last_action_date: new Date().toISOString()
            })
        } else {
          // İlerlemeyi güncelle
          const isCompleted = currentCount >= program.required_count && 
                            progress.current_count < program.required_count

          if (isCompleted) {
            // Ödül oluştur
            await this.createReward(userId, program.id)

            await this.supabase
              .from('user_loyalty_progress')
              .update({
                current_count: currentCount,
                completed_count: progress.completed_count + 1,
                last_action_date: new Date().toISOString()
              })
              .eq('id', progress.id)
          } else {
            await this.supabase
              .from('user_loyalty_progress')
              .update({
                current_count: currentCount,
                last_action_date: new Date().toISOString()
              })
              .eq('id', progress.id)
          }
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Add Google review error:', error)
      return { success: false, error }
    }
  }

  // Ödül oluştur
  private async createReward(userId: string, programId: string) {
    try {
      const rewardCode = this.generateRewardCode()
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 gün

      const { data, error } = await this.supabase
        .from('loyalty_rewards')
        .insert({
          user_id: userId,
          loyalty_program_id: programId,
          reward_code: rewardCode,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Kullanıcıya bildirim gönder
      await this.sendRewardNotification(userId, programId, rewardCode)

      return { success: true, data }
    } catch (error) {
      console.error('Create reward error:', error)
      return { success: false, error }
    }
  }

  // Kullanıcının ödüllerini getir
  async getUserRewards(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('loyalty_rewards')
        .select(`
          *,
          loyalty_program:loyalty_programs(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get user rewards error:', error)
      return { success: false, error }
    }
  }

  // Ödül kullan
  async useReward(rewardCode: string) {
    try {
      const { data, error } = await this.supabase
        .from('loyalty_rewards')
        .update({
          is_used: true,
          used_at: new Date().toISOString()
        })
        .eq('reward_code', rewardCode)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Use reward error:', error)
      return { success: false, error }
    }
  }

  // Ödül kodu oluştur
  private generateRewardCode(): string {
    const prefix = 'BF' // Butik Fırın
    const random = Math.random().toString(36).substr(2, 8).toUpperCase()
    return `${prefix}-${random}`
  }

  // Bildirim gönder
  private async sendRewardNotification(userId: string, programId: string, rewardCode: string) {
    try {
      const { data: program } = await this.supabase
        .from('loyalty_programs')
        .select('*')
        .eq('id', programId)
        .single()

      if (!program) return

      await this.supabase
        .from('notifications')
        .insert({
          type: 'reward_earned',
          title: 'Tebrikler! Ödül Kazandınız',
          message: `${program.name} programından ${program.reward_description} kazandınız! Ödül kodunuz: ${rewardCode}`,
          data: {
            user_id: userId,
            program_id: programId,
            reward_code: rewardCode
          }
        })
    } catch (error) {
      console.error('Send reward notification error:', error)
    }
  }
}

export const loyaltyService = new LoyaltyService()