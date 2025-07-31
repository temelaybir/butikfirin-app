'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Gift, Users, Award, TrendingUp } from 'lucide-react'
import { loyaltyService } from '@/services/loyalty-service'
import { LoyaltyProgram } from '@/types/supabase'

export default function LoyaltyProgramPage() {
  const [programs, setPrograms] = useState<LoyaltyProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<LoyaltyProgram | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'purchase_count' as 'purchase_count' | 'google_review',
    required_count: 5,
    reward_description: '',
    is_active: true
  })

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    setLoading(true)
    const result = await loyaltyService.getActivePrograms()
    if (result.success) {
      setPrograms(result.data || [])
    } else {
      toast.error('Sadakat programları yüklenemedi')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      // TODO: Implement save functionality with Supabase
      toast.success(editingProgram ? 'Program güncellendi' : 'Program oluşturuldu')
      setDialogOpen(false)
      resetForm()
      loadPrograms()
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bu programı silmek istediğinizden emin misiniz?')) {
      try {
        // TODO: Implement delete functionality
        toast.success('Program silindi')
        loadPrograms()
      } catch (error) {
        toast.error('Bir hata oluştu')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'purchase_count',
      required_count: 5,
      reward_description: '',
      is_active: true
    })
    setEditingProgram(null)
  }

  const openEditDialog = (program: LoyaltyProgram) => {
    setEditingProgram(program)
    setFormData({
      name: program.name,
      description: program.description || '',
      type: program.type,
      required_count: program.required_count,
      reward_description: program.reward_description,
      is_active: program.is_active
    })
    setDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sadakat Programları</h1>
        <p className="text-muted-foreground">
          Müşterilerinizi ödüllendirin ve sadakatlerini artırın
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Programlar</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.filter(p => p.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Katılımcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dağıtılan Ödüller</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanım Oranı</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
          </CardContent>
        </Card>
      </div>

      {/* Programlar Tablosu */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sadakat Programları</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Program
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProgram ? 'Programı Düzenle' : 'Yeni Sadakat Programı'}
                  </DialogTitle>
                  <DialogDescription>
                    Müşterilerinizi ödüllendirmek için yeni bir program oluşturun
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Program Adı</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Örn: 5 Siparişe 1 Kahve"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Program hakkında detaylı bilgi"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Program Tipi</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'purchase_count' | 'google_review') => 
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purchase_count">Sipariş Sayısı</SelectItem>
                        <SelectItem value="google_review">Google Yorumu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="required_count">Gerekli Sayı</Label>
                    <Input
                      id="required_count"
                      type="number"
                      min="1"
                      value={formData.required_count}
                      onChange={(e) => setFormData({ ...formData, required_count: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reward_description">Ödül Açıklaması</Label>
                    <Input
                      id="reward_description"
                      value={formData.reward_description}
                      onChange={(e) => setFormData({ ...formData, reward_description: e.target.value })}
                      placeholder="Örn: 1 Türk Kahvesi Hediye"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Program Aktif</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={handleSave}>
                    {editingProgram ? 'Güncelle' : 'Oluştur'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Adı</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Gerekli Sayı</TableHead>
                <TableHead>Ödül</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Yükleniyor...
                  </TableCell>
                </TableRow>
              ) : programs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Henüz sadakat programı oluşturulmamış
                  </TableCell>
                </TableRow>
              ) : (
                programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>
                      {program.type === 'purchase_count' ? 'Sipariş Sayısı' : 'Google Yorumu'}
                    </TableCell>
                    <TableCell>{program.required_count}</TableCell>
                    <TableCell>{program.reward_description}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        program.is_active 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        {program.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(program)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(program.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}