// Mock data for Trendyol integration testing
export const mockApiResponses = {
  localProducts: {
    products: [
      {
        id: '1',
        name: 'Sample Product 1',
        sku: 'SP001',
        price: 25.99,
        stock_quantity: 100,
        description: 'A sample product for testing purposes',
        images: ['https://example.com/image1.jpg'],
        categories: { name: 'Test Category' },
        trendyol_status: 'approved',
        trendyol_product_id: 'TYP001'
      },
      {
        id: '2',
        name: 'Sample Product 2',
        sku: 'SP002',
        price: 35.50,
        stock_quantity: 50,
        description: 'Another sample product for testing',
        images: ['https://example.com/image2.jpg'],
        categories: { name: 'Test Category' },
        trendyol_status: 'pending',
        trendyol_product_id: null
      },
      {
        id: '3',
        name: 'Sample Product 3',
        sku: 'SP003',
        price: 19.99,
        stock_quantity: 75,
        description: 'Third sample product',
        images: ['https://example.com/image3.jpg'],
        categories: { name: 'Another Category' },
        trendyol_status: 'rejected',
        trendyol_product_id: 'TYP003',
        rejection_reason: 'Image quality not sufficient'
      }
    ]
  },
  trendyolProducts: {
    products: [
      {
        id: 'TYP001',
        productName: 'Sample Product 1',
        productCode: 'SP001',
        salePrice: 25.99,
        stockAmount: 100,
        approvalStatus: 'APPROVED',
        description: 'A sample product for testing purposes',
        images: ['https://example.com/image1.jpg']
      },
      {
        id: 'TYP002',
        productName: 'Sample Product 2',
        productCode: 'SP002',
        salePrice: 35.50,
        stockAmount: 50,
        approvalStatus: 'PENDING',
        description: 'Another sample product for testing',
        images: ['https://example.com/image2.jpg']
      }
    ]
  }
}