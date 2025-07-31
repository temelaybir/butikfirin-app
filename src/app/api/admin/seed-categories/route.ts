import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { restaurantCategories } from '@/scripts/seed-categories'

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Check if categories already exist
    const { data: existingCategories, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('Error checking categories:', checkError)
      return NextResponse.json({
        success: false,
        error: 'Kategoriler kontrol edilemedi'
      }, { status: 500 })
    }

    if (existingCategories && existingCategories.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Kategoriler zaten mevcut'
      }, { status: 400 })
    }

    // Insert categories
    const { data, error } = await supabase
      .from('categories')
      .insert(restaurantCategories)
      .select()

    if (error) {
      console.error('Error seeding categories:', error)
      return NextResponse.json({
        success: false,
        error: 'Kategoriler eklenemedi'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Kategoriler başarıyla eklendi',
      data
    })

  } catch (error) {
    console.error('Seed categories error:', error)
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası'
    }, { status: 500 })
  }
}