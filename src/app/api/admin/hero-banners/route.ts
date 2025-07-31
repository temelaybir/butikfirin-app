import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateAdminAuth } from '@/lib/auth/admin-api-auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: banners, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ banners })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const validation = await validateAdminAuth()
    if (!validation.success) {
      return NextResponse.json({ error: validation.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()

    const { data: banner, error } = await supabase
      .from('hero_banners')
      .insert({
        position: body.position,
        image_url: body.image_url,
        title: body.title,
        subtitle: body.subtitle,
        button_text: body.button_text,
        button_link: body.button_link,
        alt_text: body.alt_text,
        is_active: body.is_active ?? true,
        display_order: body.display_order ?? 0
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ banner })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const validation = await validateAdminAuth()
    if (!validation.success) {
      return NextResponse.json({ error: validation.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Banner ID required' }, { status: 400 })
    }

    const body = await request.json()

    const { data: banner, error } = await supabase
      .from('hero_banners')
      .update({
        position: body.position,
        image_url: body.image_url,
        title: body.title,
        subtitle: body.subtitle,
        button_text: body.button_text,
        button_link: body.button_link,
        alt_text: body.alt_text,
        is_active: body.is_active,
        display_order: body.display_order
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ banner })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const validation = await validateAdminAuth()
    if (!validation.success) {
      return NextResponse.json({ error: validation.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Banner ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}