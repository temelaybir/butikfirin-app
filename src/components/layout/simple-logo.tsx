'use client'

import { ChefHat } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SimpleLogo({ className = "h-10 w-auto", isMobile = false }: { className?: string, isMobile?: boolean }) {
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [forceShowFallback, setForceShowFallback] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    try {
      const settings = localStorage.getItem('butik-firin-site-settings')
      console.log('SimpleLogo - localStorage settings:', settings ? 'found' : 'not found')

      if (settings) {
        const parsed = JSON.parse(settings)
        
        // Mobile cihazlarda önce mobile_logo_url'yi kontrol et
        let logoToUse = parsed.site_logo_url
        console.log('SimpleLogo - raw settings:', {
          site_logo_url: parsed.site_logo_url,
          mobile_logo_url: parsed.mobile_logo_url,
          isMobile,
          windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'SSR'
        })
        
        if (isMobile && parsed.mobile_logo_url) {
          logoToUse = parsed.mobile_logo_url
          console.log('SimpleLogo - using mobile logo:', logoToUse)
        } else {
          console.log('SimpleLogo - using desktop logo:', logoToUse, 'reason:', !isMobile ? 'not mobile' : 'no mobile logo')
        }

        if (logoToUse) {
          // If it's a base64 URL, use it directly
          // If it's a path, ensure it starts with /
          let url = logoToUse
          if (!url.startsWith('data:') && !url.startsWith('/')) {
            url = '/' + url
          }
          console.log('SimpleLogo - final URL set:', url, 'type:', url.startsWith('data:') ? 'base64' : 'path')
          setLogoUrl(url)
        } else {
          console.log('SimpleLogo - no logoToUse found, checking fallback')
          // iPhone 16 Plus'ta prodda logo yoksa fallback kullan
          if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            console.log('SimpleLogo - production mode, using fallback logo')
            setLogoUrl('/images/logo.png') // Fallback logo
          }
        }
      } else {
        console.log('SimpleLogo - no settings found in localStorage')
        // Production fallback
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
          console.log('SimpleLogo - no localStorage, using fallback logo')
          setLogoUrl('/images/logo.png')
        }
      }
    } catch (error) {
      console.error('Logo yüklenemedi:', error)
    } finally {
      setIsLoading(false)
      
      // iPhone 16 Plus timeout fallback - sadece logo yoksa ve error yoksa
      if (typeof window !== 'undefined') {
        const isIPhone = /iPhone|iPad|iPod/.test(navigator.userAgent)
        if (isIPhone) {
          const timer = setTimeout(() => {
            // Timeout anında current state'i kontrol et
            setLogoUrl(currentUrl => {
              if (!currentUrl) {
                console.log('iPhone timeout - no logo loaded, showing fallback')
                setForceShowFallback(true)
              }
              return currentUrl // State'i değiştirme, sadece kontrol et
            })
          }, 2000) // 2 second timeout for iPhone
          
          setTimeoutId(timer)
        }
      }
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // Logo yüklendiğinde timeout'u iptal et
  useEffect(() => {
    if (logoUrl && timeoutId) {
      console.log('Logo loaded, clearing timeout')
      clearTimeout(timeoutId)
      setTimeoutId(null)
      setForceShowFallback(false) // Logo varsa fallback'i kapat
    }
  }, [logoUrl, timeoutId])

  // Storage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'butik-firin-site-settings') {
        try {
          if (e.newValue) {
            const parsed = JSON.parse(e.newValue)
            
            // Mobile cihazlarda önce mobile_logo_url'yi kontrol et
            let logoToUse = parsed.site_logo_url
            if (isMobile && parsed.mobile_logo_url) {
              logoToUse = parsed.mobile_logo_url
            }
            
            if (logoToUse) {
              let url = logoToUse
              if (!url.startsWith('data:') && !url.startsWith('/')) {
                url = '/' + url
              }
              setLogoUrl(url)
              setHasError(false)
            }
          }
        } catch (error) {
          console.error('Storage change logo yüklenemedi:', error)
        }
      }
    }

    // Custom event for same-tab updates
    const handleSiteSettingsUpdate = () => {
      try {
        const settings = localStorage.getItem('butik-firin-site-settings')
        if (settings) {
          const parsed = JSON.parse(settings)
          
          // Mobile cihazlarda önce mobile_logo_url'yi kontrol et
          let logoToUse = parsed.site_logo_url
          if (isMobile && parsed.mobile_logo_url) {
            logoToUse = parsed.mobile_logo_url
          }
          
          if (logoToUse) {
            let url = logoToUse
            if (!url.startsWith('data:') && !url.startsWith('/')) {
              url = '/' + url
            }
            setLogoUrl(url)
            setHasError(false)
          }
        }
      } catch (error) {
        console.error('Site settings update logo yüklenemedi:', error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('siteSettingsUpdated', handleSiteSettingsUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('siteSettingsUpdated', handleSiteSettingsUpdate)
    }
  }, [])

  console.log('SimpleLogo render - logoUrl:', logoUrl, 'hasError:', hasError, 'isLoading:', isLoading, 'isMobile:', isMobile)
  console.log('SimpleLogo localStorage settings check:', typeof window !== 'undefined' ? localStorage.getItem('butik-firin-site-settings') : 'SSR')
  console.log('SimpleLogo viewport info:', typeof window !== 'undefined' ? {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    userAgent: navigator.userAgent.substring(0, 100)
  } : 'SSR')

  if (isLoading || !logoUrl || hasError || forceShowFallback) {
    console.log('SimpleLogo fallback icon shown - reason:', { isLoading, hasLogo: !!logoUrl, hasError, forceShowFallback })
    return (
      <div className={`${className} bg-orange-600 rounded-lg flex items-center justify-center shadow-lg min-w-[2.5rem] relative`}>
        <ChefHat className="text-white w-4 h-4 sm:w-6 sm:h-6 z-10" />
        {/* Debug overlay for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute -top-8 left-0 text-xs bg-red-500 text-white px-1 rounded z-20">
            {isLoading ? 'Loading' : !logoUrl ? 'No URL' : hasError ? 'Error' : 'Timeout'}
          </div>
        )}
      </div>
    )
  }

  // Use the logo URL from localStorage
  console.log('SimpleLogo rendering image with URL:', logoUrl)
  return (
    <img
      src={logoUrl}
      alt="Butik Fırın Logo"
      className={`${className} object-contain`}
      style={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        // iPhone Chrome compatibility fixes
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        // Force hardware acceleration on iOS
        WebkitPerspective: '1000px',
        perspective: '1000px',
        // Prevent iOS image loading issues
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      onLoad={() => {
        console.log('SimpleLogo image loaded successfully:', logoUrl)
        // Image yüklendiğinde timeout'u iptal et ve fallback'i kapat
        if (timeoutId) {
          clearTimeout(timeoutId)
          setTimeoutId(null)
        }
        setForceShowFallback(false)
        setHasError(false)
      }}
      onError={(e) => {
        console.error('SimpleLogo image failed to load:', logoUrl, e)
        setHasError(true)
      }}
      loading="eager"
      decoding="async"
    />
  )
}