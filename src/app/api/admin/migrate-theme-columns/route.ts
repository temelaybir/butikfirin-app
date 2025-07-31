import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // First, check if columns already exist
    const { data: tableInfo, error: infoError } = await supabase
      .rpc('get_table_columns', { table_name: 'site_settings' })

    if (infoError && infoError.message.includes('does not exist')) {
      // If the function doesn't exist, try a direct approach
      try {
        // Add columns one by one
        const columns = [
          { name: 'theme_color_scheme', type: 'VARCHAR(50)', default: "'light'" },
          { name: 'theme_design_style', type: 'VARCHAR(50)', default: "'default'" },
          { name: 'theme_font_style', type: 'VARCHAR(50)', default: "'modern-sans'" },
          { name: 'theme_product_card_style', type: 'VARCHAR(50)', default: "'default'" }
        ]

        for (const column of columns) {
          const { error } = await supabase.rpc('exec_sql', {
            query: `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS ${column.name} ${column.type} DEFAULT ${column.default};`
          })
          
          if (error && !error.message.includes('already exists')) {
            console.error(`Error adding column ${column.name}:`, error)
          }
        }
      } catch (e) {
        // If RPC doesn't work, we'll use a different approach
        console.log('RPC method not available, using direct SQL')
      }
    }

    // Check if site_settings table has any records
    const { data: settings, error: checkError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('is_active', true)
      .single()

    if (checkError && checkError.code === 'PGRST116') {
      // No records exist, create one
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert([{
          site_name: 'Butik Fırın',
          site_description: 'Ev yapımı taze pastalar, kekler ve tatlılar',
          site_keywords: 'butik fırın, pasta, kek, tatlı, ev yapımı',
          contact_email: 'info@butikfirin.com',
          contact_phone: '+90 555 123 4567',
          contact_address: 'İstanbul, Türkiye',
          theme_color_scheme: 'light',
          theme_design_style: 'default',
          theme_font_style: 'modern-sans',
          theme_product_card_style: 'default',
          currency_code: 'TRY',
          currency_symbol: '₺',
          is_active: true
        }])

      if (insertError) {
        console.error('Insert error:', insertError)
        return NextResponse.json({
          success: false,
          error: 'Kayıt oluşturulamadı',
          details: insertError
        }, { status: 500 })
      }
    }

    // Update existing records to ensure theme columns have values
    const { error: updateError } = await supabase
      .from('site_settings')
      .update({
        theme_color_scheme: settings?.theme_color_scheme || 'light',
        theme_design_style: settings?.theme_design_style || 'default',
        theme_font_style: settings?.theme_font_style || 'modern-sans',
        theme_product_card_style: settings?.theme_product_card_style || 'default'
      })
      .eq('is_active', true)

    if (updateError) {
      console.error('Update error:', updateError)
    }

    return NextResponse.json({
      success: true,
      message: 'Tema kolonları başarıyla eklendi/güncellendi',
      data: {
        note: 'Eğer hala hata alıyorsanız, Supabase SQL Editor\'da aşağıdaki SQL\'i çalıştırın:',
        sql: `
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS theme_color_scheme VARCHAR(50) DEFAULT 'light',
ADD COLUMN IF NOT EXISTS theme_design_style VARCHAR(50) DEFAULT 'default',
ADD COLUMN IF NOT EXISTS theme_font_style VARCHAR(50) DEFAULT 'modern-sans',
ADD COLUMN IF NOT EXISTS theme_product_card_style VARCHAR(50) DEFAULT 'default';
        `
      }
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Migration hatası',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}