import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProvinceStat } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { MapPin, Filter, Users, Home, TrendingUp, Info, CheckCircle2, ShieldCheck, Star, AlertCircle } from 'lucide-react';

export const IndonesiaMap: React.FC = () => {
  const { provinces, setSelectedProvince, setActiveView } = useApp();

  const [selectedYear, setSelectedYear] = useState<number>(2027); // Default to 2027 projection or 2026
  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState<'all' | 'sapi' | 'kambing' | 'domba'>('all');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [activeProvince, setActiveProvince] = useState<ProvinceStat>(provinces[9] || provinces[0]); // Default Jawa Barat
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceStat | null>(null);

  // Year multiplier for backwards historical years (2024-2026)
  const yearMultiplier = selectedYear === 2026 ? 1.0 : selectedYear === 2025 ? 0.92 : selectedYear === 2024 ? 0.85 : 1.065; // 2027 is 1.065x projection

  // Filter provinces by region if selected
  const filteredProvinces = selectedRegionFilter === 'all'
    ? provinces
    : provinces.filter((p) => p.region === selectedRegionFilter);

  const handleProvinceClick = (prov: ProvinceStat) => {
    setActiveProvince(prov);
  };

  const handleGoToMarketplaceWithProv = (provName: string) => {
    setSelectedProvince(provName);
    setActiveView('marketplace');
  };

  // Helper to calculate animal count for a province given filters
  const getAnimalCount = (prov: ProvinceStat) => {
    if (selectedYear === 2027 && prov.stock2027) {
      if (selectedAnimalFilter === 'sapi') return prov.stock2027.sapiCount;
      if (selectedAnimalFilter === 'kambing') return prov.stock2027.kambingCount;
      if (selectedAnimalFilter === 'domba') return prov.stock2027.dombaCount;
      return prov.stock2027.totalStock;
    }

    const sapi = Math.round(prov.sapiCount * yearMultiplier);
    const kambing = Math.round(prov.kambingCount * yearMultiplier);
    const domba = Math.round(prov.dombaCount * yearMultiplier);

    if (selectedAnimalFilter === 'sapi') return sapi;
    if (selectedAnimalFilter === 'kambing') return kambing;
    if (selectedAnimalFilter === 'domba') return domba;
    return sapi + kambing + domba;
  };

  // Compute National Summary Totals
  const nationalTotal2027 = provinces.reduce((acc, p) => acc + (p.stock2027?.totalStock || Math.round(p.totalAnimalCount * 1.065)), 0);
  const nationalSapi2027 = provinces.reduce((acc, p) => acc + (p.stock2027?.sapiCount || Math.round(p.sapiCount * 1.065)), 0);
  const nationalKambing2027 = provinces.reduce((acc, p) => acc + (p.stock2027?.kambingCount || Math.round(p.kambingCount * 1.065)), 0);
  const nationalDomba2027 = provinces.reduce((acc, p) => acc + (p.stock2027?.dombaCount || Math.round(p.dombaCount * 1.065)), 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-amber-600" /> Peta Live Sebaran 38 Provinsi
            </span>
            <span className="text-xs text-gray-400">• Data Terintegrasi SIHNAN Kementan RI</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-serif text-gray-900 mt-1.5">
            Peta Sebaran & Stok Hewan Kurban Indonesia
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Pantau titik sebaran hewan kurban live, kesiapan stok kandang, dan peta distribusi penerima manfaat kurban nasional.
          </p>
        </div>

        {/* Year & Animal Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Year Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-bold px-2 text-[11px]">Tahun:</span>
            {[2024, 2025, 2026].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedYear === yr
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
            {/* 2027 PROJECTION YEAR BUTTON */}
            <button
              onClick={() => setSelectedYear(2027)}
              className={`px-3 py-1.5 rounded-xl font-black transition-all flex items-center gap-1.5 ${
                selectedYear === 2027
                  ? 'bg-amber-500 text-emerald-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-bold'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-700 fill-amber-500" />
              <span>2027 (Stok Proyeksi)</span>
            </button>
          </div>

          {/* Animal Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
            {(['all', 'sapi', 'kambing', 'domba'] as const).map((animal) => (
              <button
                key={animal}
                onClick={() => setSelectedAnimalFilter(animal)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all capitalize ${
                  selectedAnimalFilter === animal
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {animal === 'all' ? 'Semua Jenis' : animal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2027 PROJECTION BANNER NOTIFICATION */}
      {selectedYear === 2027 && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl border border-amber-400/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3" /> Proyeksi Stok Hewan 2027
              </span>
              <span className="text-xs text-amber-300 font-semibold">Tahun Iduladha 1448 H</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Data estimasi ketersediaan stok hewan kurban nasional tahun <strong className="text-amber-300 font-extrabold">2027</strong> berbasis survei populasi peternakan & kualifikasi SKKH Kementan RI.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-700/80 shrink-0 w-full sm:w-auto text-xs">
            <div>
              <span className="text-[10px] text-emerald-300 block uppercase font-bold">Stok Sapi 2027</span>
              <span className="font-extrabold text-amber-300"><AnimatedCounter value={nationalSapi2027} /></span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 block uppercase font-bold">Stok Kambing</span>
              <span className="font-extrabold text-white"><AnimatedCounter value={nationalKambing2027} /></span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 block uppercase font-bold">Stok Domba</span>
              <span className="font-extrabold text-white"><AnimatedCounter value={nationalDomba2027} /></span>
            </div>
          </div>
        </div>
      )}

      {/* Region Category Chips Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 font-bold shrink-0 text-[11px]">Filter Pulau:</span>
        {[
          { key: 'all', label: 'Semua 38 Provinsi' },
          { key: 'Sumatera', label: 'Sumatera' },
          { key: 'Jawa', label: 'Jawa & Banten' },
          { key: 'Kalimantan', label: 'Kalimantan' },
          { key: 'Sulawesi', label: 'Sulawesi' },
          { key: 'Nusa Tenggara', label: 'Bali & Nusa Tenggara' },
          { key: 'Maluku', label: 'Maluku' },
          { key: 'Papua', label: 'Papua' },
        ].map((reg) => (
          <button
            key={reg.key}
            onClick={() => setSelectedRegionFilter(reg.key)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedRegionFilter === reg.key
                ? 'bg-amber-500 text-emerald-950 shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {reg.label}
          </button>
        ))}
      </div>

      {/* Main Map + Detail Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* INTERACTIVE VECTOR SVG MAP CONTAINER */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-5 text-white relative min-h-[460px] flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none"></div>

          {/* Top Bar inside Map */}
          <div className="flex justify-between items-center z-10 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                Sebaran Live Peta Indonesia • {selectedYear === 2027 ? 'Proyeksi Stok 2027' : `Data ${selectedYear}`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="bg-emerald-900/90 text-emerald-200 font-bold px-2.5 py-1 rounded-full border border-emerald-700/60">
                Total: <AnimatedCounter value={nationalTotal2027} /> Ekor
              </span>
            </div>
          </div>

          {/* SVG GEOGRAPHIC INDONESIA ISLAND ARCHIPELAGO ARTWORK */}
          <div className="relative my-4 w-full h-[320px] sm:h-[360px] z-10 flex items-center justify-center overflow-hidden">
            
            {/* SVG Background Map Contour Artwork */}
            <svg viewBox="0 0 800 380" className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] opacity-90">
              <defs>
                <linearGradient id="islandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#065f46" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. SUMATERA ISLAND SHAPE */}
              <path
                d="M 50,70 L 110,110 L 170,180 L 220,240 L 200,260 L 150,220 L 100,160 L 40,90 Z"
                fill="url(#islandGrad)"
                stroke="#10b981"
                strokeWidth="1.5"
                className="transition-all hover:fill-emerald-800 cursor-pointer"
              />

              {/* 2. JAWA ISLAND SHAPE */}
              <path
                d="M 230,270 L 320,272 L 390,275 L 430,273 L 435,285 L 350,288 L 235,282 Z"
                fill="url(#islandGrad)"
                stroke="#10b981"
                strokeWidth="1.5"
                className="transition-all hover:fill-emerald-800 cursor-pointer"
              />

              {/* 3. BALI & NUSA TENGGARA ISLAND SHAPE */}
              <path
                d="M 440,285 L 460,286 L 485,287 L 530,290 L 560,292 L 560,298 L 440,290 Z"
                fill="url(#islandGrad)"
                stroke="#10b981"
                strokeWidth="1.5"
              />

              {/* 4. KALIMANTAN ISLAND SHAPE */}
              <path
                d="M 270,120 L 380,110 L 410,160 L 390,210 L 320,215 L 280,180 Z"
                fill="url(#islandGrad)"
                stroke="#10b981"
                strokeWidth="1.5"
                className="transition-all hover:fill-emerald-800 cursor-pointer"
              />

              {/* 5. SULAWESI ISLAND SHAPE */}
              <path
                d="M 450,140 L 520,135 L 530,165 L 480,175 L 510,210 L 470,225 L 460,170 Z"
                fill="url(#islandGrad)"
                stroke="#10b981"
                strokeWidth="1.5"
                className="transition-all hover:fill-emerald-800 cursor-pointer"
              />

              {/* 6. MALUKU ISLANDS */}
              <path
                d="M 570,140 L 610,135 L 620,170 L 580,210 Z"
                fill="url(#islandGrad)"
                stroke="#10b981"
                strokeWidth="1.5"
              />

              {/* 7. PAPUA ISLAND SHAPE */}
              <path
                d="M 630,160 L 690,140 L 770,170 L 760,230 L 680,220 L 640,190 Z"
                fill="url(#islandGrad)"
                stroke="#10b981"
                strokeWidth="1.5"
                className="transition-all hover:fill-emerald-800 cursor-pointer"
              />
            </svg>

            {/* LIVE DYNAMIC PROVINCE PINS OVERLAYED ON MAP */}
            {filteredProvinces.map((prov) => {
              const animalCount = getAnimalCount(prov);
              const isSelected = activeProvince.id === prov.id;
              const isHovered = hoveredProvince?.id === prov.id;

              return (
                <div
                  key={prov.id}
                  style={{
                    left: `${prov.mapX}%`,
                    top: `${prov.mapY}%`,
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
                  onMouseEnter={() => setHoveredProvince(prov)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  onClick={() => handleProvinceClick(prov)}
                >
                  {/* Glowing Pulse for Selected / High Density */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-full bg-amber-400 opacity-75 animate-ping"></span>
                  )}

                  <button
                    className={`relative flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black transition-all shadow-lg ${
                      isSelected
                        ? 'bg-amber-400 text-emerald-950 scale-125 ring-2 ring-white z-30'
                        : isHovered
                        ? 'bg-emerald-500 text-white scale-110 z-20'
                        : 'bg-emerald-900/90 text-emerald-100 border border-emerald-500/60 hover:bg-emerald-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-emerald-950' : 'bg-amber-400'
                      }`}
                    ></span>
                    <span className="hidden sm:inline">{prov.code}</span>
                    <span className="text-[9px] font-extrabold">
                      {(animalCount / 1000).toFixed(1)}k
                    </span>
                  </button>

                  {/* HOVER TOOLTIP OVERLAY */}
                  {isHovered && (
                    <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 bg-emerald-950 text-white p-3 rounded-2xl shadow-2xl border border-amber-400/80 w-48 z-50 pointer-events-none text-left animate-fade-in">
                      <div className="flex items-center justify-between border-b border-emerald-800 pb-1 mb-1">
                        <span className="font-extrabold text-amber-300 text-xs">{prov.name}</span>
                        <span className="text-[9px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded font-bold">
                          {prov.region}
                        </span>
                      </div>
                      <div className="text-[10px] space-y-0.5 text-slate-200">
                        <p className="flex justify-between">
                          <span>Stok {selectedYear}:</span>
                          <strong className="text-white">{animalCount.toLocaleString('id-ID')} Ekor</strong>
                        </p>
                        {selectedYear === 2027 && prov.stock2027 && (
                          <p className="flex justify-between text-emerald-300">
                            <span>Kesiapan Kandang:</span>
                            <strong>{prov.stock2027.readinessPercent}%</strong>
                          </p>
                        )}
                        <p className="flex justify-between text-slate-400">
                          <span>Penerima Manfaat:</span>
                          <span>{prov.beneficiariesCount.toLocaleString('id-ID')}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map Footer Info */}
          <div className="z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Klik pada titik pin provinsi untuk menampilkan rincian stok lengkap.</span>
            </div>
            <button
              onClick={() => setActiveView('national-dashboard')}
              className="text-amber-300 hover:underline font-bold flex items-center gap-1"
            >
              Buka Center Data Agregasi →
            </button>
          </div>
        </div>

        {/* SELECTED PROVINCE DEEP-DIVE DETAILS PANEL */}
        <div className="lg:col-span-4 bg-emerald-50/80 rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-md space-y-5">
          
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-extrabold block">
                Detail Lokasi Provinsi
              </span>
              <h4 className="text-2xl font-black font-serif text-emerald-950 mt-0.5">
                {activeProvince.name}
              </h4>
              <span className="text-xs text-emerald-800 font-bold">Region: {activeProvince.region}</span>
            </div>
            <span className="bg-emerald-900 text-amber-300 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-xs">
              Kode: {activeProvince.code}
            </span>
          </div>

          {/* 2027 Stock Readiness Status if 2027 Selected */}
          {selectedYear === 2027 && activeProvince.stock2027 && (
            <div className="bg-emerald-900 text-white p-3.5 rounded-2xl border border-amber-400/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Kesiapan Pasokan 2027
                </span>
                <span className="bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded text-[10px]">
                  {activeProvince.stock2027.readinessPercent}% SIAP
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                Stok kandang mitra peternak terverifikasi sehat, divaksin PMK & LSD, serta siap distribusi Iduladha 1448 H.
              </p>
            </div>
          )}

          {/* Animal Breakdown Stock Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-950">
                Data Stok Hewan ({selectedYear})
              </span>
              <span className="text-[11px] text-emerald-800 font-bold">
                Total: <AnimatedCounter value={getAnimalCount(activeProvince)} /> Ekor
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-center shadow-2xs">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Sapi</p>
                <p className="text-base font-black text-emerald-900 mt-0.5">
                  <AnimatedCounter value={selectedYear === 2027 && activeProvince.stock2027
                    ? activeProvince.stock2027.sapiCount
                    : Math.round(activeProvince.sapiCount * yearMultiplier)
                  } />
                </p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-center shadow-2xs">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Kambing</p>
                <p className="text-base font-black text-emerald-900 mt-0.5">
                  <AnimatedCounter value={selectedYear === 2027 && activeProvince.stock2027
                    ? activeProvince.stock2027.kambingCount
                    : Math.round(activeProvince.kambingCount * yearMultiplier)
                  } />
                </p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-center shadow-2xs">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Domba</p>
                <p className="text-base font-black text-emerald-900 mt-0.5">
                  <AnimatedCounter value={selectedYear === 2027 && activeProvince.stock2027
                    ? activeProvince.stock2027.dombaCount
                    : Math.round(activeProvince.dombaCount * yearMultiplier)
                  } />
                </p>
              </div>
            </div>
          </div>

          {/* Beneficiaries & Coverage */}
          <div className="space-y-2.5 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase">Estimasi Penerima Manfaat</p>
                  <p className="font-extrabold text-gray-900 text-sm">
                    <AnimatedCounter value={Math.round(activeProvince.beneficiariesCount * (selectedYear === 2027 ? 1.065 : yearMultiplier))} /> Orang
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-xl text-amber-800">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase">Cakupan Wilayah Sasaran</p>
                  <p className="font-bold text-gray-900 text-xs">
                    {activeProvince.villagesCount} Desa • {activeProvince.districtsCount} Kecamatan
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleGoToMarketplaceWithProv(activeProvince.name)}
            className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-black py-3 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Cari Hewan Kurban di {activeProvince.name}</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </div>
  );
};
