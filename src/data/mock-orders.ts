export interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  notes?: string
  variant?: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string | null
  customer_email: string | null
  table_number: string | null
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

// Mock sipariş verileri
export let mockOrders: Order[] = [
  {
    id: "1",
    order_number: "SIP1708520400000",
    customer_name: "Ahmet Yılmaz",
    customer_phone: "0532 123 45 67",
    customer_email: "ahmet@example.com",
    table_number: "12",
    items: [
      {
        product_id: 1,
        product_name: "Ispanak Böreği",
        quantity: 2,
        unit_price: 45.00,
        total_price: 90.00,
        notes: "Az yağlı olsun"
      },
      {
        product_id: 10,
        product_name: "Türk Çayı",
        quantity: 2,
        unit_price: 8.00,
        total_price: 16.00
      }
    ],
    total_amount: 106.00,
    status: 'confirmed',
    notes: "Acele değil",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:35:00Z"
  },
  {
    id: "2", 
    order_number: "SIP1708520460000",
    customer_name: "Fatma Kaya",
    customer_phone: "0541 987 65 43",
    customer_email: null,
    table_number: "5",
    items: [
      {
        product_id: 7,
        product_name: "Peynirli Poğaça",
        quantity: 3,
        unit_price: 18.00,
        total_price: 54.00
      },
      {
        product_id: 13,
        product_name: "Ayran",
        quantity: 1,
        unit_price: 10.00,
        total_price: 10.00
      }
    ],
    total_amount: 64.00,
    status: 'preparing',
    notes: null,
    created_at: "2024-01-15T11:15:00Z",
    updated_at: "2024-01-15T11:45:00Z"
  },
  {
    id: "3",
    order_number: "SIP1708520520000", 
    customer_name: "Mehmet Demir",
    customer_phone: "0505 111 22 33",
    customer_email: "mehmet@example.com",
    table_number: null,
    items: [
      {
        product_id: 17,
        product_name: "Künefe",
        quantity: 1,
        unit_price: 45.00,
        total_price: 45.00
      },
      {
        product_id: 11,
        product_name: "Türk Kahvesi", 
        quantity: 1,
        unit_price: 25.00,
        total_price: 25.00
      }
    ],
    total_amount: 70.00,
    status: 'ready',
    notes: "Paket servis",
    created_at: "2024-01-15T12:00:00Z",
    updated_at: "2024-01-15T12:15:00Z"
  },
  {
    id: "4",
    order_number: "SIP1708520580000",
    customer_name: "Ayşe Öz",
    customer_phone: null,
    customer_email: "ayse@example.com",
    table_number: "8",
    items: [
      {
        product_id: 5,
        product_name: "Elmalı Börek",
        quantity: 1,
        unit_price: 35.00,
        total_price: 35.00
      },
      {
        product_id: 12,
        product_name: "Cappuccino",
        quantity: 1,
        unit_price: 22.00,
        total_price: 22.00
      }
    ],
    total_amount: 57.00,
    status: 'pending',
    notes: "Cappuccino'yu sıcak getirin",
    created_at: "2024-01-15T13:30:00Z", 
    updated_at: "2024-01-15T13:30:00Z"
  }
]

// Helper fonksiyonlar
export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find(order => order.id === id)
}

export const getOrderByOrderNumber = (orderNumber: string): Order | undefined => {
  return mockOrders.find(order => order.order_number === orderNumber)
}

export const getOrdersByStatus = (status: string): Order[] => {
  if (status === 'all') {
    return mockOrders
  }
  return mockOrders.filter(order => order.status === status)
}

export const addOrder = (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Order => {
  const newOrder: Order = {
    ...order,
    id: (mockOrders.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  mockOrders.unshift(newOrder) // Yeni siparişi başa ekle
  return newOrder
}

export const updateOrderStatus = (id: string, status: Order['status'], notes?: string): Order | null => {
  const orderIndex = mockOrders.findIndex(order => order.id === id)
  
  if (orderIndex === -1) {
    return null
  }
  
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status,
    notes: notes !== undefined ? notes : mockOrders[orderIndex].notes,
    updated_at: new Date().toISOString()
  }
  
  return mockOrders[orderIndex]
}

export const generateOrderNumber = (): string => {
  return `SIP${Date.now()}`
}