import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Article, Order, Organization, Product, AnimalType, ProvinceStat, NationalDataSummary } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { ShieldCheck, CheckCircle2, XCircle, Building2, Package, FileText, Database, Activity, RefreshCw, Award, Scale, Camera, Users, Eye, Edit3, Send, AlertTriangle, X, Check, Plus, Search, Crown, Star, Trash2, Tag, Truck, Calendar, MapPin, ChevronDown, ChevronUp, BarChart3, Calculator, TrendingUp, Globe, FileSpreadsheet } from 'lucide-react';
import { ArticleImageUploader, ArticleContentToolbar, ArticleContentRenderer } from './ArticleEditorTools';

/* ARTICLE ADMIN MODERATION MODAL */
interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

const ArticleAdminModerationModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const { approveArticle, editArticle, requestArticleRevision } = useApp();

  const [mode, setMode] = useState<'review' | 'edit' | 'request_revision'>('review');
  const [title, setTitle] = useState(article.title);
  const [category, setCategory] = useState(article.category);
  const [author, setAuthor] = useState(article.author);
  const [summary, setSummary] = useState(article.summary);
  const [content, setContent] = useState(article.content);
  const [imageUrl, setImageUrl] = useState(article.imageUrl);
  const [revisionNotes, setRevisionNotes] = useState(article.revisionNotes || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleApproveDirectly = () => {
    approveArticle(article.id);
    setFeedback('Artikel berhasil disetujui & dipublikasikan di Portal Edukasi!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSaveEditAndApprove = (e: React.FormEvent) => {
    e.preventDefault();
    editArticle(article.id, {
      title,
      category,
      author,
      summary,
      content,
      imageUrl,
      isApproved: true,
      status: 'approved',
      revisionNotes: '',
    });
    setFeedback('Perubahan oleh Admin berhasil disimpan & artikel telah disetujui!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSendRevisionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;
    requestArticleRevision(article.id, revisionNotes);
    setFeedback('Catatan moderasi berhasil dikirim ke Penjual/Lembaga untuk direvisi & dikirim ulang.');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-scale-up">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                Peninjauan & Moderasi Artikel
              </span>
              {article.resubmittedAt && (
                <span className="bg-emerald-800 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded">
                  Dikirim Ulang oleh Penjual
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold font-serif text-white mt-1">
              {article.title}
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Penulis: <span className="text-amber-300 font-bold">{article.author}</span> • Kategori: <span className="font-bold">{article.category}</span>
            </p>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-emerald-900 rounded-xl text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className="bg-emerald-100 border-b border-emerald-300 p-4 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            {feedback}
          </div>
        )}

        {/* Action Mode Toggle Bar */}
        <div className="bg-slate-100 p-2 sm:px-6 flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setMode('review')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'review' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-800" /> Peninjauan (Preview)
          </button>

          <button
            onClick={() => setMode('edit')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'edit' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" /> Edit Langsung
          </button>

          <button
            onClick={() => setMode('request_revision')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'request_revision' ? 'bg-amber-100 text-amber-900 shadow-xs border border-amber-300' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Minta Moderasi / Revisi
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 text-xs max-h-[70vh] overflow-y-auto space-y-6">

          {/* MODE 1: REVIEW / PREVIEW */}
          {mode === 'review' && (
            <div className="space-y-4">
              {article.revisionNotes && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-xs">
                  <p className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-700" /> Catatan Moderasi Sebelumnya:
                  </p>
                  <p className="mt-1 font-medium">{article.revisionNotes}</p>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={article.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-full md:w-48 h-32 object-cover rounded-xl border border-slate-200"
                />
                <div className="space-y-2 flex-1">
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                    {article.category}
                  </span>
                  <h3 className="font-serif font-bold text-base text-slate-900">{article.title}</h3>
                  <p className="text-slate-600 font-medium italic">{article.summary}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Isi Artikel Lengkap & Preview Backlink:</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-60 overflow-y-auto">
                  <ArticleContentRenderer content={article.content} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMode('request_revision')}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-700" /> Minta Moderasi / Revisi
                </button>

                <button
                  type="button"
                  onClick={handleApproveDirectly}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Setujui & Publikasikan Artikel
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: EDIT LANGSUNG ADMIN */}
          {mode === 'edit' && (
            <form onSubmit={handleSaveEditAndApprove} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-xs font-medium">
                Admin dapat menyunting langsung teks atau judul artikel sebelum disetujui secara resmi.
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Judul Artikel</label>
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
                  <label className="text-slate-700 font-bold block mb-1">Kategori</label>
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
                  <label className="text-slate-700 font-bold block mb-1">Penulis / Lembaga</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Ringkasan Artikel</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  required
                />
              </div>

              <ArticleImageUploader
                imageUrl={imageUrl}
                onChange={setImageUrl}
                label="Foto Sampul Utama Artikel"
              />

              <div>
                <label className="text-slate-700 font-bold block mb-1">Isi Teks Lengkap Artikel & Backlink</label>
                <ArticleContentToolbar
                  content={content}
                  onChange={setContent}
                  orgName={article.organizationName || article.author}
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-50 border border-t-0 rounded-b-xl p-3 text-slate-900 leading-relaxed font-sans focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMode('review')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Simpan Edit Admin & Setujui
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: MINTA MODERASI / REVISI */}
          {mode === 'request_revision' && (
            <form onSubmit={handleSendRevisionRequest} className="space-y-4">
              <div className="bg-amber-100 border border-amber-300 p-4 rounded-2xl text-amber-950 text-xs space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Minta Moderasi & Revisi kepada Penjual / Lembaga
                </p>
                <p>
                  Artikel akan dikembalikan ke dashboard penjual dengan catatan dari Admin. Penjual dapat memperbaiki isi/foto lalu mengirimkannya ulang.
                </p>
              </div>

              <div>
                <label className="text-slate-800 font-bold block mb-1">
                  Catatan Moderasi / Revisi Admin (Wajib diisi):
                </label>
                <textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  rows={4}
                  placeholder="Contoh: Mohon lengkapi kutipan nomor SK/Fatwa MUI, perbaiki ejaan, serta tambahkan foto resolusi tinggi."
                  className="w-full bg-white border border-amber-300 rounded-2xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMode('review')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Kirim Catatan Moderasi ke Penjual
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

/* SLAUGHTER REPORT EXECUTION ADMIN MODERATION MODAL */
interface ExecutionModalProps {
  order: Order;
  onClose: () => void;
}

const ExecutionReportAdminModerationModal: React.FC<ExecutionModalProps> = ({ order, onClose }) => {
  const { verifyAndIssueCertificate, editExecutionOrder, requestCertificateRevision } = useApp();

  const [mode, setMode] = useState<'review' | 'edit' | 'request_revision'>('review');

  const liveW = order.liveWeightKg || order.items[0]?.product.weightKg || 350;

  // Edit states
  const [shohibulQurbanName, setShohibulQurbanName] = useState(order.shohibulQurbanName);
  const [liveWeightKg, setLiveWeightKg] = useState<number>(liveW);
  const [slaughteredDate, setSlaughteredDate] = useState(order.slaughteredDate || '03 Agustus 2026 08:30 WITA');
  const [distributionProvince, setDistributionProvince] = useState(order.distributionProvince);
  const [distributionCity, setDistributionCity] = useState(order.distributionCity || '');
  const [photoBefore, setPhotoBefore] = useState(order.photoBeforeSlaughterUrl || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=800&auto=format&fit=crop&q=80');
  const [photoAfter, setPhotoAfter] = useState(order.photoAfterSlaughterUrl || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80');
  const [photoDist, setPhotoDist] = useState(order.photoDistributionUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80');

  // Revision state
  const [revisionNotes, setRevisionNotes] = useState(order.certificateRevisionNotes || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  const meatW = Math.round(liveWeightKg * 0.5);
  const families = meatW;
  const souls = families * 4;

  const handleApproveDirectly = () => {
    verifyAndIssueCertificate(order.id);
    setFeedback('Laporan pemotongan diverifikasi & Sertifikat Digital resmi berhasil diterbitkan!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSaveEditAndApprove = (e: React.FormEvent) => {
    e.preventDefault();
    editExecutionOrder(order.id, {
      shohibulQurbanName,
      liveWeightKg,
      distributedMeatKg: meatW,
      beneficiaryFamiliesCount: families,
      estimatedSoulsCount: souls,
      slaughteredDate,
      distributionProvince,
      distributionCity,
      photoBeforeSlaughterUrl: photoBefore,
      photoAfterSlaughterUrl: photoAfter,
      photoDistributionUrl: photoDist,
      adminVerifiedForCertificate: true,
      certificateIssued: true,
      revisionRequestedForCertificate: false,
      certificateRevisionNotes: '',
    });
    verifyAndIssueCertificate(order.id);
    setFeedback('Data laporan berhasil diperbarui oleh Admin & Sertifikat telah diterbitkan!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleSendRevisionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;
    requestCertificateRevision(order.id, revisionNotes);
    setFeedback('Catatan revisi laporan berhasil dikirim ke Lembaga Penjual untuk diperbaiki.');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-scale-up">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                Verifikasi Pelaksanaan Kurban
              </span>
              <span className="text-xs text-emerald-200 font-mono">{order.orderNumber}</span>
              {order.resubmittedForAdminVerification && (
                <span className="bg-emerald-800 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded">
                  Telah Dikirim Ulang Lembaga
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold font-serif text-white mt-1">
              {order.items[0]?.product.title}
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Shohibul Qurban: <span className="text-amber-300 font-bold">{order.shohibulQurbanName}</span> • Wilayah: <span className="font-bold">{order.distributionProvince}</span>
            </p>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-emerald-900 rounded-xl text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className="bg-emerald-100 border-b border-emerald-300 p-4 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            {feedback}
          </div>
        )}

        {/* Action Mode Toggle Bar */}
        <div className="bg-slate-100 p-2 sm:px-6 flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setMode('review')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'review' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-800" /> Peninjauan Detail Laporan
          </button>

          <button
            onClick={() => setMode('edit')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'edit' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" /> Edit Data Laporan
          </button>

          <button
            onClick={() => setMode('request_revision')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              mode === 'request_revision' ? 'bg-amber-100 text-amber-900 shadow-xs border border-amber-300' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Minta Moderasi / Revisi Laporan
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 text-xs max-h-[70vh] overflow-y-auto space-y-6">

          {/* MODE 1: REVIEW */}
          {mode === 'review' && (
            <div className="space-y-6">
              {order.certificateRevisionNotes && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-xs">
                  <p className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-700" /> Catatan Moderasi Laporan Sebelumnya:
                  </p>
                  <p className="mt-1 font-medium">{order.certificateRevisionNotes}</p>
                </div>
              )}

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <div>
                  <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">Bobot Timbang</span>
                  <span className="text-base font-extrabold text-slate-900">{liveWeightKg} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">Hasil Daging (50%)</span>
                  <span className="text-base font-extrabold text-emerald-900">{meatW} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">Penerima (1 kg/KK)</span>
                  <span className="text-base font-extrabold text-slate-900">{families} KK</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">Estimasi Jiwa (4/KK)</span>
                  <span className="text-base font-extrabold text-emerald-900">{souls} Jiwa</span>
                </div>
              </div>

              {/* 3 Verification Photos */}
              <div className="space-y-2">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-800" /> 3 Bukti Foto Pelaksanaan Kurban Syar’i:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-600">1. Hidup Sebelum Disembelih</p>
                    <img
                      src={photoBefore}
                      alt="Sebelum Disembelih"
                      className="w-full aspect-[3/2] object-cover rounded-2xl border border-slate-200 shadow-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-600">2. Penyembelihan Syar’i (Juleha)</p>
                    <img
                      src={photoAfter}
                      alt="Setelah Disembelih"
                      className="w-full aspect-[3/2] object-cover rounded-2xl border border-slate-200 shadow-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-600">3. Penyaluran ke Penerima Manfaat</p>
                    <img
                      src={photoDist}
                      alt="Distribusi Daging"
                      className="w-full aspect-[3/2] object-cover rounded-2xl border border-slate-200 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMode('request_revision')}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-700" /> Minta Moderasi / Revisi
                </button>

                <button
                  type="button"
                  onClick={handleApproveDirectly}
                  className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> Verifikasi & Terbitkan Sertifikat
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: EDIT LANGSUNG ADMIN */}
          {mode === 'edit' && (
            <form onSubmit={handleSaveEditAndApprove} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-xs font-medium">
                Admin dapat menyesuaikan angka bobot, lokasi, atau foto bukti kurban jika terdapat perbaikan minor sebelum sertifikat diterbitkan.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Nama Shohibul Qurban</label>
                  <input
                    type="text"
                    value={shohibulQurbanName}
                    onChange={(e) => setShohibulQurbanName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Bobot Hidup Hewan (kg)</label>
                  <input
                    type="number"
                    value={liveWeightKg}
                    onChange={(e) => setLiveWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Provinsi Penyaluran</label>
                  <input
                    type="text"
                    value={distributionProvince}
                    onChange={(e) => setDistributionProvince(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Kabupaten/Kota</label>
                  <input
                    type="text"
                    value={distributionCity}
                    onChange={(e) => setDistributionCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Waktu / Tanggal Penyembelihan Syar’i</label>
                <input
                  type="text"
                  value={slaughteredDate}
                  onChange={(e) => setSlaughteredDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  required
                />
              </div>

              <div className="space-y-3 pt-2">
                <p className="font-bold text-slate-900">URL 3 Foto Bukti Pelaksanaan:</p>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">1. Foto Sebelum Disembelih</label>
                  <input
                    type="text"
                    value={photoBefore}
                    onChange={(e) => setPhotoBefore(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">2. Foto Penyembelihan Syar’i</label>
                  <input
                    type="text"
                    value={photoAfter}
                    onChange={(e) => setPhotoAfter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">3. Foto Penyaluran Daging</label>
                  <input
                    type="text"
                    value={photoDist}
                    onChange={(e) => setPhotoDist(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMode('review')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> Simpan Edit Admin & Terbitkan Sertifikat
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: MINTA MODERASI / REVISI */}
          {mode === 'request_revision' && (
            <form onSubmit={handleSendRevisionRequest} className="space-y-4">
              <div className="bg-amber-100 border border-amber-300 p-4 rounded-2xl text-amber-950 text-xs space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Minta Moderasi & Revisi Laporan Pemotongan
                </p>
                <p>
                  Laporan akan dikembalikan ke Lembaga Penjual di Dashboard Penjual dengan catatan revisi. Lembaga dapat mengunggah ulang foto beresolusi jelas atau memperbaiki bobot lalu mengirimkannya kembali.
                </p>
              </div>

              <div>
                <label className="text-slate-800 font-bold block mb-1">
                  Catatan Moderasi / Revisi Laporan Admin (Wajib diisi):
                </label>
                <textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  rows={4}
                  placeholder="Contoh: Foto ke-2 penyembelihan syar’i buram / tidak memperlihatkan pisau Juleha. Mohon upload ulang foto berpencahayaan terang."
                  className="w-full bg-white border border-amber-300 rounded-2xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMode('review')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Kirim Catatan Revisi Laporan ke Lembaga
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

/* ORGANIZATION FORM MODAL FOR ADMIN */
interface OrganizationFormModalProps {
  org?: Organization | null;
  onClose: () => void;
}

const OrganizationFormModal: React.FC<OrganizationFormModalProps> = ({ org, onClose }) => {
  const { addOrganization, updateOrganization } = useApp();

  const [name, setName] = useState(org?.name || '');
  const [code, setCode] = useState(org?.code || '');
  const [logo, setLogo] = useState(org?.logo || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&auto=format&fit=crop&q=80');
  const [legalNumber, setLegalNumber] = useState(org?.legalNumber || 'SK Kemenag RI No. 123/2026');
  const [address, setAddress] = useState(org?.address || 'Jakarta');
  const [province, setProvince] = useState(org?.province || 'DKI Jakarta');
  const [contactPerson, setContactPerson] = useState(org?.contactPerson || 'Tim Layanan Kurban');
  const [phone, setPhone] = useState(org?.phone || '0812-3456-7890');
  const [email, setEmail] = useState(org?.email || 'kurban@lembaga.org');
  const [isVerified, setIsVerified] = useState(org?.isVerified ?? true);
  const [totalDistributed, setTotalDistributed] = useState<number>(org?.totalDistributed || 1000);
  const [rating, setRating] = useState<number>(org?.rating || 4.9);
  const [joinedYear, setJoinedYear] = useState<number>(org?.joinedYear || 2020);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (org) {
      updateOrganization(org.id, {
        name,
        code,
        logo,
        legalNumber,
        address,
        province,
        contactPerson,
        phone,
        email,
        isVerified,
        totalDistributed,
        rating,
        joinedYear,
      });
    } else {
      addOrganization({
        name,
        code,
        logo,
        legalNumber,
        address,
        province,
        contactPerson,
        phone,
        email,
        isVerified,
        totalDistributed,
        rating,
        joinedYear,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-scale-up">
        <div className="bg-emerald-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900">
          <div>
            <h2 className="text-lg font-bold font-serif text-white">
              {org ? `Edit Profil Lembaga: ${org.name}` : 'Tambah Lembaga Terverifikasi Baru'}
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Input data kelengkapan profil, SK Kemenag, dan kontak penanggung jawab lembaga.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-900 rounded-xl text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Nama Lembaga</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Dompet Dhuafa RI"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Kode Singkatan</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Contoh: DD / LZM / RZ"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 uppercase font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Nomor Legalitas / SK Kemenag</label>
              <input
                type="text"
                value={legalNumber}
                onChange={(e) => setLegalNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">URL Logo Lembaga</label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Provinsi Domisili/Pusat</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Alamat Kantor Pusat</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Nomor Telepon / WA</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Email Resmi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Total Kurban Terdistribusi</label>
              <input
                type="number"
                value={totalDistributed}
                onChange={(e) => setTotalDistributed(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Rating Kepercayaan</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Status Verifikasi</label>
              <select
                value={isVerified ? 'true' : 'false'}
                onChange={(e) => setIsVerified(e.target.value === 'true')}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
              >
                <option value="true">Verified (Terverifikasi)</option>
                <option value="false">Unverified (Belum Verifikasi)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow"
            >
              {org ? 'Simpan Perubahan Lembaga' : 'Tambah Lembaga Terverifikasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* PRODUCT ADD / EDIT ADMIN FORM MODAL */
interface ProductFormModalProps {
  product?: Product | null;
  onClose: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose }) => {
  const { organizations, addNewProduct, updateProduct, deleteProduct } = useApp();

  const [title, setTitle] = useState(product?.title || '');
  const [organizationId, setOrganizationId] = useState(product?.organizationId || organizations[0]?.id || 'org-1');
  const [type, setType] = useState<AnimalType>(product?.type || 'sapi');
  const [breed, setBreed] = useState(product?.breed || 'Sapi Limosin');
  const [weightKg, setWeightKg] = useState<number>(product?.weightKg || 350);
  const [ageMonths, setAgeMonths] = useState<number>(product?.ageMonths || 24);
  const [gender, setGender] = useState<'jantan' | 'betina'>(product?.gender || 'jantan');
  const [price, setPrice] = useState<number>(product?.price || 18500000);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(product?.discountPrice);
  const [province, setProvince] = useState(product?.province || 'DKI Jakarta');
  const [locationDetails, setLocationDetails] = useState(product?.locationDetails || 'Kandang Utama Tapos Bogor / Surabaya');
  const [shippingType, setShippingType] = useState<Product['shippingType']>(product?.shippingType || 'bebas_ongkir');
  const [healthCertNumber, setHealthCertNumber] = useState(product?.healthCertNumber || 'SKKH-KEMENTAN-2026/089');
  const [isVaccinatedPMK, setIsVaccinatedPMK] = useState<boolean>(product?.isVaccinatedPMK ?? true);
  const [isVaccinatedLSD, setIsVaccinatedLSD] = useState<boolean>(product?.isVaccinatedLSD ?? true);
  const [stock, setStock] = useState<number>(product?.stock ?? 10);
  const [image1, setImage1] = useState(product?.images[0] || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=800&auto=format&fit=crop&q=80');
  const [image2, setImage2] = useState(product?.images[1] || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80');
  const [videoUrl, setVideoUrl] = useState(product?.videoUrl || '');
  const [cctvUrl, setCctvUrl] = useState(product?.cctvUrl || 'https://www.w3schools.com/html/mov_bbb.mp4');
  const [has360View, setHas360View] = useState<boolean>(product?.has360View ?? true);
  const [isPremiumUnik, setIsPremiumUnik] = useState<boolean>(product?.isPremiumUnik ?? false);
  const [isFeaturedHome, setIsFeaturedHome] = useState<boolean>(product?.isFeaturedHome ?? false);
  const [isFeaturedLiveFeed, setIsFeaturedLiveFeed] = useState<boolean>(product?.isFeaturedLiveFeed ?? false);
  const [isApproved, setIsApproved] = useState<boolean>(product?.isApproved ?? true);
  const [description, setDescription] = useState(product?.description || '');
  const [programName, setProgramName] = useState(product?.programName || '');
  const [targetBeneficiaries, setTargetBeneficiaries] = useState(product?.targetBeneficiaries || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedOrg = organizations.find((o) => o.id === organizationId) || organizations[0];

    const prodData = {
      title: title || `${type === 'sapi' ? 'Sapi' : type === 'kambing' ? 'Kambing' : 'Domba'} ${breed} (${weightKg} kg)`,
      organizationId: matchedOrg.id,
      organizationName: matchedOrg.name,
      organizationLogo: matchedOrg.logo,
      type,
      breed,
      weightKg: Number(weightKg),
      ageMonths: Number(ageMonths),
      gender,
      price: Number(price),
      discountPrice: discountPrice && Number(discountPrice) > 0 ? Number(discountPrice) : undefined,
      province,
      locationDetails,
      shippingType,
      estimatedDistributionDate: '10-13 Dzulhijjah 1447 H / Juni 2026',
      healthCertNumber,
      isVaccinatedPMK,
      isVaccinatedLSD,
      stock: Number(stock),
      images: [image1, image2].filter(Boolean),
      videoUrl: videoUrl || undefined,
      cctvUrl: cctvUrl || undefined,
      has360View,
      isPremiumUnik,
      isFeaturedHome,
      isFeaturedLiveFeed,
      isApproved,
      description: description || `Hewan Kurban ${type.toUpperCase()} berkualitas super ras ${breed} dengan bobot ${weightKg} kg, dalam kondisi sehat sempurna dan siap dikurbankan.`,
      programName: programName || undefined,
      targetBeneficiaries: targetBeneficiaries || undefined,
    };

    if (product) {
      updateProduct(product.id, prodData);
    } else {
      addNewProduct(prodData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (product && confirm(`Apakah Anda yakin ingin menghapus produk ${product.title} dari katalog?`)) {
      deleteProduct(product.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-scale-up">
        <div className="bg-emerald-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                {product ? 'Edit Katalog Hewan' : 'Tambah Hewan Kurban Baru'}
              </span>
              {isPremiumUnik && (
                <span className="bg-amber-500 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-emerald-950" /> VIP Unik
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold font-serif text-white mt-1">
              {product ? product.title : 'Formulir Input Hewan Kurban'}
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Lengkapi data teknis hewan, SKKH Kementan RI, harga, dan opsi Kurban Unik VIP.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-900 rounded-xl text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* VIP Unik Notice Box */}
          {isPremiumUnik && (
            <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 border border-amber-400 p-3.5 rounded-2xl text-amber-900 text-xs font-bold flex items-center gap-2.5">
              <Crown className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-slate-900 font-bold">Hewan Kurban Unik (VIP Sultan) Aktif</p>
                <p className="text-emerald-900 text-[11px] font-medium mt-0.5">
                  Kandang Kurban Unik (VIP) tersedia untuk pengiriman Jabodetabek dan Surabaya (Free)
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Judul / Nama Produk</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Sapi Limosin Super Class 450 Kg"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Penyedia / Lembaga Kurban</label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Jenis Hewan</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AnimalType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold capitalize"
              >
                <option value="sapi">Sapi</option>
                <option value="kambing">Kambing</option>
                <option value="domba">Domba</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Ras / Breed</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Contoh: Limosin / Etawa / Garut"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Jenis Kelamin</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'jantan' | 'betina')}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold capitalize"
              >
                <option value="jantan">Jantan</option>
                <option value="betina">Betina</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Bobot Timbang (Kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Umur (Bulan)</label>
              <input
                type="number"
                value={ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Jumlah Stok Tersedia</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Harga Resmi Kurban (Rp)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-emerald-900 font-black text-sm"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Harga Diskon / Coret (Opsional Rp)</label>
              <input
                type="number"
                value={discountPrice || ''}
                onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Biarkan kosong jika tidak ada diskon"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Provinsi Lokasi Hewan</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Detail Lokasi Kandang</label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="Contoh: Kandang Utama Tapos Bogor / Surabaya"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Jenis Pengiriman / Distribusi</label>
              <select
                value={shippingType}
                onChange={(e) => setShippingType(e.target.value as Product['shippingType'])}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
              >
                <option value="bebas_ongkir">Bebas Ongkir Nasional / Jabodetabek & Surabaya</option>
                <option value="lokal">Lokal Terdekat</option>
                <option value="olahan_kornet">Olahan Kornet / Rendang Superqurban</option>
                <option value="distribusi_3t">Tebar Hewan Pelosok 3T</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Nomor SKKH Kementan RI</label>
              <input
                type="text"
                value={healthCertNumber}
                onChange={(e) => setHealthCertNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono font-bold"
                required
              />
            </div>
          </div>

          {/* Special VIP & Display Location Toggles */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-extrabold text-amber-950 text-xs">
                <input
                  type="checkbox"
                  checked={isPremiumUnik}
                  onChange={(e) => setIsPremiumUnik(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Tandai Sebagai Kurban Sultan (VIP)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-extrabold text-emerald-950 text-xs bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                <input
                  type="checkbox"
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                  className="w-4 h-4 accent-emerald-800 rounded"
                />
                <span>Setujui & Publikasikan (Status Live)</span>
              </label>
            </div>

            <p className="text-[11px] text-amber-900/80 pl-6">
              Kandang Kurban Sultan (VIP) memiliki fasilitas pengiriman Jabodetabek & Surabaya Free, Live Stream CCTV 24/7, dan Video Call Inspeksi.
            </p>

            {/* Display Placement Options */}
            <div className="pt-2 border-t border-amber-200/80 space-y-2">
              <p className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-600" />
                Pengaturan Tampilan Khusus Dashboard Admin:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeaturedHome}
                    onChange={(e) => setIsFeaturedHome(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-amber-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">🏠 Tampil di Beranda Utama (1 Produk)</span>
                    <span className="text-[10px] text-slate-500 block">Menjadikan produk ini sebagai sorotan utama di Hero Beranda.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeaturedLiveFeed}
                    onChange={(e) => setIsFeaturedLiveFeed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-amber-500 rounded"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">📹 Tampil di Live Feed CCTV Kandang VIP (Maks 3)</span>
                    <span className="text-[10px] text-slate-500 block">Menjadikan produk ini pilihan kamera live feed di halaman VIP.</span>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <label className="font-bold text-slate-800 block mb-1">Link Video Live CCTV Kandang (URL Stream MP4)</label>
                <input
                  type="text"
                  value={cctvUrl}
                  onChange={(e) => setCctvUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 text-xs">
                <input
                  type="checkbox"
                  checked={has360View}
                  onChange={(e) => setHas360View(e.target.checked)}
                  className="w-4 h-4 accent-emerald-800 rounded"
                />
                <span>Aktifkan Fitur Look 360°</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-bold block mb-1">URL Foto Utama</label>
              <input
                type="text"
                value={image1}
                onChange={(e) => setImage1(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">URL Foto Sekunder</label>
              <input
                type="text"
                value={image2}
                onChange={(e) => setImage2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Deskripsi Lengkap Produk</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan kondisi hewan, perawatan, dan keunggulan ras..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            {product ? (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-red-200"
              >
                <Trash2 className="w-4 h-4" /> Hapus Produk
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow"
              >
                {product ? 'Simpan Perubahan Produk' : 'Tambah Produk Ke Katalog'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* NATIONAL SUMMARY EDIT MODAL */
interface NationalSummaryModalProps {
  summary: NationalDataSummary;
  onClose: () => void;
  onSave: (updated: Partial<NationalDataSummary>) => void;
}

const NationalSummaryFormModal: React.FC<NationalSummaryModalProps> = ({ summary, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'kementan' | 'lembaga'>('kementan');

  const [year, setYear] = useState(summary.year);

  // Data 1: Kementan Stock State
  const [kementanSapi, setKementanSapi] = useState(summary.kementanStock?.sapiStock ?? summary.totalSapi ?? 729700);
  const [kementanKambing, setKementanKambing] = useState(summary.kementanStock?.kambingStock ?? summary.totalKambing ?? 952200);
  const [kementanDomba, setKementanDomba] = useState(summary.kementanStock?.dombaStock ?? summary.totalDomba ?? 616600);
  const [kementanTotal, setKementanTotal] = useState(summary.kementanStock?.totalStock ?? summary.totalAnimals ?? 2298500);
  const [kementanReadiness, setKementanReadiness] = useState(summary.kementanStock?.readinessPercent ?? 98.6);
  const [kementanLastUpdated, setKementanLastUpdated] = useState(summary.kementanStock?.lastUpdated ?? summary.lastUpdatedFromKementan ?? '03 Agustus 2026 (Sumber: Ditjen PKH Kementerian Pertanian RI)');

  // Data 2: Lembaga Realization State
  const [realizedSapi, setRealizedSapi] = useState(summary.lembagaRealization?.realizedSapi ?? 582100);
  const [realizedKambing, setRealizedKambing] = useState(summary.lembagaRealization?.realizedKambing ?? 765400);
  const [realizedDomba, setRealizedDomba] = useState(summary.lembagaRealization?.realizedDomba ?? 495000);
  const [realizedTotal, setRealizedTotal] = useState(summary.lembagaRealization?.totalRealizedAnimals ?? 1842500);
  const [totalTonMeat, setTotalTonMeat] = useState(summary.lembagaRealization?.totalTonMeatDistributed ?? summary.totalTonMeatDistributed ?? 42150);
  const [totalBeneficiaries, setTotalBeneficiaries] = useState(summary.lembagaRealization?.totalBeneficiaries ?? summary.totalBeneficiaries ?? 8633600);
  const [totalBuyers, setTotalBuyers] = useState(summary.lembagaRealization?.totalBuyers ?? summary.totalBuyers ?? 184500);
  const [totalOrgs, setTotalOrgs] = useState(summary.lembagaRealization?.totalReportingOrgs ?? summary.totalOrganizations ?? 112);
  const [lembagaLastUpdated, setLembagaLastUpdated] = useState(summary.lembagaRealization?.lastUpdated ?? '08 Agustus 2026 (Konsolidasi Laporan Realisasi 112 Lembaga & BAZNAS)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedKementanTotal = kementanSapi + kementanKambing + kementanDomba;
    const calculatedRealizedTotal = realizedSapi + realizedKambing + realizedDomba;

    onSave({
      year,
      // Data 1
      kementanStock: {
        totalStock: calculatedKementanTotal,
        sapiStock: kementanSapi,
        kambingStock: kementanKambing,
        dombaStock: kementanDomba,
        readinessPercent: kementanReadiness,
        lastUpdated: kementanLastUpdated,
      },
      // Data 2
      lembagaRealization: {
        totalRealizedAnimals: calculatedRealizedTotal,
        realizedSapi,
        realizedKambing,
        realizedDomba,
        totalTonMeatDistributed: totalTonMeat,
        totalBeneficiaries,
        totalBuyers,
        totalReportingOrgs: totalOrgs,
        lastUpdated: lembagaLastUpdated,
      },

      // Sync top level
      totalAnimals: calculatedKementanTotal,
      totalSapi: kementanSapi,
      totalKambing: kementanKambing,
      totalDomba: kementanDomba,
      totalOrganizations: totalOrgs,
      totalBuyers,
      totalBeneficiaries,
      totalTonMeatDistributed: totalTonMeat,
      lastUpdatedFromKementan: kementanLastUpdated,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 relative animate-scale-up">
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base">Edit Dual Data Dashboard Nasional (Tahun 2026)</h3>
              <p className="text-[11px] text-emerald-200">Kelola Data Stok Resmi Kementan (2026) & Realisasi Lembaga (2026)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dataset Tabs */}
        <div className="bg-slate-100 p-2 flex border-b border-slate-200 text-xs font-bold gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('kementan')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'kementan'
                ? 'bg-emerald-900 text-white shadow'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" /> Data 1: Stok Resmi Kementan RI (2026)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lembaga')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'lembaga'
                ? 'bg-emerald-900 text-white shadow'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" /> Data 2: Realisasi Lembaga (2026)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Global Year */}
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
            <span className="font-bold text-amber-950">Tahun Anggaran Dashboard:</span>
            <input
              type="number"
              required
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-white border border-amber-300 rounded-xl px-3 py-1 font-extrabold text-amber-950 text-center w-24 focus:outline-none"
            />
          </div>

          {/* TAB 1: KEMENTAN STOCK */}
          {activeTab === 'kementan' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-emerald-900 text-[11px] font-semibold flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <span>
                  <strong>Data Stok Resmi Kementan RI:</strong> Merupakan jumlah populasi hewan siap kurban yang telah terekapitulasi oleh Dinas Peternakan 38 Provinsi & Ditjen PKH Kementan.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stok Sapi (Ekor)</label>
                  <input
                    type="number"
                    value={kementanSapi}
                    onChange={(e) => setKementanSapi(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stok Kambing (Ekor)</label>
                  <input
                    type="number"
                    value={kementanKambing}
                    onChange={(e) => setKementanKambing(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stok Domba (Ekor)</label>
                  <input
                    type="number"
                    value={kementanDomba}
                    onChange={(e) => setKementanDomba(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kesiapan Sehat & SKKH Veteriner (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={kementanReadiness}
                    onChange={(e) => setKementanReadiness(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-emerald-900 font-extrabold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Kalkulasi Stok (Auto)</label>
                  <div className="bg-emerald-950 text-amber-300 font-black text-sm p-2.5 rounded-xl text-center">
                    {(kementanSapi + kementanKambing + kementanDomba).toLocaleString('id-ID')} Ekor
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan / Sumber Update Kementan RI</label>
                <textarea
                  rows={2}
                  value={kementanLastUpdated}
                  onChange={(e) => setKementanLastUpdated(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LEMBAGA REALIZATION */}
          {activeTab === 'lembaga' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 text-blue-900 text-[11px] font-semibold flex items-start gap-2">
                <Activity className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                <span>
                  <strong>Data Realisasi Pelaksanaan Lembaga:</strong> Merupakan rekapitulasi pemotongan kurban, pendistribusian daging, dan statistik shohibul yang diinput oleh 112 Lembaga & BAZNAS.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Realisasi Sapi (Ekor)</label>
                  <input
                    type="number"
                    value={realizedSapi}
                    onChange={(e) => setRealizedSapi(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Realisasi Kambing (Ekor)</label>
                  <input
                    type="number"
                    value={realizedKambing}
                    onChange={(e) => setRealizedKambing(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Realisasi Domba (Ekor)</label>
                  <input
                    type="number"
                    value={realizedDomba}
                    onChange={(e) => setRealizedDomba(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Daging Terdistribusi (Ton)</label>
                  <input
                    type="number"
                    value={totalTonMeat}
                    onChange={(e) => setTotalTonMeat(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Penerima Manfaat (Jiwa)</label>
                  <input
                    type="number"
                    value={totalBeneficiaries}
                    onChange={(e) => setTotalBeneficiaries(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Shohibul / Pekurban Terdaftar</label>
                  <input
                    type="number"
                    value={totalBuyers}
                    onChange={(e) => setTotalBuyers(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Lembaga Melaporkan</label>
                  <input
                    type="number"
                    value={totalOrgs}
                    onChange={(e) => setTotalOrgs(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Pemotongan (Auto)</label>
                  <div className="bg-slate-900 text-emerald-400 font-black text-sm p-2.5 rounded-xl text-center">
                    {(realizedSapi + realizedKambing + realizedDomba).toLocaleString('id-ID')} Ekor
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan / Sumber Konsolidasi Lembaga</label>
                <textarea
                  rows={2}
                  value={lembagaLastUpdated}
                  onChange={(e) => setLembagaLastUpdated(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-xl flex items-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Simpan Pembaruan Dual Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* PROVINCE STAT EDIT MODAL */
interface ProvinceModalProps {
  province: ProvinceStat | null;
  onClose: () => void;
  onSave: (data: ProvinceStat) => void;
}

const ProvinceStatFormModal: React.FC<ProvinceModalProps> = ({ province, onClose, onSave }) => {
  const [name, setName] = useState(province?.name || '');
  const [code, setCode] = useState(province?.code || '');
  const [region, setRegion] = useState<ProvinceStat['region']>(province?.region || 'Jawa');
  
  // Data 1: Stok Kementan
  const [sapiCount, setSapiCount] = useState(province?.sapiCount || 0);
  const [kambingCount, setKambingCount] = useState(province?.kambingCount || 0);
  const [dombaCount, setDombaCount] = useState(province?.dombaCount || 0);

  // Data 2: Realisasi Input Lembaga
  const [realizedSapiCount, setRealizedSapiCount] = useState(province?.realizedSapiCount || Math.round((province?.sapiCount || 0) * 0.82));
  const [realizedKambingCount, setRealizedKambingCount] = useState(province?.realizedKambingCount || Math.round((province?.kambingCount || 0) * 0.82));
  const [realizedDombaCount, setRealizedDombaCount] = useState(province?.realizedDombaCount || Math.round((province?.dombaCount || 0) * 0.82));

  const [beneficiariesCount, setBeneficiariesCount] = useState(province?.beneficiariesCount || 0);
  const [villagesCount, setVillagesCount] = useState(province?.villagesCount || 0);
  const [districtsCount, setDistrictsCount] = useState(province?.districtsCount || 0);
  const [povertyIndex, setPovertyIndex] = useState<'High' | 'Medium' | 'Low'>(province?.povertyIndex || 'Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAnimalCount = Number(sapiCount) + Number(kambingCount) + Number(dombaCount);
    const realizedTotalCount = Number(realizedSapiCount) + Number(realizedKambingCount) + Number(realizedDombaCount);

    const newProvData: ProvinceStat = {
      id: province ? province.id : `prov-${Date.now()}`,
      name,
      code,
      region,
      mapX: province?.mapX || 50,
      mapY: province?.mapY || 50,
      sapiCount: Number(sapiCount),
      kambingCount: Number(kambingCount),
      dombaCount: Number(dombaCount),
      totalAnimalCount,
      realizedSapiCount: Number(realizedSapiCount),
      realizedKambingCount: Number(realizedKambingCount),
      realizedDombaCount: Number(realizedDombaCount),
      realizedTotalCount,
      beneficiariesCount: Number(beneficiariesCount),
      villagesCount: Number(villagesCount),
      districtsCount: Number(districtsCount),
      lat: province?.lat || -2.5,
      lng: province?.lng || 118.0,
      povertyIndex,
    };
    onSave(newProvData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 relative animate-scale-up">
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-base">
              {province ? `Edit Data Wilayah: ${province.name}` : 'Tambah Data Provinsi Baru'}
            </h3>
          </div>
          <button onClick={onClose} className="text-emerald-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nama Provinsi *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Jawa Timur"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kode Provinsi *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: JT / JATIM"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 uppercase font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Wilayah / Pulau *</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as ProvinceStat['region'])}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              >
                <option value="Sumatera">Sumatera</option>
                <option value="Jawa">Jawa</option>
                <option value="Kalimantan">Kalimantan</option>
                <option value="Sulawesi">Sulawesi</option>
                <option value="Nusa Tenggara">Nusa Tenggara</option>
                <option value="Maluku">Maluku</option>
                <option value="Papua">Papua</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Indeks Kerawanan (Poverty Index)</label>
              <select
                value={povertyIndex}
                onChange={(e) => setPovertyIndex(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              >
                <option value="High">High (Prioritas Utama 3T)</option>
                <option value="Medium">Medium (Sedang)</option>
                <option value="Low">Low (Rendah)</option>
              </select>
            </div>
          </div>

          {/* Data 1: Stok Kementan Section */}
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-3">
            <h4 className="font-bold text-emerald-950 text-xs flex items-center justify-between">
              <span>[Data 1] Stok Resmi Kementan RI</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md font-mono">
                Total: {(Number(sapiCount) + Number(kambingCount) + Number(dombaCount)).toLocaleString('id-ID')} Ekor
              </span>
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Stok Sapi</label>
                <input
                  type="number"
                  value={sapiCount}
                  onChange={(e) => setSapiCount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Stok Kambing</label>
                <input
                  type="number"
                  value={kambingCount}
                  onChange={(e) => setKambingCount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Stok Domba</label>
                <input
                  type="number"
                  value={dombaCount}
                  onChange={(e) => setDombaCount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-800"
                />
              </div>
            </div>
          </div>

          {/* Data 2: Realisasi Lembaga Section */}
          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 space-y-3">
            <h4 className="font-bold text-blue-950 text-xs flex items-center justify-between">
              <span>[Data 2] Realisasi Pemotongan Lembaga / BAZNAS</span>
              <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-md font-mono">
                Total: {(Number(realizedSapiCount) + Number(realizedKambingCount) + Number(realizedDombaCount)).toLocaleString('id-ID')} Ekor
              </span>
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Realisasi Sapi</label>
                <input
                  type="number"
                  value={realizedSapiCount}
                  onChange={(e) => setRealizedSapiCount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:ring-2 focus:ring-blue-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Realisasi Kambing</label>
                <input
                  type="number"
                  value={realizedKambingCount}
                  onChange={(e) => setRealizedKambingCount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:ring-2 focus:ring-blue-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Realisasi Domba</label>
                <input
                  type="number"
                  value={realizedDombaCount}
                  onChange={(e) => setRealizedDombaCount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 font-bold focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Penerima Manfaat (Jiwa)</label>
              <input
                type="number"
                value={beneficiariesCount}
                onChange={(e) => setBeneficiariesCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Jumlah Desa</label>
              <input
                type="number"
                value={villagesCount}
                onChange={(e) => setVillagesCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Jumlah Kecamatan</label>
              <input
                type="number"
                value={districtsCount}
                onChange={(e) => setDistrictsCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-extrabold rounded-xl flex items-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Simpan Data Provinsi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ORGANIZATION REALIZATION REPORT EDIT MODAL */
interface OrgRealizationModalProps {
  organization: Organization;
  onClose: () => void;
  onSave: (orgId: string, updatedFields: Partial<Organization>) => void;
}

const OrgRealizationModal: React.FC<OrgRealizationModalProps> = ({ organization, onClose, onSave }) => {
  const [sapi, setSapi] = useState(organization.realizationSapi || 0);
  const [kambing, setKambing] = useState(organization.realizationKambing || 0);
  const [domba, setDomba] = useState(organization.realizationDomba || 0);
  const [tonMeat, setTonMeat] = useState(organization.realizationTonMeat || 0);
  const [beneficiaries, setBeneficiaries] = useState(organization.realizationBeneficiaries || 0);
  const [shohibul, setShohibul] = useState(organization.realizationShohibul || 0);
  const [reportStatus, setReportStatus] = useState<Organization['reportStatus']>(organization.reportStatus || 'terverifikasi');
  const [lastReportedDate, setLastReportedDate] = useState(organization.lastReportedDate || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(organization.id, {
      realizationSapi: sapi,
      realizationKambing: kambing,
      realizationDomba: domba,
      realizationTonMeat: tonMeat,
      realizationBeneficiaries: beneficiaries,
      realizationShohibul: shohibul,
      reportStatus,
      lastReportedDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 relative animate-scale-up">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src={organization.logo} alt={organization.name} className="w-10 h-10 rounded-full object-cover border-2 border-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base text-amber-300">Edit Laporan Realisasi Kurban Lembaga</h3>
              <p className="text-xs text-slate-300 font-bold">{organization.name} • {organization.code}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 text-blue-900 text-[11px] font-medium flex items-start gap-2">
            <Activity className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
            <span>
              Pembaruan data laporan realisasi milik <strong>{organization.name}</strong> akan tersimpan di basis data terverifikasi BAZNAS & Kementan RI.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Realisasi Sapi (Ekor)</label>
              <input
                type="number"
                value={sapi}
                onChange={(e) => setSapi(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-blue-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Realisasi Kambing (Ekor)</label>
              <input
                type="number"
                value={kambing}
                onChange={(e) => setKambing(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-blue-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Realisasi Domba (Ekor)</label>
              <input
                type="number"
                value={domba}
                onChange={(e) => setDomba(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-blue-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Daging Terdistribusi (Ton)</label>
              <input
                type="number"
                value={tonMeat}
                onChange={(e) => setTonMeat(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-blue-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Penerima Manfaat (Jiwa)</label>
              <input
                type="number"
                value={beneficiaries}
                onChange={(e) => setBeneficiaries(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-blue-800"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Total Shohibul Pekurban</label>
              <input
                type="number"
                value={shohibul}
                onChange={(e) => setShohibul(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-blue-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Status Verifikasi Laporan</label>
              <select
                value={reportStatus}
                onChange={(e) => setReportStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-blue-800"
              >
                <option value="terverifikasi">Terverifikasi Admin BAZNAS & Kementan</option>
                <option value="terkirim">Terkirim (Menunggu Verifikasi Akhir)</option>
                <option value="pending">Pending / Menunggu Pengisian Data Lengkap</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tanggal / Catatan Laporan</label>
              <input
                type="text"
                value={lastReportedDate}
                onChange={(e) => setLastReportedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-blue-800"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl flex items-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" /> Simpan Laporan Lembaga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    products,
    articles,
    organizations,
    updateOrganization,
    orders,
    auditLogs,
    nationalSummary,
    updateNationalSummary,
    provinces,
    updateProvinceStat,
    addProvinceStat,
    approveProduct,
    toggleFeaturedHomeProduct,
    toggleFeaturedLiveFeedProduct,
    togglePremiumUnikProduct,
    approveArticle,
    verifyOrganization,
    verifyAndIssueCertificate,
    updateProduct,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'products' | 'certificates' | 'lembaga' | 'national_stats' | 'audit_logs'>('approvals');
  const [articleSubTab, setArticleSubTab] = useState<'all' | 'pending' | 'published'>('all');
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // National Data Control Modals & Filters
  const [isNationalSummaryModalOpen, setIsNationalSummaryModalOpen] = useState(false);
  const [selectedProvinceForEdit, setSelectedProvinceForEdit] = useState<ProvinceStat | null | 'new'>(null);
  const [selectedOrgForRealizationEdit, setSelectedOrgForRealizationEdit] = useState<Organization | null>(null);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [provinceRegionFilter, setProvinceRegionFilter] = useState<string>('all');
  const [orgReportSearch, setOrgReportSearch] = useState('');

  // Manual Kementan Form Local State
  const activeYear = nationalSummary.currentYear || 2026;
  const isPostIduladha = nationalSummary.consolidationPhase === 'post_iduladha';
  const kementanData = nationalSummary.kementanStock || {
    totalStock: nationalSummary.totalAnimals || 2298500,
    sapiStock: nationalSummary.totalSapi || 729700,
    kambingStock: nationalSummary.totalKambing || 952200,
    dombaStock: nationalSummary.totalDomba || 616600,
    readinessPercent: 98.6,
    lastUpdated: nationalSummary.lastUpdatedFromKementan || '03 Agustus 2026 (Ditjen PKH Kementan RI)',
  };

  const [manualKementanSapi, setManualKementanSapi] = useState(kementanData.sapiStock);
  const [manualKementanKambing, setManualKementanKambing] = useState(kementanData.kambingStock);
  const [manualKementanDomba, setManualKementanDomba] = useState(kementanData.dombaStock);
  const [manualKementanReadiness, setManualKementanReadiness] = useState(kementanData.readinessPercent);
  const [manualKementanNote, setManualKementanNote] = useState(kementanData.lastUpdated);

  // Sync state if nationalSummary updates
  useEffect(() => {
    if (nationalSummary.kementanStock) {
      setManualKementanSapi(nationalSummary.kementanStock.sapiStock);
      setManualKementanKambing(nationalSummary.kementanStock.kambingStock);
      setManualKementanDomba(nationalSummary.kementanStock.dombaStock);
      setManualKementanReadiness(nationalSummary.kementanStock.readinessPercent);
      setManualKementanNote(nationalSummary.kementanStock.lastUpdated);
    }
  }, [nationalSummary]);

  const handleSaveKementanManualInput = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotal = manualKementanSapi + manualKementanKambing + manualKementanDomba;
    
    updateNationalSummary({
      kementanStock: {
        totalStock: calculatedTotal,
        sapiStock: manualKementanSapi,
        kambingStock: manualKementanKambing,
        dombaStock: manualKementanDomba,
        readinessPercent: manualKementanReadiness,
        lastUpdated: manualKementanNote,
      },
      totalAnimals: calculatedTotal,
      totalSapi: manualKementanSapi,
      totalKambing: manualKementanKambing,
      totalDomba: manualKementanDomba,
      lastUpdatedFromKementan: manualKementanNote,
    });

    setSyncNotice(`Data Stok Resmi Kementan RI Tahun ${activeYear} berhasil diperbarui secara manual oleh Admin!`);
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const handleAutoRecalculateLembagaRealization = () => {
    const totalSapi = organizations.reduce((acc, o) => acc + (o.realizationSapi || 0), 0);
    const totalKambing = organizations.reduce((acc, o) => acc + (o.realizationKambing || 0), 0);
    const totalDomba = organizations.reduce((acc, o) => acc + (o.realizationDomba || 0), 0);
    const totalTonMeat = organizations.reduce((acc, o) => acc + (o.realizationTonMeat || 0), 0);
    const totalBeneficiaries = organizations.reduce((acc, o) => acc + (o.realizationBeneficiaries || 0), 0);
    const totalBuyers = organizations.reduce((acc, o) => acc + (o.realizationShohibul || 0), 0);
    const totalReportingOrgs = organizations.length;

    const targetYear = isPostIduladha ? activeYear : (activeYear - 1);

    updateNationalSummary({
      lembagaRealization: {
        year: targetYear,
        isConsolidatedCurrentYear: isPostIduladha,
        stageLabel: isPostIduladha ? `Pasca Pelaksanaan & Konsolidasi Data (${targetYear})` : `Sebelum Iduladha (Data Realisasi ${targetYear})`,
        totalRealizedAnimals: totalSapi + totalKambing + totalDomba,
        realizedSapi: totalSapi,
        realizedKambing: totalKambing,
        realizedDomba: totalDomba,
        totalTonMeatDistributed: totalTonMeat,
        totalBeneficiaries,
        totalBuyers,
        totalReportingOrgs,
        lastUpdated: `${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} (Konsolidasi Otomatis ${totalReportingOrgs} Lembaga & BAZNAS)`,
      }
    });

    setSyncNotice('Berhasil merekapitulasi total Data 2 dari seluruh laporan lembaga terverifikasi!');
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const handleAutoRecalculateNationalSummary = () => {
    const totalSapi = provinces.reduce((acc, p) => acc + p.sapiCount, 0);
    const totalKambing = provinces.reduce((acc, p) => acc + p.kambingCount, 0);
    const totalDomba = provinces.reduce((acc, p) => acc + p.dombaCount, 0);
    const totalAnimals = totalSapi + totalKambing + totalDomba;
    const totalBeneficiaries = provinces.reduce((acc, p) => acc + p.beneficiariesCount, 0);
    const totalOrganizations = organizations.length;
    const paidOrdersCount = orders.filter((o) => o.paymentStatus === 'paid').length;
    const totalBuyers = paidOrdersCount > 0 ? paidOrdersCount : nationalSummary.totalBuyers;
    const totalTonMeatDistributed = Math.round((totalSapi * 120 + totalKambing * 15 + totalDomba * 15) / 1000);

    updateNationalSummary({
      totalAnimals,
      totalSapi,
      totalKambing,
      totalDomba,
      totalOrganizations,
      totalBuyers,
      totalBeneficiaries,
      totalTonMeatDistributed: totalTonMeatDistributed > 0 ? totalTonMeatDistributed : nationalSummary.totalTonMeatDistributed,
      lastUpdatedFromKementan: `${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} (Sumber: System Auto-Recap & Kementan RI)`,
    });

    setSyncNotice('Berhasil merekapitulasi data agregat nasional berdasarkan kalkulasi data 38 Provinsi & Sistem!');
    setTimeout(() => setSyncNotice(null), 4000);
  };

  // Admin Edit Profile Modal State
  const [isAdminProfileModalOpen, setIsAdminProfileModalOpen] = useState(false);
  const [adminName, setAdminName] = useState(currentUser.name);
  const [adminTitle, setAdminTitle] = useState(currentUser.adminTitle || 'Superintendent & Verifikator Nasional');
  const [adminEmail, setAdminEmail] = useState(currentUser.email);
  const [adminPhone, setAdminPhone] = useState(currentUser.phone || '');
  const [adminAddress, setAdminAddress] = useState(currentUser.address || '');
  const [adminAvatar, setAdminAvatar] = useState(currentUser.avatar || '');

  const handleOpenAdminProfileModal = () => {
    setAdminName(currentUser.name);
    setAdminTitle(currentUser.adminTitle || 'Superintendent & Verifikator Nasional');
    setAdminEmail(currentUser.email);
    setAdminPhone(currentUser.phone || '0811-9900-1122');
    setAdminAddress(currentUser.address || 'Gedung Kementan RI Lt. 4, Pasarminggu, Jakarta Selatan');
    setAdminAvatar(currentUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80');
    setIsAdminProfileModalOpen(true);
  };

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: adminName,
      adminTitle,
      email: adminEmail,
      phone: adminPhone,
      address: adminAddress,
      avatar: adminAvatar,
    });
    setIsAdminProfileModalOpen(false);
  };

  // Selected modals
  const [selectedArticleModal, setSelectedArticleModal] = useState<Article | null>(null);
  const [selectedExecutionModal, setSelectedExecutionModal] = useState<Order | null>(null);
  const [selectedOrgForEdit, setSelectedOrgForEdit] = useState<Organization | null | 'new'>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null | 'new'>(null);

  // Search filter for products and audit logs
  const [productTypeFilter, setProductTypeFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  const [auditSearch, setAuditSearch] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const pendingProducts = products.filter((p) => !p.isApproved);
  const pendingArticles = articles.filter((a) => !a.isApproved);
  const publishedArticles = articles.filter((a) => a.isApproved);
  const pendingCertOrders = orders.filter((o) => o.submittedForAdminVerification || o.photoDistributionUrl || o.revisionRequestedForCertificate);

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase())
  );

  const handleSyncKementan = () => {
    setSyncNotice('Sinkronisasi data SIHNAN Kementan RI berhasil dipembarui!');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Article Review Modal */}
      {selectedArticleModal && (
        <ArticleAdminModerationModal
          article={selectedArticleModal}
          onClose={() => setSelectedArticleModal(null)}
        />
      )}

      {/* Execution Report Review Modal */}
      {selectedExecutionModal && (
        <ExecutionReportAdminModerationModal
          order={selectedExecutionModal}
          onClose={() => setSelectedExecutionModal(null)}
        />
      )}

      {/* Organization Form Modal */}
      {selectedOrgForEdit && (
        <OrganizationFormModal
          org={selectedOrgForEdit === 'new' ? null : selectedOrgForEdit}
          onClose={() => setSelectedOrgForEdit(null)}
        />
      )}

      {/* Product Add/Edit Form Modal */}
      {selectedProductForEdit && (
        <ProductFormModal
          product={selectedProductForEdit === 'new' ? null : selectedProductForEdit}
          onClose={() => setSelectedProductForEdit(null)}
        />
      )}

      {/* National Data Summary Edit Modal */}
      {isNationalSummaryModalOpen && (
        <NationalSummaryFormModal
          summary={nationalSummary}
          onClose={() => setIsNationalSummaryModalOpen(false)}
          onSave={(updated) => updateNationalSummary(updated)}
        />
      )}

      {/* Province Stat Add/Edit Modal */}
      {selectedProvinceForEdit && (
        <ProvinceStatFormModal
          province={selectedProvinceForEdit === 'new' ? null : selectedProvinceForEdit}
          onClose={() => setSelectedProvinceForEdit(null)}
          onSave={(provData) => {
            if (selectedProvinceForEdit === 'new') {
              addProvinceStat(provData);
            } else {
              updateProvinceStat(provData.id, provData);
            }
          }}
        />
      )}

      {/* Admin Edit Profile Modal */}
      {isAdminProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 my-8 relative animate-scale-up">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base">Edit Profil Administrator Utama</h3>
              </div>
              <button onClick={() => setIsAdminProfileModalOpen(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminProfile} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Foto Profil / Avatar Admin</label>
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={adminAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
                    alt="Admin Avatar"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-xs"
                  />
                  <input
                    type="url"
                    value={adminAvatar}
                    onChange={(e) => setAdminAvatar(e.target.value)}
                    placeholder="URL Foto Profil (https://...)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Administrator *</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Jabatan / Gelar Verifikator *</label>
                <input
                  type="text"
                  required
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  placeholder="Contoh: Superintendent & Verifikator Kementan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Resmi Admin *</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Telepon / Hotline *</label>
                <input
                  type="tel"
                  required
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Kantor Sekretariat *</label>
                <textarea
                  rows={2}
                  required
                  value={adminAddress}
                  onChange={(e) => setAdminAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminProfileModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl flex items-center gap-1.5 shadow"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Simpan Profil Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-emerald-950 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-400">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
            alt="Admin"
            className="w-16 h-16 rounded-2xl border-2 border-emerald-950 object-cover shadow shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-950 text-amber-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Control Center
              </span>
              <span className="bg-amber-100 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                {currentUser.adminTitle || 'Superintendent & Verifikator'}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold mt-1">{currentUser.name}</h1>
            <p className="text-xs text-emerald-950/80 mt-0.5">
              {currentUser.email} • {currentUser.phone || '0811-9900-1122'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenAdminProfileModal}
            className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profil Admin
          </button>

          <button
            onClick={handleSyncKementan}
            className="bg-emerald-950/80 hover:bg-emerald-950 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Sync Data Feed</span>
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {syncNotice}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" /> Antrean Moderasi ({pendingProducts.length + pendingArticles.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Tag className="w-4 h-4 text-emerald-800" /> Kelola Katalog & Sultan (VIP) ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'certificates'
              ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600" /> Verifikasi Pelaksanaan & Sertifikat ({pendingCertOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('lembaga')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'lembaga'
              ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4" /> Manajemen Lembaga ({organizations.length})
        </button>

        <button
          onClick={() => setActiveTab('national_stats')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'national_stats'
              ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50 rounded-t-xl font-black'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-800" /> Control Data Nasional
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'audit_logs'
              ? 'border-emerald-800 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4" /> System Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB CONTENT: APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          
          {/* Pending Products Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
            <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-800" /> Moderasi Produk Hewan Baru
            </h3>

            {pendingProducts.length === 0 ? (
              <p className="text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                Tidak ada produk hewan menanti moderasi. Semua produk telah disetujui.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingProducts.map((prod) => (
                  <div key={prod.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-center gap-4 text-xs">
                    <div>
                      <p className="font-bold text-gray-900">{prod.title}</p>
                      <p className="text-gray-500">{prod.organizationName} • Rp {prod.price.toLocaleString('id-ID')}</p>
                      <p className="text-emerald-800 font-mono mt-0.5">SKKH: {prod.healthCertNumber}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedProductForEdit(prod)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-600" /> Edit
                      </button>
                      <button
                        onClick={() => approveProduct(prod.id)}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                      >
                        Setujui (Approve)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Moderasi & Manajemen Artikel Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-800" />
                  Manajemen & Moderasi Artikel Edukasi
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Gunakan panel ini untuk meninjau artikel draf baru, melakukan penyuntingan langsung sebelum verifikasi terbit, serta memperbarui artikel yang sudah terbit.
                </p>
              </div>

              {/* Sub-tab Filter Toggle */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shrink-0">
                <button
                  onClick={() => setArticleSubTab('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    articleSubTab === 'all'
                      ? 'bg-emerald-950 text-amber-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua Kolom ({articles.length})
                </button>
                <button
                  onClick={() => setArticleSubTab('pending')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    articleSubTab === 'pending'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Sedang Ditinjau</span>
                  <span className="bg-amber-400 text-emerald-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                    {pendingArticles.length}
                  </span>
                </button>
                <button
                  onClick={() => setArticleSubTab('published')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    articleSubTab === 'published'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Artikel Terbit</span>
                  <span className="bg-emerald-200 text-emerald-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                    {publishedArticles.length}
                  </span>
                </button>
              </div>
            </div>

            {/* TWO COLUMNS LAYOUT FOR ARTICLES */}
            <div className={`grid grid-cols-1 ${articleSubTab === 'all' ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
              
              {/* KOLOM 1: ARTIKEL SEDANG DITINJAU / PENDING */}
              {(articleSubTab === 'all' || articleSubTab === 'pending') && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded uppercase">
                        Draf / Moderasi
                      </span>
                      <h4 className="font-serif font-bold text-slate-900 text-sm">
                        Artikel Sedang Ditinjau
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                      {pendingArticles.length} Menanti Verifikasi
                    </span>
                  </div>

                  {pendingArticles.length === 0 ? (
                    <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500 italic">
                      Tidak ada artikel draf yang sedang menanti moderasi.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingArticles.map((art) => (
                        <div key={art.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                                  {art.category}
                                </span>
                                {art.status === 'revision_requested' ? (
                                  <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded border border-amber-300">
                                    Revisi Diminta
                                  </span>
                                ) : art.resubmittedAt ? (
                                  <span className="bg-emerald-800 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded">
                                    Dikirim Ulang Penjual
                                  </span>
                                ) : (
                                  <span className="bg-blue-100 text-blue-900 font-bold text-[10px] px-2 py-0.5 rounded">
                                    Draf Baru
                                  </span>
                                )}
                              </div>
                              <p className="font-bold text-slate-900 text-sm line-clamp-1">{art.title}</p>
                              <p className="text-slate-500 text-[11px]">Penulis: <span className="font-bold text-slate-700">{art.author}</span> • Tanggal: {art.date}</p>
                            </div>
                          </div>

                          <p className="text-slate-600 line-clamp-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            {art.summary}
                          </p>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => setSelectedArticleModal(art)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-200"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-800" /> Tinjau & Edit
                            </button>

                            <button
                              onClick={() => approveArticle(art.id)}
                              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Setujui (Terbitkan)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* KOLOM 2: ARTIKEL TERBIT / TERPERIKSA */}
              {(articleSubTab === 'all' || articleSubTab === 'published') && (
                <div className="bg-emerald-950/5 p-5 rounded-2xl border border-emerald-900/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-800 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">
                        Terpublikasi
                      </span>
                      <h4 className="font-serif font-bold text-emerald-950 text-sm">
                        Artikel Terbit & Terverifikasi
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      {publishedArticles.length} Live di Portal
                    </span>
                  </div>

                  {publishedArticles.length === 0 ? (
                    <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500 italic">
                      Belum ada artikel yang terbit.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {publishedArticles.map((art) => (
                        <div key={art.id} className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs space-y-3 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                                  {art.category}
                                </span>
                                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Terbit & Live
                                </span>
                              </div>
                              <p className="font-bold text-slate-900 text-sm line-clamp-1">{art.title}</p>
                              <p className="text-slate-500 text-[11px]">Penulis: <span className="font-bold text-slate-700">{art.author}</span> • Dibaca: <span className="font-bold text-emerald-800">{art.views}x</span></p>
                            </div>
                          </div>

                          <p className="text-slate-600 line-clamp-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            {art.summary}
                          </p>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => setSelectedArticleModal(art)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-950 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-amber-300"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-700" /> Edit Artikel Ini
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: PRODUCT & VIP CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-black text-[10px] px-2.5 py-0.5 rounded uppercase">
                  Katalog Resmi Kurban
                </span>
                <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2.5 py-0.5 rounded">
                  Total {products.length} Hewan Kurban
                </span>
              </div>
              <h3 className="font-serif font-bold text-gray-900 text-lg mt-1 flex items-center gap-2">
                Kelola Tampilan Halaman, Live Feed CCTV & Kurban Sultan (VIP)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Atur 1 produk tampil di Beranda Utama, 3 produk VIP tampil di Live Feed CCTV Kandang, dan persetujuan pengajuan Kurban Sultan (VIP).
              </p>
            </div>

            <button
              onClick={() => setSelectedProductForEdit('new')}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Produk Hewan Baru</span>
            </button>
          </div>

          {/* CONTROL BOARD: PRODUCT VISIBILITY SYNC */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-5 text-white space-y-4 border border-amber-500/30 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif font-bold text-sm text-amber-300">
                  Panel Pengaturan Slot Tampilan Utama (Live Sync)
                </h4>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                Kontrol Halaman Depan & Kandang VIP
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SLOT 1: BERANDA UTAMA (1 PRODUK) */}
              <div className="bg-slate-800/80 rounded-xl p-3.5 border border-amber-400/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    🏠 1 Produk Tampil di Halaman Depan (Beranda)
                  </span>
                  <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded">
                    SLOT ACTIVE
                  </span>
                </div>

                {(() => {
                  const featuredHome = products.find((p) => p.isFeaturedHome) || products.find((p) => p.isPremiumUnik && p.isApproved) || products[0];
                  return (
                    <div className="flex items-center gap-3 bg-slate-900/90 p-2.5 rounded-lg border border-slate-700">
                      <img src={featuredHome?.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-white truncate">{featuredHome?.title}</p>
                        <p className="text-[10px] text-amber-200/80 truncate">{featuredHome?.organizationName}</p>
                        <p className="text-[10px] text-emerald-400 font-extrabold">Rp {(featuredHome?.price || 0).toLocaleString('id-ID')} • {featuredHome?.weightKg} kg</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* SLOT 2: LIVE FEED KANDANG VIP (3 PRODUK) */}
              <div className="bg-slate-800/80 rounded-xl p-3.5 border border-amber-400/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    📹 3 Produk VIP Tampil di Live Feed CCTV Kandang
                  </span>
                  <span className="bg-emerald-800 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded">
                    {products.filter((p) => p.isFeaturedLiveFeed).length}/3 TERPILIH
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {products.filter((p) => p.isFeaturedLiveFeed).slice(0, 3).map((p, idx) => (
                    <div key={p.id} className="bg-slate-900 p-2 rounded-lg border border-slate-700 text-[10px]">
                      <p className="font-mono text-amber-400 font-bold">CAM-0{idx + 1}</p>
                      <p className="truncate font-semibold text-white">{p.breed}</p>
                      <p className="text-slate-400 truncate">{p.weightKg} kg</p>
                    </div>
                  ))}
                  {products.filter((p) => p.isFeaturedLiveFeed).length === 0 && (
                    <p className="col-span-3 text-[11px] text-slate-400 italic p-2">
                      Belum ada slot khusus terpasang. Menampilkan 3 Kurban Sultan VIP teratas.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Cari judul, ras, atau lembaga..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-800 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['all', 'pending', 'vip', 'sapi', 'kambing', 'domba'].map((fType) => (
                <button
                  key={fType}
                  onClick={() => setProductTypeFilter(fType)}
                  className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all shrink-0 ${
                    productTypeFilter === fType
                      ? 'bg-emerald-950 text-amber-300 shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {fType === 'all'
                    ? 'Semua Kategori'
                    : fType === 'pending'
                    ? '⏳ Menunggu Persetujuan'
                    : fType === 'vip'
                    ? '👑 Kurban Sultan (VIP)'
                    : fType}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => {
                const matchesSearch =
                  !productSearch ||
                  p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
                  p.breed.toLowerCase().includes(productSearch.toLowerCase()) ||
                  p.organizationName.toLowerCase().includes(productSearch.toLowerCase());

                const matchesType =
                  productTypeFilter === 'all'
                    ? true
                    : productTypeFilter === 'pending'
                    ? !p.isApproved
                    : productTypeFilter === 'vip'
                    ? p.isPremiumUnik
                    : p.type === productTypeFilter;

                return matchesSearch && matchesType;
              })
              .map((prod) => (
                <div
                  key={prod.id}
                  className={`bg-white rounded-2xl border ${
                    prod.isPremiumUnik ? 'border-amber-400 shadow-md ring-1 ring-amber-300' : 'border-slate-200 shadow-sm'
                  } p-4 flex flex-col justify-between space-y-3 relative group transition-all hover:shadow-md`}
                >
                  <div>
                    <div className="relative aspect-[3/2] w-full rounded-xl overflow-hidden bg-slate-900 mb-3">
                      <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                      
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        <span className="bg-emerald-950/90 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                          {prod.type} • {prod.breed}
                        </span>
                        {prod.isPremiumUnik && (
                          <span className="bg-amber-500 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                            <Crown className="w-3 h-3 fill-emerald-950" /> Sultan (VIP)
                          </span>
                        )}
                        {prod.isFeaturedHome && (
                          <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm">
                            🏠 Featured Beranda
                          </span>
                        )}
                        {prod.isFeaturedLiveFeed && (
                          <span className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm">
                            📹 Live Feed VIP
                          </span>
                        )}
                      </div>

                      <span
                        className={`absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                          prod.isApproved
                            ? 'bg-emerald-800 text-white'
                            : 'bg-amber-500 text-emerald-950 font-extrabold animate-pulse'
                        }`}
                      >
                        {prod.isApproved ? 'Terbit & Live' : 'Pending Persetujuan Admin'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.title}</h4>
                    <p className="text-slate-500 text-xs mt-0.5 font-medium">{prod.organizationName}</p>

                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-base font-extrabold text-emerald-900 font-serif">
                        Rp {prod.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        {prod.weightKg} kg
                      </span>
                    </div>

                    {prod.locationDetails && (
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{prod.locationDetails}, {prod.province}</span>
                      </p>
                    )}

                    {/* Pending Approval Verification Banner */}
                    {!prod.isApproved && (
                      <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl mt-2 text-xs space-y-1">
                        <p className="text-amber-900 font-extrabold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          Pengajuan Hewan Baru Menunggu Verifikasi
                        </p>
                        <button
                          onClick={() => approveProduct(prod.id)}
                          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-1.5 rounded-lg text-xs mt-1 shadow"
                        >
                          ✓ Setujui & Verifikasi Produk
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Toggle controls for Placement and VIP Status */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => toggleFeaturedHomeProduct(prod.id)}
                        className={`py-1.5 px-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-all ${
                          prod.isFeaturedHome
                            ? 'bg-blue-600 text-white border border-blue-700'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        🏠 {prod.isFeaturedHome ? 'Aktif di Beranda' : 'Set Beranda'}
                      </button>

                      <button
                        onClick={() => toggleFeaturedLiveFeedProduct(prod.id)}
                        className={`py-1.5 px-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-all ${
                          prod.isFeaturedLiveFeed
                            ? 'bg-red-600 text-white border border-red-700'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        📹 {prod.isFeaturedLiveFeed ? 'Aktif Live Feed' : 'Set Live Feed'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setSelectedProductForEdit(prod)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 rounded-lg border border-slate-200 flex items-center justify-center gap-1 text-[11px]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-600" /> Edit Detail
                      </button>

                      <button
                        onClick={() => togglePremiumUnikProduct(prod.id)}
                        className={`font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 text-[11px] transition-all ${
                          prod.isPremiumUnik
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        {prod.isPremiumUnik ? 'Batal VIP' : 'Set Sultan VIP'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CERTIFICATE & SLAUGHTER REPORT VERIFICATION */}
      {activeTab === 'certificates' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Verifikasi Pelaksanaan Kurban & Terbit Sertifikat Digital
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Klik baris laporan untuk expand/membuka detail lengkap foto pemotongan, timbangan daging, serta kontrol verifikasi.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {pendingCertOrders.length} Laporan Kurban Ditinjau
            </span>
          </div>

          {pendingCertOrders.length === 0 ? (
            <p className="text-xs text-gray-500 italic p-6 bg-gray-50 rounded-2xl text-center">
              Belum ada laporan pemotongan baru dari lembaga yang menanti verifikasi.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingCertOrders.map((ord) => {
                const liveW = ord.liveWeightKg || ord.items[0]?.product.weightKg || 350;
                const meatW = ord.distributedMeatKg || Math.round(liveW * 0.5);
                const families = ord.beneficiaryFamiliesCount || meatW;
                const souls = ord.estimatedSoulsCount || families * 4;
                const isExpanded = !!expandedOrders[ord.id];

                return (
                  <div key={ord.id} className="bg-slate-50/80 rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs hover:border-slate-300">
                    
                    {/* Expandable List Header Row */}
                    <div
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-slate-50/60 cursor-pointer transition-colors"
                      onClick={() => toggleOrderExpand(ord.id)}
                    >
                      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOrderExpand(ord.id);
                          }}
                          className="mt-0.5 sm:mt-0 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all shrink-0"
                          title={isExpanded ? 'Sembunyikan Detail' : 'Tampilkan Detail Laporan'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-800" /> : <ChevronDown className="w-4 h-4 text-emerald-800" />}
                        </button>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-slate-900 text-sm font-mono">{ord.orderNumber}</span>
                            <span className="bg-emerald-100 text-emerald-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                              Shohibul: {ord.shohibulQurbanName}
                            </span>

                            {ord.adminVerifiedForCertificate ? (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Sertifikat Terbit
                              </span>
                            ) : ord.revisionRequestedForCertificate ? (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded text-[10px]">
                                Revisi Laporan Diminta
                              </span>
                            ) : ord.resubmittedForAdminVerification ? (
                              <span className="bg-emerald-800 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                                Dikirim Ulang oleh Penjual
                              </span>
                            ) : (
                              <span className="bg-blue-100 text-blue-900 border border-blue-200 font-bold px-2 py-0.5 rounded text-[10px]">
                                Menanti Peninjauan
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 truncate font-medium">
                            Produk: <span className="font-bold text-slate-900">{ord.items[0]?.product.title}</span> •
                            Penjual: <span className="font-bold text-emerald-900">{ord.items[0]?.product.organizationName}</span> •
                            Wilayah: <span className="font-bold text-slate-800">{ord.distributionProvince}</span>
                          </p>
                        </div>
                      </div>

                      {/* Right Action Quick Buttons */}
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedExecutionModal(ord)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-800" /> Moderasi Modal
                        </button>

                        {!ord.adminVerifiedForCertificate && (
                          <button
                            onClick={() => verifyAndIssueCertificate(ord.id)}
                            className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <Award className="w-3.5 h-3.5" /> Terbitkan
                          </button>
                        )}

                        <button
                          onClick={() => toggleOrderExpand(ord.id)}
                          className="text-xs text-emerald-800 font-bold hover:underline px-2 py-1 flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Tutup' : 'Detail'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Detail Content Block */}
                    {isExpanded && (
                      <div className="p-5 border-t border-slate-200 bg-slate-50/90 space-y-5">
                        
                        {/* Buyer & Delivery Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Pemesan / Buyer</span>
                            <span className="font-bold text-slate-900">{ord.buyerName} ({ord.buyerPhone})</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Shohibul Qurban (Sertifikat)</span>
                            <span className="font-bold text-emerald-950">{ord.shohibulQurbanName}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Alamat / Lokasi Penyaluran</span>
                            <span className="font-bold text-slate-900">{ord.distributionAddress || 'Lokasi Penyaluran Kurban'}, {ord.distributionProvince}</span>
                          </div>
                        </div>

                        {/* Calculation Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Bobot Hidup Rill</span>
                            <span className="font-extrabold text-slate-900 text-sm">{liveW} kg</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Hasil Daging Bersih</span>
                            <span className="font-extrabold text-emerald-800 text-sm">{meatW} kg</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Penerima Manfaat (1kg/KK)</span>
                            <span className="font-extrabold text-slate-900 text-sm">{families} KK</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimasi Jiwa Terbantu</span>
                            <span className="font-extrabold text-emerald-800 text-sm">{souls} Jiwa</span>
                          </div>
                        </div>

                        {/* 3 Proof Photos Grid */}
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-emerald-800" />
                            Dokumentasi Foto Lapangan (Pemotongan & Distribusi):
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                              <p className="text-[10px] text-slate-600 font-bold">1. Sebelum Penyembelihan</p>
                              <img
                                src={ord.photoBeforeSlaughterUrl || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=800&auto=format&fit=crop&q=80'}
                                alt="Sebelum Disembelih"
                                className="w-full aspect-[3/2] object-cover rounded-lg border border-slate-200 shadow-xs hover:scale-102 transition-transform"
                              />
                            </div>

                            <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                              <p className="text-[10px] text-slate-600 font-bold">2. Setelah Disembelih (Syar’i)</p>
                              <img
                                src={ord.photoAfterSlaughterUrl || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80'}
                                alt="Setelah Disembelih"
                                className="w-full aspect-[3/2] object-cover rounded-lg border border-slate-200 shadow-xs hover:scale-102 transition-transform"
                              />
                            </div>

                            <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                              <p className="text-[10px] text-slate-600 font-bold">3. Penyaluran Daging Dhuafa</p>
                              <img
                                src={ord.photoDistributionUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80'}
                                alt="Distribusi"
                                className="w-full aspect-[3/2] object-cover rounded-lg border border-slate-200 shadow-xs hover:scale-102 transition-transform"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Execution Notes */}
                        {ord.executionNotes && (
                          <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-xs">
                            <span className="font-bold text-amber-900 block mb-0.5">Catatan Pelaksanaan dari Penjual:</span>
                            <p className="text-amber-950 italic">{ord.executionNotes}</p>
                          </div>
                        )}

                        {/* Action buttons footer inside expanded box */}
                        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => setSelectedExecutionModal(ord)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                          >
                            <Eye className="w-4 h-4 text-emerald-800" /> Buka Modal Peninjauan Laporan
                          </button>

                          {!ord.adminVerifiedForCertificate ? (
                            <button
                              onClick={() => verifyAndIssueCertificate(ord.id)}
                              className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black px-5 py-2 rounded-xl text-xs shadow transition-all flex items-center gap-1.5"
                            >
                              <Award className="w-4 h-4" /> Setujui & Terbitkan Sertifikat Digital
                            </button>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Sertifikat Resmi Telah Terbit
                            </span>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: LEMBAGA MANAGEMENT */}
      {activeTab === 'lembaga' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-base">
                Manajemen Profil Lembaga Zakat & Kemanusiaan Terdaftar
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Admin memiliki otoritas penuh untuk menambah lembaga baru dan memperbarui data profil semua mitra.
              </p>
            </div>

            <button
              onClick={() => setSelectedOrgForEdit('new')}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Tambah Lembaga Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map((org) => {
              const isOfficial = org.id === 'org-official' || org.name.toLowerCase().includes('kurban nasional official');
              return (
                <div key={org.id} className={`p-4 rounded-2xl border space-y-3 text-xs ${
                  isOfficial 
                    ? 'bg-amber-500/10 border-amber-400/50 shadow-xs' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={org.logo} alt={org.name} className="w-9 h-9 rounded-full object-cover border border-amber-300" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-900 text-sm">{org.name}</p>
                          {isOfficial && (
                            <span className="bg-amber-500 text-emerald-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                              <Crown className="w-2.5 h-2.5 fill-emerald-950" /> Admin Official Seller
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 font-mono text-[11px]">{org.legalNumber}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${org.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {org.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1 text-slate-700">
                    <p><span className="font-bold text-slate-900">Alamat:</span> {org.address}</p>
                    <p><span className="font-bold text-slate-900">Kontak:</span> {org.contactPerson} ({org.phone})</p>
                    <p><span className="font-bold text-slate-900">Email:</span> {org.email}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {!org.isVerified && (
                      <button
                        onClick={() => verifyOrganization(org.id)}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-3 py-1.5 rounded-xl text-xs"
                      >
                        Verifikasi SK Kemenag
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrgForEdit(org)}
                      className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Profil Lembaga
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-800" />
                System Audit Log & Real-Time Track Record
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Mencatat setiap aksi revisi, penyuntingan, persetujuan moderasi, dan pengiriman ulang antara Admin & Penjual.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Cari log audit..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Pengguna / Role</th>
                  <th className="py-3 px-4">Aksi Audit</th>
                  <th className="py-3 px-4">Detail Perubahan</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                      Tidak ada data log audit yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-all">
                      <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-emerald-950">{log.user}</td>
                      <td className="py-3 px-4">
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800">{log.details}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{log.ip}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: NATIONAL DATA CONTROL */}
      {activeTab === 'national_stats' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Info Banner & Quick Actions */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-emerald-800/50">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 fill-emerald-950" /> Pusat Kendali Administrator Kementan & BAZNAS RI
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  Kontrol & Sinkronisasi Dual Data Kurban Nasional
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Kelola data statistik tahun berjalan, input manual stok Kementerian Pertanian, serta monitoring dan edit langsung laporan konsolidasi 112 lembaga kurban se-Indonesia.
                </p>
                <p className="text-[11px] text-amber-300 font-mono flex items-center gap-1 pt-1">
                  <Globe className="w-3.5 h-3.5" /> Synchronized with Public Homepage & Interactive Map
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsNationalSummaryModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Edit3 className="w-4 h-4" /> Edit Ringkasan Agregat
                </button>

                <button
                  onClick={handleAutoRecalculateLembagaRealization}
                  className="bg-blue-800 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs border border-blue-600 flex items-center gap-2 shadow-md transition-all active:scale-95"
                  title="Hitung total rekapitulasi realisasi dari seluruh 112 lembaga"
                >
                  <Calculator className="w-4 h-4 text-amber-300" /> Auto-Recap Laporan Lembaga
                </button>

                <button
                  onClick={handleAutoRecalculateNationalSummary}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs border border-emerald-600 flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Calculator className="w-4 h-4 text-amber-300" /> Auto-Recap 38 Provinsi
                </button>
              </div>
            </div>
          </div>

          {/* 1. KONTROL TAHUN TAMPILAN & FASE KONSOLIDASI (HALAMAN DEPAN & DASHBOARD) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                  [Materi Permintaan 3] Admin Display Year Control
                </span>
                <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-800" />
                  Pengaturan Tahun & Fase Konsolidasi Data Tampilan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur tahun berjalan yang ingin ditampilkan pada halaman depan publik maupun dashboard internal.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-xs">
                <span className="text-slate-500 font-bold block text-[10px]">STATUS TAMPILAN PUBLIK SAAT INI:</span>
                <span className="font-extrabold text-emerald-950 font-serif text-sm">
                  Tahun Active: {activeYear} • Mode: {isPostIduladha ? 'Pasca Iduladha (Real Time)' : 'Sebelum Iduladha (History Previous Year)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Year Selector */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 text-xs block">
                  1. Pilih Tahun Berjalan Tampilan Utama:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[2026, 2027, 2028].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => {
                        updateNationalSummary({ currentYear: yr, year: yr });
                        setSyncNotice(`Tahun aktif tampilan berhasil diubah ke ${yr}!`);
                        setTimeout(() => setSyncNotice(null), 3000);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        activeYear === yr
                          ? 'bg-emerald-950 text-amber-300 shadow-md ring-2 ring-emerald-600'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      Tahun {yr}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Secara otomatis, data kurban yang disajikan di halaman depan & dashboard akan disesuaikan dengan tahun berjalan {activeYear}.
                </p>
              </div>

              {/* Phase Switcher */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 text-xs block">
                  2. Atur Status Pelaksanaan / Fase Konsolidasi Data 2:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      updateNationalSummary({
                        consolidationPhase: 'pre_iduladha',
                        lembagaRealization: {
                          ...nationalSummary.lembagaRealization,
                          year: activeYear - 1,
                          isConsolidatedCurrentYear: false,
                          stageLabel: `Sebelum Iduladha (Menampilkan Data Realisasi ${activeYear - 1})`,
                        } as any
                      });
                      setSyncNotice(`Fase diset ke Sebelum Iduladha. Data 2 menampilkan Realisasi ${activeYear - 1}!`);
                      setTimeout(() => setSyncNotice(null), 3500);
                    }}
                    className={`p-3 rounded-2xl text-left text-xs transition-all border ${
                      !isPostIduladha
                        ? 'bg-amber-500 text-emerald-950 border-amber-600 font-extrabold shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 font-medium'
                    }`}
                  >
                    <div className="font-bold">Sebelum Iduladha</div>
                    <div className="text-[10px] opacity-90 mt-0.5">
                      Menampilkan Data Realisasi Tahun Sebelumnya ({activeYear - 1})
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      updateNationalSummary({
                        consolidationPhase: 'post_iduladha',
                        lembagaRealization: {
                          ...nationalSummary.lembagaRealization,
                          year: activeYear,
                          isConsolidatedCurrentYear: true,
                          stageLabel: `Pasca Pelaksanaan & Konsolidasi Data (${activeYear})`,
                        } as any
                      });
                      setSyncNotice(`Fase diset ke Pasca Iduladha. Data 2 menampilkan Realisasi ${activeYear}!`);
                      setTimeout(() => setSyncNotice(null), 3500);
                    }}
                    className={`p-3 rounded-2xl text-left text-xs transition-all border ${
                      isPostIduladha
                        ? 'bg-emerald-900 text-amber-300 border-emerald-950 font-extrabold shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 font-medium'
                    }`}
                  >
                    <div className="font-bold">Pasca Iduladha & Konsolidasi</div>
                    <div className="text-[10px] opacity-90 mt-0.5">
                      Menampilkan Data Realisasi Konsolidasi Lembaga Tahun Berjalan ({activeYear})
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PANEL INPUT MANUAL DATA KEMENTAN RI */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                  [Materi Permintaan 3] Input Manual Data Kementan
                </span>
                <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-800" />
                  Input Manual Data Stok Hewan Kementerian Pertanian RI ({activeYear})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Admin dapat memperbarui angka stok resmi nasional, ketersediaan hewan, dan catatan rilis Ditjen PKH Kementan RI.
                </p>
              </div>

              <div className="bg-emerald-950 text-amber-300 font-mono font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-800">
                Total Stok Kementan: {(manualKementanSapi + manualKementanKambing + manualKementanDomba).toLocaleString('id-ID')} Ekor
              </div>
            </div>

            <form onSubmit={handleSaveKementanManualInput} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stok Sapi (Ekor) *</label>
                  <input
                    type="number"
                    value={manualKementanSapi}
                    onChange={(e) => setManualKementanSapi(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stok Kambing (Ekor) *</label>
                  <input
                    type="number"
                    value={manualKementanKambing}
                    onChange={(e) => setManualKementanKambing(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stok Domba (Ekor) *</label>
                  <input
                    type="number"
                    value={manualKementanDomba}
                    onChange={(e) => setManualKementanDomba(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kesiapan Sehat & SKKH (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualKementanReadiness}
                    onChange={(e) => setManualKementanReadiness(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-extrabold focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Sumber & Catatan Rilis Kementan RI *</label>
                <input
                  type="text"
                  value={manualKementanNote}
                  onChange={(e) => setManualKementanNote(e.target.value)}
                  placeholder="Contoh: Rilis Resmi Ditjen PKH Kementan RI, Update 08 Agustus 2026"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-emerald-800"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Simpan & Update Data Stok Kementan ({activeYear})
                </button>
              </div>
            </form>
          </div>

          {/* 3. MONITORING & EDIT KONSOLIDASI SELURUH LEMBAGA (DATA 2) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-blue-100 text-blue-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                  [Materi Permintaan 3] Monitoring & Direct Edit Konsolidasi Lembaga
                </span>
                <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-800" />
                  Monitoring & Edit Data Konsolidasi Seluruh Lembaga ({organizations.length} Lembaga Mitra)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pantau dan edit langsung angka realisasi kurban dari BAZNAS, LAZ, dan seluruh lembaga pengelola.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orgReportSearch}
                    onChange={(e) => setOrgReportSearch(e.target.value)}
                    placeholder="Cari lembaga / LAZ..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>
            </div>

            {/* Table Monitoring & Editing */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-extrabold tracking-wider text-[10px]">
                    <th className="py-3 px-3">Lembaga Kurban</th>
                    <th className="py-3 px-3 text-right">Sapi</th>
                    <th className="py-3 px-3 text-right">Kambing</th>
                    <th className="py-3 px-3 text-right">Domba</th>
                    <th className="py-3 px-3 text-right">Total Hewan</th>
                    <th className="py-3 px-3 text-right">Tonase Daging</th>
                    <th className="py-3 px-3 text-right">Penerima Manfaat</th>
                    <th className="py-3 px-3 text-right">Shohibul</th>
                    <th className="py-3 px-3 text-center">Status Laporan</th>
                    <th className="py-3 px-3 text-center">Aksi Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {organizations
                    .filter((o) => o.name.toLowerCase().includes(orgReportSearch.toLowerCase()) || o.code.toLowerCase().includes(orgReportSearch.toLowerCase()))
                    .map((org) => {
                      const totalHewan = (org.realizationSapi || 0) + (org.realizationKambing || 0) + (org.realizationDomba || 0);
                      return (
                        <tr key={org.id} className="hover:bg-blue-50/40 transition-all">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img src={org.logo} alt={org.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{org.name}</span>
                                  {org.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono font-semibold">
                                  Kode: {org.code} • Update: {org.lastReportedDate || '08 Agustus 2026'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                            {(org.realizationSapi || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                            {(org.realizationKambing || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                            {(org.realizationDomba || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-black text-blue-900 bg-blue-50 rounded px-2">
                            {totalHewan.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                            {(org.realizationTonMeat || 0).toLocaleString('id-ID')} Ton
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                            {(org.realizationBeneficiaries || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                            {(org.realizationShohibul || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              org.reportStatus === 'terverifikasi'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : org.reportStatus === 'terkirim'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {org.reportStatus || 'terverifikasi'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => setSelectedOrgForRealizationEdit(org)}
                              className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-[11px] inline-flex items-center gap-1 shadow-xs transition-all active:scale-95"
                            >
                              <Edit3 className="w-3 h-3 text-amber-300" /> Edit Laporan
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. TABEL DATA SEBARAN STATISTIK 38 PROVINSI RI */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                  Kelola Data Sebaran Statistik 38 Provinsi RI
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Setiap pembaruan jumlah hewan di level provinsi akan otomatis memperbarui kalkulasi kuota & peta distribusi nasional.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={provinceSearch}
                    onChange={(e) => setProvinceSearch(e.target.value)}
                    placeholder="Cari provinsi..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                {/* Region Filter Dropdown */}
                <select
                  value={provinceRegionFilter}
                  onChange={(e) => setProvinceRegionFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="all">Semua Region / Pulau</option>
                  <option value="Sumatera">Sumatera</option>
                  <option value="Jawa">Jawa</option>
                  <option value="Kalimantan">Kalimantan</option>
                  <option value="Sulawesi">Sulawesi</option>
                  <option value="Nusa Tenggara">Nusa Tenggara</option>
                  <option value="Maluku">Maluku</option>
                  <option value="Papua">Papua</option>
                </select>

                <button
                  onClick={() => setSelectedProvinceForEdit('new')}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Tambah Provinsi
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-extrabold tracking-wider text-[10px]">
                    <th className="py-3 px-3">Provinsi & Kode</th>
                    <th className="py-3 px-3">Wilayah</th>
                    <th className="py-3 px-3 text-right">Sapi</th>
                    <th className="py-3 px-3 text-right">Kambing</th>
                    <th className="py-3 px-3 text-right">Domba</th>
                    <th className="py-3 px-3 text-right">Total Hewan</th>
                    <th className="py-3 px-3 text-right">Penerima Manfaat</th>
                    <th className="py-3 px-3 text-center">Cakupan (Desa/Kec)</th>
                    <th className="py-3 px-3 text-center">Indeks Kerawanan</th>
                    <th className="py-3 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {provinces
                    .filter((p) => {
                      const matchesSearch = p.name.toLowerCase().includes(provinceSearch.toLowerCase()) || p.code.toLowerCase().includes(provinceSearch.toLowerCase());
                      const matchesRegion = provinceRegionFilter === 'all' || p.region === provinceRegionFilter;
                      return matchesSearch && matchesRegion;
                    })
                    .map((prov) => (
                      <tr key={prov.id} className="hover:bg-slate-50/80 transition-all">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{prov.name}</div>
                          <div className="text-[10px] text-slate-600 font-mono font-bold">Kode: {prov.code}</div>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">{prov.region}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">{prov.sapiCount.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">{prov.kambingCount.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">{prov.dombaCount.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-extrabold text-emerald-950 bg-emerald-50/60 rounded">
                          {prov.totalAnimalCount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                          {prov.beneficiariesCount.toLocaleString('id-ID')} jiwa
                        </td>
                        <td className="py-2.5 px-3 text-center text-[11px]">
                          <span className="font-bold text-slate-900">{prov.villagesCount}</span> desa / <span className="font-bold text-slate-900">{prov.districtsCount}</span> kec
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            prov.povertyIndex === 'High' 
                              ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                              : prov.povertyIndex === 'Medium'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {prov.povertyIndex || 'Medium'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setSelectedProvinceForEdit(prov)}
                            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-3 py-1 rounded-lg text-[11px] inline-flex items-center gap-1 shadow-xs transition-all"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Organization Realization Edit Modal */}
      {selectedOrgForRealizationEdit && (
        <OrgRealizationModal
          organization={selectedOrgForRealizationEdit}
          onClose={() => setSelectedOrgForRealizationEdit(null)}
          onSave={(orgId, updatedFields) => {
            updateOrganization(orgId, updatedFields);
            setSyncNotice(`Laporan realisasi untuk ${selectedOrgForRealizationEdit.name} berhasil diperbarui!`);
            setTimeout(() => setSyncNotice(null), 3500);
          }}
        />
      )}

    </div>
  );
};
