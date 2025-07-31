'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { toast } from 'sonner'
import { Download, Mail, MessageSquare, Award, Filter } from 'lucide-react'
import { exportService } from '@/services/export-service'

export default function ExportPage() {
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    email_verified: undefined as boolean | undefined,
    has_orders: undefined as boolean | undefined,
    date_from: undefined as string | undefined,
    date_to: undefined as string | undefined
  })
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv'>('excel')

  // Email listesi dışa aktar
  const handleExportEmailList = async () => {
    setLoading(true)
    
    const result = await exportService.exportCustomerList(filters)
    
    if (result.success && result.data) {
      const filename = `musteri-email-listesi-${new Date().toISOString().split('T')[0]}`
      
      if (exportFormat === 'excel') {
        exportService.createExcelFile(result.data, filename)
      } else {
        exportService.createCSVFile(result.data, filename)
      }
      
      toast.success(`${result.count} müşteri başarıyla dışa aktarıldı`)
    } else {
      toast.error('Dışa aktarma başarısız')
    }
    
    setLoading(false)
  }

  // SMS listesi dışa aktar
  const handleExportSMSList = async () => {
    setLoading(true)
    
    const result = await exportService.exportSMSList(filters)
    
    if (result.success && result.data) {
      const filename = `musteri-sms-listesi-${new Date().toISOString().split('T')[0]}`
      
      if (exportFormat === 'excel') {
        exportService.createExcelFile(result.data, filename)
      } else {
        exportService.createCSVFile(result.data, filename)
      }
      
      toast.success(`${result.count} telefon numarası başarıyla dışa aktarıldı`)
    } else {
      toast.error('Dışa aktarma başarısız')
    }
    
    setLoading(false)
  }

  // Sadakat raporu dışa aktar
  const handleExportLoyaltyReport = async () => {
    setLoading(true)
    
    const result = await exportService.exportLoyaltyReport()
    
    if (result.success && result.data) {
      const filename = `sadakat-programi-raporu-${new Date().toISOString().split('T')[0]}`
      
      if (exportFormat === 'excel') {
        exportService.createExcelFile(result.data, filename)
      } else {
        exportService.createCSVFile(result.data, filename)
      }
      
      toast.success('Sadakat programı raporu başarıyla dışa aktarıldı')
    } else {
      toast.error('Dışa aktarma başarısız')
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Veri Dışa Aktarma</h1>
        <p className="text-muted-foreground">
          Müşteri listelerini ve raporları dışa aktarın
        </p>
      </div>

      {/* Filtreler */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
          <CardDescription>
            Dışa aktarmak istediğiniz verileri filtreleyebilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Email Doğrulama Durumu</Label>
              <Select
                value={filters.email_verified?.toString() || 'all'}
                onValueChange={(value) => 
                  setFilters({ 
                    ...filters, 
                    email_verified: value === 'all' ? undefined : value === 'true' 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="true">Doğrulanmış</SelectItem>
                  <SelectItem value="false">Doğrulanmamış</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sipariş Durumu</Label>
              <Select
                value={filters.has_orders?.toString() || 'all'}
                onValueChange={(value) => 
                  setFilters({ 
                    ...filters, 
                    has_orders: value === 'all' ? undefined : value === 'true' 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="true">Sipariş Verenler</SelectItem>
                  <SelectItem value="false">Sipariş Vermeyenler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dosya Formatı</Label>
              <Select
                value={exportFormat}
                onValueChange={(value: 'excel' | 'csv') => setExportFormat(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dışa Aktarma Seçenekleri */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Email Listesi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Listesi
            </CardTitle>
            <CardDescription>
              Toplu email göndermek için müşteri email listesi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ad, soyad, email, telefon ve sipariş sayısı bilgilerini içerir.
            </p>
            <Button 
              onClick={handleExportEmailList} 
              disabled={loading}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Email Listesini İndir
            </Button>
          </CardContent>
        </Card>

        {/* SMS Listesi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              SMS Listesi
            </CardTitle>
            <CardDescription>
              Toplu SMS göndermek için telefon numaraları
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Telefon numarası olan müşterilerin listesi.
            </p>
            <Button 
              onClick={handleExportSMSList} 
              disabled={loading}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              SMS Listesini İndir
            </Button>
          </CardContent>
        </Card>

        {/* Sadakat Programı Raporu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Sadakat Raporu
            </CardTitle>
            <CardDescription>
              Sadakat programı katılım ve ilerleme durumu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Müşterilerin sadakat programı ilerlemeleri.
            </p>
            <Button 
              onClick={handleExportLoyaltyReport} 
              disabled={loading}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Raporu İndir
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bilgi Notu */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Önemli Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Dışa aktarılan veriler KVKK kapsamında korunmalıdır</li>
            <li>Email ve SMS gönderimlerinde müşteri izinlerine dikkat edilmelidir</li>
            <li>Tüm dışa aktarma işlemleri sistem tarafından loglanmaktadır</li>
            <li>Excel dosyaları Microsoft Excel, Google Sheets ve benzeri programlarda açılabilir</li>
            <li>CSV dosyaları virgülle ayrılmış değerler içerir ve tüm programlarda açılabilir</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}