import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SimpleAuthService } from '@/services/admin/simple-auth-service'

export async function adminAuthMiddleware(request: NextRequest) {
  // Get session from cookie
  const sessionToken = request.cookies.get('admin-session')?.value

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Validate session
  const user = await SimpleAuthService.validateSession(sessionToken)
  
  if (!user) {
    // Clear invalid cookie and redirect
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('admin-session')
    return response
  }

  // Add user info to headers for use in routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-admin-user', JSON.stringify({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  }))

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}