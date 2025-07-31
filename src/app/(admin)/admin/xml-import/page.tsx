'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileX, CheckCircle, AlertCircle, Database } from 'lucide-react'
import { toast } from 'sonner'

interface ImportStats {
  total: number
  imported: number
  errors: number
  current?: string
}

export default function XmlImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [stats, setStats] = useState<ImportStats>({ total: 0, imported: 0, errors: 0 })
  const [errors, setErrors] = useState<string[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xml')) {
        setFile(selectedFile)
        setErrors([])
        setStats({ total: 0, imported: 0, errors: 0 })
      } else {
        toast.error('Lütfen XML dosyası seçin')
      }
    }
  }

  const parseXmlProducts = async (xmlContent: string) => {
    // XML parsing - Excel XML formatını parse et
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')
    
    // Excel XML'den satırları al
    const rows = xmlDoc.getElementsByTagName('Row')
    const products = []
    
    // İlk satır header, ondan sonrakiler data
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const cells = row.getElementsByTagName('Cell')
      
      if (cells.length >= 6) { // En az 6 kolon olmalı
        const product = {
          product_id: parseInt(getCellValue(cells[0]) || '0'),
          name: getCellValue(cells[1]) || 'Ürün Adı',
          categories: getCellValue(cells[2]) || '276',
          quantity: parseInt(getCellValue(cells[3]) || '0'),
          image_name: getCellValue(cells[4]) || '',
          price: parseFloat(getCellValue(cells[5]) || '0'),
          description: getCellValue(cells[6]) || '',
          meta_title: getCellValue(cells[7]) || '',
          meta_description: getCellValue(cells[8]) || '',
          meta_keywords: getCellValue(cells[9]) || ''
        }
        products.push(product)
      }
    }
    
    return products
  }

  const getCellValue = (cell: Element): string => {
    const dataElement = cell.getElementsByTagName('Data')[0]
    return dataElement?.textContent || ''
  }

  const importProducts = async () => {
    if (!file) return

    setImporting(true)
    setStats({ total: 0, imported: 0, errors: 0 })
    setErrors([])

    try {
      const xmlContent = await file.text()
      const products = await parseXmlProducts(xmlContent)
      
      setStats(prev => ({ ...prev, total: products.length }))

      // Batch olarak import et (10'lu gruplar halinde)
      const batchSize = 10
      let imported = 0
      let errorCount = 0
      const errorList: string[] = []

      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize)
        
        try {
          const response = await fetch('/api/admin/import-products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products: batch }),
          })

          const result = await response.json()
          
          if (result.success) {
            imported += result.imported
            if (result.errors?.length) {
              errorCount += result.errors.length
              errorList.push(...result.errors)
            }
          } else {
            errorCount += batch.length
            errorList.push(`Batch ${Math.floor(i / batchSize) + 1}: ${result.error}`)
          }
        } catch (error) {
          errorCount += batch.length
          errorList.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error}`)
        }

        setStats({
          total: products.length,
          imported,
          errors: errorCount,
          current: `${Math.min(i + batchSize, products.length)} / ${products.length}`
        })

        // Kısa bekleme
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      setErrors(errorList)
      
      if (imported > 0) {
        toast.success(`${imported} ürün başarıyla import edildi`)
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} ürün import edilemedi`)
      }

    } catch (error) {
      console.error('XML parse error:', error)
      toast.error('XML dosyası okunamadı')
      setErrors([`XML parse hatası: ${error}`])
    } finally {
      setImporting(false)
    }
  }

  const resetImport = () => {
    setFile(null)
    setStats({ total: 0, imported: 0, errors: 0 })
    setErrors([])
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">XML Ürün Import</h1>
        <Button onClick={resetImport} variant="outline">
          <FileX className="h-4 w-4 mr-2" />
          Temizle
        </Button>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            XML Dosyası Yükle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">products-final.xml dosyasını seçin</p>
            <p className="text-sm text-gray-500 mb-4">
              Excel XML formatındaki ürün verilerini import eder
            </p>
            <input
              type="file"
              accept=".xml"
              onChange={handleFileSelect}
              className="hidden"
              id="xml-file"
            />
            <label htmlFor="xml-file">
              <Button variant="outline" className="cursor-pointer">
                Dosya Seç
              </Button>
            </label>
          </div>

          {file && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{file.name}</strong> seçildi ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import Controls */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Import İşlemi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={importProducts} 
              disabled={importing}
              className="w-full"
              size="lg"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Import Ediliyor...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Ürünleri Import Et
                </>
              )}
            </Button>

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>İlerleme</span>
                  <span>{stats.current}</span>
                </div>
                <Progress 
                  value={stats.total > 0 ? (stats.imported + stats.errors) / stats.total * 100 : 0} 
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {(stats.total > 0 || stats.imported > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Başarılı</p>
                  <p className="text-2xl font-bold text-green-600">{stats.imported}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hata</p>
                  <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Hatalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 