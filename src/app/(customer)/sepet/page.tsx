'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to home page since we handle orders in the sidebar
    router.push('/')
  }, [router])
  
  return null
}