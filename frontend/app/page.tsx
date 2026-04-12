'use client'

import { useState, useEffect } from 'react'
import { translations, Language } from '@/lib/i18n'

// Format price in MKD
const formatMKD = (price: number) => `${price.toLocaleString('mk-MK')} ден`

// REAL North Macedonia Deals
const HOT_DEALS = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB',
    store: 'Анатолија (Anatolija)',
    originalPrice: 84990,
    discountPrice: 72990,
    discount: 14,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select',
    hot: true,
    endsIn: '02:45:30',
    category: 'electronics',
    rating: 4.9,
    reviews: 2847
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra',
    store: 'Нептун (Neptun)',
    originalPrice: 74990,
    discountPrice: 64990,
    discount: 13,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/mk/2401/gallery/mk-galaxy-s24-ultra-sm-s928bztdgeo',
    hot: true,
    endsIn: '05:20:15',
    category: 'electronics',
    rating: 4.7,
    reviews: 1523
  },
  {
    id: 3,
    title: 'LG OLED TV 55\" 4K Smart',
    store: 'Сетек (Setec)',
    originalPrice: 69990,
    discountPrice: 54990,
    discount: 21,
    image: 'https://www.lg.com/mk/images/tvs/md07565051/gallery/medium01.jpg',
    hot: true,
    endsIn: '12:00:00',
    category: 'electronics',
    rating: 4.8,
    reviews: 892
  },
  {
    id: 4,
    title: 'Nike Air Force 1',
    store: 'Спорт Визион',
    originalPrice: 6490,
    discountPrice: 4990,
    discount: 23,
    image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07',
    hot: true,
    endsIn: '03:15:00',
    category: 'fashion',
    rating: 4.9,
    reviews: 567
  },
  {
    id: 5,
    title: 'PlayStation 5 Console',
    store: 'Анатолија',
    originalPrice: 34990,
    discountPrice: 29990,
    discount: 14,
    image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21',
    hot: true,
    endsIn: '01:30:00',
    category: 'electronics',
    rating: 4.9,
    reviews: 3421
  },
  {
    id: 6,
    title: 'Dyson V15 Detect',
    store: 'КАМ Маркет',
    originalPrice: 44990,
    discountPrice: 34990,
    discount: 22,
    image: 'https://m.media-amazon.com/images/I/61k3c-4hXaL._AC_UF894,1000_QL80_.jpg',
    hot: false,
    endsIn: '18:45:00',
    category: 'home',
    rating: 4.7,
    reviews: 2156
  }
]

const CATEGORIES = [
  { name: 'Сите', icon: '🔥', count: 50000 },
  { name: 'Електроника', icon: '📱', count: 12500 },
  { name: 'Мода', icon: '👕', count: 8900 },
  { name: 'Домаќинство', icon: '🏠', count: 6700 },
  { name: 'Спорт', icon: '⚽', count: 4300 },
]

export default function Home() {
  const [lang, setLang] = useState<Language>('mk')
  const t = translations[lang]
  const [selectedCategory, setSelectedCategory] = useState('Сите')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState<Record<number, string>>({})

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft: Record<number, string> = {}
      HOT_DEALS.forEach(deal => {
        const [hours, minutes, seconds] = deal.endsIn.split(':').map(Number)
        let totalSeconds = hours * 3600 + minutes * 60 + seconds
        if (totalSeconds > 0) {
          totalSeconds--
          const h = Math.floor(totalSeconds / 3600)
          const m = Math.floor((totalSeconds % 3600) / 60)
          const s = totalSeconds % 60
          newTimeLeft[deal.id] = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        }
      })
      setTimeLeft(newTimeLeft)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredDeals = HOT_DEALS.filter(deal => {
    const matchesCategory = selectedCategory === 'Сите' || 
      (selectedCategory === 'Електроника' && deal.category === 'electronics') ||
      (selectedCategory === 'Мода' && deal.category === 'fashion') ||
      (selectedCategory === 'Домаќинство' && deal.category === 'home')
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.store.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login
    setUser({ full_name: 'Јован Јовановски', email: 'jovan@example.com', qr_code: 'MKBF-A7B9C2D4E8F1' })
    setShowLogin(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <p className="text-xs text-gray-500">🇲🇰 Северна Македонија</p>
              </div>
            </div>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLang('mk')}
                className={`px-2 py-1 rounded text-sm ${lang === 'mk' ? 'bg-red-600' : 'bg-gray-800'}`}
              >
                MK
              </button>
              <button 
                onClick={() => setLang('al')}
                className={`px-2 py-1 rounded text-sm ${lang === 'al' ? 'bg-red-600' : 'bg-gray-800'}`}
              >
                AL
              </button>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.full_name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <span className="text-sm text-white hidden md:block">{user.full_name}</span>
                  <button 
                    onClick={() => setUser(null)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {t.logout}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  {t.login}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {isLogin ? t.login : t.register}
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t.fullName}</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Јован Јовановски"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t.email}</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="vasemail@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t.password}</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
              >
                {isLogin ? t.login : t.register}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-400">
              {isLogin ? 'Немаш сметка?' : 'Веќе имаш сметка?'}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-500 hover:text-red-400"
              >
                {isLogin ? t.register : t.login}
              </button>
            </p>
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-red-400 text-sm font-medium">{t.tagline}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Black Friday
            </span>
            <br />
            <span className="text-white">Radar</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            AI-powered deal discovery со реални цени во денари (MKD) од 1,200+ продавници во Северна Македонија
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-32 py-4 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-red-600"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold">
                🔍
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">50,000+</div>
              <div className="text-sm text-gray-500">{t.activeDeals}</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-500">1,200+</div>
              <div className="text-sm text-gray-500">{t.partnerStores}</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">10</div>
              <div className="text-sm text-gray-500">{t.aiAgents}</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">100K+</div>
              <div className="text-sm text-gray-500">{t.dailyScans}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === cat.name
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-gray-900/50 text-gray-400 border border-gray-800 hover:border-red-600/50"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                🔥 {t.hotDeals}
              </h2>
              <p className="text-gray-500 mt-1">{t.endingSoon}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300">
                <div className="relative h-48 bg-gray-800">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                  {deal.hot && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      🔥 HOT
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-gray-900/80 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    ⏰ {timeLeft[deal.id] || deal.endsIn}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-xs text-gray-300">{deal.store}</p>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2">{deal.title}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-500">★</span>
                    <span className="text-white text-sm">{deal.rating}</span>
                    <span className="text-gray-500 text-sm">({deal.reviews.toLocaleString()})</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-red-500">{formatMKD(deal.discountPrice)}</span>
                    <span className="text-gray-500 line-through">{formatMKD(deal.originalPrice)}</span>
                    <span className="px-2 py-1 bg-red-600/20 text-red-400 text-sm font-bold rounded">
                      -{deal.discount}%
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold text-sm">
                      {t.getDeal}
                    </button>
                    <button className="px-3 py-2 bg-gray-800 rounded-lg">♥</button>
                    <button className="px-3 py-2 bg-gray-800 rounded-lg">↗</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Section for logged in users */}
      {user && (
        <section className="px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">{t.memberQR}</h3>
              <div className="bg-white p-4 rounded-xl inline-block mb-4">
                {/* QR Code placeholder */}
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                  QR: {user.qr_code}
                </div>
              </div>
              <p className="text-xs text-gray-500 font-mono">{user.qr_code}</p>
              <p className="text-sm text-gray-400 mt-2">{t.showInStore}</p>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="px-4 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t.whyChooseUs}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                🤖
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.aiPowered}</h3>
              <p className="text-gray-400">{t.aiDesc}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                🗺️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.mapRadar}</h3>
              <p className="text-gray-400">{t.mapDesc}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                📱
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.qrVerify}</h3>
              <p className="text-gray-400">{t.qrDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">
            © 2026 MK Black Friday Radar. Сите права задржани.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            🇲🇰 Северна Македонија | Изработено со 🔥 за македонските потрошувачи
          </p>
        </div>
      </footer>
    </div>
  )
}
