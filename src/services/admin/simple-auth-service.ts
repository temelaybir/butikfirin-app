import { cookies } from 'next/headers'

// Simple in-memory session storage for demo
const sessions = new Map<string, any>()

// Default admin user matching the database
const ADMIN_USER = {
  id: '59088925-c543-47ec-8ed8-77cfd3c39f7e',
  username: 'superadmin',
  password: 'admin123', // Plain password for simple auth
  email: 'superadmin@butikfirin.com',
  full_name: 'Super Admin',
  role: 'super_admin',
  is_active: true
}

export class SimpleAuthService {
  static async login(username: string, password: string) {
    console.log('SimpleAuthService login attempt:', { username, password })
    console.log('Expected credentials:', { username: ADMIN_USER.username, password: ADMIN_USER.password })
    
    // For demo purposes, check against hardcoded credentials
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      const sessionToken = this.generateSessionToken()
      const session = {
        id: sessionToken,
        userId: ADMIN_USER.id,
        username: ADMIN_USER.username,
        email: ADMIN_USER.email,
        role: ADMIN_USER.role,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
      
      sessions.set(sessionToken, session)
      
      // Set cookie
      const cookieStore = await cookies()
      cookieStore.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400, // 24 hours
        path: '/'
      })
      
      return {
        success: true,
        user: {
          id: ADMIN_USER.id,
          username: ADMIN_USER.username,
          email: ADMIN_USER.email,
          full_name: ADMIN_USER.full_name,
          role: ADMIN_USER.role,
          is_active: ADMIN_USER.is_active
        }
      }
    }
    
    throw new Error('Geçersiz kullanıcı adı veya şifre')
  }
  
  static async validateSession(sessionToken: string) {
    const session = sessions.get(sessionToken)
    
    if (!session || new Date() > session.expiresAt) {
      return null
    }
    
    return {
      id: session.userId,
      username: session.username,
      email: session.email,
      full_name: ADMIN_USER.full_name,
      role: session.role,
      is_active: true,
      permissions: [],
      two_factor_enabled: false,
      force_password_change: false,
      created_at: new Date().toISOString()
    }
  }
  
  static async logout(sessionToken: string) {
    sessions.delete(sessionToken)
    
    const cookieStore = await cookies()
    cookieStore.delete('admin-session')
    
    return { success: true }
  }
  
  private static generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}