import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Get hero slides from database
    const { data: slides, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true })

    if (error) {
      console.error('Error fetching hero slides:', error)
      return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 })
    }

    // Filter slides based on mobile/desktop visibility
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)

    const filteredSlides = slides.filter((slide: any) => {
      // Check mobile visibility
      if (isMobile && slide.show_on_mobile === false) return false
      return true
    })

    return NextResponse.json({ slides: filteredSlides })
  } catch (error) {
    console.error('Error in hero slides API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 