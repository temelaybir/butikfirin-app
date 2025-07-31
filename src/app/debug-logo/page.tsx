'use client'

import { SimpleLogo } from '@/components/layout/simple-logo'
import { useEffect, useState } from 'react'

export default function DebugLogoPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const updateDebugInfo = () => {
      const settings = localStorage.getItem('butik-firin-site-settings')
      const parsed = settings ? JSON.parse(settings) : null

      setDebugInfo({
        hasSettings: !!settings,
        settings: parsed,
        logoUrl: parsed?.site_logo_url,
        logoUrlType: parsed?.site_logo_url ? (parsed.site_logo_url.startsWith('data:') ? 'base64' : 'path') : 'none',
        displayMode: parsed?.logo_display_mode,
        logoSize: parsed?.logo_size,
        timestamp: new Date().toISOString()
      })
    }

    updateDebugInfo()

    // Listen for changes
    const handleStorageChange = () => updateDebugInfo()
    const handleSiteSettingsUpdate = () => updateDebugInfo()

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('siteSettingsUpdated', handleSiteSettingsUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('siteSettingsUpdated', handleSiteSettingsUpdate)
    }
  }, [])

  const setTestLogo = () => {
    const testLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY2QjAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QjwvdGV4dD4KPC9zdmc+'

    const currentSettings = localStorage.getItem('butik-firin-site-settings')
    const settings = currentSettings ? JSON.parse(currentSettings) : {}

    const newSettings = {
      ...settings,
      site_logo_url: testLogo
    }

    localStorage.setItem('butik-firin-site-settings', JSON.stringify(newSettings))
    window.dispatchEvent(new Event('siteSettingsUpdated'))
  }

  const setLogoOnly = () => {
    const currentSettings = localStorage.getItem('butik-firin-site-settings')
    const settings = currentSettings ? JSON.parse(currentSettings) : {}

    const newSettings = {
      ...settings,
      logo_display_mode: 'logo_only'
    }

    localStorage.setItem('butik-firin-site-settings', JSON.stringify(newSettings))
    window.dispatchEvent(new Event('siteSettingsUpdated'))
  }

  const setLogoWithText = () => {
    const currentSettings = localStorage.getItem('butik-firin-site-settings')
    const settings = currentSettings ? JSON.parse(currentSettings) : {}

    const newSettings = {
      ...settings,
      logo_display_mode: 'logo_with_text'
    }

    localStorage.setItem('butik-firin-site-settings', JSON.stringify(newSettings))
    window.dispatchEvent(new Event('siteSettingsUpdated'))
  }

  const setLargeLogo = () => {
    const currentSettings = localStorage.getItem('butik-firin-site-settings')
    const settings = currentSettings ? JSON.parse(currentSettings) : {}

    const newSettings = {
      ...settings,
      logo_size: 'large'
    }

    localStorage.setItem('butik-firin-site-settings', JSON.stringify(newSettings))
    window.dispatchEvent(new Event('siteSettingsUpdated'))
  }

  const clearLogo = () => {
    const currentSettings = localStorage.getItem('butik-firin-site-settings')
    const settings = currentSettings ? JSON.parse(currentSettings) : {}

    const newSettings = {
      ...settings,
      site_logo_url: ''
    }

    localStorage.setItem('butik-firin-site-settings', JSON.stringify(newSettings))
    window.dispatchEvent(new Event('siteSettingsUpdated'))
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Logo Debug Sayfası</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Debug Bilgileri:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Logo Test:</h2>
        <div className="flex items-center gap-4">
          <SimpleLogo className="w-16 h-16" />
          <div className="space-y-2">
            <button
              onClick={setTestLogo}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 block"
            >
              Test Logo Ayarla
            </button>
            <button
              onClick={clearLogo}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 block"
            >
              Logo Temizle
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Display Mode Test:</h2>
        <div className="flex gap-2">
          <button
            onClick={setLogoOnly}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sadece Logo
          </button>
          <button
            onClick={setLogoWithText}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Logo + Text
          </button>
          <button
            onClick={setLargeLogo}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Büyük Logo (640px)
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Logo URL Test:</h2>
        {debugInfo.logoUrl && (
          <div className="space-y-2">
            <p><strong>Logo URL:</strong> {debugInfo.logoUrl.substring(0, 100)}...</p>
            <p><strong>URL Tipi:</strong> {debugInfo.logoUrlType}</p>
            <p><strong>Display Mode:</strong> {debugInfo.displayMode}</p>
            <p><strong>Logo Size:</strong> {debugInfo.logoSize}</p>
            <img
              src={debugInfo.logoUrl}
              alt="Test Logo"
              className="border p-2 max-w-xs"
              onError={(e) => console.error('Logo yüklenemedi:', e)}
              onLoad={() => console.log('Logo başarıyla yüklendi')}
            />
          </div>
        )}
      </div>
    </div>
  )
} 