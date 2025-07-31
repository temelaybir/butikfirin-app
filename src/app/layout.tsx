import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { OrderProvider } from '@/context/cart-context'
import { CurrencyProvider } from '@/context/currency-context'
import { WishlistProvider } from '@/context/wishlist-context'
import { ThemeConfigProvider } from '@/context/theme-context'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

// Font tanımlamaları
const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'] })

// Static metadata for Butik Fırın App
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),

  title: {
    default: 'Butik Fırın - Ev Yapımı Lezzetler',
    template: '%s | Butik Fırın'
  },
  description: 'Butik Fırın - Ev yapımı taze pastalar, kekler, kurabiyeler ve özel günler için muhteşem tatlılar',
  keywords: ['butik fırın', 'pasta', 'kek', 'kurabiye', 'tatlı', 'ev yapımı', 'taze', 'doğum günü pastası', 'özel sipariş'],
  authors: [{ name: 'Butik Fırın Ekibi' }],
  robots: 'index, follow',

  // OpenGraph
  openGraph: {
    title: 'Butik Fırın - Ev Yapımı Lezzetler',
    description: 'Butik Fırın - Ev yapımı taze pastalar, kekler, kurabiyeler ve özel günler için muhteşem tatlılar',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Butik Fırın',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Butik Fırın - Ev Yapımı Tatlılar'
      }
    ]
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Butik Fırın - Ev Yapımı Lezzetler',
    description: 'Butik Fırın - Ev yapımı taze pastalar, kekler, kurabiyeler ve özel günler için muhteşem tatlılar',
    images: ['/images/og-image.jpg']
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },

  // Manifest
  manifest: '/manifest.json',

  // Meta tags
  other: {
    'theme-color': '#ea580c',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no'
  }
}

// Viewport ayrı export (Next.js 15 requirement)
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#ea580c'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Font değişkenlerini birleştir
  const fontVariables = `${inter.className} ${poppins.className}`

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />

        {/* Aggressive Mobile Touch Optimization */}
        <meta name="theme-color" content="#ea580c" />
        <meta name="description" content="Butik Fırın - Ev yapımı taze pastalar, kekler, kurabiyeler ve özel günler için muhteşem tatlılar" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Force touch-action CSS property globally */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * { 
              -webkit-tap-highlight-color: transparent !important;
              -webkit-touch-callout: none !important;
              touch-action: manipulation !important;
            }
            a, button, [role="button"] {
              -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
              -webkit-touch-callout: none !important;
              -webkit-user-select: none !important;
              touch-action: manipulation !important;
              cursor: pointer !important;
            }
            input, textarea {
              touch-action: auto !important;
              -webkit-user-select: auto !important;
            }
          `
        }} />
      </head>
      <body className={`${inter.className} ${fontVariables}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeConfigProvider>
            <CurrencyProvider>
              <WishlistProvider>
                <OrderProvider>
                  {children}
                <Toaster
                  position="bottom-left"
                  expand={true}
                  richColors={true}
                  closeButton={true}
                  toastOptions={{
                    style: {
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                      fontSize: '14px',
                      padding: '16px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                      minWidth: '320px',
                      minHeight: '60px'
                    },
                    className: 'group toast-custom',
                    duration: 4000,
                  }}
                  className="hidden md:block"
                />
                {/* Mobile Toaster */}
                <Toaster
                  position="bottom-center"
                  expand={true}
                  richColors={true}
                  closeButton={true}
                  toastOptions={{
                    style: {
                      background: 'hsl(var(--background) / 0.85)', // Transparanlık artırıldı
                      border: '1px solid hsl(var(--border) / 0.7)',
                      color: 'hsl(var(--foreground))',
                      fontSize: '14px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 8px -2px rgb(0 0 0 / 0.15)', // Hafif gölge
                      minWidth: '280px',
                      minHeight: '50px',
                      marginBottom: '16px', // Alt boşluk
                      backdropFilter: 'blur(8px)', // Blur efekti
                      WebkitBackdropFilter: 'blur(8px)' // Safari desteği
                    },
                    className: 'group toast-custom toast-mobile',
                    duration: 2500, // Daha hızlı gitsin
                  }}
                  className="md:hidden"
                />
                </OrderProvider>
              </WishlistProvider>
            </CurrencyProvider>
          </ThemeConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}