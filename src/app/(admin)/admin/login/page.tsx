'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Shield, Loader2, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalı'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  remember_me: z.boolean().optional()
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      remember_me: false
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Login request data:', data)
      
      // Directly use simple auth for now
      const response = await fetch('/api/admin/auth/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Cookie'leri dahil et
        body: JSON.stringify({
          username: data.username,
          password: data.password
        }),
      })

      console.log('Login response status:', response.status)
      const result = await response.json()
      console.log('Login response data:', result)

      if (result.success) {
        // Save user info
        if (result.user) {
          localStorage.setItem('admin_user', JSON.stringify(result.user))
        }
        
        // Force reload to ensure middleware picks up the cookie
        window.location.href = '/admin'
      } else {
        console.error('Login failed:', result.error)
        setError(result.error || 'Giriş yapılırken hata oluştu')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Sunucu hatası. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Admin Paneli
              </CardTitle>
              <CardDescription className="text-gray-400">
                Butik Fırın yönetim sistemine giriş yapın
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-800 bg-red-900/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Kullanıcı Adı veya E-posta
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  {...register('username')}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="remember_me"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  {...register('remember_me')}
                  disabled={isLoading}
                />
                <Label htmlFor="remember_me" className="text-gray-300 text-sm">
                  Beni hatırla
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  'Giriş Yap'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo bilgileri */}
        <Card className="mt-4 border-gray-700 bg-gray-800/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm font-medium">Demo Giriş Bilgileri:</p>
              <div className="text-gray-300 text-sm space-y-1">
                <p><strong>Super Admin:</strong> superadmin / admin123</p>
              </div>
              <p className="text-yellow-400 text-xs mt-2">
                ⚠️ İlk giriş sonrası şifrenizi değiştirin!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2025 Butik Fırın. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  )
} 