'use client'

import { ChefHat } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SimpleLogo({ className = "h-10 w-auto" }: { className?: string }) {
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const settings = localStorage.getItem('butik-firin-site-settings')
      console.log('SimpleLogo - localStorage settings:', settings ? 'found' : 'not found')

      if (settings) {
        const parsed = JSON.parse(settings)
        console.log('SimpleLogo - logo URL:', parsed.site_logo_url)

        if (parsed.site_logo_url) {
          // If it's a base64 URL, use it directly
          // If it's a path, ensure it starts with /
          let url = parsed.site_logo_url
          if (!url.startsWith('data:') && !url.startsWith('/')) {
            url = '/' + url
          }
          setLogoUrl(url)
        }
      }
    } catch (error) {
      console.error('Logo yüklenemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Storage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'butik-firin-site-settings') {
        try {
          if (e.newValue) {
            const parsed = JSON.parse(e.newValue)
            if (parsed.site_logo_url) {
              let url = parsed.site_logo_url
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
          if (parsed.site_logo_url) {
            let url = parsed.site_logo_url
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

  console.log('SimpleLogo render - logoUrl:', logoUrl, 'hasError:', hasError, 'isLoading:', isLoading)

  if (isLoading || !logoUrl || hasError) {
    return (
      <div className={`${className} bg-orange-600 rounded-lg flex items-center justify-center shadow-lg min-w-[2.5rem]`}>
        <ChefHat className="text-white w-4 h-4 sm:w-6 sm:h-6" />
      </div>
    )
  }

  // Use the logo URL from localStorage
  return (
    <img
      src={logoUrl}
      alt="Butik Fırın Logo"
      className={`${className} object-contain`}
      onError={(e) => {
        console.error('Logo image failed to load:', logoUrl)
        setHasError(true)
      }}
    />
  )
}