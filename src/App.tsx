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
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Crown
} from 'lucide-react';

export default function App() {
  // Navigation View: 'home' (Landing Page) | 'order' (Halaman Order Via Username/Login) | 'payment' (Halaman Scan QRIS Invoice)
  const [currentView, setCurrentView] = useState<'home' | 'order' | 'payment'>('home');
  const [orderType, setOrderType] = useState<'username' | 'login'>('username');
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Order Form State
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [robuxAmount, setRobuxAmount] = useState<number>(50);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'dana' | 'va'>('qris');

  // Promo Pop-up on Landing Page (Khas Kingblox di Figma)
  const [showPromoPopup, setShowPromoPopup] = useState(true);

  // Active Invoice Data
  const [activeInvoice, setActiveInvoice] = useState({
    code: '444-98214',
    item: '50 Robux',
    target: '444rapz',
    amount: 50,
    total: 8500,
    method: 'QRIS Realtime',
    timeLeft: '01:29:54'
  });

  const [copiedInvoice, setCopiedInvoice] = useState(false);

  // Kurs Robux (Rate Kingblox / 444store)
  const RATE = orderType === 'username' ? 170 : 155;
  const calculatedPrice = robuxAmount * RATE;

  // Auto Slider Timer
  const banners = [
    {
      id: 1,
      title: "PASTI MASUK & INSTAN",
      subtitle: "Top Up Robux Via Username Tanpa Password • Garansi 100% Anti Banned",
      tag: "PROMO SPESIAL",
      color: "#85effe",
      image: "https://images.unsplash.com/photo-1612287233207-61b698501f6d?w=1200&q=80"
    },
    {
      id: 2,
      title: "GAMEPASS & ITEM BLOX FRUITS",
      subtitle: "Dark Blade, Fast Boats & Fruit Murah • Pengiriman Otomatis 24 Jam",
      tag: "BEST SELLER",
      color: "#85effe",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80"
    },
    {
      id: 3,
      title: "KING AFFILIATE 444STORE",
      subtitle: "Tinggal Share Link Dapat Uang • Raih Komisi Jutaan Setiap Bulan!",
      tag: "AFFILIATE",
      color: "#85effe",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80"
    }
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(t);
  }, [banners.length]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Masukkan Username Roblox kamu!');
      return;
    }
    if (!whatsapp.trim()) {
      alert('Masukkan nomor WhatsApp yang aktif!');
      return;
    }
    const inv = 'INV-444-' + Math.floor(100000 + Math.random() * 900000);
    setActiveInvoice({
      code: inv,
      item: `${robuxAmount} Robux (${orderType === 'username' ? 'Via Username' : 'Via Login'})`,
      target: username,
      amount: robuxAmount,
      total: calculatedPrice,
      method: paymentMethod.toUpperCase(),
      timeLeft: '01:30:00'
    });
    setCurrentView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#85effe] selection:text-black antialiased">
      
      {/* 1. NAVBAR (Sesuai Struktur Figma) */}
      <header className="sticky top-0 z-50 bg-[#080c14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Kiri */}
          <div 
            onClick={() => { setCurrentView('home'); }}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#85effe] to-[#0284c7] p-0.5 shadow-[0_0_20px_rgba(133,239,254,0.35)]">
              <div className="w-full h-full bg-[#080c14] rounded-[14px] flex items-center justify-center">
                <span className="text-xl font-black text-[#85effe]">444</span>
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                444<span className="text-[#85effe]">STORE</span>
              </span>
              <span className="text-[9px] text-[#85effe]/80 tracking-widest font-bold block -mt-1">
                TOP UP ROBUX #1 INDONESIA
              </span>
            </div>
          </div>

          {/* Navigasi Pill Tengah (Sesuai Figma Kingblox) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0e1422] p-1 rounded-full border border-slate-800/80 shadow-inner">
            <button 
              onClick={() => setCurrentView('home')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                currentView === 'home' 
                  ? 'bg-[#85effe] text-black shadow-[0_0_12px_rgba(133,239,254,0.4)]' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => { setOrderType('login'); setCurrentView('order'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                currentView === 'order' && orderType === 'login'
                  ? 'bg-[#85effe] text-black shadow-[0_0_12px_rgba(133,239,254,0.4)]' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Via Login
            </button>
            <button 
              onClick={() => { setOrderType('username'); setCurrentView('order'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                currentView === 'order' && orderType === 'username'
                  ? 'bg-[#85effe] text-black shadow-[0_0_12px_rgba(133,239,254,0.4)]' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Via Username
            </button>
            <button 
              onClick={() => setCurrentView('home')}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white"
            >
              Item Gamepass
            </button>
            <button 
              onClick={() => setCurrentView('payment')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                currentView === 'payment'
                  ? 'bg-[#85effe] text-black shadow-[0_0_12px_rgba(133,239,254,0.4)]' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Lacak Pesanan
            </button>
          </nav>

          {/* Action Kanan */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setOrderType('username'); setCurrentView('order'); }}
              className="text-xs font-extrabold px-4 py-2 rounded-full bg-[#85effe] hover:bg-[#a5f4ff] text-black shadow-[0_0_15px_rgba(133,239,254,0.35)] transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              Order Sekarang
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* VIEW 1: LANDING PAGE UTAMA (Persis Figma 1:2024) */}
      {/* ========================================================= */}
      {currentView === 'home' && (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-12">
          
          {/* King Affiliate Bar */}
          <div className="rounded-2xl bg-gradient-to-r from-[#0c1626] via-[#091f33] to-[#0c1626] p-4 border border-[#85effe]/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-9 h-9 rounded-xl bg-[#85effe]/20 border border-[#85effe] flex items-center justify-center text-[#85effe] shadow-[0_0_10px_rgba(133,239,254,0.3)]">
                <Crown className="w-5 h-5 text-[#85effe]" />
              </div>
              <div>
                <span className="text-xs font-black text-[#85effe] tracking-wider uppercase">KING AFFILIATE 444STORE</span>
                <p className="text-sm font-bold text-white">Ayo Jadi Affiliator 444Store dan Raih Cuan Jutaan Sambil Rebahan!</p>
              </div>
            </div>
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noreferrer"
              className="px-5 py-2 rounded-xl bg-[#85effe] hover:bg-[#a5f4ff] text-black text-xs font-extrabold shadow-[0_0_15px_rgba(133,239,254,0.4)] transition whitespace-nowrap"
            >
              Tinggal Share Link Dapat Uang! →
            </a>
          </div>

          {/* Hero Slider Carousel (Auto Slide Sendiri) */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((slide) => (
                <div 
                  key={slide.id}
                  className="w-full flex-shrink-0 relative aspect-[21/9] sm:aspect-[24/9] min-h-[260px] sm:min-h-[320px] flex items-center overflow-hidden"
                >
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070b13] via-[#070b13]/90 to-transparent" />

                  <div className="relative z-10 px-8 sm:px-16 max-w-2xl space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider bg-[#85effe] text-black shadow-[0_0_12px_rgba(133,239,254,0.5)]">
                      {slide.tag}
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {slide.subtitle}
                    </p>
                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => { setOrderType('username'); setCurrentView('order'); }}
                        className="px-6 py-2.5 rounded-xl bg-[#85effe] hover:bg-[#a5f4ff] text-black text-xs font-black shadow-[0_0_20px_rgba(133,239,254,0.4)] transition flex items-center gap-1.5"
                      >
                        Beli Sekarang <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {banners.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlide === i ? 'w-8 bg-[#85effe] shadow-[0_0_10px_#85effe]' : 'w-2 bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </section>

          {/* Kategori Best Selling (Sesuai Figma 1:2024) */}
          <section className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-[#85effe] tracking-widest uppercase">KATEGORI BEST SELLING</span>
              <h2 className="text-2xl font-black text-white">PILIH LAYANAN TERBAIK KAMI</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              
              {/* Card 1: Robux Via Login */}
              <div 
                onClick={() => { setOrderType('login'); setCurrentView('order'); }}
                className="group relative rounded-3xl bg-[#0c1424] border border-slate-800 hover:border-[#85effe] p-6 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(133,239,254,0.2)]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#131f36] border border-[#85effe]/40 flex items-center justify-center text-2xl font-black text-[#85effe] shadow-[0_0_15px_rgba(133,239,254,0.25)]">
                    R$
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    HARGA TERHEMAT
                  </span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-[#85effe] transition">Robux Via Login</h3>
                <p className="text-xs text-slate-400 mt-1">Harga super murah, cocok untuk pembelian jumlah besar dengan proses cepat.</p>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-[#85effe] font-bold">Mulai Rp 7.500</span>
                  <span className="font-extrabold text-white group-hover:translate-x-1 transition flex items-center gap-1">Order <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>

              {/* Card 2: Robux Via Username */}
              <div 
                onClick={() => { setOrderType('username'); setCurrentView('order'); }}
                className="group relative rounded-3xl bg-[#0c1424] border border-[#85effe]/60 p-6 transition-all duration-300 cursor-pointer hover:-translate-y-2 shadow-[0_0_25px_rgba(133,239,254,0.15)]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#85effe]/20 border border-[#85effe] flex items-center justify-center text-2xl font-black text-[#85effe] shadow-[0_0_15px_rgba(133,239,254,0.35)]">
                    ⚡
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#85effe] text-black shadow-[0_0_10px_rgba(133,239,254,0.4)]">
                    PROSES INSTAN (REKOMENDASI)
                  </span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-[#85effe] transition">Robux Via Username</h3>
                <p className="text-xs text-slate-400 mt-1">Cukup masukkan username Roblox saja tanpa password. 100% aman dan anti hack.</p>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-[#85effe] font-bold">Mulai Rp 8.500</span>
                  <span className="font-extrabold text-white group-hover:translate-x-1 transition flex items-center gap-1">Order <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>

              {/* Card 3: Gift in Game */}
              <div 
                onClick={() => { setCurrentView('order'); }}
                className="group relative rounded-3xl bg-[#0c1424] border border-slate-800 hover:border-[#85effe] p-6 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(133,239,254,0.2)]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#131f36] border border-[#85effe]/40 flex items-center justify-center text-2xl font-black text-[#85effe] shadow-[0_0_15px_rgba(133,239,254,0.25)]">
                    🎮
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    LENGKAP SEMUA GAME
                  </span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-[#85effe] transition">Item & Gamepass</h3>
                <p className="text-xs text-slate-400 mt-1">Blox Fruits, Fish It, Car Driving ID, Evade, dan game Roblox favorit lainnya.</p>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-[#85effe] font-bold">Mulai Rp 15.000</span>
                  <span className="font-extrabold text-white group-hover:translate-x-1 transition flex items-center gap-1">Order <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>

            </div>
          </section>

          {/* Statistik Penjualan (Sesuai Figma 1:2024) */}
          <section className="rounded-3xl bg-gradient-to-r from-[#0c1626] via-[#091f33] to-[#0c1626] border border-[#85effe]/30 p-8 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              <div className="p-2 space-y-1">
                <div className="text-3xl font-black text-[#85effe]">16.358.670+</div>
                <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">TOTAL ROBUX TERJUAL</div>
              </div>
              <div className="p-2 space-y-1">
                <div className="text-3xl font-black text-[#85effe]">36.962+</div>
                <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">ORDERAN SELESAI SUKSES</div>
              </div>
              <div className="p-2 space-y-1">
                <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
                  <Star className="w-7 h-7 fill-amber-400" /> 4.9 / 5.0
                </div>
                <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">RATING KEPUASAN PELANGGAN</div>
              </div>
            </div>
          </section>

          {/* FAQ Accordion Section (Sesuai Figma 1:2024) */}
          <section className="space-y-4 max-w-3xl mx-auto">
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-[#85effe] tracking-widest uppercase">FREQUENTLY ASKED QUESTION (FAQ)</span>
              <h3 className="text-xl font-black text-white">Pertanyaan yang Sering Ditanyakan</h3>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Berapa Lama Proses Pengiriman Robux?</h4>
                <p className="text-xs text-slate-400">Untuk pesanan via Username, pengiriman otomatis masuk ke akun dalam 1 hingga 5 menit setelah pembayaran terverifikasi oleh sistem QRIS.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Apakah Transaksi di 444Store Aman?</h4>
                <p className="text-xs text-slate-400">100% Aman dan Legal. Kami menggunakan sistem transfer resmi Roblox tanpa bypass ilegal, sehingga akun kamu terjamin bebas banwave.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Apakah Perlu Password Akun?</h4>
                <p className="text-xs text-slate-400">Untuk opsi "Via Username", kamu sama sekali TIDAK PERLU memberikan password akun. Cukup masukkan username kamu saja.</p>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: HALAMAN ORDER TOP UP (Persis Figma 1:2828) */}
      {/* ========================================================= */}
      {currentView === 'order' && (
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
          
          {/* Hero Banner Halaman Order */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0c1626] to-[#0f1f33] p-6 lg:p-8 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider bg-[#85effe] text-black">
                    {orderType === 'username' ? 'VIA USERNAME' : 'VIA LOGIN'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30">
                    INSTAN
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Robux {orderType === 'username' ? 'Via Username' : 'Via Login'}
                </h1>
                <p className="text-xs text-slate-400">Top up aman hanya dengan Username tanpa ribet!</p>
              </div>

              {/* Mode Switcher */}
              <div className="flex p-1 bg-[#070b13] rounded-2xl border border-slate-800">
                <button
                  onClick={() => setOrderType('username')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                    orderType === 'username' 
                      ? 'bg-[#85effe] text-black shadow-[0_0_12px_rgba(133,239,254,0.35)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Via Username
                </button>
                <button
                  onClick={() => setOrderType('login')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                    orderType === 'login' 
                      ? 'bg-[#85effe] text-black shadow-[0_0_12px_rgba(133,239,254,0.35)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Via Login
                </button>
              </div>
            </div>
          </div>

          {/* Kotak Peringatan Sebelum Membeli (Sesuai Figma 1:2828) */}
          <div className="rounded-2xl bg-[#0c1424] border border-amber-500/30 p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> PERHATIAN SEBELUM MEMBELI
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Pastikan <strong className="text-white">Username Roblox</strong> yang dimasukkan sudah benar (bukan Display Name).</li>
              <li><span className="text-[#85effe] font-bold">WAJIB MENGAKTIFKAN 2-STEP VERIFICATION</span> pada akun Roblox kamu.</li>
              <li>Fitur Direct Transfer: Pengiriman diproses menggunakan sistem transfer resmi antar-player dari Roblox.</li>
            </ul>
          </div>

          {/* Layout Dua Kolom (Kiri: Form 1 & 2, Kanan: Ringkasan Pesanan Sticky) */}
          <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Kolom Kiri: Form Input (8 Kolom) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* KARTU 1: Masukkan Data Akun */}
              <div className="rounded-3xl bg-[#0c1424] p-6 border border-slate-800 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-[#85effe] text-black font-black flex items-center justify-center text-xs">
                    1
                  </div>
                  <h2 className="text-base font-bold text-white">Masukkan Data Akun</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username Roblox <span className="text-[#85effe]">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ketik username Roblox Anda di sini"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#070b13] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#85effe]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nomor WhatsApp <span className="text-[#85effe]">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="0812-xxxx-xxxx"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-[#070b13] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#85effe]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email (Opsional)
                      </label>
                      <input 
                        type="email" 
                        placeholder="email@contoh.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#070b13] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#85effe]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* KARTU 2: Pilih Nominal Robux (Interactive Selector + Slider Sesuai Figma) */}
              <div className="rounded-3xl bg-[#0c1424] p-6 border border-slate-800 shadow-lg space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#85effe] text-black font-black flex items-center justify-center text-xs">
                      2
                    </div>
                    <h2 className="text-base font-bold text-white">Pilih Nominal Robux</h2>
                  </div>
                  <span className="text-xs text-[#85effe] font-extrabold bg-[#85effe]/10 px-3 py-1 rounded-full border border-[#85effe]/30">
                    Rate: Rp {RATE}/R$
                  </span>
                </div>

                {/* Box Nominal Pilihan Terpilih (Khas Figma 1:2828) */}
                <div className="p-4 rounded-2xl bg-[#070b13] border border-[#85effe]/40 flex items-center justify-between shadow-[0_0_20px_rgba(133,239,254,0.15)]">
                  <div>
                    <span className="text-[10px] font-black text-[#85effe] tracking-wider uppercase block">NOMINAL TERPILIH</span>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                      <span>{robuxAmount}</span>
                      <span className="text-sm font-bold text-[#85effe]">Robux</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Harga</span>
                    <div className="text-xl font-black text-[#85effe]">
                      Rp {calculatedPrice.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Slider / Range Selector */}
                <div className="space-y-2 pt-2">
                  <input 
                    type="range" 
                    min={50} 
                    max={5000} 
                    step={50}
                    value={robuxAmount}
                    onChange={(e) => setRobuxAmount(Number(e.target.value))}
                    className="w-full accent-[#85effe] h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>50 R$</span>
                    <span>1.000 R$</span>
                    <span>2.500 R$</span>
                    <span>5.000 R$</span>
                  </div>
                </div>

                {/* Quick Selection Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {[50, 100, 200, 400, 800, 1000, 2000, 5000].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRobuxAmount(n)}
                      className={`p-3 rounded-xl border text-center transition ${
                        robuxAmount === n 
                          ? 'border-[#85effe] bg-[#85effe]/15 shadow-[0_0_12px_rgba(133,239,254,0.3)]' 
                          : 'border-slate-800 bg-[#070b13] hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-black text-white">{n} Robux</div>
                      <div className="text-[10px] font-bold text-[#85effe]">Rp {(n * RATE).toLocaleString('id-ID')}</div>
                    </button>
                  ))}
                </div>

              </div>

              {/* KARTU 3: Pilih Metode Pembayaran */}
              <div className="rounded-3xl bg-[#0c1424] p-6 border border-slate-800 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-[#85effe] text-black font-black flex items-center justify-center text-xs">
                    3
                  </div>
                  <h2 className="text-base font-bold text-white">Metode Pembayaran</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      paymentMethod === 'qris' 
                        ? 'border-[#85effe] bg-[#85effe]/15 shadow-[0_0_15px_rgba(133,239,254,0.3)]' 
                        : 'border-slate-800 bg-[#070b13] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-[#85effe]" />
                      <div>
                        <div className="text-xs font-bold text-white">QRIS Realtime</div>
                        <div className="text-[10px] text-emerald-400 font-medium">Bebas Biaya Admin</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('dana')}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      paymentMethod === 'dana' 
                        ? 'border-[#85effe] bg-[#85effe]/15 shadow-[0_0_15px_rgba(133,239,254,0.3)]' 
                        : 'border-slate-800 bg-[#070b13] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-[#85effe]" />
                      <div>
                        <div className="text-xs font-bold text-white">E-Wallet (DANA)</div>
                        <div className="text-[10px] text-slate-400">+ Rp 500</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('va')}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      paymentMethod === 'va' 
                        ? 'border-[#85effe] bg-[#85effe]/15 shadow-[0_0_15px_rgba(133,239,254,0.3)]' 
                        : 'border-slate-800 bg-[#070b13] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[#85effe]" />
                      <div>
                        <div className="text-xs font-bold text-white">Bank Transfer VA</div>
                        <div className="text-[10px] text-slate-400">+ Rp 1.000</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Kolom Kanan: Ringkasan Pesanan Sticky (4 Kolom Sesuai Figma 1:2828) */}
            <div className="lg:col-span-4">
              <div className="sticky top-20 rounded-3xl bg-gradient-to-b from-[#0c1424] to-[#080d18] border border-[#85effe]/40 p-6 shadow-2xl space-y-5">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-extrabold text-base text-white">Ringkasan Pesanan</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#85effe]/20 text-[#85effe]">
                    DRAFT
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Username:</span>
                    <span className="font-bold text-[#85effe]">{username || '-'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Jumlah:</span>
                    <span className="font-bold text-white">{robuxAmount} Robux</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Metode:</span>
                    <span className="font-bold text-white uppercase">{paymentMethod}</span>
                  </div>
                </div>

                {/* Info Penting Box (Khas Figma) */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-400" /> INFO PENTING:
                  </div>
                  <p className="text-slate-300">Estimasi proses 1-5 menit setelah pembayaran terverifikasi.</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-300">Total Bayar:</span>
                  <span className="text-2xl font-black text-[#85effe]">
                    Rp {calculatedPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#85effe] hover:bg-[#a5f4ff] text-black font-black text-sm tracking-wide shadow-[0_0_20px_rgba(133,239,254,0.4)] transition flex items-center justify-center gap-2"
                >
                  <span>Lanjutkan Pembayaran</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#85effe]" />
                  <span>Transaksi aman & terenkripsi</span>
                </div>
              </div>
            </div>

          </form>
        </main>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: HALAMAN INVOICE / SCAN QRIS (Persis Figma 1:4055) */}
      {/* ========================================================= */}
      {currentView === 'payment' && (
        <main className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#85effe]/20 text-[#85effe] border border-[#85effe]/30 uppercase tracking-widest">
              444STORE PEMBAYARAN
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Scan QRIS di bawah ini.</h1>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Selesaikan pembayaran sebelum batas waktu berakhir. Halaman akan otomatis diperbarui setelah pembayaran berhasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Panel Kiri: QR Code & Total Bayar (7 Kolom) */}
            <div className="md:col-span-7 rounded-3xl bg-[#0c1424] border border-[#85effe]/40 p-6 sm:p-8 space-y-6 shadow-2xl text-center">
              
              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl w-52 h-52 mx-auto flex items-center justify-center shadow-lg">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126570014ID.LINKAJA.WWW01189360091100228392110215444STORE001540585005802ID5908444STORE6007JAKARTA61051234062070703A016304" 
                  alt="QRIS Code" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Total bayar:</span>
                <span className="text-3xl font-black text-[#85effe]">
                  Rp {activeInvoice.total.toLocaleString('id-ID')}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">QRIS - OTOMATIS REALTIME</p>
              </div>

              {/* Countdown Timer */}
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs">
                <span className="text-red-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-400" /> Sisa waktu: {activeInvoice.timeLeft}
                </span>
                <button 
                  onClick={() => alert('Waktu pembayaran diperpanjang 30 menit!')}
                  className="text-[11px] font-bold text-[#85effe] hover:underline"
                >
                  Perpanjang
                </button>
              </div>

              {/* Cek Status Manual Button */}
              <button 
                onClick={() => alert('Sedang memeriksa mutasi bank... Pembayaran belum terdeteksi. Silakan selesaikan scan QRIS terlebih dahulu.')}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition"
              >
                Cek Status Pembayaran Manual
              </button>

              {/* Box Warning Info Penting */}
              <div className="p-3.5 rounded-xl bg-[#070b13] border border-red-500/40 text-[11px] text-slate-300 text-left space-y-1">
                <div className="text-red-400 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" /> PENTING:
                </div>
                <p>Jika sudah transfer namun status belum berubah dalam 5 menit, segera hubungi Admin via WhatsApp dengan menyertakan Invoice ID: <strong className="text-white">{activeInvoice.code}</strong>.</p>
              </div>

              <button 
                onClick={() => setCurrentView('home')}
                className="text-xs text-slate-500 hover:text-slate-300 transition"
              >
                Batalkan Pesanan
              </button>
            </div>

            {/* Panel Kanan: Panduan Cara Membayar (5 Kolom Sesuai Figma 1:4055) */}
            <div className="md:col-span-5 rounded-3xl bg-[#0c1424] border border-slate-800 p-6 space-y-5 shadow-lg">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                Cara membayar
              </h3>

              <ol className="text-xs text-slate-300 space-y-3 list-decimal list-inside">
                <li>Buka aplikasi mobile banking atau e-wallet pilihan kamu (BCA, Mandiri, BRI, DANA, GoPay, OVO).</li>
                <li>Pilih menu <strong className="text-white">Scan QRIS</strong>, lalu arahkan kamera ke kode QR di samping.</li>
                <li>Pastikan nominal yang muncul sesuai: <strong className="text-[#85effe]">Rp {activeInvoice.total.toLocaleString('id-ID')}</strong>.</li>
                <li>Konfirmasi nama merchant: <strong className="text-white">444STORE</strong> dan masukkan PIN kamu.</li>
                <li>Pembayaran selesai! Saldo Robux akan otomatis masuk dalam hitungan menit.</li>
              </ol>

              {/* Rincian Pesanan Box */}
              <div className="p-4 rounded-2xl bg-[#070b13] border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">INFORMASI PESANAN</span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice:</span>
                  <span className="font-mono font-bold text-white flex items-center gap-1">
                    {activeInvoice.code}
                    <button onClick={() => copyToClipboard(activeInvoice.code)} className="text-[#85effe]">
                      {copiedInvoice ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Produk:</span>
                  <span className="font-bold text-white">{activeInvoice.item}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Username:</span>
                  <span className="font-bold text-[#85effe]">{activeInvoice.target}</span>
                </div>
              </div>

              <a 
                href={`https://wa.me/6281234567890?text=Halo%20Admin%20444Store,%20saya%20sudah%20transfer%20Invoice%20${activeInvoice.code}%20sebesar%20Rp%20${activeInvoice.total}`}
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <span>KONFIRMASI VIA WHATSAPP</span>
              </a>
            </div>

          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 4. PROMO POPUP MODAL (Khas Kingblox di Figma 1:2024) */}
      {/* ========================================================= */}
      {showPromoPopup && currentView === 'home' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0e172a] to-[#070b13] border border-[#85effe]/50 p-6 text-center space-y-4 shadow-[0_0_40px_rgba(133,239,254,0.3)]">
            
            <button 
              onClick={() => setShowPromoPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#85effe]/20 border border-[#85effe] flex items-center justify-center mx-auto text-[#85effe] text-2xl shadow-[0_0_15px_rgba(133,239,254,0.4)]">
              🎁
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#85effe] text-black">
                PROMO KHUSUS HARI INI
              </span>
              <h3 className="text-xl font-black text-white mt-2">CARI PROMO ROBUX TERMURAH?</h3>
              <p className="text-xs text-slate-300">
                Gabung saluran WhatsApp resmi 444Store untuk mendapatkan kode voucher diskon dan giveaway Robux gratis setiap minggu!
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#85effe] hover:bg-[#a5f4ff] text-black text-xs font-black shadow-[0_0_20px_rgba(133,239,254,0.4)] transition flex items-center justify-center gap-1.5"
              >
                JOIN SALURAN WHATSAPP SEKARANG!
              </a>
              <button 
                onClick={() => setShowPromoPopup(false)}
                className="text-xs text-slate-400 hover:text-white transition py-1"
              >
                Nanti Saja
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. FOOTER LENGKAP (Sesuai Figma) */}
      <footer className="border-t border-slate-800/80 bg-[#05070c] mt-20 py-12 px-4 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <span className="text-xl font-black text-white">444<span className="text-[#85effe]">STORE</span></span>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              444Store adalah platform top up Robux dan game Roblox nomor satu di Indonesia. Cepat, hemat, 100% legal, dan bergaransi anti banned.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Tentang Kami</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#85effe]">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-[#85effe]">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-[#85effe]">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-[#85effe]">Rating Pelanggan</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Bantuan</h4>
            <ul className="space-y-2">
              <li><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-[#85effe]">WhatsApp 24 Jam</a></li>
              <li><a href="#" className="hover:text-[#85effe]">Discord Community</a></li>
              <li><a href="#" className="hover:text-[#85effe]">Instagram Official</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 444STORE. All Rights Reserved. Not affiliated with Roblox Corporation.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#85effe]" />
            <span className="text-[#85effe] font-semibold">100% Legal & Terpercaya</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
