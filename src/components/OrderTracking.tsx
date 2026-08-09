import React from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { CheckCircle2, Clock, MapPin, Award, Eye, FileText, Camera, Video, ArrowLeft, Scale, Users, ShieldCheck } from 'lucide-react';

interface Props {
  order: Order;
  onBack?: () => void;
}

export const OrderTracking: React.FC<Props> = ({ order, onBack }) => {
  const { setCertificateOrderId } = useApp();

  const liveW = order.liveWeightKg || order.items[0]?.product.weightKg || 350;
  const meatW = order.distributedMeatKg || Math.round(liveW * 0.5);
  const families = order.beneficiaryFamiliesCount || meatW;
  const souls = order.estimatedSoulsCount || families * 4;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <span className="text-[10px] uppercase font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Lacak Pelaksanaan Kurban
            </span>
            <h3 className="text-xl font-bold font-serif text-gray-900 mt-1">
              Order No: {order.orderNumber}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {order.certificateIssued ? (
            <button
              onClick={() => setCertificateOrderId(order.id)}
              className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-4 py-2.5 rounded-xl text-xs shadow transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" /> Buka Sertifikat Digital (Terverifikasi)
            </button>
          ) : (
            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Sertifikat Menunggu Verifikasi Admin
            </span>
          )}
        </div>
      </div>

      {/* Shohibul Qurban Summary Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-xs">
        <div>
          <span className="text-gray-500 font-semibold block">Shohibul Qurban</span>
          <span className="font-extrabold text-emerald-950 text-sm">{order.shohibulQurbanName}</span>
        </div>
        <div>
          <span className="text-gray-500 font-semibold block">Lokasi Penyaluran Target</span>
          <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500" /> {order.distributionProvince}
          </span>
        </div>
        <div>
          <span className="text-gray-500 font-semibold block">Total Transaksi</span>
          <span className="font-extrabold text-emerald-800 font-serif text-sm">
            Rp {order.totalAmount.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Rincian Perhitungan Daging & Penerima Manfaat */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-800" />
            <span>Kalkulasi Karkas & Penyaluran Daging (Rumus Standar)</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            Resmi & Transparan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Bobot Hidup Hewan</span>
            <span className="font-extrabold text-slate-900 text-sm">{liveW} kg</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Jumlah Daging (50%)</span>
            <span className="font-extrabold text-emerald-800 text-sm">{meatW} kg</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Penerima (1 kg / KK)</span>
            <span className="font-extrabold text-slate-900 text-sm">{families} Keluarga (KK)</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Estimasi Penerima (4 / KK)</span>
            <span className="font-extrabold text-emerald-800 text-sm">{souls} Jiwa</span>
          </div>
        </div>
      </div>

      {/* Galeri 3 Foto Proses Pemotongan */}
      <div className="space-y-3 pt-2">
        <h4 className="font-serif font-bold text-gray-900 text-sm flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-800" />
          <span>Dokumentasi Foto Bukti Proses (3 Tahap Utama)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Foto 1 */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-800">1. Hidup Sebelum Disembelih</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <img
              src={order.photoBeforeSlaughterUrl || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=800&auto=format&fit=crop&q=80'}
              alt="Foto Sebelum Disembelih"
              className="w-full h-36 object-cover rounded-xl border border-slate-200 shadow-xs"
            />
          </div>

          {/* Foto 2 */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-800">2. Setelah Disembelih (Syar'i)</span>
              {order.photoAfterSlaughterUrl ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-500" />
              )}
            </div>
            <img
              src={order.photoAfterSlaughterUrl || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80'}
              alt="Foto Setelah Disembelih"
              className="w-full h-36 object-cover rounded-xl border border-slate-200 shadow-xs"
            />
          </div>

          {/* Foto 3 */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-800">3. Penyaluran ke Penerima</span>
              {order.photoDistributionUrl ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-500" />
              )}
            </div>
            <img
              src={order.photoDistributionUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80'}
              alt="Foto Distribusi"
              className="w-full h-36 object-cover rounded-xl border border-slate-200 shadow-xs"
            />
          </div>

        </div>
      </div>

      {/* Timeline Steps Stream */}
      <div className="space-y-4 pt-2">
        <h4 className="font-serif font-bold text-gray-900 text-sm">Alur & Histori Pelaksanaan Syari’at</h4>

        <div className="relative pl-6 border-l-2 border-emerald-200 space-y-6 my-4">
          {order.timeline.map((step, idx) => (
            <div key={idx} className="relative group">
              
              {/* Bullet point */}
              <div
                className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.isCompleted
                    ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              {/* Step Details */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <h5 className={`font-bold ${step.isCompleted ? 'text-emerald-950' : 'text-gray-500'}`}>
                    {step.title}
                  </h5>
                  {step.timestamp && (
                    <span className="text-[10px] text-gray-400 font-medium">{step.timestamp}</span>
                  )}
                </div>

                <p className="text-xs text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
