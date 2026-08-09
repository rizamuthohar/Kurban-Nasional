import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnimatedCounter } from './AnimatedCounter';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, Download, FileSpreadsheet, Building2, Users, ShieldCheck, MapPin, Database, Star, Filter, CheckCircle2, Activity, PieChart, Layers, Scale, HeartHandshake } from 'lucide-react';

const multiYearDataRaw = [
  {
    year: '2022',
    sapiKementan: 510000,
    kambingDombaKementan: 1170000,
    sapiLembaga: 410000,
    kambingDombaLembaga: 940000,
  },
  {
    year: '2023',
    sapiKementan: 560000,
    kambingDombaKementan: 1270000,
    sapiLembaga: 450000,
    kambingDombaLembaga: 1020000,
  },
  {
    year: '2024',
    sapiKementan: 610000,
    kambingDombaKementan: 1340000,
    sapiLembaga: 490000,
    kambingDombaLembaga: 1100000,
  },
  {
    year: '2025',
    sapiKementan: 650000,
    kambingDombaKementan: 1410000,
    sapiLembaga: 520000,
    kambingDombaLembaga: 1160000,
  },
  {
    year: '2026',
    sapiKementan: 729700,
    kambingDombaKementan: 1568800,
    sapiLembaga: 582100,
    kambingDombaLembaga: 1260400,
  },
  {
    year: '2027 (Proyeksi)',
    sapiKementan: 770000,
    kambingDombaKementan: 1650000,
    sapiLembaga: 630000,
    kambingDombaLembaga: 1350000,
  },
];

export const NationalDashboard: React.FC = () => {
  const { nationalSummary, updateNationalSummary, provinces } = useApp();
  const [datasetFilter, setDatasetFilter] = useState<'all' | 'kementan' | 'lembaga'>('all');
  const [selectedAnimalChart, setSelectedAnimalChart] = useState<'all' | 'sapi' | 'kambing' | 'domba'>('all');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [selectedRegionTable, setSelectedRegionTable] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const activeYear = nationalSummary.kementanStock?.year || nationalSummary.currentYear || 2026;
  const isPostIduladha = nationalSummary.lembagaRealization?.isConsolidatedCurrentYear ?? (nationalSummary.consolidationPhase === 'post_iduladha');

  const kementan = nationalSummary.kementanStock || {
    year: activeYear,
    totalStock: nationalSummary.totalAnimals || 2298500,
    sapiStock: nationalSummary.totalSapi || 729700,
    kambingStock: nationalSummary.totalKambing || 952200,
    dombaStock: nationalSummary.totalDomba || 616600,
    readinessPercent: 98.6,
    lastUpdated: nationalSummary.lastUpdatedFromKementan || '03 Agustus 2026 (Ditjen PKH Kementan RI)',
  };

  const lembaga = nationalSummary.lembagaRealization || {
    year: isPostIduladha ? activeYear : (activeYear - 1),
    isConsolidatedCurrentYear: isPostIduladha,
    stageLabel: isPostIduladha ? `Pasca Pelaksanaan ${activeYear}` : `Sebelum Iduladha (Data ${activeYear - 1})`,
    totalRealizedAnimals: 1842500,
    realizedSapi: 582100,
    realizedKambing: 765400,
    realizedDomba: 495000,
    totalTonMeatDistributed: nationalSummary.totalTonMeatDistributed || 42150,
    totalBeneficiaries: nationalSummary.totalBeneficiaries || 8633600,
    totalBuyers: nationalSummary.totalBuyers || 184500,
    totalReportingOrgs: nationalSummary.totalOrganizations || 112,
    lastUpdated: '08 Agustus 2026 (Konsolidasi Input 112 Lembaga & BAZNAS)',
  };

  const percentRealizedOfStock = Math.round((lembaga.totalRealizedAnimals / kementan.totalStock) * 100);

  // Dynamically compute chart data according to active animal filter (Sapi / Kambing & Domba / Semua Ekor)
  const chartData = multiYearDataRaw.map((item) => {
    const is2026 = item.year === '2026';
    const sapiKementan = is2026 ? kementan.sapiStock : item.sapiKementan;
    const kambingDombaKementan = is2026 ? (kementan.kambingStock + kementan.dombaStock) : item.kambingDombaKementan;
    const sapiLembaga = is2026 ? lembaga.realizedSapi : item.sapiLembaga;
    const kambingDombaLembaga = is2026 ? (lembaga.realizedKambing + lembaga.realizedDomba) : item.kambingDombaLembaga;

    let stokVal = sapiKementan + kambingDombaKementan;
    let realisasiVal = sapiLembaga + kambingDombaLembaga;

    if (selectedAnimalChart === 'sapi') {
      stokVal = sapiKementan;
      realisasiVal = sapiLembaga;
    } else if (selectedAnimalChart === 'kambing' || selectedAnimalChart === 'domba') {
      stokVal = kambingDombaKementan;
      realisasiVal = kambingDombaLembaga;
    }

    return {
      year: item.year,
      StokKementan: stokVal,
      RealisasiLembaga: realisasiVal,
    };
  });

  const handleExport = (type: 'pdf' | 'excel') => {
    setExportNotice(`File Laporan_Dual_Data_Kurban_Nasional_2026.${type === 'pdf' ? 'pdf' : 'xlsx'} berhasil di-generate.`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Filter provinces for the 38 Provinsi Table
  const filteredProvincesTable = provinces.filter((prov) => {
    const matchesSearch = prov.name.toLowerCase().includes(provinceSearch.toLowerCase()) ||
                          prov.code.toLowerCase().includes(provinceSearch.toLowerCase());
    const matchesRegion = selectedRegionTable === 'all' || prov.region === selectedRegionTable;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title & Export Actions */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-400 text-emerald-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 fill-emerald-950" /> National Data Integration Hub
              </span>
              <span className="text-xs text-emerald-200 font-medium bg-emerald-800/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                Kementan RI & BAZNAS Synchronized
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight">
              Dashboard Statistik & Dual Data Kurban Nasional (2026)
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl mt-2 leading-relaxed">
              Integrasi dua sumber data utama kurban Indonesia (Tahun 2026): <strong>[Data 1] Stok Hewan Resmi Kementan RI (2026)</strong> berdasarkan laporan 38 provinsi, dan <strong>[Data 2] Realisasi Pelaksanaan Kurban (2026)</strong> yang diinput oleh 112 Lembaga terverifikasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleExport('pdf')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl border border-white/20 text-xs backdrop-blur transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-300" />
              Download PDF Dual Data (2026)
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel (.xlsx 2026)
            </button>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="mt-4 bg-emerald-900/90 border border-amber-400/60 p-3 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* Dataset Filter Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-emerald-800" />
            <span>Pengaturan Simulasi Data Agregasi Nasional:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            {/* Year Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase px-2 font-bold">Tahun Berjalan:</span>
              <button
                onClick={() => updateNationalSummary({ currentYear: 2026 })}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeYear === 2026 ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2026
              </button>
              <button
                onClick={() => updateNationalSummary({ currentYear: 2027 })}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeYear === 2027 ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2027
              </button>
            </div>

            {/* Iduladha Consolidation Phase Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase px-2 font-bold">Status Data 2:</span>
              <button
                onClick={() => updateNationalSummary({ consolidationPhase: 'pre_iduladha' })}
                className={`px-3 py-1 rounded-lg transition-all ${
                  !isPostIduladha ? 'bg-amber-800 text-amber-100 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sebelum Iduladha (Data {activeYear - 1})
              </button>
              <button
                onClick={() => updateNationalSummary({ consolidationPhase: 'post_iduladha' })}
                className={`px-3 py-1 rounded-lg transition-all ${
                  isPostIduladha ? 'bg-blue-800 text-blue-100 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pasca Konsolidasi ({activeYear})
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setDatasetFilter('all')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              datasetFilter === 'all'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Sandingkan Dual Data (Stok & Realisasi)
          </button>

          <button
            onClick={() => setDatasetFilter('kementan')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              datasetFilter === 'kementan'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            Data 1: Stok Kementan ({activeYear})
          </button>

          <button
            onClick={() => setDatasetFilter('lembaga')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              datasetFilter === 'lembaga'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-300" />
            Data 2: Realisasi ({lembaga.year})
          </button>
        </div>
      </div>

      {/* Info Notice Banner on Business Rules */}
      {!isPostIduladha && (
        <div className="bg-amber-50 border border-amber-300/80 p-3.5 rounded-2xl text-amber-900 text-xs flex items-start gap-3 shadow-xs">
          <Activity className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-amber-950">Aturan Tampilan Data 2 (Sebelum Pelaksanaan Iduladha):</strong>
            <span>
              Mengingat pelaksanaan Iduladha tahun {activeYear} belum dilaksanakan/dikonsolidasi, Data 2 saat ini menampilkan <strong>Data Realisasi Tahun Sebelumnya ({activeYear - 1})</strong>. Setelah hari pemotongan dan seluruh 112 lembaga mengonsolidasi data kurbannya, Data 2 akan otomatis berganti menjadi <strong>Data Realisasi Tahun Berjalan ({activeYear})</strong>.
            </span>
          </div>
        </div>
      )}

      {/* DUAL DATA HIGHLIGHT PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DATA 1: KEMENTAN OFFICIAL ANIMAL STOCK */}
        {(datasetFilter === 'all' || datasetFilter === 'kementan') && (
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-6 text-white shadow-xl border border-emerald-800 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-800/80 rounded-xl text-amber-300 border border-emerald-700/50">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                      DATA 1 • KEMENTERIAN PERTANIAN RI ({activeYear})
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white">
                      Stok Hewan Kurban Nasional ({activeYear})
                    </h3>
                  </div>
                </div>
                <span className="bg-emerald-800 text-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-700">
                  Stok Tahun Berjalan ({activeYear})
                </span>
              </div>

              <div>
                <div className="text-3xl font-black font-serif text-amber-300 tracking-tight">
                  <AnimatedCounter value={kementan.totalStock} /> <span className="text-xs text-emerald-200 font-sans font-normal">ekor siap kurban ({activeYear})</span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-1">
                  Kesiapan Kesehatan Veteriner & SKKH ({activeYear}): <strong className="text-amber-300">{kementan.readinessPercent}% Terverifikasi Sehat</strong>
                </p>
              </div>

              {/* Animal Breakdown Pills */}
              <div className="grid grid-cols-3 gap-2 bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800/60 text-xs">
                <div className="bg-emerald-950/80 p-2 rounded-xl text-center">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Sapi ({activeYear})</div>
                  <div className="font-extrabold text-white text-sm mt-0.5"><AnimatedCounter value={kementan.sapiStock} /></div>
                </div>
                <div className="bg-emerald-950/80 p-2 rounded-xl text-center">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Kambing ({activeYear})</div>
                  <div className="font-extrabold text-white text-sm mt-0.5"><AnimatedCounter value={kementan.kambingStock} /></div>
                </div>
                <div className="bg-emerald-950/80 p-2 rounded-xl text-center">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Domba ({activeYear})</div>
                  <div className="font-extrabold text-white text-sm mt-0.5"><AnimatedCounter value={kementan.dombaStock} /></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-800/60 text-[11px] text-emerald-200/80 flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Ditjen PKH Kementan RI
              </span>
              <span className="italic">{kementan.lastUpdated}</span>
            </div>
          </div>
        )}

        {/* DATA 2: LEMBAGA EXECUTION REALIZATION */}
        {(datasetFilter === 'all' || datasetFilter === 'lembaga') && (
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-blue-900/80 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between border-b border-blue-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-900/80 rounded-xl text-blue-300 border border-blue-700/50">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-300 tracking-wider">
                      DATA 2 • REALISASI {isPostIduladha ? 'TAHUN BERJALAN' : 'TAHUN SEBELUMNYA'} ({lembaga.year})
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white">
                      Realisasi Pelaksanaan Kurban ({lembaga.year})
                    </h3>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isPostIduladha ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-amber-950 text-amber-300 border-amber-800'}`}>
                  {isPostIduladha ? `Pasca Iduladha ${lembaga.year}` : `Sebelum Iduladha (Data ${lembaga.year})`}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black font-serif text-blue-300 tracking-tight">
                    <AnimatedCounter value={lembaga.totalRealizedAnimals} /> <span className="text-xs text-blue-200 font-sans font-normal">ekor tersembelih ({lembaga.year})</span>
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black px-2 py-0.5 rounded-md">
                    {percentRealizedOfStock}% Absorpsi
                  </span>
                </div>
                <p className="text-xs text-blue-200/90 mt-1">
                  Telah Menjangkau <strong className="text-white"><AnimatedCounter value={lembaga.totalBeneficiaries} /> Jiwa</strong> Penerima Manfaat ({lembaga.year})
                </p>
              </div>

              {/* Realization Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-blue-950/60 p-3 rounded-2xl border border-blue-900/60 text-xs">
                <div className="bg-slate-900/80 p-2 rounded-xl text-center">
                  <div className="text-[10px] text-blue-300 font-bold uppercase">Sapi Terpotong ({lembaga.year})</div>
                  <div className="font-extrabold text-white text-sm mt-0.5"><AnimatedCounter value={lembaga.realizedSapi} /></div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl text-center">
                  <div className="text-[10px] text-blue-300 font-bold uppercase">Kambing/Domba ({lembaga.year})</div>
                  <div className="font-extrabold text-white text-sm mt-0.5"><AnimatedCounter value={lembaga.realizedKambing + lembaga.realizedDomba} /></div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl text-center">
                  <div className="text-[10px] text-amber-300 font-bold uppercase">Daging (Ton {lembaga.year})</div>
                  <div className="font-extrabold text-amber-300 text-sm mt-0.5"><AnimatedCounter value={lembaga.totalTonMeatDistributed} /> T</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-900/60 text-[11px] text-blue-200/80 flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono">
                <HeartHandshake className="w-3.5 h-3.5 text-blue-400" /> Total Shohibul ({lembaga.year}): <AnimatedCounter value={lembaga.totalBuyers} /> Pekurban
              </span>
              <span className="italic">{lembaga.lastUpdated}</span>
            </div>
          </div>
        )}

      </div>

      {/* DUAL DATA KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Stok Kementan Sapi (2026)</div>
          <div className="text-xl font-black text-emerald-950 font-serif">
            <AnimatedCounter value={kementan.sapiStock} />
          </div>
          <p className="text-[10px] text-emerald-800 font-bold">Populasi Siap Potong (2026)</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Realisasi Sapi Lembaga (2026)</div>
          <div className="text-xl font-black text-blue-900 font-serif">
            <AnimatedCounter value={lembaga.realizedSapi} />
          </div>
          <p className="text-[10px] text-blue-700 font-bold">{Math.round((lembaga.realizedSapi / kementan.sapiStock) * 100)}% Terpotong (2026)</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Stok Kambing/Domba (2026)</div>
          <div className="text-xl font-black text-emerald-950 font-serif">
            <AnimatedCounter value={kementan.kambingStock + kementan.dombaStock} />
          </div>
          <p className="text-[10px] text-emerald-800 font-bold">Resmi Kementan (2026)</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Realisasi Kambing/Domba (2026)</div>
          <div className="text-xl font-black text-blue-900 font-serif">
            <AnimatedCounter value={lembaga.realizedKambing + lembaga.realizedDomba} />
          </div>
          <p className="text-[10px] text-blue-700 font-bold">Input 112 Lembaga (2026)</p>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Shohibul / Pekurban (2026)</div>
          <div className="text-xl font-black text-emerald-950 font-serif">
            <AnimatedCounter value={lembaga.totalBuyers} />
          </div>
          <p className="text-[10px] text-slate-600 font-semibold">Pekurban Terverifikasi (2026)</p>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Penerima Manfaat (2026)</div>
          <div className="text-xl font-black text-emerald-950 font-serif">
            <AnimatedCounter value={lembaga.totalBeneficiaries} />
          </div>
          <p className="text-[10px] text-slate-600 font-semibold">Jiwa di 38 Provinsi (2026)</p>
        </div>

      </div>

      {/* 5-Year Trend Chart Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 text-emerald-950 text-[11px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Trend 5 Tahun (2022 - 2027 Proyeksi)
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Filter Aktif: <strong className="text-emerald-900 capitalize">{selectedAnimalChart === 'all' ? 'Semua Ekor (Sapi + Kambing + Domba)' : selectedAnimalChart === 'sapi' ? 'Khusus Hewan Sapi' : 'Khusus Kambing & Domba'}</strong>
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900">
              Grafik Perbandingan: Stok Kementan vs Realisasi Pelaksanaan Lembaga (2022 - 2027)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Perbandingan pertumbuhan data stok resmi pemerintah RI dengan realisasi pelaksanaan kurban oleh lembaga kurban nasional (periode tahun 2022 s.d. 2027).
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200 text-xs font-bold shrink-0">
            <span className="text-slate-500 px-2 text-[11px]">Filter Hewan:</span>
            <button
              onClick={() => setSelectedAnimalChart('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedAnimalChart === 'all' ? 'bg-emerald-900 text-white shadow-xs font-black' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semua Ekor
            </button>
            <button
              onClick={() => setSelectedAnimalChart('sapi')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedAnimalChart === 'sapi' ? 'bg-emerald-900 text-white shadow-xs font-black' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sapi
            </button>
            <button
              onClick={() => setSelectedAnimalChart('kambing')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedAnimalChart === 'kambing' ? 'bg-emerald-900 text-white shadow-xs font-black' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Kambing & Domba
            </button>
          </div>
        </div>

        {/* Recharts Bar Container */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="year" tickLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
              <YAxis tickLine={false} style={{ fontSize: '12px' }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(val: any, name: string) => [`${Number(val).toLocaleString('id-ID')} ekor`, name]} 
                labelFormatter={(label) => `Tahun ${label} • Filter: ${selectedAnimalChart === 'all' ? 'Semua Jenis Hewan' : selectedAnimalChart === 'sapi' ? 'Sapi' : 'Kambing & Domba'}`}
              />
              <Legend />
              <Bar dataKey="StokKementan" name="[Data 1] Stok Resmi Kementan" fill="#059669" radius={[6, 6, 0, 0]} />
              <Bar dataKey="RealisasiLembaga" name="[Data 2] Realisasi Input Lembaga" fill="#1e40af" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Provincial Dual Dataset Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-800" />
              Tabel Dual Data Kurban Per 38 Provinsi RI (2026)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Sinkronisasi Rincian Stok Resmi Kementan vs Realisasi Pemotongan Lembaga untuk tiap provinsi (Tahun 2026).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> {filteredProvincesTable.length} Provinsi Tampil (2026)
            </span>
          </div>
        </div>

        {/* Search & Region Filter Bar for Province Table */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari provinsi / kode..."
              value={provinceSearch}
              onChange={(e) => setProvinceSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-bold">
            <span className="text-slate-500 text-[11px] shrink-0">Wilayah:</span>
            {['all', 'Jawa', 'Sumatera', 'Sulawesi', 'Kalimantan', 'Nusa Tenggara', 'Maluku', 'Papua'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegionTable(reg)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                  selectedRegionTable === reg ? 'bg-emerald-950 text-white font-black' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {reg === 'all' ? 'Semua Wilayah' : reg}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <th className="py-3 px-3">Provinsi & Region</th>
                <th className="py-3 px-3 text-right bg-emerald-50 text-emerald-950 border-x border-emerald-100">
                  [Data 1] Stok Sapi (2026)
                </th>
                <th className="py-3 px-3 text-right bg-emerald-50 text-emerald-950 border-r border-emerald-100">
                  [Data 1] Kambing & Domba (2026)
                </th>
                <th className="py-3 px-3 text-right bg-emerald-100/60 text-emerald-950 border-r border-emerald-200 font-black">
                  Total Stok Kementan (2026)
                </th>
                <th className="py-3 px-3 text-right bg-blue-50 text-blue-950 border-r border-blue-100">
                  [Data 2] Realisasi Sapi (2026)
                </th>
                <th className="py-3 px-3 text-right bg-blue-50 text-blue-950 border-r border-blue-100">
                  [Data 2] Kambing & Domba (2026)
                </th>
                <th className="py-3 px-3 text-right bg-blue-100/60 text-blue-950 border-r border-blue-200 font-black">
                  Total Realisasi Lembaga (2026)
                </th>
                <th className="py-3 px-3 text-center">Persentase Absorpsi (2026)</th>
                <th className="py-3 px-3 text-right">Penerima Manfaat (2026)</th>
                <th className="py-3 px-3 text-center">Cakupan Wilayah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-slate-800">
              {filteredProvincesTable.map((prov) => {
                const stokSapi = prov.sapiCount;
                const stokKambingDomba = prov.kambingCount + prov.dombaCount;
                const stokTotal = prov.totalAnimalCount;

                const realizedSapi = prov.realizedSapiCount ?? Math.round(prov.sapiCount * 0.82);
                const realizedKambingDomba = (prov.realizedKambingCount ?? Math.round(prov.kambingCount * 0.82)) + (prov.realizedDombaCount ?? Math.round(prov.dombaCount * 0.82));
                const realizedTotal = prov.realizedTotalCount ?? (realizedSapi + realizedKambingDomba);

                const absorptionRate = Math.min(100, Math.round((realizedTotal / stokTotal) * 100));

                return (
                  <tr key={prov.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="bg-slate-200 text-slate-800 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">{prov.code}</span>
                        <span>{prov.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium ml-7">{prov.region}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-950 bg-emerald-50/30 border-x border-emerald-100/60">
                      {stokSapi.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-950 bg-emerald-50/30 border-r border-emerald-100/60">
                      {stokKambingDomba.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-950 bg-emerald-100/30 border-r border-emerald-200/60">
                      {stokTotal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-blue-950 bg-blue-50/30 border-r border-blue-100/60">
                      {realizedSapi.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-blue-950 bg-blue-50/30 border-r border-blue-100/60">
                      {realizedKambingDomba.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-blue-950 bg-blue-100/30 border-r border-blue-200/60">
                      {realizedTotal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-14 bg-slate-200 h-2 rounded-full overflow-hidden shrink-0">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${absorptionRate}%` }}
                          />
                        </div>
                        <span className="font-black text-[11px] text-emerald-950">{absorptionRate}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                      {prov.beneficiariesCount.toLocaleString('id-ID')} jiwa
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-500 text-[11px]">
                      {prov.villagesCount} Desa / {prov.districtsCount} Kec
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
