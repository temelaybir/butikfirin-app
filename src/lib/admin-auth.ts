import { createAdminSupabaseClient } from '@/lib/supabase/admin-client'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export interface AdminUser {
  id: string
  username: string
  email: string
  full_name: string
  role: 'super_admin' | 'admin'
  permissions: string[]
  is_active: boolean
}

/**
 * Validate admin session from request cookies
 */
export async function validateAdminSession(request?: NextRequest): Promise<{
  success: boolean
  user?: AdminUser
  error?: string
}> {
  try {
    // Get session token from cookies
    let sessionToken: string | undefined
    
    if (request) {
      // From API route
      sessionToken = request.cookies.get('admin_session_token')?.value
    } else {
      // From Server Component
      const cookieStore = await cookies()
      sessionToken = cookieStore.get('admin_session_token')?.value
    }
    
    if (!sessionToken) {
      return {
        success: false,
        error: 'No session token provided'
      }
    }
    
    const supabase = await createAdminSupabaseClient()
    
    // Validate session
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
          permissions,
          is_active
        )
      `)
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .single()
    
    if (error || !session || !session.admin_users) {
      return {
        success: false,
        error: 'Invalid session'
      }
    }
    
    const user = session.admin_users as any
    
    // Check if user is active
    if (!user.is_active) {
      return {
        success: false,
        error: 'User account is deactivated'
      }
    }
    
    // Get role permissions
    const { data: rolePermissions } = await supabase
      .from('admin_role_permissions')
      .select('permission_name')
      .eq('role', user.role)
    
    const permissions = rolePermissions?.map(p => p.permission_name) || []
    
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        permissions: [...permissions, ...(user.permissions || [])],
        is_active: user.is_active
      }
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return {
      success: false,
      error: 'Session validation failed'
    }
  }
}

/**
 * Check if admin user has a specific permission
 */
export async function hasAdminPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  try {
    const supabase = await createAdminSupabaseClient()
    
    // Get user with role
    const { data: user } = await supabase
      .from('admin_users')
      .select('role, permissions')
      .eq('id', userId)
      .single()
    
    if (!user) return false
    
    // Super admin has all permissions
    if (user.role === 'super_admin') return true
    
    // Check user custom permissions
    if (user.permissions && Array.isArray(user.permissions) && user.permissions.includes(permission)) {
      return true
    }
    
    // Check role permissions
    const { data: rolePermissions } = await supabase
      .from('admin_role_permissions')
      .select('permission_name')
      .eq('role', user.role)
    
    return rolePermissions?.some(p => p.permission_name === permission) || false
  } catch (error) {
    console.error('Permission check error:', error)
    return false
  }
}

/**
 * Middleware function to protect admin routes
 */
export async function withAdminAuth<T>(
  handler: (user: AdminUser) => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
  try {
    const authResult = await validateAdminSession()
    
    if (!authResult.success || !authResult.user) {
      return {
        success: false,
        error: authResult.error || 'Authentication failed',
        status: 401
      }
    }
    
    const data = await handler(authResult.user)
    
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Admin API handler error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
      status: 500
    }
  }
}