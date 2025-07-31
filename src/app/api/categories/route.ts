import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET - Kategorileri listeler (Supabase'den)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')
    const active = searchParams.get('active')

    // ID ile tek kategori getir
    if (id) {
      const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Kategori getirme hatası:', error)
        return NextResponse.json({
          success: false,
          error: 'Kategori bulunamadı'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: category
      })
    }

    // Slug ile tek kategori getir
    if (slug) {
      const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Kategori getirme hatası:', error)
        return NextResponse.json({
          success: false,
          error: 'Kategori bulunamadı'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: category
      })
    }

    // Kategorileri listele
    let query = supabase.from('categories').select('*')

    if (active === 'true') {
      query = query.eq('is_active', true)
    }

    query = query.order('display_order', { ascending: true })

    const { data: categories, error } = await query

    if (error) {
      console.error('Kategoriler getirme hatası:', error)
      return NextResponse.json({
        success: false,
        error: 'Kategoriler getirilirken hata oluştu'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: categories || []
    })

  } catch (error: any) {
    console.error('Categories API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası oluştu: ' + error.message
    }, { status: 500 })
  }
}