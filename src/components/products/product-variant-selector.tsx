'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Minus } from 'lucide-react'
import { ProductVariant, VariantOption, OrderItemVariant } from '@/types/supabase'

interface ProductVariantSelectorProps {
  variants: ProductVariant[]
  basePrice: number
  onVariantChange: (selectedVariants: OrderItemVariant[], totalPrice: number) => void
  formatPrice: (price: number) => string
}

export function ProductVariantSelector({
  variants,
  basePrice,
  onVariantChange,
  formatPrice
}: ProductVariantSelectorProps) {
  const [selectedVariants, setSelectedVariants] = useState<{
    [variantId: string]: string[] // variant option ids
  }>({})
  
  const [totalPrice, setTotalPrice] = useState(basePrice)

  // Initialize default selections
  useEffect(() => {
    const defaultSelections: { [variantId: string]: string[] } = {}
    
    variants.forEach(variant => {
      if (variant.is_required) {
        const defaultOption = variant.options?.find(opt => opt.is_default) || variant.options?.[0]
        if (defaultOption) {
          if (variant.type === 'size' || variant.type === 'option') {
            defaultSelections[variant.id] = [defaultOption.id]
          }
        }
      }
    })
    
    setSelectedVariants(defaultSelections)
  }, [variants])

  // Calculate total price and notify parent
  useEffect(() => {
    let priceModifier = 0
    const selectedVariantsList: OrderItemVariant[] = []

    Object.entries(selectedVariants).forEach(([variantId, optionIds]) => {
      const variant = variants.find(v => v.id === variantId)
      if (!variant) return

      optionIds.forEach(optionId => {
        const option = variant.options?.find(opt => opt.id === optionId)
        if (option) {
          priceModifier += option.price_modifier
          selectedVariantsList.push({
            variant_name: variant.name,
            option_name: option.name,
            price_modifier: option.price_modifier
          })
        }
      })
    })

    const newTotalPrice = basePrice + priceModifier
    setTotalPrice(newTotalPrice)
    onVariantChange(selectedVariantsList, newTotalPrice)
  }, [selectedVariants, variants, basePrice, onVariantChange])

  const handleVariantSelection = (variantId: string, optionId: string, isSelected: boolean) => {
    const variant = variants.find(v => v.id === variantId)
    if (!variant) return

    setSelectedVariants(prev => {
      const current = prev[variantId] || []
      
      if (variant.type === 'size' || variant.type === 'option') {
        // Single selection
        return {
          ...prev,
          [variantId]: isSelected ? [optionId] : []
        }
      } else if (variant.type === 'addon') {
        // Multiple selection
        if (isSelected) {
          if (current.length < variant.max_selection) {
            return {
              ...prev,
              [variantId]: [...current, optionId]
            }
          }
          return prev // Max selection reached
        } else {
          return {
            ...prev,
            [variantId]: current.filter(id => id !== optionId)
          }
        }
      }
      
      return prev
    })
  }

  const isVariantValid = (variant: ProductVariant) => {
    const selectedCount = selectedVariants[variant.id]?.length || 0
    return selectedCount >= variant.min_selection && selectedCount <= variant.max_selection
  }

  const isFormValid = () => {
    return variants.every(variant => {
      if (variant.is_required) {
        return isVariantValid(variant)
      }
      return true
    })
  }

  if (variants.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {variants.map((variant) => {
        const selectedCount = selectedVariants[variant.id]?.length || 0
        const isValid = isVariantValid(variant)
        
        return (
          <Card key={variant.id} className={!isValid && variant.is_required ? 'border-red-200' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {variant.name}
                    {variant.is_required && (
                      <Badge variant="destructive" className="text-xs">
                        Zorunlu
                      </Badge>
                    )}
                  </CardTitle>
                  {variant.type === 'addon' && (
                    <CardDescription className="text-sm">
                      {variant.min_selection === variant.max_selection 
                        ? `Tam ${variant.max_selection} adet seçin`
                        : `${variant.min_selection}-${variant.max_selection} adet seçebilirsiniz`
                      }
                      {selectedCount > 0 && ` (${selectedCount} seçildi)`}
                    </CardDescription>
                  )}
                </div>
                {!isValid && variant.is_required && (
                  <Badge variant="destructive" className="text-xs">
                    Seçim yapın
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {variant.type === 'size' || variant.type === 'option' ? (
                // Radio Group for single selection
                <RadioGroup
                  value={selectedVariants[variant.id]?.[0] || ''}
                  onValueChange={(value) => handleVariantSelection(variant.id, value, true)}
                  className="space-y-3"
                >
                  {variant.options?.filter(opt => opt.is_available).map((option) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>{option.name}</span>
                          {option.price_modifier !== 0 && (
                            <span className={`text-sm font-medium ${
                              option.price_modifier > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {option.price_modifier > 0 ? '+' : ''}
                              {formatPrice(option.price_modifier)}
                            </span>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                // Checkbox Group for multiple selection
                <div className="space-y-3">
                  {variant.options?.filter(opt => opt.is_available).map((option) => {
                    const isSelected = selectedVariants[variant.id]?.includes(option.id) || false
                    const canSelect = selectedCount < variant.max_selection || isSelected
                    
                    return (
                      <div key={option.id} className={`flex items-center space-x-3 ${
                        !canSelect ? 'opacity-50 cursor-not-allowed' : ''
                      }`}>
                        <Checkbox
                          id={option.id}
                          checked={isSelected}
                          disabled={!canSelect}
                          onCheckedChange={(checked) => 
                            handleVariantSelection(variant.id, option.id, !!checked)
                          }
                        />
                        <Label 
                          htmlFor={option.id} 
                          className={`flex-1 ${canSelect ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.name}</span>
                            {option.price_modifier !== 0 && (
                              <span className={`text-sm font-medium ${
                                option.price_modifier > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {option.price_modifier > 0 ? '+' : ''}
                                {formatPrice(option.price_modifier)}
                              </span>
                            )}
                          </div>
                        </Label>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {/* Price Summary */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Fiyat</p>
              {totalPrice !== basePrice && (
                <p className="text-xs text-gray-500">
                  Temel fiyat: {formatPrice(basePrice)}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-orange-600">
                {formatPrice(totalPrice)}
              </p>
              {totalPrice !== basePrice && (
                <p className="text-xs text-green-600">
                  +{formatPrice(totalPrice - basePrice)} ek ücret
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Status */}
      {!isFormValid() && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">
              Lütfen tüm zorunlu seçimleri yapın.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}