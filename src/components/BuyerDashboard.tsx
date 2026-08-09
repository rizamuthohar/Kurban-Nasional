import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderTracking } from './OrderTracking';
import { 
  ShoppingBag, 
  Award, 
  Clock, 
  CheckCircle2, 
  User as UserIcon, 
  Edit3,
  X,
  Save,
  MapPin,
  Phone,
  Mail,
  Camera,
  Users,
  ShieldCheck,
  Globe,
  Sparkles
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const { currentUser, updateUserProfile, orders, setCertificateOrderId, setActiveView } = useApp();

  const userOrders = orders.filter((o) => o.userId === currentUser.id || o.userEmail === currentUser.email);
  const [viewScope, setViewScope] = useState<'my_orders' | 'all_portal_orders'>(
    userOrders.length > 0 ? 'my_orders' : 'all_portal_orders'
  );

  const displayedOrders = viewScope === 'my_orders' && userOrders.length > 0 ? userOrders : orders;

  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<string | null>(null);
  
  // Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');
  const [profileAddress, setProfileAddress] = useState(currentUser.address || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar || '');

  const activeTrackingOrder = displayedOrders.find((o) => o.id === selectedOrderForTracking);

  const handleOpenEditProfile = () => {
    setProfileName(currentUser.name);
    setProfileEmail(currentUser.email);
    setProfilePhone(currentUser.phone || '');
    setProfileAddress(currentUser.address || 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan');
    setProfileAvatar(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      address: profileAddress,
      avatar: profileAvatar,
    });
    setIsEditProfileOpen(false);
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  ];

  // Stats calculation
  const totalUserOrdersCount = userOrders.length;
  const totalPekurbanRegistered = displayedOrders.reduce((acc, o) => acc + (o.pekurbanList?.length || 1), 0);
  const totalCertificatesIssued = displayedOrders.filter((o) => o.certificateId).length;
  const totalBeneficiariesImpacted = displayedOrders.reduce((acc, o) => acc + (o.beneficiariesCount || 150), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-800 relative overflow-hidden">
        <div className="relative z-10 flex items-start sm:items-center gap-4">
          <div className="relative group shrink-0">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-amber-400 object-cover shadow"
            />
            <button
              onClick={handleOpenEditProfile}
              className="absolute -bottom-1 -right-1 bg-amber-500 text-emerald-950 p-1.5 rounded-lg shadow hover:bg-amber-400 transition-all"
              title="Ubah Foto Profil"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-serif font-bold">{currentUser.name}</h1>
              <span className="bg-amber-400 text-emerald-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                Shohibul Qurban Terdaftar
              </span>
              <span className="bg-emerald-800/90 text-emerald-200 border border-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-300" /> BAZNAS & Kementan
              </span>
            </div>
            <p className="text-xs text-emerald-200 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-amber-300" /> {currentUser.email}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-300" /> {currentUser.phone || '0812-9988-7766'}</span>
            </p>
            {currentUser.address && (
              <p className="text-[11px] text-emerald-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate max-w-md">{currentUser.address}</span>
              </p>
            )}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenEditProfile}
            className="bg-emerald-800/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profil Saya
          </button>

          <button
            onClick={() => setActiveView('marketplace')}
            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> + Tambah Pesanan Kurban
          </button>
        </div>
      </div>

      {/* KPI Overview Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Pesanan</div>
            <div className="text-lg font-black text-slate-900 font-serif">
              {userOrders.length > 0 ? userOrders.length : displayedOrders.length} Transaksi
            </div>
            <p className="text-[10px] text-emerald-800 font-medium">Terverifikasi Sistem</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-900 rounded-xl font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Pekurban Terdaftar</div>
            <div className="text-lg font-black text-slate-900 font-serif">{totalPekurbanRegistered} Nama</div>
            <p className="text-[10px] text-amber-800 font-medium">Sesuai Syariat</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-900 rounded-xl font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Sertifikat Digital</div>
            <div className="text-lg font-black text-slate-900 font-serif">{totalCertificatesIssued} Dokumen</div>
            <p className="text-[10px] text-blue-800 font-medium">Siap Unduh PDF</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-900 rounded-xl font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Estimasi Penerima</div>
            <div className="text-lg font-black text-slate-900 font-serif">{totalBeneficiariesImpacted.toLocaleString('id-ID')} Jiwa</div>
            <p className="text-[10px] text-teal-800 font-medium">Pelosok 3T Indonesia</p>
          </div>
        </div>
      </div>

      {/* Main Content: Selected Order Tracking or List View */}
      {activeTrackingOrder ? (
        <OrderTracking order={activeTrackingOrder} onBack={() => setSelectedOrderForTracking(null)} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-800" /> Riwayat Transaksi & Sertifikat Kurban
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau progres status pemotongan, lokasi distribusi, dan unduh sertifikat resmi BAZNAS RI.
              </p>
            </div>

            {/* Tab Filter Scope */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
              <button
                onClick={() => setViewScope('my_orders')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewScope === 'my_orders'
                    ? 'bg-emerald-900 text-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pesanan Saya ({totalUserOrdersCount})
              </button>
              <button
                onClick={() => setViewScope('all_portal_orders')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewScope === 'all_portal_orders'
                    ? 'bg-emerald-900 text-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Transaksi Portal ({orders.length})
              </button>
            </div>
          </div>

          {/* Banner notice if displaying sample demo portal orders */}
          {userOrders.length === 0 && viewScope === 'my_orders' && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Anda belum memiliki transaksi kurban pribadi atas nama akun ini.</p>
                <p className="text-amber-800 mt-0.5">
                  Gunakan tombol <strong>+ Tambah Pesanan Kurban</strong> untuk melakukan kurban pertama Anda, atau jelajahi sampel transaksi portal nasional di bawah ini.
                </p>
              </div>
            </div>
          )}

          {/* Orders List Grid */}
          <div className="grid grid-cols-1 gap-4">
            {displayedOrders.map((order) => {
              const pekurbanCount = order.pekurbanList?.length || 1;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800 font-bold shrink-0">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm font-mono">{order.orderNumber}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          {order.orderStatus.replace('_', ' ')}
                        </span>
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Users className="w-3 h-3 text-amber-700" /> {pekurbanCount} Pekurban
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-950">
                        Shohibul Qurban: <span className="font-bold text-emerald-900">{order.shohibulQurbanName}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Total: <span className="font-extrabold text-emerald-800 font-serif">Rp {order.totalAmount.toLocaleString('id-ID')}</span> • Met. Bayar: {order.paymentProvider} • Lokasi: {order.distributionProvince}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedOrderForTracking(order.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5 text-emerald-700" /> Lacak Progress
                    </button>

                    {order.certificateId && (
                      <button
                        onClick={() => setCertificateOrderId(order.id)}
                        className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold px-3.5 py-2 rounded-xl text-xs shadow transition-all flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" /> Sertifikat Digital ({pekurbanCount})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-100 my-8 relative animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base">Edit Profil Pembeli (Shohibul Qurban)</h3>
              </div>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs">
              
              {/* Avatar Selector */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Foto Profil / Avatar</label>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={profileAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600 shadow-xs"
                  />
                  <div className="flex gap-2">
                    {avatarPresets.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfileAvatar(url)}
                        className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                          profileAvatar === url ? 'border-emerald-700 scale-105 shadow' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="url"
                  value={profileAvatar}
                  onChange={(e) => setProfileAvatar(e.target.value)}
                  placeholder="Atau masukkan URL Foto kustom (https://...)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nama Lengkap Pemesan *</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* No WhatsApp */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nomor WhatsApp / HP *</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Alamat Lengkap Domisili *</label>
                <textarea
                  rows={2}
                  required
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4 text-amber-400" /> Simpan Profil
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
