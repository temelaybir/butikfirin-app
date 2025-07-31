'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import themeSettingsService from '@/services/admin/theme-settings-service'
import type { ThemeSettings, ColorTheme, DesignStyle, FontStyle, ProductCardStyle } from '@/services/site-settings'

interface ThemeConfig extends ThemeSettings {
  colorTheme: ColorTheme
  designStyle: DesignStyle
  fontStyle: FontStyle
  productCardStyle: ProductCardStyle
}

interface ThemeContextType {
  theme: ThemeConfig
  isLoading: boolean
  setColorTheme: (colorTheme: ColorTheme) => Promise<void>
  setDesignStyle: (designStyle: DesignStyle) => Promise<void>
  setFontStyle: (fontStyle: FontStyle) => Promise<void>
  setProductCardStyle: (productCardStyle: ProductCardStyle) => Promise<void>
  refreshTheme: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useThemeConfig() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeConfig must be used within ThemeConfigProvider')
  }
  return context
}

export function ThemeConfigProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>({
    // Veritabanı alanları
    theme_color_scheme: 'light',
    theme_design_style: 'default',
    theme_font_style: 'modern-sans',
    theme_product_card_style: 'default',
    // Context uyumluluğu için alias'lar
    colorTheme: 'light',
    designStyle: 'default',
    fontStyle: 'modern-sans',
    productCardStyle: 'default'
  })
  const [isLoading, setIsLoading] = useState(true)

  // API'den tema ayarlarını yükle
  const loadThemeSettings = async () => {
    try {
      setIsLoading(true)
      const settings = await themeSettingsService.getThemeSettings()
      
      const newTheme: ThemeConfig = {
        // Veritabanı alanları
        theme_color_scheme: settings.theme_color_scheme,
        theme_design_style: settings.theme_design_style,
        theme_font_style: settings.theme_font_style,
        theme_product_card_style: settings.theme_product_card_style,
        // Context uyumluluğu için alias'lar
        colorTheme: settings.theme_color_scheme,
        designStyle: settings.theme_design_style,
        fontStyle: settings.theme_font_style,
        productCardStyle: settings.theme_product_card_style
      }
      
      setTheme(newTheme)
      applyThemeToDOM(newTheme)
    } catch (error) {
      console.error('Tema ayarları yüklenemedi:', error)
      toast.error('Tema ayarları yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  // Tema ayarlarını DOM'a uygula
  const applyThemeToDOM = (themeConfig: ThemeConfig) => {
    // Renk teması uygula
    if (themeConfig.colorTheme === 'light' || themeConfig.colorTheme === 'dark') {
      document.documentElement.className = themeConfig.colorTheme
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.className = ''
      document.documentElement.setAttribute('data-theme', themeConfig.colorTheme)
    }
    
    // Tasarım stili uygula
    if (themeConfig.designStyle === 'default') {
      document.documentElement.removeAttribute('data-design')
    } else {
      document.documentElement.setAttribute('data-design', themeConfig.designStyle)
    }
    
    // Font stili uygula
    if (themeConfig.fontStyle === 'modern-sans') {
      document.documentElement.removeAttribute('data-font')
    } else {
      document.documentElement.setAttribute('data-font', themeConfig.fontStyle)
    }

    // Ürün kartı stili uygula
    if (themeConfig.productCardStyle === 'default') {
      document.documentElement.removeAttribute('data-product-card')
    } else {
      document.documentElement.setAttribute('data-product-card', themeConfig.productCardStyle)
    }
  }

  // Component mount edildiğinde tema ayarlarını yükle
  useEffect(() => {
    loadThemeSettings()
  }, [])

  const setColorTheme = async (colorTheme: ColorTheme) => {
    try {
      const updatedSettings = await themeSettingsService.updateColorTheme(colorTheme)
      
      const newTheme: ThemeConfig = {
        theme_color_scheme: updatedSettings.theme_color_scheme,
        theme_design_style: updatedSettings.theme_design_style,
        theme_font_style: updatedSettings.theme_font_style,
        theme_product_card_style: updatedSettings.theme_product_card_style,
        colorTheme: updatedSettings.theme_color_scheme,
        designStyle: updatedSettings.theme_design_style,
        fontStyle: updatedSettings.theme_font_style,
        productCardStyle: updatedSettings.theme_product_card_style
      }
      
      setTheme(newTheme)
      applyThemeToDOM(newTheme)
      toast.success('Renk teması güncellendi')
    } catch (error) {
      console.error('Renk teması güncellenemedi:', error)
      toast.error('Renk teması güncellenemedi')
    }
  }

  const setDesignStyle = async (designStyle: DesignStyle) => {
    try {
      const updatedSettings = await themeSettingsService.updateDesignStyle(designStyle)
      
      const newTheme: ThemeConfig = {
        theme_color_scheme: updatedSettings.theme_color_scheme,
        theme_design_style: updatedSettings.theme_design_style,
        theme_font_style: updatedSettings.theme_font_style,
        theme_product_card_style: updatedSettings.theme_product_card_style,
        colorTheme: updatedSettings.theme_color_scheme,
        designStyle: updatedSettings.theme_design_style,
        fontStyle: updatedSettings.theme_font_style,
        productCardStyle: updatedSettings.theme_product_card_style
      }
      
      setTheme(newTheme)
      applyThemeToDOM(newTheme)
      toast.success('Tasarım stili güncellendi')
    } catch (error) {
      console.error('Tasarım stili güncellenemedi:', error)
      toast.error('Tasarım stili güncellenemedi')
    }
  }

  const setFontStyle = async (fontStyle: FontStyle) => {
    try {
      const updatedSettings = await themeSettingsService.updateFontStyle(fontStyle)
      
      const newTheme: ThemeConfig = {
        theme_color_scheme: updatedSettings.theme_color_scheme,
        theme_design_style: updatedSettings.theme_design_style,
        theme_font_style: updatedSettings.theme_font_style,
        theme_product_card_style: updatedSettings.theme_product_card_style,
        colorTheme: updatedSettings.theme_color_scheme,
        designStyle: updatedSettings.theme_design_style,
        fontStyle: updatedSettings.theme_font_style,
        productCardStyle: updatedSettings.theme_product_card_style
      }
      
      setTheme(newTheme)
      applyThemeToDOM(newTheme)
      toast.success('Font stili güncellendi')
    } catch (error) {
      console.error('Font stili güncellenemedi:', error)
      toast.error('Font stili güncellenemedi')
    }
  }

  const setProductCardStyle = async (productCardStyle: ProductCardStyle) => {
    try {
      const updatedSettings = await themeSettingsService.updateProductCardStyle(productCardStyle)
      
      const newTheme: ThemeConfig = {
        theme_color_scheme: updatedSettings.theme_color_scheme,
        theme_design_style: updatedSettings.theme_design_style,
        theme_font_style: updatedSettings.theme_font_style,
        theme_product_card_style: updatedSettings.theme_product_card_style,
        colorTheme: updatedSettings.theme_color_scheme,
        designStyle: updatedSettings.theme_design_style,
        fontStyle: updatedSettings.theme_font_style,
        productCardStyle: updatedSettings.theme_product_card_style
      }
      
      setTheme(newTheme)
      applyThemeToDOM(newTheme)
      toast.success('Ürün kartı stili güncellendi')
    } catch (error) {
      console.error('Ürün kartı stili güncellenemedi:', error)
      toast.error('Ürün kartı stili güncellenemedi')
    }
  }

  const refreshTheme = async () => {
    await loadThemeSettings()
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isLoading,
      setColorTheme, 
      setDesignStyle, 
      setFontStyle, 
      setProductCardStyle,
      refreshTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Backward compatibility exports
export type { ColorTheme, DesignStyle, FontStyle, ProductCardStyle } 