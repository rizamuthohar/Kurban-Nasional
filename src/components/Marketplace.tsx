import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { getOrgTheme } from '../utils/orgTheme';
import { Search, Filter, ShieldCheck, MapPin, Scale, Calendar, CheckCircle2, Video, Eye, ShoppingCart, Star, AlertCircle } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const { 
    products, 
    setSelectedProduct, 
    addToCart, 
    searchQuery, 
    setSearchQuery,
    selectedAnimalType,
    setSelectedAnimalType,
    selectedProvince,
    setSelectedProvince,
    selectedOrg,
    setSelectedOrg,
    organizations
  } = useApp();

  const [priceRange, setPriceRange] = useState<number>(100000000); // Max price filter
  const [shippingFilter, setShippingFilter] = useState<string>('all');
  const [minWeight, setMinWeight] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'weight_high'>('recommended');

  // Filter approved products
  const approvedProducts = products.filter((p) => p.isApproved);

  const filteredProducts = approvedProducts.filter((p) => {
    // Search
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.province.toLowerCase().includes(searchQuery.toLowerCase());

    // Animal Type
    const matchesType = selectedAnimalType === 'all' || p.type === selectedAnimalType;

    // Province (Supports multi-province matching)
    const matchesProv =
      selectedProvince === 'all' ||
      p.province.toLowerCase().includes(selectedProvince.toLowerCase());

    // Organization
    const matchesOrg = 
      selectedOrg === 'all' || 
      p.organizationId === selectedOrg || 
      (p.organizationName && p.organizationName.toLowerCase().includes(selectedOrg.toLowerCase()));

    // Price
    const currentPrice = p.discountPrice || p.price;
    const matchesPrice = currentPrice <= priceRange;

    // Weight
    const matchesWeight = p.weightKg >= minWeight;

    // Shipping
    const matchesShipping = shippingFilter === 'all' || p.shippingType === shippingFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesProv &&
      matchesOrg &&
      matchesPrice &&
      matchesWeight &&
      matchesShipping
    );
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price_low') return priceA - priceB;
    if (sortBy === 'price_high') return priceB - priceA;
    if (sortBy === 'weight_high') return b.weightKg - a.weightKg;
    return 0; // recommended
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xs border border-slate-200">
        <div>
          <span className="bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" /> Resmi Terverifikasi
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-emerald-950 mt-2">
            Marketplace Hewan Kurban Nasional
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Menampilkan hewan kurban dari lembaga zakat & kemanusiaan resmi bersertifikat SKKH Kementan.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs shrink-0">
          <ShieldCheck className="w-6 h-6 text-emerald-800 shrink-0" />
          <div>
            <p className="font-extrabold text-emerald-950">Garansi Akad & Kesehatan</p>
            <p className="text-[11px] text-slate-500">Sertifikat Resmi & Laporan Pemotongan</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Filter Sidebar + Right Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-3 space-y-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-md h-fit">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" /> Filter Pencarian
            </h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAnimalType('all');
                setSelectedProvince('all');
                setSelectedOrg('all');
                setPriceRange(100000000);
                setMinWeight(0);
                setShippingFilter('all');
              }}
              className="text-xs text-amber-600 hover:underline font-medium"
            >
              Reset
            </button>
          </div>

          {/* Kata Kunci / Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Cari Hewan / Jenis</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Limosin, Etawa, Dompet Dhuafa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-8 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-gray-400 hover:text-gray-700 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Jenis Hewan */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">Jenis Hewan</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'sapi', label: 'Sapi' },
                { id: 'kambing', label: 'Kambing' },
                { id: 'domba', label: 'Domba' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedAnimalType(t.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedAnimalType === t.id
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lembaga Pengelola */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">Lembaga Pengelola</label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">Semua Lembaga Terverifikasi</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          {/* Provinsi Lokasi */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">Provinsi</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">Seluruh Indonesia (38 Provinsi)</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Jawa Tengah">Jawa Tengah</option>
              <option value="Jawa Timur">Jawa Timur</option>
              <option value="DKI Jakarta">DKI Jakarta</option>
              <option value="Nusa Tenggara Barat">Nusa Tenggara Barat</option>
              <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
              <option value="Aceh">Aceh</option>
              <option value="Papua">Papua</option>
            </select>
          </div>

          {/* Model Pengiriman / Distribusi */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">Program / Pengiriman</label>
            <select
              value={shippingFilter}
              onChange={(e) => setShippingFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">Semua Jenis Distribusi</option>
              <option value="distribusi_3t">Tebar Pelosok 3T (NTT/Papua)</option>
              <option value="olahan_kornet">Olahan Kaleng Kornet / Rendang</option>
              <option value="lokal">Distribusi Lokal Warga Dhuafa</option>
              <option value="bebas_ongkir">Bebas Ongkir (Kandang Kurban Sultan (VIP))</option>
            </select>
          </div>

          {/* Range Harga */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-800 uppercase tracking-wider">Maksimum Harga</label>
              <span className="font-bold text-emerald-800">
                {priceRange >= 100000000 ? 'Tanpa Batas' : `Rp ${(priceRange / 1000000).toFixed(1)} Jt`}
              </span>
            </div>
            <input
              type="range"
              min={2000000}
              max={100000000}
              step={1000000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>

          {/* Minimal Berat (kg) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-800 uppercase tracking-wider">Minimal Berat (kg)</label>
              <span className="font-bold text-emerald-800">{minWeight} kg</span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={minWeight}
              onChange={(e) => setMinWeight(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Catalog Grid */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-xs">
            <p className="text-gray-600">
              Menampilkan <span className="font-extrabold text-emerald-900">{sortedProducts.length}</span> pilihan hewan kurban terverifikasi
            </p>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="recommended">Rekomendasi Terbaik</option>
                <option value="price_low">Harga Terendah</option>
                <option value="price_high">Harga Tertinggi</option>
                <option value="weight_high">Bobot Terberat</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
              <div className="p-4 bg-amber-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-amber-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-gray-900 text-lg">Hewan Tidak Ditemukan</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  Coba sesuaikan filter pencarian atau kata kunci lokasi/lembaga Anda.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => {
                const currentPrice = product.discountPrice || product.price;
                const theme = getOrgTheme(product.organizationName);

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-2xl border-2 ${theme.cardBorder} shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group`}
                  >
                    <div>
                      {/* Image Preview & Badges - Strictly 3:2 Aspect Ratio */}
                      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                          <span className={`${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} border text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm`}>
                            <img src={product.organizationLogo} alt={product.organizationName} className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                            {product.organizationName}
                          </span>

                          {product.isPremiumUnik && (
                            <span className="bg-amber-500 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                              Kurban Sultan (VIP)
                            </span>
                          )}
                        </div>

                        {/* Bottom Overlay Info */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-medium max-w-[65%] truncate">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">
                              {product.isPremiumUnik && product.locationDetails
                                ? `${product.locationDetails}, ${product.province}`
                                : product.province}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-300 shrink-0">
                            <Scale className="w-3 h-3" /> {product.weightKg} kg
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {product.type} • {product.breed}
                          </span>
                          {product.isVaccinatedPMK && (
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-blue-600" /> Bebas PMK
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => setSelectedProduct(product)}
                          className="font-serif font-bold text-gray-900 text-base leading-snug hover:text-emerald-800 cursor-pointer line-clamp-2"
                        >
                          {product.title}
                        </h3>

                        {/* Price Display */}
                        <div>
                          {product.discountPrice ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-extrabold text-emerald-800 font-serif">
                                Rp {product.discountPrice.toLocaleString('id-ID')}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                Rp {product.price.toLocaleString('id-ID')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-extrabold text-emerald-800 font-serif">
                              Rp {product.price.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>

                        {/* Specs row */}
                        <div className="text-[11px] text-gray-600 space-y-2 leading-relaxed bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                          <p className="truncate flex items-center gap-1.5">
                            <span className="font-bold text-gray-700">Penjual:</span>
                            <span className="font-semibold text-emerald-900 flex items-center gap-1 truncate">
                              <img src={product.organizationLogo} alt="" className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                              {product.organizationName}
                            </span>
                          </p>
                          <p className="truncate">
                            <span className="font-bold text-gray-700">
                              {product.isPremiumUnik ? 'Lokasi Kandang VIP:' : 'Lokasi Provinsi:'}
                            </span>{' '}
                            {product.isPremiumUnik && product.locationDetails
                              ? `${product.locationDetails}, ${product.province}`
                              : product.province}
                          </p>
                          <p className="truncate">
                            <span className="font-bold text-gray-700">SKKH:</span> {product.healthCertNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer CTAs */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Detail
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Beli
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
