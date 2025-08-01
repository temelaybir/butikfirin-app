import { NextRequest, NextResponse } from 'next/server'
import { adminAuthService } from '@/services/admin/admin-auth-service'
import { z } from 'zod'

// Node.js runtime gerekli (bcryptjs için)
export const runtime = 'nodejs'

// Request validation schema
const loginRequestSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember_me: z.boolean().optional().default(false)
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate request data
    const validationResult = loginRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Geçersiz giriş bilgileri',
        details: validationResult.error.issues
      }, { status: 400 })
    }

    const { username, password, remember_me } = validationResult.data

    // Rate limiting check (basic)
    const clientIP = 
                    request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    
    console.log(`Admin login attempt from IP: ${clientIP}, Username: ${username}`)

    // Attempt login
    const loginResult = await adminAuthService.login({
      username,
      password,
      remember_me
    }, request)

    if (!loginResult.success) {
      // Log failed login attempt
      console.warn(`Failed admin login attempt - IP: ${clientIP}, Username: ${username}, Error: ${loginResult.error}`)
      
      return NextResponse.json({
        success: false,
        error: loginResult.error
      }, { status: 401 })
    }

    // Success - Log successful login
    console.log(`Successful admin login - IP: ${clientIP}, Username: ${username}, User ID: ${loginResult.user?.id}`)

    // Set secure HTTP-only cookie for session
    const response = NextResponse.json({
      success: true,
      user: loginResult.user,
      session_token: loginResult.session_token,
      expires_at: loginResult.expires_at,
      requires_password_change: loginResult.requires_password_change
    })

    // Set session cookie
    response.cookies.set('admin_session_token', loginResult.session_token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: remember_me ? 30 * 24 * 60 * 60 : 8 * 60 * 60, // 30 days or 8 hours
      path: '/admin'
    })

    return response

  } catch (error) {
    console.error('Admin login API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası oluştu'
    }, { status: 500 })
  }
}

// Options for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 