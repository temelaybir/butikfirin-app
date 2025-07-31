'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Clock, ChefHat, Coffee, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Butik Fırın için statik footer verisi
const restaurantInfo = {
  name: 'Butik Fırın',
  description: 'Geleneksel tariflerimizle hazırladığımız taze börekler, nefis poğaçalar ve ev yapımı lezzetlerle damağınızda unutulmaz tatlar bırakıyoruz. Her gün taze, her lokma lezzet.',
  phone: '(0212) 855 44 22',
  email: 'info@butikfirin.com',
  address: 'Adnan Kahveci Mah. Engin Sk. No:20 Beylikdüzü/İSTANBUL',
  address2: 'Cumhuriyet Mah. Atatürk Bulvarı No:8 Bizimkent-Beylikdüzü/İSTANBUL',
  hours: 'Her Gün 08:00 - 22:00',
  copyright: '© 2024 Butik Fırın. Tüm hakları saklıdır.',
}

// Restoran için footer linkleri
const footerLinks = {
  menu: [
    { name: 'Tuzlu Börekler', href: '/kategoriler/tuzlu-borekler' },
    { name: 'Tatlı Börekler', href: '/kategoriler/tatli-borekler' },
    { name: 'Poğaça & Açma', href: '/kategoriler/pogaca-acma' },
    { name: 'İçecekler', href: '/kategoriler/icecekler' },
  ],
  company: [
    { name: 'Hakkımızda', href: '/hakkimizda' },
    { name: 'İletişim', href: '/iletisim' },
    { name: 'Şubelerimiz', href: '/subeler' },
    { name: 'Kariyer', href: '/kariyer' },
  ],
  support: [
    { name: 'Sipariş Takibi', href: '/siparis-takip' },
    { name: 'SSS', href: '/sss' },
    { name: 'Rezervasyon', href: '/rezervasyon' },
    { name: 'Catering Hizmeti', href: '/catering' },
  ],
  legal: [
    { name: 'Gizlilik Politikası', href: '/gizlilik' },
    { name: 'Kullanım Şartları', href: '/kullanim-sartlari' },
    { name: 'Çerez Politikası', href: '/cerez-politikasi' },
    { name: 'KVKK', href: '/kvkk' },
  ],
}

// Sosyal medya linkleri
const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/butikfirin', icon: Facebook },
  { name: 'Instagram', href: 'https://instagram.com/butikfirin', icon: Instagram },
  { name: 'Twitter', href: 'https://twitter.com/butikfirin', icon: Twitter },
]

export function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white ${className}`}>
      {/* Compact Header */}
      <div className="border-b border-slate-700/50 bg-gradient-to-r from-amber-600/20 to-orange-600/20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center gap-3 justify-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <ChefHat className="text-white w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Butik Fırın
              </h3>
            </div>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              Taze, lezzetli ve doğal. Her gün sizin için hazırlanıyor.
            </p>
          </div>
        </div>
      </div>

      {/* Compact Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h4 className="font-bold mb-4 text-amber-400 flex items-center gap-2 justify-center md:justify-start">
              <Phone className="h-4 w-4" />
              İletişim
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="h-3 w-3 text-amber-500" />
                <Link href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`} className="hover:text-white font-medium">
                  {restaurantInfo.phone}
                </Link>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Clock className="h-3 w-3 text-amber-500" />
                <span>{restaurantInfo.hours}</span>
              </div>
              <div className="flex items-start gap-2 justify-center md:justify-start">
                <MapPin className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs leading-relaxed text-left">
                  <p className="font-medium">Merkez:</p>
                  <p>{restaurantInfo.address}</p>
                  <p className="font-medium mt-1">Şube 1:</p>
                  <p>{restaurantInfo.address2}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="text-center">
            <h4 className="font-bold mb-4 text-amber-400 flex items-center gap-2 justify-center">
              <UtensilsCrossed className="h-4 w-4" />
              Hızlı Menü
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {footerLinks.menu.slice(0, 4).map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-gray-300 hover:text-amber-400 transition-colors py-1 px-2 rounded hover:bg-slate-800"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social & Info */}
          <div className="text-center md:text-right">
            <h4 className="font-bold mb-4 text-amber-400 flex items-center gap-2 justify-center md:justify-end">
              <Instagram className="h-4 w-4" />
              Takip Edin
            </h4>
            <div className="flex gap-3 justify-center md:justify-end mb-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 hover:bg-amber-600 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>7/24 Online Sipariş</p>
              <p>Hızlı Teslimat</p>
              <p>Taze Garanti</p>
            </div>
          </div>
        </div>

      </div>

      {/* Compact Bottom */}
      <div className="border-t border-slate-700/50 bg-slate-900/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
            <p>{restaurantInfo.copyright}</p>
            <div className="flex items-center gap-3">
              <Link href="/gizlilik" className="hover:text-amber-400 transition-colors">Gizlilik</Link>
              <span>•</span>
              <Link href="/kullanim-sartlari" className="hover:text-amber-400 transition-colors">Koşullar</Link>
              <span>•</span>
              <Link href="/kvkk" className="hover:text-amber-400 transition-colors">KVKK</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}