import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Crown, Video, Calendar, PhoneCall, Truck, ShieldCheck, Star, CheckCircle2, Scale, Play, MapPin, Eye, ShoppingCart, Building2 } from 'lucide-react';

export const KurbanUnik: React.FC = () => {
  const { products, setSelectedProduct, addToCart, setIsCheckoutOpen } = useApp();

  // Premium Sultan (VIP) products filter - Strictly synchronized with Admin toggles
  const vipProducts = products.filter((p) => p.isPremiumUnik && p.isApproved);
  const premiumProducts = vipProducts;

  // 3 products specifically designated by Admin for "LIVE FEED KANDANG KURBAN SULTAN (VIP)"
  const featuredLiveFeedProducts = products.filter((p) => p.isFeaturedLiveFeed && p.isApproved);
  
  // Live Feed camera pool (3 slots)
  const liveStreamProducts = featuredLiveFeedProducts.length > 0
    ? featuredLiveFeedProducts.slice(0, 3)
    : vipProducts.slice(0, 3);

  const [selectedStreamIndex, setSelectedStreamIndex] = useState<number>(0);
  const [bookingType, setBookingType] = useState<'video_call' | 'visit_kandang'>('video_call');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const activeStreamProduct = liveStreamProducts[selectedStreamIndex] || liveStreamProducts[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(
      `Jadwal ${bookingType === 'video_call' ? 'Video Call Inspeksi' : 'Kunjungan Kandang Sultan (VIP)'} berhasil dikonfirmasi! Tim concierge Kurban Sultan (VIP) akan menghubungi Anda.`
    );
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <div className="bg-gradient-to-b from-amber-100/50 via-amber-50/30 to-slate-50 text-slate-900 min-h-screen py-10 space-y-12">
      
      {/* Hero Banner Section (Light Luxury Theme) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-400 border border-amber-400/50 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-md">
          <Crown className="w-4 h-4 text-amber-400 fill-amber-400" /> KURBAN SULTAN (VIP)
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black font-serif text-slate-950 tracking-tight leading-tight">
          Katalog Hewan <span className="text-amber-600 underline decoration-amber-400/60 underline-offset-8">Kurban Sultan (VIP)</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Koleksi Sapi Raksasa Heavy Class (1 Ton+) dan Domba Champion eksklusif. Layanan VIP lengkap dengan Live CCTV Kandang 24/7, Video Call Inspeksi Privat, Bingkai Sertifikat Akrilik Gold, dan Bebas Ongkir Pengiriman Jabodetabek & Surabaya.
        </p>

        {/* Feature Highlights Pills - Black & Gold */}
        <div className="flex flex-wrap justify-center items-center gap-3 pt-2 text-xs">
          <span className="bg-slate-950 border border-amber-400/60 text-amber-300 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm font-bold">
            <Video className="w-4 h-4 text-amber-400" /> Live CCTV Kandang 24/7
          </span>
          <span className="bg-slate-950 border border-amber-400/60 text-amber-300 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm font-bold">
            <PhoneCall className="w-4 h-4 text-amber-400" /> Inspection Video Call
          </span>
          <span className="bg-slate-950 border border-amber-400/60 text-amber-300 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm font-bold">
            <Truck className="w-4 h-4 text-amber-400" /> Free Ongkir Jabodetabek & Surabaya
          </span>
          <span className="bg-slate-950 border border-amber-400/60 text-amber-300 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Sertifikat Akrilik Gold
          </span>
        </div>
      </div>

      {/* Live CCTV Feed & Booking Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Live CCTV Video Feed Player - High Contrast Black & Gold Container */}
        <div className="lg:col-span-7 bg-slate-950 text-white rounded-3xl p-6 border-2 border-amber-400 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">LIVE FEED KANDANG KURBAN SULTAN (VIP)</span>
            </div>
            <span className="text-xs text-amber-300 font-serif font-bold flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-amber-400/30">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeStreamProduct?.locationDetails || 'Kandang VIP Tapos'}, {activeStreamProduct?.province || 'Jawa Barat'}</span>
            </span>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-amber-400/40 group">
            {activeStreamProduct?.cctvUrl || activeStreamProduct?.videoUrl ? (
              <video
                src={activeStreamProduct.cctvUrl || activeStreamProduct.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-90"
              />
            ) : (
              <img
                src={activeStreamProduct?.images[0] || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=800&auto=format&fit=crop&q=80'}
                alt="CCTV Stream"
                className="w-full h-full object-cover opacity-80"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none"></div>

            <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-mono text-amber-400 border border-amber-400/50 flex items-center gap-1.5 shadow">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>CAM-0{selectedStreamIndex + 1} • 1080p 60FPS • {activeStreamProduct?.locationDetails || 'TAPOS BOGOR VIP'}</span>
            </div>

            <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase shadow-md flex items-center gap-1.5 border border-amber-200">
              <img src={activeStreamProduct?.organizationLogo} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
              <span>{activeStreamProduct?.organizationName}</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-amber-200 bg-slate-950/80 backdrop-blur p-3.5 rounded-2xl border border-amber-400/40">
              <div>
                <p className="font-serif font-black text-white text-base leading-snug">{activeStreamProduct?.title}</p>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  Bobot: <strong className="text-white font-bold">{activeStreamProduct?.weightKg} kg</strong> • Rp {(activeStreamProduct?.price || 0).toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => {
                  if (activeStreamProduct) setSelectedProduct(activeStreamProduct);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg transition-all shrink-0 border border-amber-300"
              >
                Detail Hewan
              </button>
            </div>
          </div>

          {/* Stream Selector Thumbs - Sync 3 VIP Live Feed products */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {liveStreamProducts.map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => setSelectedStreamIndex(idx)}
                className={`p-3 rounded-2xl border transition-all text-left ${
                  selectedStreamIndex === idx
                    ? 'border-amber-400 bg-amber-400/20 text-white font-bold shadow-lg ring-1 ring-amber-400'
                    : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-amber-400/40 hover:text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase font-mono text-amber-400 font-bold">
                  <span>CAM-0{idx + 1}</span>
                  {prod.isFeaturedLiveFeed && <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded text-[8px]">VIP</span>}
                </div>
                <p className="text-xs truncate font-bold text-white mt-1">{prod.breed}</p>
                <p className="text-[10px] text-slate-300 truncate mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{prod.organizationName}</span>
                </p>
                <p className="text-[10px] text-amber-400/90 truncate mt-0.5 font-semibold">
                  {prod.locationDetails ? `${prod.locationDetails}, ${prod.province}` : prod.province}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Concierge Booking Form (Elegant Light Card with Black/Gold Accent) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-amber-400/80 shadow-xl overflow-hidden space-y-0">
          <div className="bg-slate-950 text-amber-400 p-6 space-y-1 border-b border-amber-400/40">
            <h3 className="text-xl font-serif font-black flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Concierge Kurban Sultan (VIP)
            </h3>
            <p className="text-xs text-amber-200/90 font-medium">
              Jadwalkan Video Call privat atau Kunjungan Kandang Kurban Sultan (VIP) bersama Tim Dokter Hewan.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {bookingSuccess && (
              <div className="bg-emerald-50 border-2 border-emerald-500 p-3.5 rounded-2xl text-emerald-950 text-xs flex items-center gap-2.5 font-bold shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{bookingSuccess}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setBookingType('video_call')}
                  className={`py-3 px-3 rounded-xl font-extrabold border-2 transition-all flex items-center justify-center gap-1.5 ${
                    bookingType === 'video_call'
                      ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" /> Video Call
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType('visit_kandang')}
                  className={`py-3 px-3 rounded-xl font-extrabold border-2 transition-all flex items-center justify-center gap-1.5 ${
                    bookingType === 'visit_kandang'
                      ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-amber-400" /> Kunjungan Kandang
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-slate-900 font-bold block">Nama Lengkap Shohibul Qurban</label>
                <input
                  type="text"
                  required
                  placeholder="H. Ahmad Abdullah"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-900 font-bold block">Nomor WhatsApp Aktif</label>
                <input
                  type="tel"
                  required
                  placeholder="0812-3456-7890"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-900 font-bold block">Pilih Tanggal & Waktu Inspeksi</label>
                <input
                  type="datetime-local"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-black text-amber-400 font-black py-4 rounded-xl shadow-xl text-xs transition-all border border-amber-400 flex items-center justify-center gap-2 tracking-wide"
              >
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>KONFIRMASI JADWAL CONCIERGE SULTAN</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Exclusive Catalog Cards (Light Theme + Black & Gold Accents) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        <div className="border-b border-amber-300/80 pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-serif font-black text-slate-950 flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500 fill-amber-400" /> Katalog Hewan Kurban Sultan (VIP)
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">Hewan pilihan kelas raksasa kualitas pameran & kontes nasional.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {premiumProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border-2 border-amber-300 hover:border-amber-500 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-950">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>

                  <span className="absolute top-4 left-4 bg-slate-950 text-amber-400 border border-amber-400/60 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400 fill-amber-400" /> KURBAN SULTAN (VIP)
                  </span>

                  <span className="absolute bottom-4 right-4 bg-slate-950/90 backdrop-blur text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-400/50">
                    {product.weightKg} kg (Heavy Sultan)
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  {/* Seller / Organization Info */}
                  <div className="flex items-center gap-2.5 bg-slate-950 text-amber-300 p-2.5 rounded-2xl border border-amber-400/40">
                    <img
                      src={product.organizationLogo}
                      alt={product.organizationName}
                      className="w-6 h-6 rounded-full object-cover border border-amber-400 shrink-0"
                    />
                    <div className="truncate text-xs">
                      <p className="font-bold text-white truncate">{product.organizationName}</p>
                      <p className="text-[10px] text-amber-300 font-medium truncate">Lembaga Terverifikasi Kemenag RI</p>
                    </div>
                  </div>

                  <h3 className="font-serif font-black text-slate-950 text-lg line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  <div className="text-2xl font-black text-slate-950 font-serif flex items-center gap-1">
                    <span className="text-amber-600 font-extrabold">Rp</span>
                    <span>{product.price.toLocaleString('id-ID')}</span>
                  </div>

                  {/* Barn Location details */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Lokasi Kandang Kurban Sultan (VIP):</p>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{product.locationDetails ? `${product.locationDetails}, ${product.province}` : product.province}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium">
                    {product.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-800 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 font-medium">
                    <p className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-600 shrink-0" /> Free Ongkir Jabodetabek & Surabaya
                    </p>
                    <p className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" /> Sertifikat Bingkai Akrilik Gold
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-2xl text-xs transition-colors border border-slate-300 flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Lihat Detail
                </button>
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-slate-950 hover:bg-black text-amber-400 font-black py-3 rounded-2xl text-xs shadow-lg transition-all border border-amber-400 flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-400" /> Beli Sultan (VIP)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
