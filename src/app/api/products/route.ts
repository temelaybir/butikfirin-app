import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET - Ürünleri listeler (Supabase'den)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')
    const available = searchParams.get('available')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    // ID ile tek ürün getir
    if (id) {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories!category_id (
            id,
            name,
            slug
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Ürün getirme hatası:', error)
        return NextResponse.json({
          success: false,
          error: 'Ürün bulunamadı'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: product
      })
    }

    // Slug ile tek ürün getir
    if (slug) {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories!category_id (
            id,
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Ürün getirme hatası:', error)
        return NextResponse.json({
          success: false,
          error: 'Ürün bulunamadı'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: product
      })
    }

    // Ürünleri listele
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories!category_id (
          id,
          name,
          slug
        )
      `)

    // Filtrele
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (available === 'true') {
      query = query.eq('is_active', true).gt('stock_quantity', 0)
    }

    // Arama
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Aktif ürünleri getir (default)
    query = query.eq('is_active', true)

    // Sıralama
    query = query.order('created_at', { ascending: false })

    // Count için ayrı query
    let countQuery = supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)

    if (categoryId) {
      countQuery = countQuery.eq('category_id', categoryId)
    }
    if (featured === 'true') {
      countQuery = countQuery.eq('is_featured', true)
    }
    if (available === 'true') {
      countQuery = countQuery.gt('stock_quantity', 0)
    }
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Pagination uygula
    const { data: products, error } = await query
      .range(offset, offset + limit - 1)

    const { count, error: countError } = await countQuery

    if (error) {
      console.error('Ürünler getirme hatası:', error)
      return NextResponse.json({
        success: false,
        error: 'Ürünler getirilirken hata oluştu'
      }, { status: 500 })
    }

    if (countError) {
      console.error('Ürün sayısı getirme hatası:', countError)
    }

    const total = count || 0

    return NextResponse.json({
      success: true,
      data: products || [],
      meta: {
        total,
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error('Products API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası oluştu: ' + error.message
    }, { status: 500 })
  }
}