import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Award, CheckCircle2, QrCode, Printer, Download, ShieldCheck, Users, ChevronRight } from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { certificateOrderId, setCertificateOrderId, orders } = useApp();
  const [selectedPekurbanIndex, setSelectedPekurbanIndex] = useState<number>(0);

  if (!certificateOrderId) return null;

  const order = orders.find((o) => o.id === certificateOrderId || o.certificateId === certificateOrderId);

  if (!order) return null;

  const item = order.items[0];
  const animal = item?.product;

  const pekurbanList = order.pekurbanList && order.pekurbanList.length > 0
    ? order.pekurbanList
    : [{
        id: 'pek-default',
        name: order.shohibulQurbanName,
        productTitle: animal?.title || 'Hewan Kurban',
        animalType: animal?.type || 'sapi',
        breed: animal?.breed || 'Limosin',
        shareLabel: 'Shohibul Qurban Utama',
        certificateNumber: order.certificateId || 'CERT-KN-2026-88012',
      }];

  const currentPekurban = pekurbanList[selectedPekurbanIndex] || pekurbanList[0];

  const liveW = order.liveWeightKg || animal?.weightKg || 380;
  const meatW = order.distributedMeatKg || Math.round(liveW * 0.5);
  const families = order.beneficiaryFamiliesCount || meatW;
  const souls = order.estimatedSoulsCount || families * 4;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-4 border-amber-400 my-8 relative animate-scale-up">
        
        {/* Modal Controls Bar */}
        <div className="bg-emerald-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-serif font-bold text-sm block">Sertifikat Digital Kurban Nasional</span>
              <span className="text-[10px] text-emerald-300">ID Transaksi: {order.orderNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak / Download
            </button>
            <button
              onClick={() => setCertificateOrderId(null)}
              className="text-gray-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Multi-Pekurban Certificate Switcher Tab */}
        {pekurbanList.length > 1 && (
          <div className="bg-slate-100 p-3 no-print border-b border-slate-200">
            <p className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-800" /> Pilih Sertifikat Nama Pekurban ({pekurbanList.length} Nama):
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {pekurbanList.map((p, idx) => (
                <button
                  key={p.id || idx}
                  onClick={() => setSelectedPekurbanIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                    selectedPekurbanIndex === idx
                      ? 'bg-emerald-900 text-amber-300 shadow border border-emerald-950'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span>{idx + 1}. {p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Decorative Canvas Frame */}
        <div className="p-8 sm:p-10 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 relative text-center space-y-6">
          
          {/* Subtle Corner Seals */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500 pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500 pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500 pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500 pointer-events-none"></div>

          {/* Header Seal */}
          <div className="space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-full mx-auto flex items-center justify-center text-emerald-950 shadow-lg border-2 border-amber-200">
              <Award className="w-10 h-10" />
            </div>

            <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-800">
              PT DISTRIBUSI KURBAN NASIONAL
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-emerald-950 tracking-tight">
              SERTIFIKAT KASIH KURBAN DIGITAL
            </h1>
            <p className="text-xs text-amber-800 font-mono">
              No. Sertifikat: {currentPekurban.certificateNumber || order.certificateId}
            </p>
          </div>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>

          {/* Body Text */}
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed max-w-lg mx-auto">
            <p className="italic">Sertifikat ini diterbitkan secara sah sebagai bukti ibadah kurban atas nama:</p>

            <div className="py-3 px-4 bg-amber-100/60 rounded-2xl border border-amber-300/80 shadow-xs">
              <p className="text-2xl font-extrabold font-serif text-emerald-950">
                {currentPekurban.name}
              </p>
              <p className="text-[11px] font-medium text-amber-900 mt-0.5">
                {currentPekurban.shareLabel || 'Shohibul Qurban'}
              </p>
            </div>

            <p>
              Telah disembelih secara Syar’i hewan kurban <span className="font-bold text-gray-900 uppercase">{currentPekurban.breed || animal?.breed || 'Sapi Limosin'}</span> dengan bobot hidup <span className="font-bold text-gray-900">{liveW} kg</span> oleh lembaga <span className="font-bold text-emerald-900">{animal?.organizationName || 'Dompet Dhuafa'}</span> pada tanggal <span className="font-bold text-gray-900">{order.slaughterDate || '03 Agustus 2026'}</span>.
            </p>
          </div>

          {/* Distribution Specs Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-amber-200 shadow-sm text-xs text-left">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Wilayah Penyaluran</p>
              <p className="font-bold text-gray-900 truncate">{order.distributionProvince}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Total Daging (50%)</p>
              <p className="font-extrabold text-emerald-800">{meatW} kg Daging</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Penerima Manfaat</p>
              <p className="font-bold text-slate-900">{families} KK ({souls} Jiwa)</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Status Syari’at</p>
              <p className="font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sah & Terverifikasi
              </p>
            </div>
          </div>

          {/* Footer Validation QR Code */}
          <div className="pt-4 border-t border-amber-200 flex items-center justify-between text-left text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl text-white">
                <QrCode className="w-10 h-10" />
              </div>
              <div>
                <p className="font-bold text-gray-900">QR Verifikasi Nasional</p>
                <p className="text-[10px] text-gray-500">Scan untuk bukti foto/video pemotongan</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-gray-400">Diterbitkan oleh:</p>
              <p className="font-serif font-bold text-emerald-950">Komite Kurban Nasional</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
