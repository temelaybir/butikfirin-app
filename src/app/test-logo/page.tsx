'use client'

import { SimpleLogo } from '@/components/layout/simple-logo'
import { useEffect, useState } from 'react'

export default function TestLogoPage() {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const savedSettings = localStorage.getItem('butik-firin-site-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const testLogo = () => {
    const testSettings = {
      ...settings,
      site_logo_url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRkY2QjAwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QjwvdGV4dD4KPC9zdmc+'
    }
    localStorage.setItem('butik-firin-site-settings', JSON.stringify(testSettings))
    window.dispatchEvent(new Event('siteSettingsUpdated'))
    setSettings(testSettings)
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Logo Test Sayfası</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Mevcut Ayarlar:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Logo Test:</h2>
        <div className="flex items-center gap-4">
          <SimpleLogo className="w-16 h-16" />
          <button
            onClick={testLogo}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Test Logo Yükle
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Farklı Boyutlar:</h2>
        <div className="flex items-center gap-4">
          <SimpleLogo className="w-32 h-32" />
          <SimpleLogo className="w-48 h-48" />
          <SimpleLogo className="w-64 h-64" />
          <SimpleLogo className="w-80 h-80" />
        </div>
      </div>
    </div>
  )
}