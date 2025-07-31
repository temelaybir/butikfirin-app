import { CookieBanner } from '@/components/layout/cookie-banner'
import { Footer } from '@/components/layout/footer'
import { ModernHeader } from '@/components/layout/modern-header'
import { SocialMediaWidget } from '@/components/layout/social-media-widget'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { OrderProvider } from '@/context/cart-context'
import { CurrencyProvider } from '@/context/currency-context'
import { UserProvider } from '@/context/user-context'
import { WishlistProvider } from '@/context/wishlist-context'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CurrencyProvider>
      <UserProvider>
        <WishlistProvider>
          <OrderProvider>
            <div className="flex min-h-screen flex-col">
              <ModernHeader />
              <main className="flex-1 pb-24 lg:pb-0">
                {children}
              </main>
              <Footer className="hidden lg:block" />
              <MobileBottomNav />
            </div>
            <SocialMediaWidget />
            <CookieBanner />
          </OrderProvider>
        </WishlistProvider>
      </UserProvider>
    </CurrencyProvider>
  )
}