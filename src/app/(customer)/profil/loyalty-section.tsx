'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Gift, Award, Coffee, Cake } from 'lucide-react'
import { loyaltyService } from '@/services/loyalty-service'
import { UserLoyaltyProgress, LoyaltyReward } from '@/types/supabase'
import { toast } from 'sonner'

interface LoyaltyData extends UserLoyaltyProgress {
  loyalty_program: any
}

interface RewardData extends LoyaltyReward {
  loyalty_program: any
}

export function LoyaltySection({ userId }: { userId: string }) {
  const [progress, setProgress] = useState<LoyaltyData[]>([])
  const [rewards, setRewards] = useState<RewardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      loadLoyaltyData()
    }
  }, [userId])

  const loadLoyaltyData = async () => {
    setLoading(true)
    
    // İlerleme durumunu getir
    const progressResult = await loyaltyService.getUserProgress(userId)
    if (progressResult.success) {
      setProgress(progressResult.data || [])
    }

    // Ödülleri getir
    const rewardsResult = await loyaltyService.getUserRewards(userId)
    if (rewardsResult.success) {
      setRewards(rewardsResult.data || [])
    }

    setLoading(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'purchase_count':
        return <Coffee className="h-5 w-5" />
      case 'google_review':
        return <Award className="h-5 w-5" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  const getProgressPercentage = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100)
  }

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      {/* Sadakat Programları İlerlemesi */}
      <Card>
        <CardHeader>
          <CardTitle>Sadakat Programları</CardTitle>
          <CardDescription>
            Ödüllerinize yaklaşıyorsunuz!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {progress.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Henüz bir sadakat programına katılmadınız.
            </p>
          ) : (
            progress.map((item) => {
              const percentage = getProgressPercentage(
                item.current_count,
                item.loyalty_program.required_count
              )
              
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getIcon(item.loyalty_program.type)}
                      <span className="font-medium">{item.loyalty_program.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.current_count} / {item.loyalty_program.required_count}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {item.loyalty_program.reward_description}
                  </p>
                  {item.completed_count > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Bu programı {item.completed_count} kez tamamladınız
                    </p>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Kazanılan Ödüller */}
      <Card>
        <CardHeader>
          <CardTitle>Ödüllerim</CardTitle>
          <CardDescription>
            Kazandığınız ödüller burada listelenir
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rewards.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Henüz ödül kazanmadınız.
            </p>
          ) : (
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`border rounded-lg p-4 ${
                    reward.is_used ? 'bg-gray-50 opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {reward.loyalty_program.reward_description}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Kod: {reward.reward_code}
                      </p>
                      {reward.expires_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Son kullanım: {new Date(reward.expires_at).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                    </div>
                    <div>
                      {reward.is_used ? (
                        <Badge variant="secondary">Kullanıldı</Badge>
                      ) : (
                        <Badge variant="default">Aktif</Badge>
                      )}
                    </div>
                  </div>
                  {reward.is_used && reward.used_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Kullanım tarihi: {new Date(reward.used_at).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}