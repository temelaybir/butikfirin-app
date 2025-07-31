import { NextRequest, NextResponse } from 'next/server'
import { SimpleAuthService } from '@/services/admin/simple-auth-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body
    
    console.log('Simple login API called with:', { username, password })

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Kullanıcı adı ve şifre gerekli'
      }, { status: 400 })
    }

    const result = await SimpleAuthService.login(username, password)

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'Giriş başarılı'
    })

  } catch (error) {
    console.error('Simple login error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Giriş başarısız'
    }, { status: 401 })
  }
}