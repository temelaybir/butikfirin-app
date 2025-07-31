import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Check if settings already exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('site_settings')
      .select('id')
      .eq('is_active', true)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking settings:', checkError)
      return NextResponse.json({
        success: false,
        error: 'Ayarlar kontrol edilemedi'
      }, { status: 500 })
    }

    if (existingSettings) {
      return NextResponse.json({
        success: false,
        error: 'Site ayarları zaten mevcut'
      }, { status: 400 })
    }

    // Insert default settings
    const defaultSettings = {
      site_name: 'Butik Fırın',
      site_description: 'Ev yapımı taze pastalar, kekler ve tatlılar',
      site_keywords: 'butik fırın, pasta, kek, tatlı, ev yapımı',
      site_logo: '/images/logo.png',
      favicon: '/favicon.ico',
      contact_email: 'info@butikfirin.com',
      contact_phone: '+90 555 123 4567',
      contact_address: 'İstanbul, Türkiye',
      social_facebook: 'https://facebook.com/butikfirin',
      social_instagram: 'https://instagram.com/butikfirin',
      social_twitter: null,
      theme_color_scheme: 'light',
      theme_design_style: 'default',
      theme_font_style: 'modern-sans',
      theme_product_card_style: 'default',
      currency_code: 'TRY',
      currency_symbol: '₺',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('site_settings')
      .insert([defaultSettings])
      .select()

    if (error) {
      console.error('Error seeding settings:', error)
      return NextResponse.json({
        success: false,
        error: 'Ayarlar eklenemedi'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Site ayarları başarıyla eklendi',
      data
    })

  } catch (error) {
    console.error('Seed settings error:', error)
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası'
    }, { status: 500 })
  }
}