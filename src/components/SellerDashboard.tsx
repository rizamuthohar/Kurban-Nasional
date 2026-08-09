import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, Article } from '../types';
import { Building2, Plus, Package, ShoppingBag, CheckCircle2, Upload, FileText, Camera, BarChart2, ShieldCheck, Scale, Users, Award, X, Star, CheckSquare, Clock, MapPin, AlertTriangle, Send, Edit3, Eye } from 'lucide-react';
import { ArticleImageUploader, ArticleContentToolbar } from './ArticleEditorTools';

/* SELLER ORDER UPDATE & RESUBMIT MODAL */
interface UpdateModalProps {
  order: Order;
  onClose: () => void;
}

const SellerOrderUpdateModal: React.FC<UpdateModalProps> = ({ order, onClose }) => {
  const { updateOrderExecutionFlow } = useApp();

  const baseWeight = order.liveWeightKg || order.items[0]?.product.weightKg || 350;

  const [animalArrived, setAnimalArrived] = useState<boolean>(order.animalArrivedAtLocation ?? true);
  const [arrivedDate, setArrivedDate] = useState<string>(order.animalArrivedDate || '02 Agustus 2026 14:00 WITA');
  const [slaughteredDate, setSlaughteredDate] = useState<string>(order.slaughteredDate || '03 Agustus 2026 08:30 WITA');
  const [liveWeightKg, setLiveWeightKg] = useState<number>(baseWeight);

  // Photos
  const [photoBefore, setPhotoBefore] = useState<string>(
    order.photoBeforeSlaughterUrl || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=800&auto=format&fit=crop&q=80'
  );
  const [photoAfter, setPhotoAfter] = useState<string>(
    order.photoAfterSlaughterUrl || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80'
  );
  const [photoDistribution, setPhotoDistribution] = useState<string>(
    order.photoDistributionUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80'
  );

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Calculations:
  // 1. Meat = 50% of live weight
  const meatKg = Math.round(liveWeightKg * 0.5);
  // 2. 1 kg / family (KK)
  const familiesCount = meatKg;
  // 3. 4 souls / family (KK)
  const soulsCount = familiesCount * 4;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrderExecutionFlow(order.id, {
      animalArrivedAtLocation: animalArrived,
      animalArrivedDate: arrivedDate,
      slaughteredDate,
      liveWeightKg,
      photoBeforeSlaughterUrl: photoBefore,
      photoAfterSlaughterUrl: photoAfter,
      photoDistributionUrl: photoDistribution,
      submitForAdminVerification: true,
      resubmittedForAdminVerification: true,
      revisionRequestedForCertificate: false,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-scale-up">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                Aksi Update Lembaga
              </span>
              <span className="text-xs text-emerald-200 font-mono">{order.orderNumber}</span>
              {order.revisionRequestedForCertificate && (
                <span className="bg-amber-500 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded">
                  Revisi Laporan Diminta
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold font-serif text-white mt-1">
              Update Flow Kurban & Laporan Pemotongan
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Shohibul Qurban: <span className="text-amber-300 font-bold">{order.shohibulQurbanName}</span>
            </p>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-emerald-900 rounded-xl text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {order.certificateRevisionNotes && (
          <div className="bg-amber-50 border-b border-amber-300 p-4 text-amber-950 text-xs">
            <p className="font-extrabold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Catatan Moderasi / Revisi dari Admin Utama:
            </p>
            <p className="mt-1 font-semibold text-amber-900 leading-relaxed bg-amber-100/60 p-2.5 rounded-xl border border-amber-200">
              "{order.certificateRevisionNotes}"
            </p>
          </div>
        )}

        {savedSuccess && (
          <div className="bg-emerald-100 border-b border-emerald-300 p-4 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Laporan Kurban berhasil dikirim ulang ke Admin Utama untuk Verifikasi Sertifikat!
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          
          {/* STEP 1: HEWAN TIBA DI LOKASI */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 font-extrabold text-emerald-950 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={animalArrived}
                  onChange={(e) => setAnimalArrived(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-800"
                />
                <MapPin className="w-4 h-4 text-emerald-800" />
                <span>1. Hewan Tiba di Lokasi Pemotongan / Kandang</span>
              </label>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${animalArrived ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                {animalArrived ? 'Telah Tiba' : 'Belum Tiba'}
              </span>
            </div>

            {animalArrived && (
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Waktu / Tanggal Tiba di Lokasi</label>
                <input
                  type="text"
                  value={arrivedDate}
                  onChange={(e) => setArrivedDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  placeholder="Contoh: 02 Agustus 2026 14:00 WITA"
                />
              </div>
            )}
          </div>

          {/* STEP 2: HEWAN DI SEMBELIH */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 font-extrabold text-emerald-950 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(slaughteredDate)}
                  onChange={(e) => {
                    if (!e.target.checked) setSlaughteredDate('');
                    else setSlaughteredDate('03 Agustus 2026 08:30 WITA');
                  }}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-800"
                />
                <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                <span>2. Hewan Disembelih secara Syar’i</span>
              </label>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${slaughteredDate ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                {slaughteredDate ? 'Disembelih' : 'Belum Disembelih'}
              </span>
            </div>

            {slaughteredDate && (
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Waktu / Tanggal Penyembelihan (Juleha Verified)</label>
                <input
                  type="text"
                  value={slaughteredDate}
                  onChange={(e) => setSlaughteredDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  placeholder="Contoh: 03 Agustus 2026 08:30 WITA"
                />
              </div>
            )}
          </div>

          {/* STEP 3: KALKULASI DAGING & PENERIMA MANFAAT */}
          <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm border-b border-emerald-200/80 pb-2">
              <Scale className="w-4 h-4 text-emerald-800" />
              <span>3. Perhitungan Daging Kurban & Penerima Manfaat</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 block font-bold mb-1">
                  Bobot Hidup Hewan (kg)
                </label>
                <input
                  type="number"
                  value={liveWeightKg}
                  onChange={(e) => setLiveWeightKg(Number(e.target.value))}
                  className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-800"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  *Bobot ditimbang sebelum penyembelihan
                </span>
              </div>

              {/* AUTOMATED CALCULATION SUMMARY CARD */}
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-600">Jumlah Daging (50% Bobot Hidup):</span>
                  <span className="font-extrabold text-emerald-950 text-xs">{meatKg} kg</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-600">Penerima (1 kg / KK):</span>
                  <span className="font-extrabold text-emerald-950 text-xs">{familiesCount} KK</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                  <span className="text-emerald-900 font-bold">Estimasi Penerima (4 Jiwa / KK):</span>
                  <span className="font-black text-emerald-800 text-sm">{soulsCount} Jiwa</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-800 bg-emerald-100/70 p-2.5 rounded-xl leading-relaxed">
              <strong>Aturan Standar Kurban:</strong> Daging kurban terdistribusi dihitung otomatis <strong>50% dari bobot hidup</strong>. Setiap keluarga (1 KK) menerima <strong>1 kg daging</strong>, dengan estimasi <strong>4 jiwa</strong> per KK.
            </p>
          </div>

          {/* STEP 4: UPLOAD 3 FOTO PROSES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-800" />
                <span>4. Upload Foto Bukti Proses (3 Foto Wajib)</span>
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Wajib Lengkap
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Foto 1: Hidup sebelum disembelih */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 text-[11px] text-center">Foto 1: Hidup Sebelum Disembelih</p>
                <img
                  src={photoBefore}
                  alt="Foto Sebelum Disembelih"
                  className="w-full h-28 object-cover rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  value={photoBefore}
                  onChange={(e) => setPhotoBefore(e.target.value)}
                  placeholder="URL Foto Hewan Hidup..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px]"
                />
                <div className="flex gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setPhotoBefore('https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=800&auto=format&fit=crop&q=80')}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-1 rounded text-[9px]"
                  >
                    Sampel Sapi
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoBefore('https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&auto=format&fit=crop&q=80')}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-1 rounded text-[9px]"
                  >
                    Sampel Kambing
                  </button>
                </div>
              </div>

              {/* Foto 2: Setelah disembelih */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 text-[11px] text-center">Foto 2: Setelah Disembelih</p>
                <img
                  src={photoAfter}
                  alt="Foto Setelah Disembelih"
                  className="w-full h-28 object-cover rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  value={photoAfter}
                  onChange={(e) => setPhotoAfter(e.target.value)}
                  placeholder="URL Foto Setelah Disembelih..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px]"
                />
                <div className="flex gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setPhotoAfter('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80')}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-1 rounded text-[9px]"
                  >
                    Gunakan Sampel Pemotongan
                  </button>
                </div>
              </div>

              {/* Foto 3: Distribusi ke Penerima Manfaat */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 text-[11px] text-center">Foto 3: Distribusi Penerima Manfaat</p>
                <img
                  src={photoDistribution}
                  alt="Foto Distribusi"
                  className="w-full h-28 object-cover rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  value={photoDistribution}
                  onChange={(e) => setPhotoDistribution(e.target.value)}
                  placeholder="URL Foto Distribusi..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px]"
                />
                <div className="flex gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setPhotoDistribution('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80')}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-1 rounded text-[9px]"
                  >
                    Gunakan Sampel Distribusi
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* STEP 5: STATUS SERTIFIKAT DIGITAL */}
          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-950 flex items-center gap-1.5 text-xs">
                <Award className="w-4 h-4 text-amber-600" /> Status Sertifikat Digital
              </span>
              <span className={`px-2.5 py-0.5 rounded font-bold uppercase text-[10px] ${order.adminVerifiedForCertificate ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900'}`}>
                {order.adminVerifiedForCertificate ? 'Sertifikat Terbit' : 'Menunggu Verifikasi Admin'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {order.adminVerifiedForCertificate
                ? 'Sertifikat Digital telah diverifikasi dan terbit resmi untuk Shohibul Qurban.'
                : 'Sertifikat Digital akan terbit otomatis setelah seluruh foto dan data di atas diverifikasi oleh Admin Utama Kurban Nasional.'}
            </p>
          </div>

          {/* Save & Submit Button */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              className="w-2/3 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>{order.revisionRequestedForCertificate ? 'Kirim Ulang Laporan ke Admin' : 'Simpan Update & Kirim ke Admin'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

/* SELLER ARTICLE RESUBMIT MODAL */
interface SellerArticleModalProps {
  article: Article;
  onClose: () => void;
}

const SellerArticleEditModal: React.FC<SellerArticleModalProps> = ({ article, onClose }) => {
  const { resubmitArticle } = useApp();

  const [title, setTitle] = useState(article.title);
  const [category, setCategory] = useState(article.category);
  const [summary, setSummary] = useState(article.summary);
  const [content, setContent] = useState(article.content);
  const [imageUrl, setImageUrl] = useState(article.imageUrl);
  const [resubmittedMsg, setResubmittedMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resubmitArticle(article.id, {
      title,
      category,
      summary,
      content,
      imageUrl,
    });
    setResubmittedMsg(true);
    setTimeout(() => {
      setResubmittedMsg(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-scale-up text-xs">
        
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div>
            <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
              Revisi & Pengiriman Ulang Artikel
            </span>
            <h3 className="text-base font-serif font-bold text-white mt-1">{article.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-900 rounded-xl text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {article.revisionNotes && (
          <div className="bg-amber-50 p-4 border-b border-amber-200 text-amber-950">
            <p className="font-extrabold flex items-center gap-1 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Catatan Moderasi dari Admin:
            </p>
            <p className="mt-1 font-semibold text-amber-900">{article.revisionNotes}</p>
          </div>
        )}

        {resubmittedMsg && (
          <div className="bg-emerald-100 p-3 text-emerald-900 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Artikel berhasil diperbaiki & dikirim ulang ke Admin Utama!
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Judul Artikel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
              >
                <option value="Berita">Berita</option>
                <option value="Edukasi">Edukasi</option>
                <option value="Fatwa">Fatwa</option>
                <option value="Peternakan">Peternakan</option>
                <option value="Artikel Lembaga">Artikel Lembaga</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">URL Gambar Cover</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Ringkasan Artikel</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Isi Lengkap Artikel</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-sans"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl"
            >
              Batal
            </button>

            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-5 py-2 rounded-xl shadow flex items-center gap-1.5"
            >
              <Send className="w-4 h-4 text-amber-400" /> Kirim Ulang ke Admin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export const SellerDashboard: React.FC = () => {
  const { currentUser, products, articles, orders, organizations, updateOrderStatus, addNewProduct, addNewArticle } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'articles' | 'products' | 'add_product' | 'add_article'>('orders');
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState<Order | null>(null);
  const [selectedArticleForEdit, setSelectedArticleForEdit] = useState<Article | null>(null);

  // Active Seller Organization Profile
  const sellerOrg = organizations.find((o) => o.id === currentUser.organizationId || o.name.includes('Dompet Dhuafa')) || organizations[0];

  // New Product Form State
  const [prodTitle, setProdTitle] = useState('');
  const [prodType, setProdType] = useState<'sapi' | 'kambing' | 'domba'>('sapi');
  const [prodBreed, setProdBreed] = useState('Sapi Limosin');
  const [prodWeight, setProdWeight] = useState(350);
  const [prodAge, setProdAge] = useState(26);
  const [prodPrice, setProdPrice] = useState(18500000);
  const [prodProvince, setProdProvince] = useState(sellerOrg?.province || 'Jawa Barat');
  const [prodLocationDetails, setProdLocationDetails] = useState(`Kandang Sentra ${sellerOrg?.name || 'Lembaga'}`);
  const [prodSKKH, setProdSKKH] = useState('SKKH/KEMENTAN/2026/0912');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIsVIP, setProdIsVIP] = useState(false);
  const [prodCCTVUrl, setProdCCTVUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [prodSuccessMsg, setProdSuccessMsg] = useState<string | null>(null);

  // Multi-Province Allocation State for Non-VIP Products
  const [prodAllocations, setProdAllocations] = useState<{ province: string; stock: number }[]>([
    { province: sellerOrg?.province || 'Jawa Barat', stock: 100 },
  ]);

  const addAllocationRow = () => {
    setProdAllocations((prev) => [...prev, { province: 'Jawa Tengah', stock: 50 }]);
  };

  const updateAllocationRow = (index: number, field: 'province' | 'stock', value: any) => {
    setProdAllocations((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const removeAllocationRow = (index: number) => {
    if (prodAllocations.length <= 1) return;
    setProdAllocations((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCalculatedStock = prodIsVIP
    ? 10
    : prodAllocations.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);

  // New Article Form State
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState<'Berita' | 'Edukasi' | 'Fatwa' | 'Peternakan' | 'Artikel Lembaga'>('Artikel Lembaga');
  const [artSummary, setArtSummary] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artImageUrl, setArtImageUrl] = useState('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80');
  const [artSuccessMsg, setArtSuccessMsg] = useState<string | null>(null);

  // Filter org products, articles & orders
  const orgProducts = products.filter((p) => p.organizationId === sellerOrg.id || p.organizationName === sellerOrg.name);
  const orgArticles = articles.filter((a) => a.organizationId === sellerOrg.id || a.organizationName === sellerOrg.name || a.author.includes(sellerOrg.name));
  const orgOrders = orders;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedAllocations = prodIsVIP
      ? [{ province: prodProvince, stock: 10 }]
      : prodAllocations.map((a) => ({ province: a.province.trim(), stock: Number(a.stock) || 0 }));

    const formattedProvinceString = prodIsVIP
      ? prodProvince
      : formattedAllocations.map((a) => a.province).join(', ');

    addNewProduct({
      title: prodTitle,
      organizationId: sellerOrg.id,
      organizationName: sellerOrg.name,
      organizationLogo: sellerOrg.logo,
      type: prodType,
      breed: prodBreed,
      weightKg: prodWeight,
      ageMonths: prodAge,
      gender: 'jantan',
      price: prodPrice,
      province: formattedProvinceString,
      locationDetails: prodIsVIP ? prodLocationDetails : undefined,
      provinceAllocations: formattedAllocations,
      shippingType: 'distribusi_3t',
      estimatedDistributionDate: 'Hari H Iduladha 1447 H',
      healthCertNumber: prodSKKH,
      isVaccinatedPMK: true,
      isVaccinatedLSD: true,
      stock: totalCalculatedStock,
      images: ['https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      cctvUrl: prodCCTVUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
      has360View: true,
      isPremiumUnik: prodIsVIP,
      description: prodDesc,
      programName: `Program Kurban ${sellerOrg.name}`,
    });

    setProdSuccessMsg(
      prodIsVIP
        ? `Pengajuan Kurban Sultan (VIP) berhasil dikirim oleh ${sellerOrg.name}! Menunggu verifikasi & persetujuan Admin Utama Kurban Nasional.`
        : `Produk baru berhasil terdaftar di bawah ${sellerOrg.name}! Menunggu persetujuan Admin Nasional.`
    );
    setTimeout(() => {
      setProdSuccessMsg(null);
      setActiveTab('products');
    }, 2000);
  };

  const handleAddArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNewArticle({
      title: artTitle,
      slug: artTitle.toLowerCase().replace(/\s+/g, '-'),
      category: artCategory,
      author: `${sellerOrg.contactPerson} (${sellerOrg.name})`,
      organizationName: sellerOrg.name,
      organizationId: sellerOrg.id,
      date: new Date().toLocaleDateString('id-ID'),
      summary: artSummary,
      content: artContent,
      imageUrl: artImageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    });

    setArtSuccessMsg(`Draft Artikel terhubung ke PIC ${sellerOrg.contactPerson} (${sellerOrg.name}) berhasil dikirim! Menunggu moderasi Admin.`);
    setTimeout(() => {
      setArtSuccessMsg(null);
      setActiveTab('articles');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-800">
        <div className="flex items-center gap-4">
          <img
            src={sellerOrg.logo}
            alt={sellerOrg.name}
            className="w-14 h-14 rounded-2xl border-2 border-amber-400 object-cover shadow-md shrink-0 bg-white"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-serif font-bold">{sellerOrg.name}</h1>
              <span className="bg-emerald-800 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded border border-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Terverifikasi Kemenag RI
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-1 flex items-center gap-3 flex-wrap">
              <span>PIC: <strong className="text-amber-300">{sellerOrg.contactPerson}</strong></span>
              <span>•</span>
              <span>SK: {sellerOrg.legalNumber}</span>
              <span>•</span>
              <span>Kontak: {sellerOrg.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('add_product')}
            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold px-3.5 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tambah Produk Hewan
          </button>
          <button
            onClick={() => setActiveTab('add_article')}
            className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs border border-emerald-700 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Tulis Artikel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Kelola Pesanan & Pemotongan ({orgOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" /> Artikel Edukasi & Moderasi ({orgArticles.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" /> Katalog Hewan Saya ({orgProducts.length})
        </button>
      </div>

      {/* TAB CONTENT: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <h3 className="font-serif font-bold text-gray-900 text-base">
            Daftar Pesanan Masuk & Update Status Pemotongan
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">No. Order</th>
                  <th className="py-3 px-4">Shohibul Qurban</th>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Wilayah</th>
                  <th className="py-3 px-4">Status Pemotongan</th>
                  <th className="py-3 px-4 text-center">Aksi Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {orgOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-emerald-950">
                      {ord.orderNumber}
                      {ord.revisionRequestedForCertificate && (
                        <span className="block text-[9px] text-amber-700 font-bold">
                          ⚠️ Revisi Diminta Admin
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{ord.shohibulQurbanName}</td>
                    <td className="py-3 px-4">{ord.items[0]?.product.title}</td>
                    <td className="py-3 px-4">{ord.distributionProvince}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrderForUpdate(ord)}
                        className={`font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 mx-auto ${
                          ord.revisionRequestedForCertificate
                            ? 'bg-amber-500 text-emerald-950 hover:bg-amber-400'
                            : 'bg-emerald-900 text-white hover:bg-emerald-800'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-300" />
                        <span>{ord.revisionRequestedForCertificate ? 'Revisi Laporan' : 'Aksi Update Flow Kurban'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ARTICLES MODERATION */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <h3 className="font-serif font-bold text-gray-900 text-base">
            Artikel Edukasi Lembaga & Status Moderasi Admin
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgArticles.map((art) => (
              <div key={art.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                      {art.category}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm mt-1">{art.title}</h4>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                    art.status === 'approved' || art.isApproved
                      ? 'bg-emerald-100 text-emerald-800'
                      : art.status === 'revision_requested'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {art.status === 'approved' || art.isApproved
                      ? 'Disetujui'
                      : art.status === 'revision_requested'
                      ? 'Revisi Diminta'
                      : 'Dalam Moderasi'}
                  </span>
                </div>

                {art.revisionNotes && (
                  <div className="bg-amber-100/70 p-2.5 rounded-xl border border-amber-200 text-amber-950 font-medium">
                    <p className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Catatan Admin:
                    </p>
                    <p className="text-[11px] mt-0.5">{art.revisionNotes}</p>
                  </div>
                )}

                <p className="text-slate-600 line-clamp-2 italic">{art.summary}</p>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedArticleForEdit(art)}
                    className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{art.status === 'revision_requested' ? 'Perbaiki & Kirim Ulang' : 'Edit Artikel'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL FOR SELLER EXECUTION FLOW UPDATE */}
      {selectedOrderForUpdate && (
        <SellerOrderUpdateModal
          order={selectedOrderForUpdate}
          onClose={() => setSelectedOrderForUpdate(null)}
        />
      )}

      {/* MODAL FOR SELLER ARTICLE EDIT & RESUBMIT */}
      {selectedArticleForEdit && (
        <SellerArticleEditModal
          article={selectedArticleForEdit}
          onClose={() => setSelectedArticleForEdit(null)}
        />
      )}

      {/* TAB CONTENT: PRODUCT LIST */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow space-y-3.5">
              <div className="w-full aspect-[3/2] overflow-hidden rounded-xl bg-gray-100">
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-serif font-bold text-gray-900 text-sm leading-snug">{p.title}</h4>
              <p className="text-xs text-emerald-800 font-bold">Rp {p.price.toLocaleString('id-ID')}</p>
              <div className="flex justify-between items-center text-[10px] text-gray-500">
                <span>Stok: {p.stock} ekor</span>
                <span className={`font-bold px-2 py-0.5 rounded ${p.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {p.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: ADD PRODUCT FORM */}
      {activeTab === 'add_product' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md max-w-2xl mx-auto space-y-6">
          <h3 className="text-lg font-serif font-bold text-gray-900 border-b pb-3">Daftarkan Produk Hewan Kurban Baru</h3>

          {prodSuccessMsg && (
            <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {prodSuccessMsg}
            </div>
          )}

          <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Nama Produk Hewan</label>
              <input
                type="text"
                required
                value={prodTitle}
                onChange={(e) => setProdTitle(e.target.value)}
                placeholder="Contoh: Sapi Limosin Super 350 kg"
                className="w-full bg-gray-50 border rounded-xl p-2.5 text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Jenis Hewan</label>
                <select
                  value={prodType}
                  onChange={(e: any) => setProdType(e.target.value)}
                  className="w-full bg-gray-50 border rounded-xl p-2.5"
                >
                  <option value="sapi">Sapi</option>
                  <option value="kambing">Kambing</option>
                  <option value="domba">Domba</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Ras / Breed</label>
                <input
                  type="text"
                  required
                  value={prodBreed}
                  onChange={(e) => setProdBreed(e.target.value)}
                  className="w-full bg-gray-50 border rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Berat (kg)</label>
                <input
                  type="number"
                  required
                  value={prodWeight}
                  onChange={(e) => setProdWeight(Number(e.target.value))}
                  className="w-full bg-gray-50 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border rounded-xl p-2.5"
                />
              </div>
            </div>

            {/* Location & Stock Section based on VIP vs Non-VIP */}
            {prodIsVIP ? (
              <div className="grid grid-cols-2 gap-3 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Provinsi Lokasi Hewan (VIP)</label>
                  <input
                    type="text"
                    required
                    value={prodProvince}
                    onChange={(e) => setProdProvince(e.target.value)}
                    placeholder="Contoh: Jawa Barat"
                    className="w-full bg-white border rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Detail Lokasi Kandang (VIP)</label>
                  <input
                    type="text"
                    required
                    value={prodLocationDetails}
                    onChange={(e) => setProdLocationDetails(e.target.value)}
                    placeholder="Contoh: Kandang Sultan Tapos Bogor"
                    className="w-full bg-white border rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-emerald-950 block text-xs">
                      Lokasi Provinsi & Kuota Stok Hewan (Multi-Provinsi)
                    </label>
                    <p className="text-[11px] text-emerald-700">
                      Penjual dapat menentukan lebih dari 1 lokasi provinsi untuk 1 produk hewan.
                    </p>
                  </div>
                  <span className="bg-emerald-800 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-xs">
                    Total Stok: {totalCalculatedStock} ekor
                  </span>
                </div>

                <div className="space-y-2">
                  {prodAllocations.map((alloc, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                      <div className="flex-1">
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Nama Provinsi</span>
                        <input
                          type="text"
                          required
                          value={alloc.province}
                          onChange={(e) => updateAllocationRow(idx, 'province', e.target.value)}
                          placeholder="Contoh: Aceh / Jawa Timur / NTT"
                          className="w-full border-b border-gray-200 focus:border-emerald-700 py-1 text-xs font-bold text-gray-900 focus:outline-none"
                        />
                      </div>
                      <div className="w-28">
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Kuota (Ekor)</span>
                        <input
                          type="number"
                          required
                          min={1}
                          value={alloc.stock}
                          onChange={(e) => updateAllocationRow(idx, 'stock', Number(e.target.value))}
                          className="w-full border-b border-gray-200 focus:border-emerald-700 py-1 text-xs font-extrabold text-emerald-900 focus:outline-none"
                        />
                      </div>
                      {prodAllocations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAllocationRow(idx)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg shrink-0 mt-3"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addAllocationRow}
                  className="w-full bg-white hover:bg-emerald-100/50 text-emerald-900 border border-emerald-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>+ Tambah Lokasi Provinsi Lainnya</span>
                </button>
              </div>
            )}

            <div>
              <label className="font-bold text-gray-700 block mb-1">Nomor SKKH (Keterangan Sehat Dokter Hewan)</label>
              <input
                type="text"
                required
                value={prodSKKH}
                onChange={(e) => setProdSKKH(e.target.value)}
                className="w-full bg-gray-50 border rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Deskripsi Lengkap</label>
              <textarea
                rows={3}
                required
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                placeholder="Jelaskan kondisi hewan, lokasi kandang, dan sasaran penerima daging..."
                className="w-full bg-gray-50 border rounded-xl p-2.5"
              />
            </div>

            {/* VIP Sultan Application Section */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prodIsVIP}
                  onChange={(e) => setProdIsVIP(e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                />
                <div>
                  <span className="font-extrabold text-amber-950 text-xs block">⭐ Ajukan sebagai "Kurban Sultan (VIP)"</span>
                  <span className="text-[11px] text-amber-800 leading-snug block">
                    Hewan kelas eksklusif/raksasa dengan fasilitas Live Streaming CCTV Kandang & Layanan Inspeksi Video Call. Memerlukan verifikasi & persetujuan Admin Utama.
                  </span>
                </div>
              </label>

              {prodIsVIP && (
                <div className="pt-2 border-t border-amber-200/60">
                  <label className="font-bold text-amber-950 block mb-1">Link Live CCTV Kandang (URL MP4 / Stream)</label>
                  <input
                    type="url"
                    value={prodCCTVUrl}
                    onChange={(e) => setProdCCTVUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs"
                  />
                  <p className="text-[10px] text-amber-700 mt-1">
                    Link stream CCTV ini akan ditampilkan di Live Feed Kandang Sultan jika disetujui Admin.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 text-white font-bold py-3 rounded-xl hover:bg-emerald-900"
            >
              Kirim Pendaftaran Produk
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: ADD ARTICLE FORM */}
      {activeTab === 'add_article' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md max-w-2xl mx-auto space-y-6">
          <h3 className="text-lg font-serif font-bold text-gray-900 border-b pb-3">Tulis Artikel Edukasi / Berita Lembaga</h3>

          {artSuccessMsg && (
            <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {artSuccessMsg}
            </div>
          )}

          <form onSubmit={handleAddArticleSubmit} className="space-y-4 text-xs">
            {/* Upload Cover Image Component */}
            <ArticleImageUploader
              imageUrl={artImageUrl}
              onChange={setArtImageUrl}
              label="Foto Sampul Utama Artikel"
            />

            <div>
              <label className="font-bold text-gray-700 block mb-1">Judul Artikel</label>
              <input
                type="text"
                required
                value={artTitle}
                onChange={(e) => setArtTitle(e.target.value)}
                placeholder="Contoh: Laporan Penyaluran Kurban Dompet Dhuafa di Pelosok Timor..."
                className="w-full bg-gray-50 border rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Kategori</label>
              <select
                value={artCategory}
                onChange={(e: any) => setArtCategory(e.target.value)}
                className="w-full bg-gray-50 border rounded-xl p-2.5"
              >
                <option value="Artikel Lembaga">Artikel Lembaga</option>
                <option value="Berita">Berita</option>
                <option value="Edukasi">Edukasi</option>
                <option value="Peternakan">Peternakan</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Ringkasan Singkat</label>
              <textarea
                rows={2}
                required
                value={artSummary}
                onChange={(e) => setArtSummary(e.target.value)}
                placeholder="Tuliskan ringkasan 2-3 kalimat menarik..."
                className="w-full bg-gray-50 border rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Isi Lengkap Artikel & Backlink</label>
              <ArticleContentToolbar
                content={artContent}
                onChange={setArtContent}
                orgName={sellerOrg.name}
              />
              <textarea
                rows={7}
                required
                value={artContent}
                onChange={(e) => setArtContent(e.target.value)}
                placeholder="Tuliskan isi artikel lengkap di sini. Gunakan tombol diatas untuk menyisipkan backlink/tautan atau foto..."
                className="w-full bg-gray-50 border border-t-0 rounded-b-xl p-3 font-sans leading-relaxed text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 text-white font-bold py-3 rounded-xl hover:bg-emerald-900"
            >
              Kirim Artikel Untuk Moderasi
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
