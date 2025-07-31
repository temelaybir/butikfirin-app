'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Download,
  TrendingUp,
  ShoppingBag,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  CreditCard,
  Package,
  Send,
  Edit
} from 'lucide-react'

// Mock müşteri verisi
interface CustomerOrder {
  id: string
  date: string
  total: number
  status: string
  items: number
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  registrationDate: string
  lastOrder: string
  totalOrders: number
  totalSpent: number
  status: string
  avatar: string | null
  address?: {
    fullName: string
    address: string
    city: string
    district: string
    postalCode: string
  }
  orders?: CustomerOrder[]
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 555 123 4567',
    registrationDate: '2023-06-15',
    lastOrder: '2024-01-15',
    totalOrders: 12,
    totalSpent: 15750.50,
    status: 'active',
    avatar: null,
    address: {
      fullName: 'Ahmet Yılmaz',
      address: 'Atatürk Cad. No: 123 Kat: 2 Daire: 5',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34710'
    },
    orders: [
      { id: '#3210', date: '2024-01-15', total: 1250.00, status: 'completed', items: 3 },
      { id: '#3185', date: '2024-01-10', total: 875.50, status: 'completed', items: 2 },
      { id: '#3156', date: '2024-01-05', total: 2340.00, status: 'completed', items: 5 }
    ]
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    phone: '+90 555 234 5678',
    registrationDate: '2023-08-22',
    lastOrder: '2024-01-14',
    totalOrders: 8,
    totalSpent: 8340.00,
    status: 'active',
    avatar: null,
    orders: [
      { id: '#3209', date: '2024-01-14', total: 875.50, status: 'processing', items: 2 },
      { id: '#3178', date: '2024-01-08', total: 1200.00, status: 'completed', items: 1 }
    ]
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    phone: '+90 555 345 6789',
    registrationDate: '2023-09-10',
    lastOrder: '2024-01-10',
    totalOrders: 5,
    totalSpent: 4250.75,
    status: 'active',
    avatar: null
  },
  {
    id: 4,
    name: 'Fatma Öz',
    email: 'fatma@example.com',
    phone: '+90 555 456 7890',
    registrationDate: '2023-07-05',
    lastOrder: '2023-12-20',
    totalOrders: 3,
    totalSpent: 2100.00,
    status: 'inactive',
    avatar: null
  },
  {
    id: 5,
    name: 'Ali Veli',
    email: 'ali@example.com',
    phone: '+90 555 567 8901',
    registrationDate: '2023-11-12',
    lastOrder: '2024-01-08',
    totalOrders: 15,
    totalSpent: 22500.00,
    status: 'active',
    avatar: null
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)

  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditDialogOpen(true)
  }

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === updatedCustomer.id 
          ? updatedCustomer
          : customer
      )
    )
    toast.success('Müşteri bilgileri güncellendi')
    setIsEditDialogOpen(false)
  }

  const handleSendEmail = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEmailSubject('')
    setEmailContent('')
    setIsEmailDialogOpen(true)
  }

  const handleSendEmailSubmit = () => {
    if (!emailSubject || !emailContent) {
      toast.error('Konu ve içerik alanları zorunludur')
      return
    }
    // Gerçek uygulamada e-posta gönderim işlemi
    toast.success(`${selectedCustomer?.name} adlı müşteriye e-posta gönderildi`)
    setIsEmailDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800">
            <UserCheck className="mr-1 h-3 w-3" />
            Aktif
          </Badge>
        )
      case 'inactive':
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <UserX className="mr-1 h-3 w-3" />
            Pasif
          </Badge>
        )
      default:
        return <Badge>Bilinmiyor</Badge>
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / 
      customers.reduce((sum, c) => sum + c.totalOrders, 0)
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Müşteriler</h1>
          <p className="text-muted-foreground">
            Müşteri bilgilerini ve alışveriş geçmişini yönetin
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Dışa Aktar
        </Button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {customerStats.active} aktif müşteri
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₺{customerStats.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Tüm müşterilerden
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Sipariş</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₺{customerStats.avgOrderValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Sipariş başına ortalama
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Büyüme</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+180</span> yeni müşteri (30 gün)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Müşteri Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>Müşteri Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Arama ve Filtreleme */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ad, e-posta veya telefon ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Durum
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
                  Tümü
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('active')}>
                  Aktif
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('inactive')}>
                  Pasif
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tablo */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>İletişim</TableHead>
                  <TableHead>Kayıt Tarihi</TableHead>
                  <TableHead>Siparişler</TableHead>
                  <TableHead>Toplam Harcama</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer.avatar || ''} />
                          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Son sipariş: {customer.lastOrder}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {customer.registrationDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-medium">{customer.totalOrders}</p>
                        <p className="text-xs text-muted-foreground">sipariş</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      ₺{customer.totalSpent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCustomerDetails(customer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Detayları Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(customer)}>
                            <Mail className="mr-2 h-4 w-4" />
                            E-posta Gönder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Sayfalama */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {filteredCustomers.length} müşteriden {filteredCustomers.length} tanesi gösteriliyor
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Önceki
              </Button>
              <Button variant="outline" size="sm" disabled>
                Sonraki
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Müşteri Detayları Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-none w-[70vw] h-[85vh] max-h-[85vh] overflow-y-auto p-6 rounded-lg border shadow-2xl min-w-[800px] min-h-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedCustomer?.avatar || ''} />
                <AvatarFallback>
                  {selectedCustomer?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {selectedCustomer?.name}
              {getStatusBadge(selectedCustomer?.status || '')}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Müşteri Bilgileri</TabsTrigger>
              <TabsTrigger value="orders">Sipariş Geçmişi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">İletişim Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer?.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Kayıt Tarihi: {selectedCustomer?.registrationDate}</span>
                    </div>
                  </CardContent>
                </Card>

                {selectedCustomer?.address && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Adres Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">{selectedCustomer.address.fullName}</p>
                          <p>{selectedCustomer.address.address}</p>
                          <p>{selectedCustomer.address.city}, {selectedCustomer.address.district}</p>
                          <p>{selectedCustomer.address.postalCode}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alışveriş İstatistikleri</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{selectedCustomer?.totalOrders}</div>
                      <div className="text-sm text-muted-foreground">Toplam Sipariş</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₺{selectedCustomer?.totalSpent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-muted-foreground">Toplam Harcama</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ₺{selectedCustomer?.totalOrders ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0.00'}
                      </div>
                      <div className="text-sm text-muted-foreground">Ortalama Sipariş</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sipariş Geçmişi</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCustomer?.orders && selectedCustomer.orders.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCustomer.orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-muted-foreground">{order.date}</p>
                              <p className="text-sm">{order.items} ürün</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₺{order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                              <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                {order.status === 'completed' ? 'Tamamlandı' : 
                                 order.status === 'processing' ? 'Hazırlanıyor' : order.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingBag className="mx-auto h-12 w-12 mb-4" />
                      <p>Henüz sipariş bulunmuyor</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => handleSendEmail(selectedCustomer!)}>
              <Mail className="mr-2 h-4 w-4" />
              E-posta Gönder
            </Button>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Kapat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
       
       {/* Müşteri Düzenleme Dialog */}
       <CustomerEditDialog
         customer={selectedCustomer}
         open={isEditDialogOpen}
         onOpenChange={setIsEditDialogOpen}
         onSave={handleUpdateCustomer}
       />

       {/* E-posta Gönder Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>E-posta Gönder</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="emailSubject" className="block text-sm font-medium text-muted-foreground">
                Konu
              </label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="E-posta konusu"
              />
            </div>
            <div>
              <label htmlFor="emailContent" className="block text-sm font-medium text-muted-foreground">
                İçerik
              </label>
              <Textarea
                id="emailContent"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="E-posta içeriği"
                rows={10}
              />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end mt-4">
            <Button onClick={handleSendEmailSubmit}>Gönder</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 

// Müşteri Düzenleme Dialog Component
interface CustomerEditDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: Customer) => void
}

function CustomerEditDialog({ customer, open, onOpenChange, onSave }: CustomerEditDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active',
    address: {
      fullName: '',
      address: '',
      city: '',
      district: '',
      postalCode: ''
    }
  })

  // Form'u customer verisiyle doldur
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        address: customer.address || {
          fullName: '',
          address: '',
          city: '',
          district: '',
          postalCode: ''
        }
      })
    }
  }, [customer])

  const handleSave = () => {
    if (!customer) return
    
    const updatedCustomer: Customer = {
      ...customer,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      address: formData.address
    }
    
    onSave(updatedCustomer)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[70vw] h-[85vh] max-h-[85vh] overflow-y-auto p-6 rounded-lg border shadow-2xl min-w-[800px] min-h-[600px]">
        <DialogHeader>
          <DialogTitle>Müşteri Bilgilerini Düzenle</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Kişisel Bilgiler</TabsTrigger>
            <TabsTrigger value="address">Adres Bilgileri</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ad Soyad</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ad Soyad"
                />
              </div>
              <div>
                <label className="text-sm font-medium">E-posta</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="E-posta adresi"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telefon</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Telefon numarası"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Durum</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="address" className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ad Soyad</label>
                <Input
                  value={formData.address.fullName}
                  onChange={(e) => handleAddressChange('fullName', e.target.value)}
                  placeholder="Teslimat ad soyad"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Posta Kodu</label>
                <Input
                  value={formData.address.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  placeholder="Posta kodu"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Adres</label>
                <Textarea
                  value={formData.address.address}
                  onChange={(e) => handleAddressChange('address', e.target.value)}
                  placeholder="Tam adres"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">İl</label>
                <Input
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="İl"
                />
              </div>
              <div>
                <label className="text-sm font-medium">İlçe</label>
                <Input
                  value={formData.address.district}
                  onChange={(e) => handleAddressChange('district', e.target.value)}
                  placeholder="İlçe"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleSave}>
            Kaydet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 