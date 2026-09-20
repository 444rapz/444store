import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  Search, 
  ChevronRight, 
  Star, 
  HelpCircle, 
  CheckCircle2, 
  Flame, 
  Gamepad2, 
  ArrowUpRight,
  Sparkles,
  CreditCard,
  QrCode,
  Wallet,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'order' | 'track' | 'reviews'>('order');
  const [orderType, setOrderType] = useState<'username' | 'login'>('username');
  const [robuxAmount, setRobuxAmount] = useState<number>(100);
  const [username, setUsername] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('qris');
  const [searchGame, setSearchGame] = useState<string>('');
  const [invoiceSearch, setInvoiceSearch] = useState<string>('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Perhitungan Kurs 1 Robux = 160 (atau rate dinamis)
  const RATE_PER_ROBUX = orderType === 'username' ? 165 : 155;
  const totalPrice = robuxAmount * RATE_PER_ROBUX;

  const quickNominals = [50, 100, 200, 400, 800, 1000, 1700, 2000, 4500, 10000];

  const gameItems = [
    { id: 1, name: "Blox Fruits", category: "Gamepass & Fruit", hot: true, variants: "32 Item", image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&q=80" },
    { id: 2, name: "Fish It", category: "Rod & Coin", hot: true, variants: "18 Item", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80" },
    { id: 3, name: "CDID (Car Driving ID)", category: "Mobil & Gamepass", hot: true, variants: "14 Item", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" },
    { id: 4, name: "Evade", category: "Cosmetic & Pass", hot: false, variants: "12 Item", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80" },
    { id: 5, name: "Grow A Garden 2", category: "Item & Tools", hot: false, variants: "10 Item", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80" },
    { id: 6, name: "Sawah Indo", category: "Sawah & Traktor", hot: true, variants: "8 Item", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80" },
  ];

  const paymentOptions = [
    { id: 'qris', name: 'QRIS Realtime (Semua E-Wallet & Bank)', fee: 'Rp 0', badge: 'Instan', icon: QrCode },
    { id: 'dana', name: 'DANA / GoPay / OVO / ShopeePay', fee: 'Rp 250', badge: 'Populer', icon: Wallet },
    { id: 'va', name: 'Virtual Account (BCA, Mandiri, BRI, BNI)', fee: 'Rp 1.000', badge: 'Otomatis', icon: CreditCard },
  ];

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      alert('Silakan masukkan Username Roblox kamu!');
      return;
    }
    if (!whatsapp) {
      alert('Silakan masukkan nomor WhatsApp untuk konfirmasi pesanan!');
      return;
    }
    const invoiceId = '444-' + Math.floor(100000 + Math.random() * 900000);
    alert(`Pesanan Berhasil Dibuat!\nInvoice: ${invoiceId}\nNominal: ${robuxAmount} Robux\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}\nMetode: ${paymentMethod.toUpperCase()}\n\nHubungi Admin dengan Nomor Invoice untuk menyelesaikan!`);
  };

  const handleTrackInvoice = () => {
    if (!invoiceSearch) return;
    setTrackResult({
      invoice: invoiceSearch,
      status: 'SUCCESS',
      item: 'Robux Via Username (400 Robux)',
      target: '444rapz',
      date: 'Baru saja',
      total: 'Rp 66.000'
    });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-[#85effe] selection:text-black">
      {/* Top Banner Flash Info */}
      <div className="bg-gradient-to-r from-[#0d1527] via-[#091829] to-[#0d1527] border-b border-[#85effe]/20 text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-[#85effe] animate-ping" />
        <span className="text-[#85effe] font-semibold">FLASH SALE:</span> 
        <span className="text-slate-300">Rate Robux termurah mulai Rp 155/R$! Pengiriman otomatis di bawah 1 menit.</span>
      </div>

      {/* Modern Takapedia-Inspired Navbar */}
      <header className="sticky top-0 z-50 bg-[#07090e]/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('order')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#85effe] to-[#0ea5e9] p-0.5 flex items-center justify-center shadow-neon">
              <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
                <span className="text-lg font-black tracking-tighter text-[#85effe]">444</span>
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                444<span className="text-[#85effe]">STORE</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider">ROBLOX & GAME SERVICES</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0f1422] p-1.5 rounded-full border border-slate-800">
            <button 
              onClick={() => setActiveTab('order')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'order' 
                  ? 'bg-[#85effe] text-black shadow-neon' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Order Robux
            </button>
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'home' 
                  ? 'bg-[#85effe] text-black shadow-neon' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Katalog Game
            </button>
            <button 
              onClick={() => setActiveTab('track')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'track' 
                  ? 'bg-[#85effe] text-black shadow-neon' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Lacak Pesanan
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'reviews' 
                  ? 'bg-[#85effe] text-black shadow-neon' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Testimoni
            </button>
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition"
            >
              Bantuan CS
            </a>
            <button 
              onClick={() => setActiveTab('order')}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-[#85effe] hover:bg-[#a5f4ff] text-black shadow-neon transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              Top Up Sekarang
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-200"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button 
              onClick={() => { setActiveTab('order'); setIsMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-semibold rounded-lg bg-slate-800/50 text-[#85effe]"
            >
              Order Robux
            </button>
            <button 
              onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-semibold rounded-lg text-slate-300"
            >
              Katalog Game & Gamepass
            </button>
            <button 
              onClick={() => { setActiveTab('track'); setIsMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-semibold rounded-lg text-slate-300"
            >
              Lacak Pesanan
            </button>
            <button 
              onClick={() => { setActiveTab('reviews'); setIsMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-semibold rounded-lg text-slate-300"
            >
              Testimoni
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        
        {/* TAB 1: ORDER ROBUX (TAKAPEDIA LAYOUT STYLE) */}
        {activeTab === 'order' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Flow Pengisian (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Product Header Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1220] to-[#0f172a] p-6 border border-slate-800 shadow-xl">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#85effe]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#141d30] border border-[#85effe]/40 flex items-center justify-center p-2 shadow-neon">
                      <div className="text-2xl font-black text-[#85effe]">R$</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#85effe]/15 text-[#85effe] border border-[#85effe]/30">
                          PROSES KILAT 24 JAM
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9 (1.8k+ Ulasan)
                        </span>
                      </div>
                      <h1 className="text-2xl font-extrabold text-white mt-1">Robux Instant Transfer</h1>
                      <p className="text-xs text-slate-400">Jaminan legal, aman tanpa resiko banned. Sistem transfer resmi.</p>
                    </div>
                  </div>

                  {/* Switch Mode: Username vs Login */}
                  <div className="flex p-1 bg-[#090d16] rounded-xl border border-slate-800">
                    <button
                      onClick={() => setOrderType('username')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                        orderType === 'username' 
                          ? 'bg-[#85effe] text-black shadow-neon' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Via Username
                    </button>
                    <button
                      onClick={() => setOrderType('login')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                        orderType === 'login' 
                          ? 'bg-[#85effe] text-black shadow-neon' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Via Login (Lebih Murah)
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 1: Masukkan Data Akun */}
              <div className="rounded-2xl bg-[#0c1220] p-6 border border-slate-800/80 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-[#85effe]/20 text-[#85effe] font-bold flex items-center justify-center text-sm">
                    1
                  </div>
                  <h2 className="text-base font-bold text-white">Masukkan Informasi Akun</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Username Roblox <span className="text-[#85effe]">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 444rapz (Bukan Display Name)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#07090e] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#85effe] transition"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Pastikan username sudah terdaftar dan bukan akun private.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nomor WhatsApp <span className="text-[#85effe]">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 081234567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-[#07090e] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#85effe] transition"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Bukti transfer & notifikasi sukses akan dikirim via WA.</p>
                  </div>
                </div>
              </div>

              {/* STEP 2: Pilih Nominal Robux (Interactive Grid + Custom Input) */}
              <div className="rounded-2xl bg-[#0c1220] p-6 border border-slate-800/80 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#85effe]/20 text-[#85effe] font-bold flex items-center justify-center text-sm">
                      2
                    </div>
                    <h2 className="text-base font-bold text-white">Pilih Nominal Robux</h2>
                  </div>
                  <span className="text-xs text-[#85effe] font-semibold bg-[#85effe]/10 px-2.5 py-1 rounded-md border border-[#85effe]/20">
                    Rate: Rp {RATE_PER_ROBUX}/R$
                  </span>
                </div>

                {/* Quick Selection Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  {quickNominals.map((nom) => (
                    <button
                      key={nom}
                      type="button"
                      onClick={() => setRobuxAmount(nom)}
                      className={`p-3 rounded-xl border text-left transition relative overflow-hidden group ${
                        robuxAmount === nom 
                          ? 'border-[#85effe] bg-[#85effe]/10 shadow-neon' 
                          : 'border-slate-800 bg-[#07090e] hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs text-slate-400 font-medium">Robux</div>
                      <div className="text-lg font-black text-white group-hover:text-[#85effe] transition">
                        {nom.toLocaleString('id-ID')} R$
                      </div>
                      <div className="text-xs font-semibold text-[#85effe] mt-1">
                        Rp {(nom * RATE_PER_ROBUX).toLocaleString('id-ID')}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount Slider */}
                <div className="p-4 rounded-xl bg-[#07090e] border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-300 font-semibold">Atau Masukkan Jumlah Custom:</span>
                    <span className="font-bold text-[#85effe] text-sm">{robuxAmount} Robux</span>
                  </div>
                  <input 
                    type="range" 
                    min={20} 
                    max={5000} 
                    step={10}
                    value={robuxAmount}
                    onChange={(e) => setRobuxAmount(Number(e.target.value))}
                    className="w-full accent-[#85effe] h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Min: 20 R$</span>
                    <span>Max: 5.000 R$</span>
                  </div>
                </div>
              </div>

              {/* STEP 3: Pilih Metode Pembayaran */}
              <div className="rounded-2xl bg-[#0c1220] p-6 border border-slate-800/80 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-[#85effe]/20 text-[#85effe] font-bold flex items-center justify-center text-sm">
                    3
                  </div>
                  <h2 className="text-base font-bold text-white">Pilih Metode Pembayaran</h2>
                </div>

                <div className="space-y-3">
                  {paymentOptions.map((opt) => {
                    const IconComponent = opt.icon;
                    return (
                      <label 
                        key={opt.id}
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                          paymentMethod === opt.id 
                            ? 'border-[#85effe] bg-[#85effe]/10 shadow-neon' 
                            : 'border-slate-800 bg-[#07090e] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2.5 rounded-lg ${paymentMethod === opt.id ? 'bg-[#85effe] text-black' : 'bg-slate-800 text-slate-300'}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              {opt.name}
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-[#85effe] border border-slate-700">
                                {opt.badge}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">Biaya Admin: {opt.fee}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-extrabold text-white">
                            Rp {totalPrice.toLocaleString('id-ID')}
                          </div>
                          <div className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3 h-3" /> Verifikasi Otomatis
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Summary Box (4 Cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-2xl bg-gradient-to-b from-[#0e1526] to-[#0a0f1d] p-6 border border-[#85effe]/30 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-base text-white">Ringkasan Pesanan</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#85effe]/20 text-[#85effe] font-semibold">
                    Invoice Draft
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Layanan:</span>
                    <span className="font-semibold text-white">Robux {orderType === 'username' ? 'Via Username' : 'Via Login'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Target Akun:</span>
                    <span className="font-semibold text-[#85effe]">{username || '-'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Jumlah Robux:</span>
                    <span className="font-bold text-white text-sm">{robuxAmount.toLocaleString('id-ID')} R$</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Metode Bayar:</span>
                    <span className="font-semibold text-white uppercase">{paymentMethod}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-800/80 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-300">Total Tagihan:</span>
                    <span className="text-2xl font-black text-[#85effe]">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#85effe] to-[#38d2e8] hover:from-[#a5f4ff] hover:to-[#5de0f2] text-black font-extrabold text-sm tracking-wide shadow-neon-strong transition flex items-center justify-center gap-2 group"
                >
                  <span>Beli Sekarang</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </button>

                {/* Trust Badges */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#07090e] border border-slate-800/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#85effe]" />
                    <span>Garansi 100% Aman</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#07090e] border border-slate-800/80">
                    <Clock className="w-3.5 h-3.5 text-[#85effe]" />
                    <span>Proses &lt; 1 Menit</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: KATALOG GAME & GAMEPASS (GRID TAKAPEDIA STYLE) */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  Katalog Item & Gamepass Roblox <Flame className="w-6 h-6 text-orange-400 fill-orange-400" />
                </h1>
                <p className="text-xs text-slate-400 mt-1">Pilih game favoritmu dan dapatkan gamepass eksklusif dengan proses kilat.</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari nama game..."
                  value={searchGame}
                  onChange={(e) => setSearchGame(e.target.value)}
                  className="w-full bg-[#0f1422] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#85effe] transition"
                />
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {gameItems
                .filter(g => g.name.toLowerCase().includes(searchGame.toLowerCase()))
                .map((game) => (
                  <div 
                    key={game.id}
                    onClick={() => setActiveTab('order')}
                    className="group relative rounded-2xl bg-[#0c1220] border border-slate-800/80 hover:border-[#85effe]/60 transition-all duration-300 p-3 flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-lg"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-900">
                      <img 
                        src={game.image} 
                        alt={game.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {game.hot && (
                        <span className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow">
                          HOT
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-medium block">{game.category}</span>
                      <h3 className="font-bold text-sm text-white group-hover:text-[#85effe] transition truncate">
                        {game.name}
                      </h3>
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-[#85effe] font-semibold">{game.variants}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-[#85effe] transition" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: LACAK PESANAN (TRACK INVOICE) */}
        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto py-10 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-extrabold text-white">Lacak Status Pesanan</h1>
              <p className="text-xs text-slate-400">Masukkan kode Invoice transaksi kamu untuk memantau status pengiriman.</p>
            </div>

            <div className="rounded-2xl bg-[#0c1220] p-6 border border-slate-800 shadow-xl">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Masukkan nomor invoice (contoh: 444-123456)"
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="flex-1 bg-[#07090e] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#85effe]"
                />
                <button
                  type="button"
                  onClick={handleTrackInvoice}
                  className="px-6 py-3 rounded-xl bg-[#85effe] text-black font-bold text-sm shadow-neon hover:bg-[#a5f4ff] transition"
                >
                  Lacak
                </button>
              </div>

              {trackResult && (
                <div className="mt-6 p-4 rounded-xl bg-[#07090e] border border-[#85effe]/30 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs text-slate-400 font-medium">Invoice: {trackResult.invoice}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      SELESAI (SUKSES)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Item:</span>
                      <span className="font-semibold text-white">{trackResult.item}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Username:</span>
                      <span className="font-semibold text-[#85effe]">{trackResult.target}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Total:</span>
                      <span className="font-semibold text-white">{trackResult.total}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Waktu:</span>
                      <span className="font-semibold text-slate-300">{trackResult.date}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TESTIMONI & ULASAN PELANGGAN */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h1 className="text-2xl font-black text-white">Apa Kata Pelanggan 444Store?</h1>
              <p className="text-xs text-slate-400">Transparansi ulasan asli dari ribuan pemain Roblox di seluruh Indonesia.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { user: 'raf***44', item: '400 Robux', text: 'Gokil ga nyampe 30 detik beneran masuk! Trusted parah bos.', star: 5 },
                { user: 'dim***99', item: '1000 Robux', text: 'Harga paling murah se-Indonesia, adminnya fast respon di WA.', star: 5 },
                { user: 'kei***01', item: 'Gamepass Blox Fruits', text: 'Langsung aktif di akun tanpa kendala. Bakal langganan disini.', star: 5 },
                { user: 'ald***23', item: '800 Robux', text: 'Mantap banget via username gak perlu share password aman pol.', star: 5 },
                { user: 'zan***12', item: '200 Robux', text: 'Proses kilat QRIS langsung otomatis kedetect.', star: 5 },
                { user: 'ven***88', item: '1700 Robux', text: 'Recommended seller buat top up Robux legal tanpa takut banned.', star: 5 },
              ].map((rev, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0c1220] border border-slate-800/80 space-y-2 shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#85effe]">{rev.user}</span>
                    <div className="flex text-amber-400">
                      {[...Array(rev.star)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">{rev.item}</span>
                  <p className="text-xs text-slate-300 italic">"{rev.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <section className="mt-16 border-t border-slate-800/80 pt-10">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-center text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#85effe]" /> Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            
            <div className="space-y-3 pt-4">
              <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800">
                <h4 className="text-xs font-bold text-white mb-1">Berapa lama proses pengiriman Robux?</h4>
                <p className="text-xs text-slate-400">Untuk pesanan via Username, pengiriman otomatis masuk ke akun dalam waktu 30 detik hingga 1 menit setelah pembayaran terverifikasi.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800">
                <h4 className="text-xs font-bold text-white mb-1">Apakah perlu memberikan password akun Roblox?</h4>
                <p className="text-xs text-slate-400">Tidak perlu! Jika memilih opsi "Via Username", kamu hanya perlu mengetikkan username kamu saja. Sangat aman dan tanpa resiko akun diretas.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0c1220] border border-slate-800">
                <h4 className="text-xs font-bold text-white mb-1">Bagaimana jika pesanan belum masuk setelah 5 menit?</h4>
                <p className="text-xs text-slate-400">Silakan hubungi Customer Service kami via WhatsApp dengan menyertakan Nomor Invoice kamu. Tim kami standby 24 jam untuk membantu.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05070a] mt-20 py-10 px-4 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white tracking-tight">444<span className="text-[#85effe]">STORE</span></span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm">
              Platform top up Robux dan game item terpercaya di Indonesia. Transaksi 100% legal, aman, harga bersaing, dan didukung sistem otomatis 24 jam nonstop.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Layanan</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('order')} className="hover:text-[#85effe] transition">Robux Via Username</button></li>
              <li><button onClick={() => setActiveTab('order')} className="hover:text-[#85effe] transition">Robux Via Login</button></li>
              <li><button onClick={() => setActiveTab('home')} className="hover:text-[#85effe] transition">Gamepass & Items</button></li>
              <li><button onClick={() => setActiveTab('track')} className="hover:text-[#85effe] transition">Lacak Pesanan</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Bantuan & Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#85effe] transition">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-[#85effe] transition">Kebijakan Privasi</a></li>
              <li><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-[#85effe] transition">Hubungi WhatsApp</a></li>
              <li><a href="#" className="hover:text-[#85effe] transition">Discord Community</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 444Store (by 444rapz). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Design Inspired by Takapedia & Kingblox</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#85effe]" />
            <span className="text-[#85effe]">v1.0.0 Production</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
