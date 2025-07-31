import { createClient } from '@/lib/supabase/client'
import { Notification } from '@/types/supabase'

export class NotificationService {
  private supabase = createClient()
  private subscribers: Set<(notification: Notification) => void> = new Set()

  // Real-time bildirimleri dinle
  async subscribeToNotifications(callback: (notification: Notification) => void) {
    this.subscribers.add(callback)

    // Supabase real-time subscription
    const subscription = this.supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const notification = payload.new as Notification
          this.notifySubscribers(notification)
        }
      )
      .subscribe()

    return () => {
      this.subscribers.delete(callback)
      subscription.unsubscribe()
    }
  }

  // Yeni sipariş bildirimi oluştur
  async createOrderNotification(orderData: {
    order_id: string
    order_number: string
    customer_name: string
    total_amount: number
    items: any[]
  }) {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .insert({
          order_id: orderData.order_id,
          type: 'new_order',
          title: `Yeni Sipariş: #${orderData.order_number}`,
          message: `${orderData.customer_name} tarafından ${orderData.total_amount} TL tutarında sipariş verildi.`,
          data: orderData
        })

      if (error) throw error

      // Ses çal (browser notification API kullanarak)
      this.playNotificationSound()

      return { success: true }
    } catch (error) {
      console.error('Create order notification error:', error)
      return { success: false, error }
    }
  }

  // Sipariş durumu güncelleme bildirimi
  async createStatusUpdateNotification(orderData: {
    order_id: string
    order_number: string
    old_status: string
    new_status: string
    customer_name: string
  }) {
    try {
      const statusMessages: Record<string, string> = {
        confirmed: 'onaylandı',
        preparing: 'hazırlanıyor',
        ready: 'hazır',
        completed: 'tamamlandı',
        cancelled: 'iptal edildi'
      }

      const { error } = await this.supabase
        .from('notifications')
        .insert({
          order_id: orderData.order_id,
          type: 'status_update',
          title: `Sipariş Durumu Güncellendi: #${orderData.order_number}`,
          message: `${orderData.customer_name} siparişi ${statusMessages[orderData.new_status] || orderData.new_status}.`,
          data: orderData
        })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Create status update notification error:', error)
      return { success: false, error }
    }
  }

  // Bildirimleri getir
  async getNotifications(limit = 50, offset = 0) {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get notifications error:', error)
      return { success: false, error }
    }
  }

  // Bildirimi okundu olarak işaretle
  async markAsRead(notificationId: string) {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Mark as read error:', error)
      return { success: false, error }
    }
  }

  // Tüm bildirimleri okundu olarak işaretle
  async markAllAsRead() {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Mark all as read error:', error)
      return { success: false, error }
    }
  }

  // Okunmamış bildirim sayısını getir
  async getUnreadCount() {
    try {
      const { count, error } = await this.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

      if (error) throw error
      return { success: true, count: count || 0 }
    } catch (error) {
      console.error('Get unread count error:', error)
      return { success: false, error, count: 0 }
    }
  }

  // Browser notification izni iste
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  // Browser notification göster
  async showBrowserNotification(title: string, body: string, icon?: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: icon || '/icon.svg',
        badge: '/icon.svg',
        vibrate: [200, 100, 200],
        tag: 'butik-firin-notification',
        requireInteraction: true
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    }
  }

  // Bildirim sesi çal
  private playNotificationSound() {
    try {
      const audio = new Audio('/sounds/notification.mp3')
      audio.volume = 0.5
      audio.play().catch(e => console.log('Could not play notification sound:', e))
    } catch (error) {
      console.error('Play notification sound error:', error)
    }
  }

  // Subscriber'lara bildirim gönder
  private notifySubscribers(notification: Notification) {
    this.subscribers.forEach(callback => {
      try {
        callback(notification)
      } catch (error) {
        console.error('Subscriber callback error:', error)
      }
    })

    // Browser notification göster
    if (notification.type === 'new_order') {
      this.showBrowserNotification(
        notification.title,
        notification.message,
        '/icon.svg'
      )
    }
  }
}

export const notificationService = new NotificationService()