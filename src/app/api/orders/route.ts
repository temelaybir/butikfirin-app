import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Siparişleri saklamak için dosya yolu
const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json')

// Otomatik sipariş tamamlama için timer'ları sakla
const orderTimers = new Map<string, NodeJS.Timeout>()

// Siparişleri dosyadan oku
async function readOrders(): Promise<any[]> {
  try {
    await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true })
    const data = await fs.readFile(ORDERS_FILE, 'utf-8')
    const orders = JSON.parse(data)
    
    // Eski status'leri güncelle
    return orders.map((order: any) => {
      if (order.status === 'confirmed' || order.status === 'ready') {
        order.status = 'preparing'
      }
      return order
    })
  } catch (error) {
    // Dosya yoksa boş array döndür
    return []
  }
}

// Siparişleri dosyaya yaz
async function writeOrders(orders: any[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true })
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

// Sipariş counter'ı oku
async function getOrderCounter(): Promise<number> {
  const orders = await readOrders()
  if (orders.length === 0) return 1000
  
  const lastOrder = orders.reduce((prev, current) => {
    const prevNum = parseInt(prev.order_number.split('-')[1] || '0')
    const currentNum = parseInt(current.order_number.split('-')[1] || '0')
    return currentNum > prevNum ? current : prev
  })
  
  return parseInt(lastOrder.order_number.split('-')[1] || '1000') + 1
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  
  const orders = await readOrders()
  let filteredOrders = orders
  
  if (status && status !== 'all') {
    filteredOrders = orders.filter(order => order.status === status)
  }
  
  // Son 100 siparişi göster
  filteredOrders = filteredOrders.slice(-100).reverse()
  
  return NextResponse.json({ 
    success: true,
    data: filteredOrders
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Received order:', body)
    
    const orderCounter = Date.now() // Fallback to timestamp
    
    const newOrder = {
      id: Date.now().toString(),
      order_number: `ORD-${orderCounter}`,
      customer_name: 'Masa Müşterisi',
      customer_phone: null,
      customer_email: null,
      table_number: `Masa ${Math.floor(Math.random() * 20) + 1}`,
      items: body.items.map((item: any) => ({
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total,
        notes: null,
        variant: null
      })),
      total_amount: body.totalPrice,
      status: 'pending',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    try {
      // Try to save to file system
      const orders = await readOrders()
      const realOrderCounter = await getOrderCounter()
      newOrder.order_number = `ORD-${realOrderCounter}`
      orders.push(newOrder)
      await writeOrders(orders)
      console.log('💾 Order saved to file system')
    } catch (fileError) {
      console.warn('⚠️ Could not save to file system:', fileError)
      // Continue without file system - order is still processed
    }
    
    console.log('✅ Order processed successfully:', newOrder.order_number)
    
    return NextResponse.json({ 
      success: true, 
      order: newOrder,
      message: 'Siparişiniz alındı!'
    })
  } catch (error) {
    console.error('❌ Order processing error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Invalid request' },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const orders = await readOrders()
    
    const orderIndex = orders.findIndex(o => o.id === id)
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    orders[orderIndex] = { 
      ...orders[orderIndex], 
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    // Eğer sipariş hazırlanıyor durumuna geçtiyse, 5 dakika sonra otomatik tamamla
    if (updates.status === 'preparing') {
      // Önceki timer'ı iptal et
      if (orderTimers.has(id)) {
        clearTimeout(orderTimers.get(id)!)
      }
      
      // Yeni timer başlat (5 dakika)
      const timer = setTimeout(() => {
        const idx = orders.findIndex(o => o.id === id)
        if (idx !== -1 && orders[idx].status === 'preparing') {
          orders[idx] = {
            ...orders[idx],
            status: 'completed',
            updated_at: new Date().toISOString()
          }
        }
        orderTimers.delete(id)
      }, 5 * 60 * 1000) // 5 dakika
      
      orderTimers.set(id, timer)
    }
    
    // Eğer sipariş iptal edildiyse veya tamamlandıysa timer'ı temizle
    if (updates.status === 'cancelled' || updates.status === 'completed') {
      if (orderTimers.has(id)) {
        clearTimeout(orderTimers.get(id)!)
        orderTimers.delete(id)
      }
    }
    
    await writeOrders(orders)
    
    return NextResponse.json({ 
      success: true, 
      order: orders[orderIndex] 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}