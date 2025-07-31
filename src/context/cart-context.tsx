'use client'

import type { Product } from '@/data/mock-products'
import { Cart, CartContextType, CartItem, CartItemVariant } from '@/types/cart'
import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react'
import { toast } from 'sonner'

// Order Actions
type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ORDER_OPEN'; payload: boolean }
  | { type: 'SET_ORDER'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_NOTES'; payload: { id: string; notes: string } }
  | { type: 'CLEAR_ORDER' }
  | { type: 'REFRESH_PRICES' }

// Order State
interface OrderState {
  order: Cart
  isOpen: boolean
  isLoading: boolean
}

const initialState: OrderState = {
  order: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    subtotal: 0,
    currency: 'TRY',
    lastUpdated: new Date()
  },
  isOpen: false,
  isLoading: false
}

// Helper functions
const calculateOrderTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => {
    const basePrice = item.product.price || 0
    const variantPrice = item.variant?.priceModifier || 0
    const itemPrice = basePrice + variantPrice
    return sum + (itemPrice * item.quantity)
  }, 0)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    subtotal,
    totalItems,
    totalPrice: subtotal, // Shipping ve tax hesapları context dışında yapılacak
  }
}

const generateOrderItemId = (productId: number, variantId?: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `order_${productId}_${variantId || 'default'}_${timestamp}_${random}`
}

// Order Reducer
function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ORDER_OPEN':
      return { ...state, isOpen: action.payload }

    case 'SET_ORDER':
      return { ...state, order: action.payload }

    case 'ADD_ITEM': {
      const newItem = action.payload
      const existingItemIndex = state.order.items.findIndex(
        item => item.productId === newItem.productId &&
          JSON.stringify(item.variant) === JSON.stringify(newItem.variant)
      )

      let updatedItems: CartItem[]

      if (existingItemIndex > -1) {
        // Mevcut ürünü güncelle
        const existingItem = state.order.items[existingItemIndex]
        const newQuantity = Math.min(
          existingItem.quantity + newItem.quantity,
          newItem.maxQuantity || existingItem.product.stock || 999
        )

        updatedItems = state.order.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: newQuantity }
            : item
        )
      } else {
        // Yeni ürün ekle
        updatedItems = [...state.order.items, newItem]
      }

      const totals = calculateOrderTotals(updatedItems)

      return {
        ...state,
        order: {
          ...state.order,
          items: updatedItems,
          ...totals,
          lastUpdated: new Date()
        }
      }
    }

    case 'UPDATE_ITEM': {
      const { id, quantity } = action.payload
      const safeQuantity = Math.max(0, Math.floor(quantity))

      const updatedItems = safeQuantity <= 0
        ? state.order.items.filter(item => item.id !== id)
        : state.order.items.map(item =>
          item.id === id ? { ...item, quantity: safeQuantity } : item
        )

      const totals = calculateOrderTotals(updatedItems)

      return {
        ...state,
        order: {
          ...state.order,
          items: updatedItems,
          ...totals,
          lastUpdated: new Date()
        }
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.order.items.filter(item => item.id !== action.payload)
      const totals = calculateOrderTotals(updatedItems)

      return {
        ...state,
        order: {
          ...state.order,
          items: updatedItems,
          ...totals,
          lastUpdated: new Date()
        }
      }
    }

    case 'UPDATE_NOTES': {
      const { id, notes } = action.payload
      const updatedItems = state.order.items.map(item =>
        item.id === id ? { ...item, notes } : item
      )

      return {
        ...state,
        order: {
          ...state.order,
          items: updatedItems,
          lastUpdated: new Date()
        }
      }
    }

    case 'CLEAR_ORDER':
      return {
        ...state,
        order: {
          ...initialState.order,
          lastUpdated: new Date()
        }
      }

    case 'REFRESH_PRICES': {
      // Fiyatları yenile (API'den güncel fiyatları al)
      const totals = calculateOrderTotals(state.order.items)
      return {
        ...state,
        order: {
          ...state.order,
          ...totals,
          lastUpdated: new Date()
        }
      }
    }

    default:
      return state
  }
}

// Context
const OrderContext = createContext<CartContextType | undefined>(undefined)

// Provider Component
interface OrderProviderProps {
  children: ReactNode
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  // LocalStorage'dan siparişi yükle
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem('butik-firin-order')
      if (savedOrder) {
        const order = JSON.parse(savedOrder)
        // Veri doğrulaması yap
        if (order && typeof order === 'object' && Array.isArray(order.items)) {
          // Date'leri restore et
          const restoredOrder = {
            ...order,
            lastUpdated: new Date(order.lastUpdated || Date.now()),
            items: order.items.map((item: any) => ({
              ...item,
              addedAt: new Date(item.addedAt || Date.now())
            }))
          }
          dispatch({ type: 'SET_ORDER', payload: restoredOrder })
        }
      }
    } catch (error) {
      console.error('Error loading order from localStorage:', error)
      localStorage.removeItem('butik-firin-order')
    }
  }, [])

  // Sipariş değişikliklerini localStorage'a kaydet
  useEffect(() => {
    try {
      if (state.order && Array.isArray(state.order.items)) {
        localStorage.setItem('butik-firin-order', JSON.stringify(state.order))
      }
    } catch (error) {
      console.error('Error saving order to localStorage:', error)
    }
  }, [state.order])

  // Order visibility controls
  const openCart = () => {
    dispatch({ type: 'SET_ORDER_OPEN', payload: true })
  }

  const closeCart = () => {
    dispatch({ type: 'SET_ORDER_OPEN', payload: false })
  }

  const toggleCart = () => {
    dispatch({ type: 'SET_ORDER_OPEN', payload: !state.isOpen })
  }

  // Core order operations
  const addToCart = async (product: Product, quantity = 1, variant?: CartItemVariant) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Validation
      if (!product || !product.id) {
        throw new Error('Geçersiz ürün')
      }

      const safeQuantity = Math.max(1, Math.floor(quantity))
      const maxQuantity = product.stock_quantity || 999

      if (safeQuantity > maxQuantity) {
        toast.error(`En fazla ${maxQuantity} adet ekleyebilirsiniz`)
        return
      }

      // Create order item
      const orderItemId = generateOrderItemId(product.id, variant?.id)
      const orderItem: CartItem = {
        id: orderItemId,
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          images: product.images || [product.image_url],
          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
          stock: product.stock_quantity,
          brand: product.brand || 'Butik Fırın'
        },
        quantity: safeQuantity,
        addedAt: new Date(),
        variant,
        maxQuantity: maxQuantity
      }

      dispatch({ type: 'ADD_ITEM', payload: orderItem })

      // Success message
      openCart()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ürün siparişe eklenirken hata oluştu')
      console.error('Error adding to order:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateQuantity = async (orderItemId: string, quantity: number) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const safeQuantity = Math.max(0, Math.floor(quantity))
      dispatch({ type: 'UPDATE_ITEM', payload: { id: orderItemId, quantity: safeQuantity } })

      // Quantity updated silently
    } catch (error) {
      toast.error('Miktar güncellenirken hata oluştu')
      console.error('Error updating quantity:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeFromCart = async (orderItemId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      dispatch({ type: 'REMOVE_ITEM', payload: orderItemId })
      // Item removed silently
    } catch (error) {
      toast.error('Ürün kaldırılırken hata oluştu')
      console.error('Error removing from order:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const clearCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      dispatch({ type: 'CLEAR_ORDER' })
      // Cart cleared silently
    } catch (error) {
      toast.error('Sipariş temizlenirken hata oluştu')
      console.error('Error clearing order:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Product utilities
  const isInCart = (productId: number): boolean => {
    return state.order.items.some(item => item.productId === productId)
  }

  const getCartItem = (productId: number): CartItem | undefined => {
    return state.order.items.find(item => item.productId === productId)
  }

  const canAddToCart = (productId: number, requestedQty: number): boolean => {
    const existingItem = getCartItem(productId)
    const currentQty = existingItem?.quantity || 0
    const maxStock = existingItem?.product.stock || 999

    return (currentQty + requestedQty) <= maxStock
  }

  const getCartItemById = (orderItemId: string): CartItem | undefined => {
    return state.order.items.find(item => item.id === orderItemId)
  }

  // Computed values
  const getTotalPrice = (): number => {
    return state.order.totalPrice
  }

  const getTotalItems = (): number => {
    return state.order.totalItems
  }

  const getSubtotal = (): number => {
    return state.order.subtotal
  }

  const getShippingCost = (): number => {
    // Kargo hesaplama - 100 TL üzeri ücretsiz (Butik Fırın için)
    if (state.order.subtotal >= 100) return 0

    // Büyük ürün kontrolü (pastalar için ek kargo ücreti)
    const hasBigProduct = state.order.items.some(item =>
      item.product.tags?.includes('büyük-ürün') ||
      item.variant?.isBigProduct ||
      item.product.shipping?.isOversized ||
      item.product.name.toLowerCase().includes('pasta')
    )

    if (hasBigProduct) return 35 // Pasta/büyük ürün kargo ücreti
    return 20 // Normal kargo ücreti
  }

  const getTax = (): number => {
    // %18 KDV (güncel oran)
    return state.order.subtotal * 0.18
  }

  const getTaxInclusivePrice = (): number => {
    // KDV dahil fiyat
    return state.order.subtotal + getTax()
  }

  const getFinalTotal = (): number => {
    // Son toplam (KDV + Kargo dahil)
    return getTaxInclusivePrice() + getShippingCost()
  }

  const getShippingInfo = () => {
    const cost = getShippingCost()
    const freeShippingLimit = 100 // Butik Fırın için ücretsiz kargo eşiği
    const remaining = Math.max(0, freeShippingLimit - state.order.subtotal)

    return {
      cost,
      isFree: cost === 0,
      freeShippingLimit,
      remainingForFreeShipping: remaining,
      hasBigProduct: state.order.items.some(item =>
        item.product.tags?.includes('büyük-ürün') ||
        item.variant?.isBigProduct ||
        item.product.shipping?.isOversized ||
        item.product.name.toLowerCase().includes('pasta')
      )
    }
  }

  const getTaxInfo = () => {
    const subtotal = state.order.subtotal
    const taxAmount = getTax()
    const taxRate = 0.18 // %18

    return {
      subtotal,
      taxAmount,
      taxRate: taxRate * 100, // Yüzde olarak
      totalWithTax: subtotal + taxAmount,
      priceBeforeTax: subtotal / (1 + taxRate) // KDV hariç fiyat
    }
  }

  // Utility operations
  const updateNotes = async (orderItemId: string, notes: string) => {
    try {
      dispatch({ type: 'UPDATE_NOTES', payload: { id: orderItemId, notes } })
    } catch (error) {
      toast.error('Not güncellenirken hata oluştu')
      console.error('Error updating notes:', error)
    }
  }

  const validateCart = async (): Promise<boolean> => {
    try {
      // Stok kontrolü ve fiyat doğrulaması
      let hasErrors = false

      for (const item of state.order.items) {
        // Stok kontrolü (gerçek uygulamada API'den kontrol edilir)
        if (item.quantity > (item.product.stock || 0)) {
          toast.error(`${item.product.name} için yeterli stok yok`)
          hasErrors = true
        }
      }

      return !hasErrors
    } catch (error) {
      console.error('Error validating order:', error)
      return false
    }
  }

  const refreshPrices = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Gerçek uygulamada API'den güncel fiyatları al
      dispatch({ type: 'REFRESH_PRICES' })
    } catch (error) {
      toast.error('Fiyatlar güncellenirken hata oluştu')
      console.error('Error refreshing prices:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const contextValue: CartContextType = {
    // State (order olarak kullanılacak ama eski interface uyumluluğu için cart property)
    cart: state.order,
    isOpen: state.isOpen,
    isLoading: state.isLoading,

    // Order visibility controls
    openCart,
    closeCart,
    toggleCart,

    // Core order operations
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,

    // Product utilities
    isInCart,
    getCartItem,
    canAddToCart,
    getCartItemById,

    // Computed values
    getTotalPrice,
    getTotalItems,
    getSubtotal,
    getShippingCost,
    getTax,
    getTaxInclusivePrice,
    getFinalTotal,
    getShippingInfo,
    getTaxInfo,

    // Utility operations
    updateNotes,
    validateCart,
    refreshPrices
  }

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  )
}

// Hook
export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}

// Backward compatibility
export function useCart() {
  return useOrder()
}

// Provider backward compatibility
export const CartProvider = OrderProvider

export { OrderContext as CartContext, OrderContext }

