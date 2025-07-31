import { createClient } from '@/lib/supabase/client'
import * as XLSX from 'xlsx'

export class ExportService {
  private supabase = createClient()

  // Müşteri listesini dışa aktar
  async exportCustomerList(filters?: {
    email_verified?: boolean
    has_orders?: boolean
    date_from?: string
    date_to?: string
  }) {
    try {
      // Müşterileri getir
      let query = this.supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          phone,
          email_verified,
          created_at,
          orders:orders(count)
        `)

      // Filtreleri uygula
      if (filters?.email_verified !== undefined) {
        query = query.eq('email_verified', filters.email_verified)
      }

      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from)
      }

      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

      const { data: users, error } = await query

      if (error) throw error

      // Has orders filter
      let filteredUsers = users || []
      if (filters?.has_orders !== undefined) {
        filteredUsers = filteredUsers.filter(user => {
          const hasOrders = (user.orders as any)[0]?.count > 0
          return filters.has_orders ? hasOrders : !hasOrders
        })
      }

      // Export formatına dönüştür
      const exportData = filteredUsers.map(user => ({
        'Ad Soyad': user.name,
        'Email': user.email,
        'Telefon': user.phone || '-',
        'Email Doğrulandı': user.email_verified ? 'Evet' : 'Hayır',
        'Kayıt Tarihi': new Date(user.created_at).toLocaleDateString('tr-TR'),
        'Sipariş Sayısı': (user.orders as any)[0]?.count || 0
      }))

      // Log kaydet
      await this.logExport('email_list', filters, exportData.length)

      return { 
        success: true, 
        data: exportData,
        count: exportData.length 
      }
    } catch (error) {
      console.error('Export customer list error:', error)
      return { success: false, error }
    }
  }

  // SMS listesini dışa aktar (telefon numarası olanlar)
  async exportSMSList(filters?: {
    email_verified?: boolean
    has_orders?: boolean
    date_from?: string
    date_to?: string
  }) {
    try {
      // Telefon numarası olan müşterileri getir
      let query = this.supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          phone,
          email_verified,
          created_at,
          orders:orders(count)
        `)
        .not('phone', 'is', null)

      // Filtreleri uygula
      if (filters?.email_verified !== undefined) {
        query = query.eq('email_verified', filters.email_verified)
      }

      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from)
      }

      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

      const { data: users, error } = await query

      if (error) throw error

      // Has orders filter
      let filteredUsers = users || []
      if (filters?.has_orders !== undefined) {
        filteredUsers = filteredUsers.filter(user => {
          const hasOrders = (user.orders as any)[0]?.count > 0
          return filters.has_orders ? hasOrders : !hasOrders
        })
      }

      // Export formatına dönüştür
      const exportData = filteredUsers.map(user => ({
        'Ad Soyad': user.name,
        'Telefon': user.phone,
        'Email': user.email,
        'Kayıt Tarihi': new Date(user.created_at).toLocaleDateString('tr-TR'),
        'Sipariş Sayısı': (user.orders as any)[0]?.count || 0
      }))

      // Log kaydet
      await this.logExport('sms_list', filters, exportData.length)

      return { 
        success: true, 
        data: exportData,
        count: exportData.length 
      }
    } catch (error) {
      console.error('Export SMS list error:', error)
      return { success: false, error }
    }
  }

  // Sadakat programı raporunu dışa aktar
  async exportLoyaltyReport() {
    try {
      const { data: progress, error } = await this.supabase
        .from('user_loyalty_progress')
        .select(`
          *,
          user:users(name, email, phone),
          loyalty_program:loyalty_programs(name, type, required_count)
        `)

      if (error) throw error

      const exportData = (progress || []).map(item => ({
        'Müşteri': item.user?.name || '-',
        'Email': item.user?.email || '-',
        'Telefon': item.user?.phone || '-',
        'Program': item.loyalty_program?.name || '-',
        'Mevcut İlerleme': `${item.current_count}/${item.loyalty_program?.required_count || 0}`,
        'Tamamlama Sayısı': item.completed_count,
        'Son İşlem': item.last_action_date ? new Date(item.last_action_date).toLocaleDateString('tr-TR') : '-'
      }))

      return { 
        success: true, 
        data: exportData,
        count: exportData.length 
      }
    } catch (error) {
      console.error('Export loyalty report error:', error)
      return { success: false, error }
    }
  }

  // Excel dosyası oluştur
  createExcelFile(data: any[], filename: string) {
    try {
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Veri')

      // Sütun genişliklerini ayarla
      const colWidths = Object.keys(data[0] || {}).map(() => ({ wch: 20 }))
      ws['!cols'] = colWidths

      // Excel dosyasını oluştur
      XLSX.writeFile(wb, `${filename}.xlsx`)

      return { success: true }
    } catch (error) {
      console.error('Create Excel file error:', error)
      return { success: false, error }
    }
  }

  // CSV dosyası oluştur
  createCSVFile(data: any[], filename: string) {
    try {
      if (data.length === 0) {
        throw new Error('Veri bulunamadı')
      }

      // CSV header
      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header]
            // Virgül içeren değerleri tırnak içine al
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`
            }
            return value
          }).join(',')
        )
      ].join('\n')

      // Blob oluştur ve indir
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${filename}.csv`
      link.click()

      return { success: true }
    } catch (error) {
      console.error('Create CSV file error:', error)
      return { success: false, error }
    }
  }

  // Export log kaydet
  private async logExport(type: 'sms_list' | 'email_list', filters: any, rowCount: number) {
    try {
      await this.supabase
        .from('export_logs')
        .insert({
          export_type: type,
          filters,
          row_count: rowCount
        })
    } catch (error) {
      console.error('Log export error:', error)
    }
  }
}

export const exportService = new ExportService()