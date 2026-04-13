'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Flame, User, Heart, X, Home, TrendingUp, Store, Grid, 
  MapPin, Camera, QrCode, ChevronRight, Star, ShoppingCart, 
  Zap, Bell, Menu, Smartphone, Tv, Watch, Laptop, Sparkles
} from 'lucide-react';

// MACEDONIAN STORES
const STORES = [
  { id: 1, name: 'Нептун', slug: 'neptun', category: 'electronics', deals: 128, color: 'bg-blue-600', icon: '📱' },
  { id: 2, name: 'Сетек', slug: 'setec', category: 'electronics', deals: 67, color: 'bg-green-600', icon: '💻' },
  { id: 3, name: 'Техномаркет', slug: 'tehnomarket', category: 'appliances', deals: 34, color: 'bg-orange-600', icon: '📺' },
  { id: 4, name: 'Анхоч', slug: 'anhoch', category: 'electronics', deals: 89, color: 'bg-purple-600', icon: '💻' },
  { id: 5, name: 'Тинекс', slug: 'tinex', category: 'supermarket', deals: 156, color: 'bg-red-600', icon: '🛒' },
  { id: 6, name: 'Рамстор', slug: 'ramstore', category: 'supermarket', deals: 78, color: 'bg-yellow-600', icon: '🛒' },
  { id: 7, name: 'Веро', slug: 'vero', category: 'supermarket', deals: 92, color: 'bg-teal-600', icon: '🛒' },
  { id: 8, name: 'КАМ Маркет', slug: 'kam', category: 'supermarket', deals: 45, color: 'bg-pink-600', icon: '🛒' },
  { id: 9, name: 'Ананас', slug: 'ananas', category: 'marketplace', deals: 234, color: 'bg-indigo-600', icon: '📦' },
  { id: 10, name: 'Жирафа', slug: 'zirafa', category: 'marketplace', deals: 189, color: 'bg-cyan-600', icon: '📦' },
];

// REAL DEALS
const DEALS = [
  { id: 1, title: 'Apple iPhone 15 Pro Max 256GB', store: 'Нептун', store_slug: 'neptun', category: 'phones', original: 84990, discount: 72990, percent: 14, hot: true, badge: 'TOP', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400', rating: 4.9, reviews: 2847 },
  { id: 2, title: 'Samsung Galaxy S24 Ultra 256GB', store: 'Сетек', store_slug: 'setec', category: 'phones', original: 74990, discount: 64990, percent: 13, hot: true, badge: 'HOT', image: 'https://images.unsplash.com/photo-1610945265078-3858a0828671?w=400', rating: 4.7, reviews: 1523 },
  { id: 3, title: 'Samsung 55" OLED 4K Smart TV', store: 'Техномаркет', store_slug: 'tehnomarket', category: 'tv', original: 69990, discount: 54990, percent: 21, hot: true, badge: '-21%', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', rating: 4.8, reviews: 892 },
  { id: 4, title: 'Nike Air Force 1 White', store: 'Спорт Визион', store_slug: 'sport-vision', category: 'fashion', original: 6490, discount: 4990, percent: 23, hot: false, badge: 'SALE', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', rating: 4.9, reviews: 567 },
  { id: 5, title: 'Sony PlayStation 5 + 2 Игри', store: 'Нептун', store_slug: 'neptun', category: 'gaming', original: 34990, discount: 29990, percent: 14, hot: true, badge: 'BEST', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', rating: 4.9, reviews: 3421 },
  { id: 6, title: 'Samsung Galaxy Watch 6 Classic', store: 'Сетек', store_slug: 'setec', category: 'electronics', original: 19990, discount: 14990, percent: 25, hot: false, badge: '-25%', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', rating: 4.7, reviews: 756 },
  { id: 7, title: 'LG 65" OLED evo C4', store: 'Техномаркет', store_slug: 'tehnomarket', category: 'tv', original: 129990, discount: 99990, percent: 23, hot: true, badge: 'DEAL', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400', rating: 4.8, reviews: 432 },
  { id: 8, title: 'MacBook Air M3 15" 512GB', store: 'Анхоч', store_slug: 'anhoch', category: 'laptops', original: 89990, discount: 79990, percent: 11, hot: false, badge: 'NEW', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', rating: 4.9, reviews: 1289 },
  { id: 9, title: 'Dyson V15 Detect Vacuum', store: 'Техномаркет', store_slug: 'tehnomarket', category: 'appliances', original: 54990, discount: 42990, percent: 22, hot: false, badge: '-22%', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', rating: 4.6, reviews: 234 },
  { id: 10, title: 'AirPods Pro 2nd Gen', store: 'Нептун', store_slug: 'neptun', category: 'electronics', original: 16990, discount: 13990, percent: 18, hot: false, badge: 'SALE', image: 'https://images.unsplash.com/photo-1603351154351-5cf233e5c2a4?w=400', rating: 4.8, reviews: 1892 },
];

const CATEGORIES = [
  { name: 'Сите', slug: 'all', icon: '🔥' },
  { name: 'Телефони', slug: 'phones', icon: '📱' },
  { name: 'Лаптопи', slug: 'laptops', icon: '💻' },
  { name: 'ТВ', slug: 'tv', icon: '📺' },
  { name: 'Апарати', slug: 'appliances', icon: '🔌' },
  { name: 'Игри', slug: 'gaming', icon: '🎮' },
  { name: 'Мода', slug: 'fashion', icon: '👕' },
  { name: 'Супермаркет', slug: 'supermarket', icon: '🛒' },
];

const formatMKD = (price: number) => price.toLocaleString('mk-MK') + ' ден';

// AI Chat Component
function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Здраво! Јас сум MKBF AI.\n\nКако можам да ти помогнам да најдеш најдобри понуди?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setTimeout(() => {
      let response = '';
      if (userMsg.toLowerCase().includes('iphone') || userMsg.toLowerCase().includes('телефон')) {
        response = '📱 Најдов iPhone и Samsung понуди!\n\n• iPhone 15 Pro Max 256GB - 72,990 ден (Нептун)\n• Samsung S24 Ultra 256GB - 64,990 ден (Сетек)\n\nПогледни табот "🔥 Врели Понуди"!';
      } else if (userMsg.toLowerCase().includes('laptop') || userMsg.toLowerCase().includes('лаптоп')) {
        response = '💻 Одлични лаптоп понуди!\n\n• MacBook Air M3 15" - 79,990 ден (Анхоч)\n• Провери табот "💻 Лаптопи" за повеќе!';
      } else {
        response = `🔍 Бараш "${userMsg}"?\n\nПробај:\n• "Најди iPhone попусти"\n• "Што има на акција во Нептун?"\n• "Најдобри телевизори"\n• "Лаптопи под 50,000 ден"`;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 800);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-24 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all">
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-t-2xl flex justify-between items-center">
        <span className="text-white font-semibold">🤖 MKBF AI</span>
        <button onClick={() => setIsOpen(false)} className="text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`${m.role === 'user' ? 'bg-red-600' : 'bg-gray-800'} p-2 rounded-lg text-sm whitespace-pre-wrap`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-800">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Прашај го AI..." className="flex-1 bg-gray-800 text-white text-sm p-2 rounded-lg border border-gray-700" />
          <button onClick={sendMessage} className="bg-red-600 p-2 rounded-lg"><ChevronRight className="w-4 h-4 text-white" /></button>
        </div>
      </div>
    </div>
  );
}

// QR Scanner Modal
function QRScanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
        <span className="text-white font-semibold">📷 Скенирај QR Код</span>
        <button onClick={onClose}><X className="w-6 h-6 text-gray-400" /></button>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="bg-white p-4 rounded-2xl mb-4 mx-auto w-64">
            <QrCode className="w-full h-full text-gray-900" />
          </div>
          <p className="text-white font-mono mb-2">MKBF-X9K2M4P7Q1</p>
          <p className="text-gray-400 text-sm">Твојот членски QR код</p>
          <p className="text-red-400 text-xs mt-2">Прикажи во продавница за попуст</p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [savedDeals, setSavedDeals] = useState<number[]>([]);

  const filteredDeals = DEALS.filter(d => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogin = () => {
    setUser({
      full_name: 'Марко Марковски',
      email: 'marko@example.com',
      qr_code: 'MKBF-X9K2M4P7Q1',
      saved_deals: 12,
      used_deals: 5,
      total_savings: 8450
    });
    setShowLogin(false);
  };

  const toggleSave = (dealId: number) => {
    setSavedDeals(prev => prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="px-4 py-4 pb-24">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-xs text-red-200">Активни</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 text-center border border-gray-700">
                <div className="text-2xl font-bold text-white">10</div>
                <div className="text-xs text-gray-400">Продавници</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 text-center border border-gray-700">
                <div className="text-2xl font-bold text-green-400">2.5M</div>
                <div className="text-xs text-gray-400">Заштеда</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Пребарај понуди (пр. iPhone, TV, лаптоп)..." className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors" />
              </div>
              <button onClick={() => setShowQR(true)} className="bg-gradient-to-br from-red-600 to-red-700 p-4 rounded-2xl hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)} className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap text-sm font-medium transition-all ${selectedCategory === cat.slug ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'}`}>
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Hot Deals Section */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                🔥 Врели Понуди
              </h2>
              <span className="text-sm text-gray-400">{filteredDeals.length} понуди</span>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredDeals.map((deal) => (
                <div key={deal.id} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-red-500/50 transition-all">
                  <div className="relative h-44">
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">{deal.badge}</div>
                    <button onClick={() => toggleSave(deal.id)} className="absolute top-3 right-3 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                      <Heart className={`w-5 h-5 ${savedDeals.includes(deal.id) ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white/90 text-sm">🏪 {deal.store}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">{deal.title}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-white text-sm font-medium">{deal.rating}</span>
                      <span className="text-gray-500 text-sm">({deal.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-2xl font-bold text-red-400">{formatMKD(deal.discount)}</span>
                      <span className="text-gray-500 line-through text-sm">{formatMKD(deal.original)}</span>
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-sm font-bold">-{deal.percent}%</span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                      <ShoppingCart className="w-5 h-5" />
                      Земи Понуда
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'stores':
        return (
          <div className="px-4 py-4 pb-24">
            <h2 className="text-2xl font-bold text-white mb-2">🏪 Продавници</h2>
            <p className="text-gray-400 mb-6">10 продавници во Македонија</p>
            <div className="grid grid-cols-2 gap-4">
              {STORES.map((store) => (
                <div key={store.slug} className={`${store.color} rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform shadow-lg`}>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 text-2xl">{store.icon}</div>
                  <h3 className="text-white font-bold text-lg">{store.name}</h3>
                  <p className="text-white/80 text-sm">{store.deals} активни понуди</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="px-4 py-4 pb-24">
            <h2 className="text-2xl font-bold text-white mb-6">📂 Категории</h2>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.slice(1).map((cat) => (
                <div key={cat.slug} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center cursor-pointer hover:border-red-500/50 transition-all">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="text-white font-semibold">{cat.name}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="px-4 py-4 pb-24">
            <h2 className="text-2xl font-bold text-white mb-6">🗺️ Мапа на Продавници</h2>
            <div className="bg-gray-800 rounded-2xl h-96 flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-400">Интерактивна мапа</p>
                <p className="text-gray-500 text-sm">Прикажување на 10 продавници</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {STORES.slice(0, 5).map((s) => (
                <div key={s.slug} className="bg-gray-800 rounded-xl p-4 flex items-center gap-3 border border-gray-700">
                  <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center text-lg`}>{s.icon}</div>
                  <div>
                    <h4 className="text-white font-medium">{s.name}</h4>
                    <p className="text-gray-400 text-sm">Скопје, Македонија</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'saved':
        return (
          <div className="px-4 py-4 pb-24">
            <h2 className="text-2xl font-bold text-white mb-2">💾 Зачувани Понуди</h2>
            <p className="text-gray-400 mb-6">{savedDeals.length} зачувани понуди</p>
            {savedDeals.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Немаш зачувани понуди</p>
                <p className="text-gray-500 text-sm mt-2">Притисни ❤️ на понуда за да ја зачуваш</p>
              </div>
            ) : (
              <div className="space-y-4">
                {DEALS.filter(d => savedDeals.includes(d.id)).map((deal) => (
                  <div key={deal.id} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                    <div className="relative h-40">
                      <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">{deal.badge}</div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{deal.title}</h3>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xl font-bold text-red-400">{formatMKD(deal.discount)}</span>
                        <span className="text-gray-500 line-through text-sm">{formatMKD(deal.original)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="px-4 py-4 pb-24">
            {user ? (
              <>
                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 mb-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">MM</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{user.full_name}</h2>
                      <p className="text-red-200 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-white">{user.saved_deals}</div>
                      <div className="text-xs text-red-200">Зачувани</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-white">{user.used_deals}</div>
                      <div className="text-xs text-red-200">Искористени</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-white">{user.total_savings.toLocaleString()}</div>
                      <div className="text-xs text-red-200">Заштеда (ден)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700 text-center">
                  <h3 className="text-white font-semibold mb-4">📱 Твој QR Код</h3>
                  <div className="bg-white p-4 rounded-2xl w-fit mx-auto mb-3">
                    <QrCode className="w-40 h-40 text-gray-900" />
                  </div>
                  <p className="text-white font-mono text-lg tracking-wider">{user.qr_code}</p>
                  <p className="text-gray-400 text-sm mt-2">Прикажи во продавница за попуст</p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {['Нептун', 'Сетек', 'Тинекс', 'Веро', 'КАМ'].map(s => (
                      <span key={s} className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">{s}</span>
                    ))}
                  </div>
                </div>

                <button onClick={() => setUser(null)} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold transition-colors">
                  Одјави се
                </button>
              </>
            ) : (
              <div className="text-center py-12">
                <User className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">👤 Профил</h2>
                <p className="text-gray-400 mb-6">Најави се за да ги видиш твоите понуди и зачувани артикли</p>
                <button onClick={() => setShowLogin(true)} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all">
                  Најави се / Регистрирај се
                </button>
              </div>
            )}
          </div>
        );

      default:
        return <div className="px-4 py-12 text-center text-gray-400">Сеуште во изработка...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">MK Black Friday</h1>
              <p className="text-xs text-gray-400">🇲🇰 Северна Македонија</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={() => user ? setActiveTab('profile') : setShowLogin(true)} className="p-2 rounded-xl hover:bg-gray-800 transition-colors">
              {user ? (
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">MM</span>
                </div>
              ) : (
                <User className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{renderContent()}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 z-40 safe-area-pb">
        <div className="flex justify-around py-2">
          {[
            { id: 'home', icon: Home, label: 'Почетна' },
            { id: 'stores', icon: Store, label: 'Продавници' },
            { id: 'map', icon: MapPin, label: 'Мапа' },
            { id: 'saved', icon: Heart, label: 'Зачувани' },
            { id: 'profile', icon: User, label: 'Профил' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${activeTab === item.id ? 'text-red-500' : 'text-gray-400 hover:text-gray-300'}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* AI Chatbot */}
      <AIChatbot />

      {/* QR Scanner */}
      {showQR && <QRScanner onClose={() => setShowQR(false)} />}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">🔐 Најави се</h2>
              <button onClick={() => setShowLogin(false)}><X className="w-6 h-6 text-gray-400 hover:text-white" /></button>
            </div>
            <input type="email" placeholder="📧 Емаил адреса" className="w-full bg-gray-700 rounded-xl py-3 px-4 text-white mb-3 border border-gray-600 focus:border-red-500 focus:outline-none" />
            <input type="password" placeholder="🔒 Лозинка" className="w-full bg-gray-700 rounded-xl py-3 px-4 text-white mb-4 border border-gray-600 focus:border-red-500 focus:outline-none" />
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all">
              Најави се
            </button>
            <p className="text-gray-500 text-sm text-center mt-4">Немаш профил? <span className="text-red-400 cursor-pointer">Регистрирај се</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
