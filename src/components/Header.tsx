import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  User as UserIcon, 
  Star, 
  Menu, 
  X, 
  Building2, 
  BarChart2, 
  BookOpen, 
  Crown, 
  HelpCircle, 
  Phone, 
  Info,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    currentUser, 
    activeView, 
    setActiveView, 
    cart, 
    setIsCartOpen,
    setIsAiModalOpen,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleRoleChange = (newRole: 'guest' | 'pembeli' | 'penjual' | 'admin') => {
    setRole(newRole);
    setIsRoleDropdownOpen(false);
    if (newRole === 'penjual') setActiveView('seller-dashboard');
    else if (newRole === 'admin') setActiveView('admin-dashboard');
    else if (newRole === 'pembeli') setActiveView('buyer-dashboard');
    else setActiveView('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white text-slate-800 shadow-sm border-b border-slate-200/80">
      {/* Main Navbar - Dominant Clean White */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0" onClick={() => setActiveView('home')}>
            <div className="w-12 h-12">
                <img
                  src="/kurban.png"
                  alt="Kurban Nasional"
                  className="w-full h-full object-contain"
                />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-base sm:text-xl tracking-tight text-emerald-950 font-serif group-hover:text-emerald-800 transition-colors truncate">
                  KURBAN NASIONAL
                </span>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 hidden xs:inline-block">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate hidden sm:block">Marketplace Kurban Resmi Indonesia</p>
            </div>
          </div>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-950 transition-colors border border-slate-200 hover:border-emerald-300"
              title="Keranjang Belanja Kurban"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-900" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-emerald-950 font-extrabold text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200 hover:border-emerald-600 px-2 sm:px-3 py-1.5 rounded-xl transition-all"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-900 flex items-center justify-center text-amber-300 font-bold text-[10px] sm:text-xs shrink-0">
                  {role === 'admin' ? 'AD' : role === 'penjual' ? 'LG' : role === 'pembeli' ? 'BY' : 'GS'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Akses Peran</p>
                  <p className="text-xs font-bold text-emerald-950 capitalize">{role === 'penjual' ? 'Lembaga' : role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              </button>

              {/* Role Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 text-slate-800 text-xs divide-y divide-slate-100">
                  <div className="px-3 py-2 bg-slate-50">
                    <p className="font-bold text-emerald-950">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>

                  <div className="py-1">
                    <p className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Ganti Mode Simulasi:</p>
                    <button
                      onClick={() => handleRoleChange('guest')}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${role === 'guest' ? 'text-emerald-900 font-bold bg-emerald-50' : ''}`}
                    >
                      <span>Guest (Publik)</span>
                      {role === 'guest' && <span className="w-2 h-2 rounded-full bg-emerald-800"></span>}
                    </button>
                    <button
                      onClick={() => handleRoleChange('pembeli')}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${role === 'pembeli' ? 'text-emerald-900 font-bold bg-emerald-50' : ''}`}
                    >
                      <span>Pembeli (Shohibul Qurban)</span>
                      {role === 'pembeli' && <span className="w-2 h-2 rounded-full bg-emerald-800"></span>}
                    </button>
                    <button
                      onClick={() => handleRoleChange('penjual')}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${role === 'penjual' ? 'text-emerald-900 font-bold bg-emerald-50' : ''}`}
                    >
                      <span>Penjual / Lembaga (Dompet Dhuafa)</span>
                      {role === 'penjual' && <span className="w-2 h-2 rounded-full bg-emerald-800"></span>}
                    </button>
                    <button
                      onClick={() => handleRoleChange('admin')}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${role === 'admin' ? 'text-emerald-900 font-bold bg-emerald-50' : ''}`}
                    >
                      <span>Admin Nasional (Full Access)</span>
                      {role === 'admin' && <span className="w-2 h-2 rounded-full bg-emerald-800"></span>}
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        if (role === 'pembeli' || role === 'guest') setActiveView('buyer-dashboard');
                        else if (role === 'penjual') setActiveView('seller-dashboard');
                        else if (role === 'admin') setActiveView('admin-dashboard');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-emerald-900 font-bold hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-emerald-800" />
                      Buka Dashboard Profil Saya
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 text-emerald-950"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Primary Navigation Bar (Desktop) - Clean White with Generous Spacing */}
        <nav className="hidden md:flex items-center gap-1.5 mt-3 border-t border-slate-100 pt-2.5 text-xs font-semibold">
          <button
            onClick={() => setActiveView('home')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'home'
                ? 'bg-emerald-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            Beranda
          </button>

          <button
            onClick={() => setActiveView('marketplace')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'marketplace'
                ? 'bg-emerald-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            Marketplace Hewan
          </button>

          <button
            onClick={() => setActiveView('kurban-unik')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'kurban-unik'
                ? 'bg-amber-500 text-emerald-950 font-extrabold shadow-xs'
                : 'text-amber-800 hover:bg-amber-50 font-bold'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
            Kurban Sultan (VIP)
          </button>

          <button
            onClick={() => setActiveView('national-dashboard')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'national-dashboard'
                ? 'bg-emerald-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            Dashboard Nasional
          </button>

          <button
            onClick={() => setActiveView('articles')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeView === 'articles'
                ? 'bg-emerald-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            Artikel & Fatwa
          </button>

          {/* Quick links to role dashboards */}
          <div className="ml-auto flex items-center gap-2">
            {role === 'pembeli' && (
              <button
                onClick={() => setActiveView('buyer-dashboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  activeView === 'buyer-dashboard'
                    ? 'bg-emerald-900 text-white border-emerald-900'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Dashboard Pembeli
              </button>
            )}
            {role === 'penjual' && (
              <button
                onClick={() => setActiveView('seller-dashboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  activeView === 'seller-dashboard'
                    ? 'bg-emerald-900 text-white border-emerald-900'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Portal Lembaga
              </button>
            )}
            {role === 'admin' && (
              <button
                onClick={() => setActiveView('admin-dashboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  activeView === 'admin-dashboard'
                    ? 'bg-amber-500 text-emerald-950 border-amber-500'
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                Admin Control
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 border-t border-emerald-800 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => { setActiveView('home'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-emerald-900 text-white"
          >
            Beranda
          </button>
          <button
            onClick={() => { setActiveView('marketplace'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-emerald-900 text-white"
          >
            Marketplace Hewan
          </button>
          <button
            onClick={() => { setActiveView('kurban-unik'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-amber-300 hover:bg-emerald-900 flex items-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Kurban Sultan (VIP)
          </button>
          <button
            onClick={() => { setActiveView('national-dashboard'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-emerald-900 text-white"
          >
            Dashboard Nasional
          </button>
          <button
            onClick={() => { setActiveView('articles'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-emerald-900 text-white"
          >
            Artikel & Fatwa
          </button>

          {/* Mobile role-based dashboard links */}
          <div className="pt-2 border-t border-emerald-800/80 space-y-1">
            <p className="px-3 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Akses Dashboard Role:</p>
            {role === 'pembeli' && (
              <button
                onClick={() => { setActiveView('buyer-dashboard'); setIsMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold bg-emerald-900 text-amber-300 flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-amber-300" />
                Dashboard Pembeli (Shohibul Qurban)
              </button>
            )}
            {role === 'penjual' && (
              <button
                onClick={() => { setActiveView('seller-dashboard'); setIsMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold bg-emerald-900 text-amber-300 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-amber-300" />
                Portal Lembaga Penjual
              </button>
            )}
            {role === 'admin' && (
              <button
                onClick={() => { setActiveView('admin-dashboard'); setIsMobileMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-2"
              >
                <Crown className="w-4 h-4 text-slate-950" />
                Admin Control Nasional
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
