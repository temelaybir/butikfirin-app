import { createClient } from '@/lib/supabase/client'
import bcrypt from 'bcryptjs'
import { User } from '@/types/supabase'

export class AuthService {
  private supabase = createClient()

  // Email ile kayıt
  async register(email: string, password: string, name: string, phone?: string) {
    try {
      // Şifreyi hashle
      const passwordHash = await bcrypt.hash(password, 10)
      
      // Email doğrulama token'ı oluştur
      const verificationToken = this.generateToken()
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat

      // Kullanıcıyı oluştur
      const { data, error } = await this.supabase
        .from('users')
        .insert({
          email,
          password_hash: passwordHash,
          name,
          phone,
          email_verification_token: verificationToken,
          email_verification_expires: verificationExpires.toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Email doğrulama maili gönder (bu kısım mail servisi eklendiğinde yapılacak)
      await this.sendVerificationEmail(email, verificationToken)

      return { success: true, data }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error }
    }
  }

  // Email doğrulama
  async verifyEmail(token: string) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          email_verified: true,
          email_verification_token: null,
          email_verification_expires: null
        })
        .eq('email_verification_token', token)
        .gt('email_verification_expires', new Date().toISOString())
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Email verification error:', error)
      return { success: false, error }
    }
  }

  // Email ve şifre ile giriş
  async login(email: string, password: string) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        throw new Error('Kullanıcı bulunamadı')
      }

      // Şifreyi kontrol et
      const isValidPassword = await bcrypt.compare(password, user.password_hash || '')
      if (!isValidPassword) {
        throw new Error('Geçersiz şifre')
      }

      // Email doğrulanmamışsa uyar
      if (!user.email_verified) {
        return { 
          success: false, 
          error: 'Email adresinizi doğrulamanız gerekiyor',
          needsVerification: true 
        }
      }

      // JWT token oluştur (session için)
      const token = this.generateToken()
      
      return { success: true, data: { user, token } }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error }
    }
  }

  // Magic link ile giriş isteği
  async requestMagicLink(email: string) {
    try {
      // Kullanıcıyı kontrol et
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (userError || !user) {
        throw new Error('Kullanıcı bulunamadı')
      }

      // Magic link token'ı oluştur
      const magicLinkToken = this.generateToken()
      const magicLinkExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 dakika

      // Token'ı kaydet
      const { error } = await this.supabase
        .from('users')
        .update({
          magic_link_token: magicLinkToken,
          magic_link_expires: magicLinkExpires.toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Magic link maili gönder
      await this.sendMagicLinkEmail(email, magicLinkToken)

      return { success: true }
    } catch (error) {
      console.error('Magic link request error:', error)
      return { success: false, error }
    }
  }

  // Magic link ile giriş
  async loginWithMagicLink(token: string) {
    try {
      const { data: user, error } = await this.supabase
        .from('users')
        .update({
          magic_link_token: null,
          magic_link_expires: null
        })
        .eq('magic_link_token', token)
        .gt('magic_link_expires', new Date().toISOString())
        .select()
        .single()

      if (error || !user) {
        throw new Error('Geçersiz veya süresi dolmuş link')
      }

      // JWT token oluştur
      const sessionToken = this.generateToken()

      return { success: true, data: { user, token: sessionToken } }
    } catch (error) {
      console.error('Magic link login error:', error)
      return { success: false, error }
    }
  }

  // Şifre değiştirme
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      // Kullanıcıyı getir
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single()

      if (userError || !user) {
        throw new Error('Kullanıcı bulunamadı')
      }

      // Mevcut şifreyi kontrol et
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash || '')
      if (!isValidPassword) {
        throw new Error('Mevcut şifre yanlış')
      }

      // Yeni şifreyi hashle
      const newPasswordHash = await bcrypt.hash(newPassword, 10)

      // Şifreyi güncelle
      const { error } = await this.supabase
        .from('users')
        .update({ password_hash: newPasswordHash })
        .eq('id', userId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Change password error:', error)
      return { success: false, error }
    }
  }

  // Misafir token oluştur
  async createGuestToken(userData?: any) {
    try {
      const token = this.generateToken()
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 gün

      const { data, error } = await this.supabase
        .from('guest_tokens')
        .insert({
          token,
          user_data: userData || {},
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Create guest token error:', error)
      return { success: false, error }
    }
  }

  // Misafir kullanıcıyı kayıtlı kullanıcıya dönüştür
  async convertGuestToUser(guestToken: string, email: string, password: string, name: string, phone?: string) {
    try {
      // Guest token'ı kontrol et
      const { data: guest, error: guestError } = await this.supabase
        .from('guest_tokens')
        .select('*')
        .eq('token', guestToken)
        .single()

      if (guestError || !guest) {
        throw new Error('Geçersiz misafir token')
      }

      // Yeni kullanıcı oluştur
      const registerResult = await this.register(email, password, name, phone)
      if (!registerResult.success) {
        throw registerResult.error
      }

      const user = registerResult.data

      // Guest token'ı güncelle
      await this.supabase
        .from('guest_tokens')
        .update({ converted_to_user_id: user.id })
        .eq('id', guest.id)

      // Guest'in siparişlerini kullanıcıya aktar
      await this.supabase
        .from('orders')
        .update({ 
          user_id: user.id,
          guest_token_id: null 
        })
        .eq('guest_token_id', guest.id)

      return { success: true, data: user }
    } catch (error) {
      console.error('Convert guest to user error:', error)
      return { success: false, error }
    }
  }

  // Token oluştur
  private generateToken(): string {
    return Math.random().toString(36).substr(2) + Date.now().toString(36)
  }

  // Email gönderme fonksiyonları (mail servisi eklendiğinde implement edilecek)
  private async sendVerificationEmail(email: string, token: string) {
    console.log(`Verification email would be sent to ${email} with token: ${token}`)
    // TODO: Implement email sending
  }

  private async sendMagicLinkEmail(email: string, token: string) {
    console.log(`Magic link email would be sent to ${email} with token: ${token}`)
    // TODO: Implement email sending
  }
}

export const authService = new AuthService()