import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Search, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Flame, 
  CreditCard,
  QrCode,
  Wallet,
  Menu,
  X,
  ChevronLeft,
  ShieldCheck,
  Headphones,
  ShoppingBag,
  Bell,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'robux' | 'gamepass' | 'voucher'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modal Detail Top Up State
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [orderType, setOrderType] = useState<'username' | 'login'>('username');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');

  // Modal Konfirmasi Pembelian State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<any | null>(null);

  // Banner Carousel Data
  const banners = [
    {
      id: 1,
      title: "PROMO ROBUX SPESIAL SEPTEMBER",
      subtitle: "Rate Termurah Rp 155/R$ • Otomatis Masuk < 1 Menit!",
      tag: "FLASH SALE",
      bg: "from-[#0a1626] via-[#0d233a] to-[#08101a]",
      accent: "#85effe",
      image: "https://images.unsplash.com/photo-1612287233207-61b698501f6d?w=1200&q=80"
    },
    {
      id: 2,
      title: "GAMEPASS BLOX FRUITS & FRUITS",
      subtitle: "Stok Selalu Ready • Pengiriman Instan Langsung ke Akun",
      tag: "BEST SELLER",
      bg: "from-[#111927] via-[#102a3a] to-[#0a121d]",
      accent: "#85effe",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80"
    },
    {
      id: 3,
      title: "TOP UP 24 JAM NONSTOP LEGAL 100%",
      subtitle: "Didukung Pembayaran QRIS Realtime & Semua Bank",
      tag: "100% LEGAL",
      bg: "from-[#071520] via-[#0b2438] to-[#050e18]",
      accent: "#85effe",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80"
    }
  ];

  // Auto-play Slider (Ganti slide sendiri tiap 4 detik)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Game Products Catalog (Khas Takapedia Game Cards)
  const products = [
    {
      id: 'robux',
      name: 'Roblox (Robux Instant)',
      publisher: 'Roblox Corporation',
      category: 'robux',
      badge: 'TERPOPULER',
      rating: '4.9',
      sold: '15.4k+',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&q=80',
      items: [
        { id: 1, name: '50 Robux', price: 8250, robux: 50 },
        { id: 2, name: '100 Robux', price: 16500, robux: 100 },
        { id: 3, name: '200 Robux', price: 33000, robux: 200 },
        { id: 4, name: '400 Robux', price: 66000, robux: 400 },
        { id: 5, name: '800 Robux', price: 132000, robux: 800 },
        { id: 6, name: '1.000 Robux', price: 165000, robux: 1000 },
        { id: 7, name: '1.700 Robux', price: 280500, robux: 1700 },
        { id: 8, name: '2.000 Robux', price: 330000, robux: 2000 },
        { id: 9, name: '4.500 Robux', price: 742500, robux: 4500 },
        { id: 10, name: '10.000 Robux', price: 1650000, robux: 10000 },
      ]
    },
    {
      id: 'bloxfruits',
      name: 'Blox Fruits',
      publisher: 'Gamer Robot Inc',
      category: 'gamepass',
      badge: 'HOT',
      rating: '4.9',
      sold: '8.2k+',
      image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&q=80',
      items: [
        { id: 101, name: '2x Money Pass', price: 65000 },
        { id: 102, name: '2x Mastery Pass', price: 65000 },
        { id: 103, name: 'Fast Boats Pass', price: 45000 },
        { id: 104, name: 'Dark Blade (Yoru)', price: 175000 },
        { id: 105, name: 'Fruit Notifier', price: 350000 },
        { id: 106, name: 'Permanent Leopard', price: 420000 },
      ]
    },
    {
      id: 'fishit',
      name: 'Fish It Roblox',
      publisher: 'Fish Simulator Studio',
      category: 'gamepass',
      badge: 'UPDATE',
      rating: '4.8',
      sold: '4.1k+',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&q=80',
      items: [
        { id: 201, name: 'Mythic Rod Pass', price: 35000 },
        { id: 202, name: 'VIP Boat Pass', price: 50000 },
        { id: 203, name: '1.000.000 Coins', price: 25000 },
        { id: 204, name: 'Auto Reel Pass', price: 45000 },
      ]
    },
    {
      id: 'cdid',
      name: 'Car Driving Indonesia (CDID)',
      publisher: 'Pengemudi Indonesia',
      category: 'gamepass',
      badge: 'TERLARIS',
      rating: '4.9',
      sold: '6.7k+',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80',
      items: [
        { id: 301, name: 'Custom Plate Pass', price: 30000 },
        { id: 302, name: 'VIP Gamepass', price: 60000 },
        { id: 303, name: 'Uang 100 Juta CDID', price: 45000 },
        { id: 304, name: 'Supercar Garage Pass', price: 85000 },
      ]
    },
    {
      id: 'evade',
      name: 'Evade Roblox',
      publisher: 'Hexagon Development',
      category: 'gamepass',
      badge: 'EVENT',
      rating: '4.7',
      sold: '2.9k+',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80',
      items: [
        { id: 401, name: 'VIP Pass', price: 40000 },
        { id: 402, name: 'Custom Boombox', price: 35000 },
        { id: 403, name: '50.000 Tokens', price: 45000 },
      ]
    },
    {
      id: 'sawahoindo',
      name: 'Sawah Indo Simulator',
      publisher: 'Indo Developer',
      category: 'gamepass',
      badge: 'LOKAL',
      rating: '4.8',
      sold: '3.4k+',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
      items: [
        { id: 501, name: 'Traktor Turbo Pass', price: 20000 },
        { id: 502, name: 'Lahan Sultan 10 Hektar', price: 50000 },
        { id: 503, name: 'Pupuk Ajaib Instan', price: 15000 },
      ]
    }
  ];

  const paymentOptions = [
    { id: 'qris', name: 'QRIS Realtime (BCA, Mandiri, DANA, GoPay, OVO)', fee: 0, icon: QrCode, badge: 'Instan Otomatis' },
    { id: 'dana', name: 'DANA / GoPay / ShopeePay Langsung', fee: 500, icon: Wallet, badge: 'Favorit' },
    { id: 'va', name: 'Virtual Account Bank Transfer (BCA, BNI, BRI)', fee: 1000, icon: CreditCard, badge: 'Dicek Otomatis' },
  ];

  // Buka Pop Up Detail
  const handleOpenProduct = (product: any) => {
    setSelectedProduct(product);
    setSelectedItem(product.items[0]);
    setUsername('');
    setWhatsapp('');
    setPaymentMethod('qris');
  };

  // Submit Order -> Munculkan Pop Up Konfirmasi
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      alert('Silakan masukkan Username / Data Akun kamu!');
      return;
    }
    if (!whatsapp) {
      alert('Silakan masukkan Nomor WhatsApp yang aktif!');
      return;
    }
    const invCode = '444-' + Math.floor(100000 + Math.random() * 900000);
    const selectedPay = paymentOptions.find(p => p.id === paymentMethod);
    const total = (selectedItem?.price || 0) + (selectedPay?.fee || 0);

    setCreatedInvoice({
      code: invCode,
      product: selectedProduct.name,
      variant: selectedItem.name,
      username: username,
      whatsapp: whatsapp,
      method: selectedPay?.name,
      fee: selectedPay?.fee,
      total: total,
      time: new Date().toLocaleTimeString('id-ID')
    });
    setShowConfirmModal(true);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#85effe] selection:text-black">
      
      {/* 1. Header Navigation Bar (Takapedia Style) */}
      <header className="sticky top-0 z-40 bg-[#070b13]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Toko */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedProduct(null)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#85effe] to-[#0ea5e9] p-[1.5px] shadow-[0_0_20px_rgba(133,239,254,0.35)]">
              <div className="w-full h-full bg-[#070b13] rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-black text-[#85effe] tracking-tighter">444</span>
              </div>
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center">
                444<span className="text-[#85effe] ml-0.5">STORE</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider block -mt-1">TAKAPEDIA OFFICIAL STYLE</span>
            </div>
          </div>

          {/* Search Bar Tengah (Takapedia Style) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari game favorit (Roblox, Blox Fruits, CDID...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c1322] border border-slate-800 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#85effe] transition shadow-inner"
            />
          </div>

          {/* Navigasi Kanan */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => handleOpenProduct(products[0])}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-[#85effe] hover:bg-[#a5f4ff] text-black shadow-[0_0_15px_rgba(133,239,254,0.35)] transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              Top Up Robux
            </button>
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Headphones className="w-3.5 h-3.5 text-[#85effe]" />
              <span className="hidden sm:inline">CS 24 Jam</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
        
        {/* 2. AUTO-PLAY CAROUSEL SLIDER (Gambar Slide Sendiri Takapedia Style) */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((slide) => (
              <div 
                key={slide.id}
                className="w-full flex-shrink-0 relative aspect-[21/9] sm:aspect-[24/8] min-h-[220px] sm:min-h-[280px] flex items-center overflow-hidden"
              >
                {/* Background Image with Dark Vignette */}
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#070b13] via-[#070b13]/85 to-transparent" />

                {/* Banner Content */}
                <div className="relative z-10 px-6 sm:px-12 max-w-2xl space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider bg-[#85effe] text-black shadow-[0_0_12px_rgba(133,239,254,0.4)]">
                    {slide.tag}
                  </span>
                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {slide.subtitle}
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={() => handleOpenProduct(products[0])}
                      className="px-5 py-2.5 rounded-xl bg-[#85effe] hover:bg-[#a5f4ff] text-black text-xs font-extrabold shadow-[0_0_20px_rgba(133,239,254,0.4)] transition flex items-center gap-1.5"
                    >
                      Beli Sekarang <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Controls (Prev / Next Buttons) */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-slate-700/80 transition backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-slate-700/80 transition backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-[#85effe] shadow-[0_0_8px_#85effe]' : 'w-2 bg-slate-600'
                }`}
              />
            ))}
          </div>
        </section>

        {/* 3. TABS KATEGORI (Takapedia Style) */}
        <section className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'all' 
                  ? 'bg-[#85effe] text-black shadow-[0_0_15px_rgba(133,239,254,0.35)]' 
                  : 'bg-[#0e1422] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Semua Game
            </button>
            <button
              onClick={() => setActiveTab('robux')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'robux' 
                  ? 'bg-[#85effe] text-black shadow-[0_0_15px_rgba(133,239,254,0.35)]' 
                  : 'bg-[#0e1422] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Robux Instan
            </button>
            <button
              onClick={() => setActiveTab('gamepass')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'gamepass' 
                  ? 'bg-[#85effe] text-black shadow-[0_0_15px_rgba(133,239,254,0.35)]' 
                  : 'bg-[#0e1422] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Item & Gamepass
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#85effe]" />
            Garansi 100% Legal & Terpercaya
          </div>
        </section>

        {/* 4. GRID PRODUK GAME (Mirip Takapedia: Kartu Berfoto Jelas & Label Rapi) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#85effe] animate-pulse" />
              Pilih Layanan Top Up
            </h3>
            <span className="text-xs text-slate-400">{products.length} Game Tersedia</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {products
              .filter(p => activeTab === 'all' || p.category === activeTab)
              .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="group relative rounded-2xl bg-[#0c1322] border border-slate-800/80 hover:border-[#85effe] transition-all duration-300 p-2.5 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_8px_25px_rgba(133,239,254,0.15)]"
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden mb-2.5 bg-slate-900">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Badge Pojok Kiri */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#85effe] text-black font-black text-[9px] shadow">
                      {product.badge}
                    </span>

                    {/* Rating Bawah */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-white font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 text-[9px]">({product.sold})</span>
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1 px-1">
                    <h4 className="font-bold text-xs text-white group-hover:text-[#85effe] transition line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{product.publisher}</p>
                    
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-[#85effe] font-bold">Mulai Rp 8.250</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#85effe] group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

      </main>

      {/* 5. MODAL POP-UP DETAIL PEMBELIAN (Takapedia Style Stepper Form) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090e1a] border border-slate-800 shadow-2xl p-6 lg:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-[#85effe]/40 shadow-[0_0_10px_rgba(133,239,254,0.25)]"
                />
                <div>
                  <h3 className="text-lg font-black text-white">{selectedProduct.name}</h3>
                  <p className="text-xs text-slate-400">Pilih nominal & selesaikan pembayaran dengan proses instan.</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Form */}
            <form onSubmit={handleOrderSubmit} className="space-y-6">
              
              {/* STEP 1: Masukkan Data Akun */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1424] border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-lg bg-[#85effe] text-black flex items-center justify-center text-xs font-black">1</span>
                  Masukkan Data Akun
                </div>

                {selectedProduct.id === 'robux' && (
                  <div className="flex gap-2 pb-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('username')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        orderType === 'username' 
                          ? 'bg-[#85effe] text-black shadow-[0_0_10px_rgba(133,239,254,0.3)]' 
                          : 'bg-[#080c14] text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Via Username (Tanpa Password)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('login')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        orderType === 'login' 
                          ? 'bg-[#85effe] text-black shadow-[0_0_10px_rgba(133,239,254,0.3)]' 
                          : 'bg-[#080c14] text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Via Login (Super Murah)
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username Roblox <span className="text-[#85effe]">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 444rapz"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#070b13] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#85effe]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nomor WhatsApp <span className="text-[#85effe]">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 081234567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-[#070b13] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#85effe]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: Pilih Nominal Produk */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1424] border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-lg bg-[#85effe] text-black flex items-center justify-center text-xs font-black">2</span>
                  Pilih Layanan / Nominal
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {selectedProduct.items.map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className={`p-3 rounded-xl border text-left transition relative ${
                        selectedItem?.id === item.id 
                          ? 'border-[#85effe] bg-[#85effe]/15 shadow-[0_0_15px_rgba(133,239,254,0.3)]' 
                          : 'border-slate-800 bg-[#070b13] hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white line-clamp-1">{item.name}</div>
                      <div className="text-xs font-extrabold text-[#85effe] mt-1.5">
                        Rp {item.price.toLocaleString('id-ID')}
                      </div>
                      {selectedItem?.id === item.id && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#85effe] shadow-[0_0_6px_#85effe]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 3: Pilih Metode Pembayaran */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1424] border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-lg bg-[#85effe] text-black flex items-center justify-center text-xs font-black">3</span>
                  Pilih Metode Pembayaran
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {paymentOptions.map((opt) => {
                    const IconComp = opt.icon;
                    return (
                      <div 
                        key={opt.id}
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                          paymentMethod === opt.id 
                            ? 'border-[#85effe] bg-[#85effe]/15 shadow-[0_0_15px_rgba(133,239,254,0.3)]' 
                            : 'border-slate-800 bg-[#070b13] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className={`w-5 h-5 ${paymentMethod === opt.id ? 'text-[#85effe]' : 'text-slate-400'}`} />
                          <div>
                            <div className="text-xs font-bold text-white">{opt.name.split('(')[0]}</div>
                            <div className="text-[10px] text-slate-400">Biaya: Rp {opt.fee.toLocaleString('id-ID')}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Total Pembayaran:</span>
                  <span className="text-2xl font-black text-[#85effe]">
                    Rp {((selectedItem?.price || 0) + (paymentOptions.find(p => p.id === paymentMethod)?.fee || 0)).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[#85effe] hover:bg-[#a5f4ff] text-black text-xs font-extrabold shadow-[0_0_20px_rgba(133,239,254,0.4)] transition flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-black" />
                    Lanjutkan Pembayaran
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. POP-UP MODAL KONFIRMASI INVOICE (Success / Payment Confirmation) */}
      {showConfirmModal && createdInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95">
          <div className="w-full max-w-md rounded-3xl bg-[#090e1a] border border-[#85effe]/50 shadow-[0_0_40px_rgba(133,239,254,0.25)] p-6 space-y-5 text-center">
            
            <div className="w-16 h-16 rounded-full bg-[#85effe]/20 border border-[#85effe] text-[#85effe] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(133,239,254,0.4)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                INVOICE BERHASIL DIBUAT
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">Menunggu Pembayaran</h3>
              <p className="text-xs text-slate-400 mt-1">Invoice ID: <span className="text-[#85effe] font-mono font-bold">{createdInvoice.code}</span></p>
            </div>

            <div className="p-4 rounded-2xl bg-[#070b13] border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Produk:</span>
                <span className="font-bold text-white">{createdInvoice.product}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Varian:</span>
                <span className="font-bold text-[#85effe]">{createdInvoice.variant}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Target Akun:</span>
                <span className="font-bold text-white">{createdInvoice.username}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Metode Bayar:</span>
                <span className="font-bold text-white">{createdInvoice.method}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="font-bold text-slate-300">Total Tagihan:</span>
                <span className="text-lg font-black text-[#85effe]">
                  Rp {createdInvoice.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Tutup
              </button>
              <a 
                href={`https://wa.me/6281234567890?text=Halo%20Admin%20444Store,%20saya%20mau%20bayar%20pesanan%20dengan%20Invoice%20${createdInvoice.code}%20total%20Rp%20${createdInvoice.total}`}
                target="_blank" 
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-[#85effe] hover:bg-[#a5f4ff] text-black text-xs font-extrabold shadow-[0_0_15px_rgba(133,239,254,0.35)] transition flex items-center justify-center gap-1.5"
              >
                Konfirmasi WA
              </a>
            </div>

          </div>
        </div>
      )}

      {/* 7. Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05070c] mt-20 py-10 px-4 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white">444<span className="text-[#85effe]">STORE</span></span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Top Up Game Termurah & Tercepat</span>
          </div>
          <p className="text-slate-500 text-[11px]">© 2026 444Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
