import React from 'react';
import { useApp } from '../context/AppContext';
import { IndonesiaMap } from './IndonesiaMap';
import { AnimatedCounter } from './AnimatedCounter';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Crown, 
  Users, 
  Building2, 
  TrendingUp, 
  Scale, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Award,
  Video
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    nationalSummary, 
    products, 
    articles, 
    organizations, 
    setActiveView, 
    setSelectedProduct, 
    searchQuery, 
    setSearchQuery 
  } = useApp();

  const previewProducts = products.filter((p) => p.isApproved).slice(0, 3);
  const premiumProducts = products.filter((p) => p.isPremiumUnik && p.isApproved).slice(0, 2);
  const previewArticles = articles.filter((a) => a.isApproved).slice(0, 3);

  // Dynamic featured home product set by Admin
  const featuredHomeProduct = products.find((p) => p.isFeaturedHome && p.isApproved) 
    || products.find((p) => p.isPremiumUnik && p.isApproved) 
    || products[0];

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION - Pristine White with Dark Green Typography */}
      <section className="relative bg-white text-slate-900 pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-950 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-800" /> Marketplace Kurban Resmi Indonesia
            </div>

            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black font-serif leading-snug text-emerald-950 tracking-tight">
              Menghubungkan Shohibul Qurban dengan Lembaga Terpercaya
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              Platform digital nasional terintegrasi pusat data, transaksi transparan, dan jangkauan penyaluran hingga ke pelosok 3T Indonesia. Bekerja sama resmi dengan BAZNAS, Dompet Dhuafa, Rumah Zakat, dan LAZISNU.
            </p>

            {/* Quick Search Controls - Clean White/Slate Panel */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setActiveView('marketplace');
                    }}
                    placeholder="Cari Sapi Limosin, Kambing Etawa, atau Provinsi..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-transparent transition-all shadow-inner"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>

                <button
                  onClick={() => setActiveView('marketplace')}
                  className="w-full sm:w-auto bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Beli Kurban</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 px-1 pt-1">
                <span>Populer: Sapi Bali 220kg, Kambing Etawa, Domba Garut</span>
                <button
                  onClick={() => setActiveView('kurban-unik')}
                  className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-600" /> Kurban Sultan (VIP)
                </button>
              </div>
            </div>

            {/* Hero Quick Stats - Crisp White Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-200 text-xs">
              <div>
                <p className="text-emerald-950 font-black font-serif text-2xl tracking-tight">2.150.000+</p>
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">Ekor Hewan Nasional</p>
              </div>
              <div>
                <p className="text-emerald-950 font-black font-serif text-2xl tracking-tight">112+</p>
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">Lembaga Terverifikasi</p>
              </div>
              <div>
                <p className="text-emerald-950 font-black font-serif text-2xl tracking-tight">8.600.000+</p>
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">Penerima Manfaat</p>
              </div>
              <div>
                <p className="text-emerald-950 font-black font-serif text-2xl tracking-tight">38</p>
                <p className="text-slate-500 text-[11px] font-medium mt-0.5">Provinsi Indonesia</p>
              </div>
            </div>

          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900 group">
              <div className="w-full aspect-[3/2] overflow-hidden">
                <img
                  src={featuredHomeProduct?.images[0] || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=800&auto=format&fit=crop&q=80'}
                  alt={featuredHomeProduct?.title || 'Sapi Limosin Super'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent"></div>

              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-amber-500 text-emerald-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-emerald-950" /> Pilihan Utama Halaman Depan
              </div>

              <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
                <span className="bg-emerald-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-amber-300 border border-emerald-700">
                  {featuredHomeProduct?.organizationName}
                </span>
                <h3 className="text-xl font-bold font-serif text-white">{featuredHomeProduct?.title}</h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed line-clamp-2">
                  {featuredHomeProduct?.description || 'Dilengkapi Live Stream CCTV 24 Jam, Inspeksi Video Call & Gratis Kirim Jabodetabek/Surabaya.'}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (featuredHomeProduct) setSelectedProduct(featuredHomeProduct);
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold py-2.5 rounded-xl text-xs shadow transition-all border border-amber-400"
                  >
                    Beli Kurban Rp {(featuredHomeProduct?.price || 0).toLocaleString('id-ID')}
                  </button>
                  <button
                    onClick={() => setActiveView('kurban-unik')}
                    className="bg-emerald-900/80 hover:bg-emerald-800 text-white font-bold px-3 py-2.5 rounded-xl text-xs shadow transition-all border border-emerald-700"
                  >
                    Lihat VIP
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NATIONAL DASHBOARD SUMMARY - DUAL DATASET SYNC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Pusat Agregasi Dual Data Nasional
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-emerald-950 mt-2">
              Dashboard Statistik Kurban Nasional Indonesia 2026
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Sinkronisasi data resmi Kementerian Pertanian RI (Data Stok) dan konsolidasi data input 112 lembaga kurban & BAZNAS (Data Realisasi).
            </p>
          </div>
          <button
            onClick={() => setActiveView('national-dashboard')}
            className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1 transition-colors bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shrink-0"
          >
            Buka Dashboard Nasional Lengkap →
          </button>
        </div>

        {/* Dual Dataset Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Data 1: Kementan Stock (Tahun Berjalan) */}
          <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-5 rounded-2xl border border-emerald-800 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2.5">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                DATA 1 • KEMENTAN RI ({nationalSummary.kementanStock?.year || nationalSummary.currentYear || 2026})
              </span>
              <span className="text-[10px] bg-emerald-800 text-emerald-100 font-bold px-2 py-0.5 rounded">
                Stok Tahun Berjalan ({nationalSummary.kementanStock?.year || nationalSummary.currentYear || 2026})
              </span>
            </div>
            <div>
              <p className="text-[11px] text-emerald-200 font-medium">
                Stok Hewan Kurban Siap Potong ({nationalSummary.kementanStock?.year || nationalSummary.currentYear || 2026})
              </p>
              <p className="text-2xl sm:text-3xl font-black font-serif text-amber-300 mt-0.5">
                <AnimatedCounter value={nationalSummary.kementanStock?.totalStock || nationalSummary.totalAnimals} /> <span className="text-xs font-sans text-emerald-200 font-normal">ekor siap kurban</span>
              </p>
              <p className="text-[11px] text-emerald-200/80 mt-1">
                Sapi: <strong><AnimatedCounter value={nationalSummary.kementanStock?.sapiStock || 729700} /></strong> • Kambing/Domba: <strong><AnimatedCounter value={(nationalSummary.kementanStock?.kambingStock || 952200) + (nationalSummary.kementanStock?.dombaStock || 616600)} /></strong>
              </p>
            </div>
            <div className="text-[10px] text-emerald-300/80 pt-2 border-t border-emerald-800/60 flex items-center justify-between">
              <span>Status SKKH & Kesehatan ({nationalSummary.kementanStock?.year || 2026}): <strong>{nationalSummary.kementanStock?.readinessPercent || 98.6}% Sehat</strong></span>
              <span className="italic">Ditjen PKH Kementan</span>
            </div>
          </div>

          {/* Data 2: Lembaga Realization (Tahun Sebelumnya / Berjalan) */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-2xl border border-blue-900 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-blue-800/80 pb-2.5">
              <span className="text-[10px] font-black uppercase text-blue-300 tracking-wider">
                DATA 2 • REALISASI {nationalSummary.lembagaRealization?.isConsolidatedCurrentYear ? 'TAHUN BERJALAN' : 'TAHUN SEBELUMNYA'} ({nationalSummary.lembagaRealization?.year || 2026})
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${nationalSummary.lembagaRealization?.isConsolidatedCurrentYear ? 'bg-blue-800 text-blue-100' : 'bg-amber-900/90 text-amber-200 border border-amber-700/60'}`}>
                {nationalSummary.lembagaRealization?.isConsolidatedCurrentYear ? `Pasca Iduladha & Konsolidasi ${nationalSummary.lembagaRealization?.year || 2026}` : `Sebelum Iduladha (Data ${nationalSummary.lembagaRealization?.year || 2025})`}
              </span>
            </div>
            <div>
              <p className="text-[11px] text-blue-200 font-medium">
                Realisasi Pelaksanaan & Pemotongan ({nationalSummary.lembagaRealization?.year || 2026})
              </p>
              <p className="text-2xl sm:text-3xl font-black font-serif text-blue-300 mt-0.5">
                <AnimatedCounter value={nationalSummary.lembagaRealization?.totalRealizedAnimals || 1842500} /> <span className="text-xs font-sans text-blue-200 font-normal">ekor terpotong</span>
              </p>
              <p className="text-[11px] text-blue-200/80 mt-1">
                Daging ({nationalSummary.lembagaRealization?.year || 2026}): <strong><AnimatedCounter value={nationalSummary.lembagaRealization?.totalTonMeatDistributed || nationalSummary.totalTonMeatDistributed} /> Ton</strong> • Penerima: <strong><AnimatedCounter value={nationalSummary.lembagaRealization?.totalBeneficiaries || nationalSummary.totalBeneficiaries} /> Jiwa</strong>
              </p>
            </div>
            <div className="text-[10px] text-blue-300/80 pt-2 border-t border-blue-800/60 flex items-center justify-between">
              <span>Shohibul Terdaftar ({nationalSummary.lembagaRealization?.year || 2026}): <strong><AnimatedCounter value={nationalSummary.lembagaRealization?.totalBuyers || nationalSummary.totalBuyers} /> Pekurban</strong></span>
              <span className="italic">{nationalSummary.lembagaRealization?.totalReportingOrgs || 112} Lembaga Reporting</span>
            </div>
          </div>

        </div>
      </section>

      {/* INDONESIA INTERACTIVE MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IndonesiaMap />
      </section>

      {/* MARKETPLACE PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Katalog Pilihan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-emerald-950 mt-2">
              Marketplace Kurban Pilihan Terbaru
            </h2>
          </div>
          <button
            onClick={() => setActiveView('marketplace')}
            className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            Lihat Seluruh Katalog Marketplace →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-950/90 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <img src={product.organizationLogo} alt="" className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                    {product.organizationName}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded">
                      {product.type} • {product.weightKg} kg
                    </span>
                    <span className="text-slate-500 font-semibold flex items-center gap-1 truncate max-w-[50%]">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">
                        {product.isPremiumUnik && product.locationDetails
                          ? `${product.locationDetails}, ${product.province}`
                          : product.province}
                      </span>
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-base line-clamp-2 leading-relaxed">
                    {product.title}
                  </h3>
                  <p className="text-lg font-black text-emerald-950 font-serif">
                    Rp {(product.discountPrice || product.price).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
                >
                  Lihat Detail Hewan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KURBAN SULTAN (VIP) PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 rounded-3xl p-8 sm:p-12 border border-emerald-900 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
              <Crown className="w-4 h-4 text-amber-400" /> Kurban Sultan (VIP)
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-amber-200">
              Pilih Kurban Sultan (VIP) untuk Kurban Terbaik
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Dapatkan pengalaman kurban eksklusif dengan Sapi Heavy Class (1 Ton+), pemantauan Live CCTV 24 Jam, inspeksi Video Call bersama Dokter Hewan, dan Gratis Ongkir Jakarta & Surabaya.
            </p>
          </div>

          <button
            onClick={() => setActiveView('kurban-unik')}
            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold px-6 py-3.5 rounded-xl text-xs shadow-md transition-all shrink-0 flex items-center gap-2 transform hover:scale-105"
          >
            <span>Jelajahi Kurban Sultan (VIP)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ARTICLES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Edukasi & Fatwa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-emerald-950 mt-2">Artikel & Fatwa Terbaru</h2>
          </div>
          <button
            onClick={() => setActiveView('articles')}
            className="text-xs font-bold text-emerald-900 hover:text-emerald-700"
          >
            Lihat Semua Artikel →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveView('articles')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all"
            >
              <div className="w-full aspect-[3/2] overflow-hidden rounded-xl bg-slate-100">
                <img src={art.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200/60 inline-block">
                {art.category}
              </span>
              <h3 className="font-serif font-bold text-slate-900 text-sm line-clamp-2 leading-relaxed">{art.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{art.summary}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
