import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Phone, MapPin, Award, CheckCircle2, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedOrg, organizations } = useApp();

  const handleOrgClick = (orgId: string) => {
    setSelectedOrg(orgId);
    setActiveView('marketplace');
  };

  return (
    <footer className="bg-emerald-950 text-emerald-200 border-t border-emerald-800/90 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-emerald-800/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('home')}>
              <div className="bg-amber-500 p-2 rounded-xl text-emerald-950 font-bold shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base text-white font-serif tracking-tight">KURBAN NASIONAL</span>
                <p className="text-[10px] text-emerald-300 font-medium">PT Distribusi Kurban Nasional</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-emerald-300/90 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Jl. Legoso Raya, Pisangan, Kec. Ciputat Tim., Kota Tangerang Selatan, Banten 15446</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Hotline Kurban: 082125382809 (WhatsApp)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@kurbannasional.com • mitra@kurbannasional.com</span>
              </div>
            </div>
          </div>

          {/* Lembaga & Mitra (Clickable filter to Marketplace) */}
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider border-b border-emerald-800 pb-1.5">
              Lembaga Terverifikasi
            </h4>
            <p className="text-[11px] text-emerald-300/80">
              Klik nama lembaga untuk melihat katalog kurban:
            </p>
            <ul className="space-y-2 text-xs">
              {organizations && organizations.length > 0 ? (
                organizations.map((org) => (
                  <li key={org.id}>
                    <button
                      onClick={() => handleOrgClick(org.id)}
                      className="flex items-center gap-2 text-emerald-200 hover:text-amber-300 font-medium transition-colors text-left group cursor-pointer"
                    >
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-5 h-5 rounded-full object-cover shrink-0 border border-amber-400/50 group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                      )}
                      <span className="underline-offset-2 group-hover:underline">{org.name}</span>
                    </button>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <button onClick={() => handleOrgClick('Dompet Dhuafa')} className="flex items-center gap-2 text-emerald-200 hover:text-amber-300 font-medium transition-colors text-left group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&auto=format&fit=crop&q=80" alt="" className="w-5 h-5 rounded-full object-cover border border-amber-400/50" />
                      <span className="underline-offset-2 group-hover:underline">Dompet Dhuafa</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleOrgClick('Rumah Zakat')} className="flex items-center gap-2 text-emerald-200 hover:text-amber-300 font-medium transition-colors text-left group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=100&auto=format&fit=crop&q=80" alt="" className="w-5 h-5 rounded-full object-cover border border-amber-400/50" />
                      <span className="underline-offset-2 group-hover:underline">Rumah Zakat</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleOrgClick('Lazismu')} className="flex items-center gap-2 text-emerald-200 hover:text-amber-300 font-medium transition-colors text-left group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=100&auto=format&fit=crop&q=80" alt="" className="w-5 h-5 rounded-full object-cover border border-amber-400/50" />
                      <span className="underline-offset-2 group-hover:underline">Lazismu (Muhammadiyah)</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleOrgClick('LAZISNU')} className="flex items-center gap-2 text-emerald-200 hover:text-amber-300 font-medium transition-colors text-left group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&auto=format&fit=crop&q=80" alt="" className="w-5 h-5 rounded-full object-cover border border-amber-400/50" />
                      <span className="underline-offset-2 group-hover:underline">NU Care - LAZISNU</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleOrgClick('Human Initiative')} className="flex items-center gap-2 text-emerald-200 hover:text-amber-300 font-medium transition-colors text-left group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&auto=format&fit=crop&q=80" alt="" className="w-5 h-5 rounded-full object-cover border border-amber-400/50" />
                      <span className="underline-offset-2 group-hover:underline">Human Initiative</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleOrgClick('BAZNAS')} className="flex items-center gap-2 text-emerald-200 hover:text-amber-300 font-medium transition-colors text-left group cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=100&auto=format&fit=crop&q=80" alt="" className="w-5 h-5 rounded-full object-cover border border-amber-400/50" />
                      <span className="underline-offset-2 group-hover:underline">BAZNAS RI</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legalitas & Keamanan */}
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider border-b border-emerald-800 pb-1.5">
              Keamanan & Legalitas
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-800">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Izin Resmi Kemenag
                </p>
                <p className="text-[11px] text-emerald-300/90 mt-0.5">
                  Mitra Resmi Penyelenggara Zakat & Kurban SK Kemenag RI.
                </p>
              </div>

              <div className="bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-800">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Midtrans Secured
                </p>
                <p className="text-[11px] text-emerald-300/90 mt-0.5">
                  Sistem pembayaran terenkripsi QRIS, VA, dan E-Wallet 24/7.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & status pill */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-emerald-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <p>© 2026 PT Distribusi Kurban Nasional (kurbannasional.com). Hak Cipta Dilindungi.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 font-medium">
            <button onClick={() => setActiveView('about')} className="hover:text-amber-300 transition-colors text-white font-bold">Tentang Kami</button>
            <span>•</span>
            <button onClick={() => setActiveView('faq')} className="hover:text-amber-300 transition-colors text-white font-bold">FAQ</button>
            <span>•</span>
            <button onClick={() => setActiveView('contact')} className="hover:text-amber-300 transition-colors text-white font-bold">Kontak</button>
            <span>•</span>
            <button onClick={() => setActiveView('about')} className="hover:text-amber-300 transition-colors">Kebijakan Privasi</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
