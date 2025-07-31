import { Suspense } from 'react'
import ProductsClient from './products-client'
import { mockProducts, getActiveCategories } from '@/data/mock-products'

function getProducts() {
  return mockProducts.filter(product => product.is_active)
}

function getCategories() {
  return getActiveCategories()
}

export default function ProductsPage() {
  const products = getProducts()
  const categories = getCategories()

  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <ProductsClient initialProducts={products} categories={categories} />
    </Suspense>
  )
}