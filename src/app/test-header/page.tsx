'use client'

import { ModernHeader } from '@/components/layout/modern-header'
import { NewHeader } from '@/components/layout/new-header'
import { useEffect, useState } from 'react'

export default function TestHeaderPage() {
  const [currentHeader, setCurrentHeader] = useState<'modern' | 'new'>('modern')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const savedSettings = localStorage.getItem('butik-firin-site-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const forceUpdate = () => {
    window.dispatchEvent(new Event('siteSettingsUpdated'))
  }

  return (
    <div className="min-h-screen">
      {/* Test Controls */}
      <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="font-bold mb-2">Header Test Kontrolleri</h3>
        <div className="space-y-2">
          <button
            onClick={() => setCurrentHeader('modern')}
            className={`px-3 py-1 rounded text-sm ${currentHeader === 'modern' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Modern Header
          </button>
          <button
            onClick={() => setCurrentHeader('new')}
            className={`px-3 py-1 rounded text-sm ${currentHeader === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            New Header
          </button>
          <button
            onClick={forceUpdate}
            className="px-3 py-1 rounded text-sm bg-green-500 text-white"
          >
            Ayarları Yenile
          </button>
        </div>

        <div className="mt-4 text-xs">
          <p><strong>Display Mode:</strong> {settings?.logo_display_mode}</p>
          <p><strong>Logo Size:</strong> {settings?.logo_size}</p>
          <p><strong>Logo URL:</strong> {settings?.site_logo_url ? 'Var' : 'Yok'}</p>
        </div>
      </div>

      {/* Header */}
      {currentHeader === 'modern' ? <ModernHeader /> : <NewHeader />}

      {/* Test Content */}
      <div className="pt-32 p-8">
        <h1 className="text-3xl font-bold mb-4">Header Test Sayfası</h1>
        <p className="text-lg mb-4">
          Bu sayfa header'ın nasıl göründüğünü test etmek için kullanılır.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Mevcut Ayarlar</h2>
            <pre className="text-sm bg-white p-4 rounded overflow-auto">
              {JSON.stringify(settings, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Butonları</h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const newSettings = { ...settings, logo_display_mode: 'logo_only' }
                  localStorage.setItem('butik-firin-site-settings', JSON.stringify(newSettings))
                  forceUpdate()
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sadece Logo
              </button>
              <button
                onClick={() => {
                  const newSettings = { ...settings, logo_display_mode: 'logo_with_text' }
                  localStorage.setItem('butik-firin-site-settings', JSON.stringify(newSettings))
                  forceUpdate()
                }}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Logo + Text
              </button>
              <button
                onClick={() => {
                  const newSettings = { ...settings, logo_size: 'large' }
                  localStorage.setItem('butik-firin-site-settings', JSON.stringify(newSettings))
                  forceUpdate()
                }}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Büyük Logo (640px)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 