import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Admin rotaları
const ADMIN_ROUTES = [
  '/admin',
  '/admin/dashboard',
  '/admin/urunler',
  '/admin/kategoriler',
  '/admin/siparisler',
  '/admin/musteriler',
  '/admin/raporlar',
  '/admin/ayarlar',
  '/admin/tema',
  '/admin/icerik',
  '/admin/bildirimler',
  '/admin/guvenlik',
  '/admin/site-ayarlari',
  '/admin/header-footer',
  '/admin/hero-slider',
  '/admin/kargo',
  '/admin/iyzico',
  '/admin/para-birimi',
  '/admin/trendyol'
]

// Public admin rotaları (login sayfası gibi)
const PUBLIC_ADMIN_ROUTES = [
  '/admin/login',
  '/admin/change-password'
]

// Edge Runtime uyumlu session validation
async function validateAdminSession(sessionToken: string, request: NextRequest) {
  try {
    // Supabase client oluştur
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        }
      }
    )
    
    // Session'ı doğrula
    const { data: session, error } = await supabase
      .from('admin_sessions')
      .select(`
        *,
        admin_users (
          id,
          username,
          email,
          full_name,
          role,
          is_active,
          force_password_change
        )
      `)
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (error || !session || !session.admin_users) {
      return null
    }

    const user = session.admin_users as any

    // Kullanıcı aktif mi?
    if (!user.is_active) {
      return null
    }

    return user
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`🔍 Middleware: ${pathname}`)

  // Admin rotalarını kontrol et
  if (pathname.startsWith('/admin')) {
    // Public admin sayfaları için auth kontrolü yapmama
    if (PUBLIC_ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // First check for simple auth session
    const simpleSessionToken = request.cookies.get('admin-session')?.value
    
    if (simpleSessionToken) {
      // For simple auth, just check if cookie exists
      console.log(`✅ Simple auth session found`)
      
      // Add basic user info to headers for API routes
      if (pathname.startsWith('/admin/api/') || pathname.startsWith('/api/admin/')) {
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-admin-session', simpleSessionToken)
        
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          }
        })
      }
      
      return NextResponse.next()
    }
    
    // Fallback to Supabase session token
    const sessionToken = request.cookies.get('admin_session_token')?.value ||
                        request.headers.get('authorization')?.replace('Bearer ', '')

    console.log(`🔑 Session Token: ${sessionToken ? 'Found' : 'Not found'}`)
    // Debug: Cookie listesi
    const cookieNames = Array.from(request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 20)}...`))
    console.log(`🍪 Cookies:`, cookieNames)

    if (!sessionToken) {
      console.log('❌ No session token, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Session'ı doğrula
      const user = await validateAdminSession(sessionToken, request)
      
      if (!user) {
        console.log('❌ Invalid session, redirecting to login')
        // Invalid session, redirect to login and clear cookie
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.set('admin_session_token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 0,
          path: '/admin'
        })
        return response
      }

      console.log(`✅ Valid session for user: ${user.username} (${user.role})`)

      // Password change zorunlu mu?
      if (user.force_password_change && pathname !== '/admin/change-password') {
        console.log('🔒 Password change required, redirecting')
        return NextResponse.redirect(new URL('/admin/change-password', request.url))
      }

      // API route'lar için session token'ı request header'ına ekle
      if (pathname.startsWith('/admin/api/') || pathname.startsWith('/api/admin/')) {
        console.log(`🔗 Middleware setting session header for ${pathname}:`, sessionToken ? 'Token Set' : 'No Token')
        
        // Request headers'a user bilgisini ve session token'ı ekle
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-admin-session-token', sessionToken)
        requestHeaders.set('x-admin-user-id', user.id)
        requestHeaders.set('x-admin-user-role', user.role)
        
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          }
        })
      }
      
      // Normal sayfa rotaları için sadece response header'ı ekle
      const response = NextResponse.next()
      response.headers.set('x-admin-user-id', user.id)
      response.headers.set('x-admin-user-role', user.role)
      
      return response

    } catch (error) {
      console.error('Middleware error:', error)
      
      // Hata durumunda login'e yönlendir
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.set('admin_session_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/admin'
      })
      return response
    }
  }

  // Diğer rotalar için normal davranış
  return NextResponse.next()
}

// Middleware'i hangi rotalar için çalıştıracağımızı belirt
export const config = {
  matcher: [
    /*
     * Match all admin routes and admin API routes
     * Exclude: static files, images, favicon, public files, non-admin APIs
     */
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!api/(?!admin)|_next/static|_next/image|favicon.ico|public|.*\\..*$).*)'
  ],
} 