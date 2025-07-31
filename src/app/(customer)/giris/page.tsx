'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { authService } from '@/services/auth-service'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Giriş form verileri
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  // Kayıt form verileri
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  })
  
  // Magic link form verileri
  const [magicLinkEmail, setMagicLinkEmail] = useState('')

  // Email ve şifre ile giriş
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await authService.login(loginData.email, loginData.password)
    
    if (result.success && result.data) {
      toast.success('Giriş başarılı!')
      // Token'ı localStorage'a kaydet
      localStorage.setItem('authToken', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
      router.push('/profil')
    } else if (result.needsVerification) {
      toast.error('Email adresinizi doğrulamanız gerekiyor')
    } else {
      toast.error('Giriş başarısız. Email veya şifrenizi kontrol edin.')
    }
    
    setLoading(false)
  }

  // Yeni üyelik
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor')
      return
    }
    
    if (registerData.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır')
      return
    }
    
    setLoading(true)
    
    const result = await authService.register(
      registerData.email,
      registerData.password,
      registerData.name,
      registerData.phone
    )
    
    if (result.success) {
      toast.success('Kayıt başarılı! Email adresinize doğrulama linki gönderildi.')
      // Giriş sekmesine geç
      document.getElementById('login-tab')?.click()
    } else {
      toast.error('Kayıt başarısız. Bu email adresi zaten kullanılıyor olabilir.')
    }
    
    setLoading(false)
  }

  // Magic link ile giriş
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await authService.requestMagicLink(magicLinkEmail)
    
    if (result.success) {
      toast.success('Giriş linki email adresinize gönderildi!')
      setMagicLinkEmail('')
    } else {
      toast.error('Email adresi bulunamadı')
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Hoş Geldiniz</CardTitle>
          <CardDescription>
            Hesabınıza giriş yapın veya yeni üyelik oluşturun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login" id="login-tab">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register">Üye Ol</TabsTrigger>
              <TabsTrigger value="magic-link">Hızlı Giriş</TabsTrigger>
            </TabsList>
            
            {/* Giriş Yap */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="ornek@email.com"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Şifre</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  <a href="#" className="hover:underline">Şifremi unuttum</a>
                </p>
              </form>
            </TabsContent>
            
            {/* Üye Ol */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Ad Soyad</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Adınız Soyadınız"
                      className="pl-10"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="ornek@email.com"
                      className="pl-10"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Telefon (Opsiyonel)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      className="pl-10"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Şifre</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Şifre Tekrar</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Kayıt yapılıyor...' : 'Üye Ol'}
                </Button>
              </form>
            </TabsContent>
            
            {/* Hızlı Giriş (Magic Link) */}
            <TabsContent value="magic-link">
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Email adresinize göndereceğimiz link ile şifresiz giriş yapabilirsiniz.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="magic-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="magic-email"
                      type="email"
                      placeholder="ornek@email.com"
                      className="pl-10"
                      value={magicLinkEmail}
                      onChange={(e) => setMagicLinkEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Link gönderiliyor...' : 'Giriş Linki Gönder'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}