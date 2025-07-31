'use client'

import { useState, useEffect } from 'react'
import { adminAuthService } from '@/services/admin/admin-auth-service'

interface PermissionCheckProps {
  permission: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionCheck({ permission, children, fallback = null }: PermissionCheckProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem('admin_user')
        if (!userStr) {
          setHasPermission(false)
          setLoading(false)
          return
        }

        const user = JSON.parse(userStr)
        
        // Super admin has all permissions
        if (user.role === 'super_admin') {
          setHasPermission(true)
          setLoading(false)
          return
        }

        // Check specific permission
        const hasPerm = await adminAuthService.hasPermission(user.id, permission)
        setHasPermission(hasPerm)
      } catch (error) {
        console.error('Permission check error:', error)
        setHasPermission(false)
      } finally {
        setLoading(false)
      }
    }

    checkPermission()
  }, [permission])

  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>
}