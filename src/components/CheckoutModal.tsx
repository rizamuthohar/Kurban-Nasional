import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building, 
  Wallet, 
  CheckCircle2, 
  MapPin, 
  User as UserIcon, 
  Heart,
  ArrowRight,
  Receipt,
  Plus,
  Trash2,
  Award,
  Users
} from 'lucide-react';
import { PekurbanEntry } from '../types';

interface ItemPekurbanGroup {
  cartIndex: number;
  productTitle: string;
  animalType: string;
  breed: string;
  quantity: number;
  isFullSapi: boolean;
  isPatunganSapi: boolean;
  names: string[];
}

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    currentUser,
    createNewOrder, 
    setTrackingOrderId, 
    setCertificateOrderId,
    setActiveView 
  } = useApp();

  const [userPhone, setUserPhone] = useState(currentUser.phone || '0812-9988-7766');
  const [userEmail, setUserEmail] = useState(currentUser.email || 'budi.santoso@gmail.com');
  const [niatDoa, setNiatDoa] = useState('Niat kurban lillahi ta’ala untuk keselamatan dan keberkahan keluarga');
  const [distributionProvince, setDistributionProvince] = useState('Nusa Tenggara Timur');
  
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'virtual_account' | 'e_wallet' | 'bank_transfer'>('qris');
  const [paymentProvider, setPaymentProvider] = useState('Midtrans QRIS / GoPay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedInvoiceOrder, setCompletedInvoiceOrder] = useState<any | null>(null);

  // Dynamic Pekurban state per cart item
  const [pekurbanGroups, setPekurbanGroups] = useState<ItemPekurbanGroup[]>([]);

  // Compute available distribution provinces from cart items
  const availableProvinces = React.useMemo(() => {
    if (cart.length === 0) return [];
    const provMap = new Map<string, number>();

    cart.forEach((item) => {
      if (item.product.provinceAllocations && item.product.provinceAllocations.length > 0) {
        item.product.provinceAllocations.forEach((alloc) => {
          if (alloc.stock > 0) {
            const existing = provMap.get(alloc.province) || 0;
            provMap.set(alloc.province, Math.max(existing, alloc.stock));
          }
        });
      } else if (item.product.province) {
        const provList = item.product.province.split(',').map((p) => p.trim());
        provList.forEach((prov) => {
          if (!provMap.has(prov)) {
            provMap.set(prov, item.product.stock);
          }
        });
      }
    });

    return Array.from(provMap.entries()).map(([province, stock]) => ({
      province,
      stock,
    }));
  }, [cart]);

  useEffect(() => {
    if (availableProvinces.length > 0) {
      const isValid = availableProvinces.some((p) => p.province === distributionProvince);
      if (!isValid) {
        setDistributionProvince(availableProvinces[0].province);
      }
    }
  }, [availableProvinces, distributionProvince]);

  useEffect(() => {
    if (isCheckoutOpen && cart.length > 0) {
      setUserPhone(currentUser.phone || '0812-9988-7766');
      setUserEmail(currentUser.email || 'budi.santoso@gmail.com');

      const initialGroups: ItemPekurbanGroup[] = cart.map((item, index) => {
        const titleLower = item.product.title.toLowerCase();
        const isSapi = item.product.type === 'sapi';
        const isPatungan = titleLower.includes('1/7') || titleLower.includes('patungan');
        const isFullSapi = isSapi && !isPatungan;

        let initialNames: string[] = [];

        if (isFullSapi) {
          // Full Sapi: start with 1 name (or up to 7 max)
          initialNames = [currentUser.name || 'Budi Santoso bin Ahmad'];
        } else {
          // Patungan Sapi or Kambing/Domba: 1 name per quantity unit
          const requiredCount = item.quantity;
          for (let i = 0; i < requiredCount; i++) {
            if (i === 0) initialNames.push(currentUser.name || 'Budi Santoso bin Ahmad');
            else initialNames.push(`Nama Pekurban #${i + 1}`);
          }
        }

        return {
          cartIndex: index,
          productTitle: item.product.title,
          animalType: item.product.type,
          breed: item.product.breed,
          quantity: item.quantity,
          isFullSapi,
          isPatunganSapi: isPatungan,
          names: initialNames,
        };
      });

      setPekurbanGroups(initialGroups);
    }
  }, [isCheckoutOpen, cart, currentUser]);

  if (!isCheckoutOpen) return null;

  const totalAmount = cart.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const handleNameChange = (groupIndex: number, nameIndex: number, value: string) => {
    setPekurbanGroups((prev) =>
      prev.map((group, idx) => {
        if (idx !== groupIndex) return group;
        const newNames = [...group.names];
        newNames[nameIndex] = value;
        return { ...group, names: newNames };
      })
    );
  };

  const handleAddSapiPekurbanName = (groupIndex: number) => {
    setPekurbanGroups((prev) =>
      prev.map((group, idx) => {
        if (idx !== groupIndex) return group;
        if (group.names.length >= 7) return group;
        return {
          ...group,
          names: [...group.names, `Pekurban #${group.names.length + 1}`],
        };
      })
    );
  };

  const handleRemoveSapiPekurbanName = (groupIndex: number, nameIndex: number) => {
    setPekurbanGroups((prev) =>
      prev.map((group, idx) => {
        if (idx !== groupIndex) return group;
        if (group.names.length <= 1) return group;
        return {
          ...group,
          names: group.names.filter((_, nIdx) => nIdx !== nameIndex),
        };
      })
    );
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        subtotal: (item.product.discountPrice || item.product.price) * item.quantity,
      }));

      // Flatten all pekurban entries across cart items for individual certificates
      const pekurbanList: Omit<PekurbanEntry, 'certificateNumber'>[] = [];

      pekurbanGroups.forEach((group) => {
        group.names.forEach((name, nIdx) => {
          const trimmedName = name.trim() || `Pekurban ${nIdx + 1}`;
          let shareLabel = 'Pekurban';
          if (group.isFullSapi) {
            shareLabel = `1 Ekor Sapi Utuh (Nama ${nIdx + 1} dari ${group.names.length})`;
          } else if (group.isPatunganSapi) {
            shareLabel = `1/7 Sapi Patungan (Bagian #${nIdx + 1})`;
          } else {
            shareLabel = `1 Ekor ${group.animalType === 'kambing' ? 'Kambing' : 'Domba'}`;
          }

          pekurbanList.push({
            id: `pek-${Date.now()}-${group.cartIndex}-${nIdx}`,
            name: trimmedName,
            productTitle: group.productTitle,
            animalType: group.animalType as any,
            breed: group.breed,
            shareLabel,
          });
        });
      });

      const summaryShohibulName = pekurbanList.map((p) => p.name).join(', ');

      const newOrder = createNewOrder({
        shohibulQurbanName: summaryShohibulName,
        pekurbanList: pekurbanList as any,
        niatDoa,
        userPhone,
        userEmail,
        items: orderItems,
        totalAmount,
        paymentMethod,
        paymentProvider,
        distributionProvince,
      });

      setIsProcessing(false);
      setCompletedInvoiceOrder(newOrder);
    }, 1800);
  };

  const handleGoToTracking = () => {
    if (completedInvoiceOrder) {
      setTrackingOrderId(completedInvoiceOrder.id);
      setIsCheckoutOpen(false);
      setCompletedInvoiceOrder(null);
      setActiveView('buyer-dashboard');
    }
  };

  const handleViewCertificates = () => {
    if (completedInvoiceOrder) {
      setCertificateOrderId(completedInvoiceOrder.id);
      setIsCheckoutOpen(false);
      setCompletedInvoiceOrder(null);
      setActiveView('buyer-dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-emerald-100 my-8 relative animate-scale-up">
        
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-xl text-emerald-950 font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl">Checkout Kurban Nasional</h3>
              <p className="text-xs text-emerald-200">Midtrans Gateway • Multi-Pekurban & Single Order ID</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setCompletedInvoiceOrder(null);
            }}
            className="text-emerald-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content View: Form or Invoice */}
        {completedInvoiceOrder ? (
          /* Invoice Success Screen */
          <div className="p-8 text-center space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800 shadow">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Pembayaran Midtrans Lunas
              </span>
              <h2 className="text-2xl font-bold font-serif text-gray-900 mt-2">
                Alhamdulillah! Kurban Anda Berhasil
              </h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Single ID Transaksi: <span className="font-extrabold text-emerald-900 font-mono">{completedInvoiceOrder.orderNumber}</span>
              </p>
            </div>

            {/* Invoice Breakdown */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-semibold">Total Item Kurban:</span>
                <span className="font-bold text-gray-900">{completedInvoiceOrder.items.length} Paket Hewan</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-semibold">Total Pekurban Terdaftar:</span>
                <span className="font-bold text-emerald-900">{completedInvoiceOrder.pekurbanList?.length || 1} Nama (Sertifikat Terpisah)</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-semibold">Total Pembayaran:</span>
                <span className="font-extrabold text-emerald-800 font-serif text-sm">
                  Rp {completedInvoiceOrder.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Metode Pembayaran:</span>
                <span className="font-bold text-gray-900">{completedInvoiceOrder.paymentProvider}</span>
              </div>
            </div>

            {/* Registered Pekurban List Preview */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 text-left space-y-2">
              <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-800" /> Daftar Nama Pekurban & Sertifikat Terbit:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {completedInvoiceOrder.pekurbanList?.map((p: any, idx: number) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{idx + 1}. {p.name}</p>
                      <p className="text-[10px] text-gray-500">{p.shareLabel} • {p.productTitle}</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      CERT
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleGoToTracking}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Lacak Progress Kurban</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleViewCertificates}
                className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold py-3 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Lihat Sertifikat per Nama</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleProcessPayment} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Multi-Item Pekurban Name Assignment */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="text-sm font-serif font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-800" /> Data Nama Pekurban (Shohibul Qurban)
                </h4>
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {cart.length} Hewan dalam 1 Transaksi
                </span>
              </div>

              {pekurbanGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-950">{group.productTitle}</p>
                      <p className="text-[10px] text-gray-500">
                        Jenis: <span className="uppercase font-semibold">{group.animalType}</span> • Qty: {group.quantity}
                      </p>
                    </div>

                    {group.isFullSapi && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        1 Sapi Utuh (Maks 7 Nama)
                      </span>
                    )}
                    {group.isPatunganSapi && (
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Patungan 1/7 Sapi ({group.quantity} Bagian)
                      </span>
                    )}
                  </div>

                  {/* Input Fields for Pekurban Names */}
                  <div className="space-y-2">
                    {group.names.map((name, nameIdx) => (
                      <div key={nameIdx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-16 shrink-0">
                          Nama #{nameIdx + 1}:
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => handleNameChange(groupIdx, nameIdx, e.target.value)}
                          placeholder={`Nama Atas Nama Kurban #${nameIdx + 1}`}
                          className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        />
                        {group.isFullSapi && group.names.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSapiPekurbanName(groupIdx, nameIdx)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Nama"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Option to add names for 1 Full Sapi up to 7 */}
                  {group.isFullSapi && group.names.length < 7 && (
                    <button
                      type="button"
                      onClick={() => handleAddSapiPekurbanName(groupIdx)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-white border border-emerald-300 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Tambah Nama Pekurban Sapi ini ({group.names.length}/7)</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Buyer Contact Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-serif font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-emerald-800" /> Kontak Pemesan & Target Penyaluran
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nomor WhatsApp Notifikasi *</label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Notifikasi *</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-gray-700 block mb-1">Niat & Doa Khusus (Opsional)</label>
                <input
                  type="text"
                  value={niatDoa}
                  onChange={(e) => setNiatDoa(e.target.value)}
                  placeholder="Niat kurban lillahi ta'ala..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="text-xs">
                <label className="font-bold text-gray-700 block mb-1">
                  Target Wilayah Penyaluran / Distribusi (Terintegrasi Lokasi Hewan)
                </label>
                {availableProvinces.length > 0 ? (
                  <select
                    value={distributionProvince}
                    onChange={(e) => setDistributionProvince(e.target.value)}
                    className="w-full bg-emerald-50/80 border border-emerald-300 rounded-xl p-2.5 text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {availableProvinces.map((p) => (
                      <option key={p.province} value={p.province}>
                        Provinsi {p.province} (Kuota Tersedia: {p.stock} ekor)
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    readOnly
                    value={distributionProvince}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-gray-700 font-bold"
                  />
                )}
                <p className="text-[10px] text-emerald-700 mt-1 font-medium">
                  Pilihan lokasi penyaluran disesuaikan otomatis dengan lokasi fisik ketersediaan stok hewan di database.
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <h4 className="text-sm font-serif font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800" /> Metode Pembayaran (Midtrans Integrated)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('qris');
                    setPaymentProvider('Midtrans QRIS / GoPay');
                  }}
                  className={`p-3 rounded-2xl border text-left font-bold transition-all ${
                    paymentMethod === 'qris'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1" />
                  <span>QRIS Instant</span>
                  <p className="text-[9px] font-normal opacity-80">GoPay, OVO, Dana</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('virtual_account');
                    setPaymentProvider('Mandiri / BCA Virtual Account');
                  }}
                  className={`p-3 rounded-2xl border text-left font-bold transition-all ${
                    paymentMethod === 'virtual_account'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Building className="w-5 h-5 mb-1" />
                  <span>Virtual Account</span>
                  <p className="text-[9px] font-normal opacity-80">BCA, Mandiri, BRI</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('e_wallet');
                    setPaymentProvider('ShopeePay / LinkAja');
                  }}
                  className={`p-3 rounded-2xl border text-left font-bold transition-all ${
                    paymentMethod === 'e_wallet'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Wallet className="w-5 h-5 mb-1" />
                  <span>E-Wallet</span>
                  <p className="text-[9px] font-normal opacity-80">ShopeePay, LinkAja</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('bank_transfer');
                    setPaymentProvider('Transfer Bank Manual / ATM');
                  }}
                  className={`p-3 rounded-2xl border text-left font-bold transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span>Transfer Bank</span>
                  <p className="text-[9px] font-normal opacity-80">Manual Verifikasi</p>
                </button>
              </div>
            </div>

            {/* Total Summary & Pay Button */}
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-800">Total Biaya Kurban ({cart.length} Hewan):</span>
                <span className="text-xl font-extrabold text-emerald-900 font-serif">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing || totalAmount <= 0}
                className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold py-3.5 rounded-xl shadow-lg text-xs transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Memproses Pembayaran Midtrans...</span>
                ) : (
                  <>
                    <span>Bayar Sekarang (Rp {totalAmount.toLocaleString('id-ID')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
