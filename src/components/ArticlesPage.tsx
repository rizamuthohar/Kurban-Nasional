import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Article } from '../types';
import { BookOpen, Calendar, Eye, ShieldCheck, Star, User, ArrowLeft, Share2, Edit3, X, Check, CheckCircle2 } from 'lucide-react';
import { ArticleImageUploader, ArticleContentToolbar, ArticleContentRenderer } from './ArticleEditorTools';

/* Modal to edit article directly when logged in as Admin */
interface AdminEditArticleModalProps {
  article: Article;
  onClose: () => void;
  onSaved: (updatedArticle: Article) => void;
}

const AdminEditArticleModal: React.FC<AdminEditArticleModalProps> = ({ article, onClose, onSaved }) => {
  const { editArticle } = useApp();

  const [title, setTitle] = useState(article.title);
  const [category, setCategory] = useState(article.category);
  const [author, setAuthor] = useState(article.author);
  const [summary, setSummary] = useState(article.summary);
  const [imageUrl, setImageUrl] = useState(article.imageUrl);
  const [content, setContent] = useState(article.content);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFields = {
      title,
      category,
      author,
      summary,
      imageUrl,
      content,
      isApproved: true,
      status: 'approved' as const,
    };

    editArticle(article.id, updatedFields);
    setSavedSuccess(true);

    const updatedArticle = {
      ...article,
      ...updatedFields,
    };

    setTimeout(() => {
      onSaved(updatedArticle);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-scale-up">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                Admin Control Panel
              </span>
              <span className="bg-emerald-800 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded">
                Edit Artikel Terbit
              </span>
            </div>
            <h2 className="text-lg font-bold font-serif text-white mt-1">
              Sunting Teks & Informasi Artikel
            </h2>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-emerald-900 rounded-xl text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-100 border-b border-emerald-300 p-3 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Artikel berhasil diperbarui & disimpan oleh Admin!
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
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
              <label className="text-slate-700 font-bold block mb-1">Kategori Fatwa/Edukasi</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
              >
                <option value="Fatwa">Fatwa</option>
                <option value="Edukasi">Edukasi</option>
                <option value="Berita">Berita</option>
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
            <label className="text-slate-700 font-bold block mb-1">Ringkasan Singkat</label>
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
            label="Foto Sampul Utama Artikel (Cover)"
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
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Simpan Perubahan Artikel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ArticlesPage: React.FC = () => {
  const { articles, role } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [editingArticleModal, setEditingArticleModal] = useState<Article | null>(null);

  const approvedArticles = articles.filter((a) => a.isApproved);

  const filteredArticles = approvedArticles.filter((a) =>
    selectedCategory === 'all' ? true : a.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Modal Edit for Admin */}
      {editingArticleModal && (
        <AdminEditArticleModal
          article={editingArticleModal}
          onClose={() => setEditingArticleModal(null)}
          onSaved={(updated) => {
            setActiveArticle(updated);
          }}
        />
      )}

      {/* Title */}
      <div className="bg-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-amber-400 text-emerald-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Pusat Edukasi & Fatwa
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif mt-1">
            Artikel, Edukasi & Fatwa MUI Kurban
          </h1>
          <p className="text-xs text-emerald-200 mt-1 max-w-xl">
            Informasi resmi mengenai keabsahan fiqih kurban online, standar kesehatan hewan Kementan, dan kabar penyaluran dari lembaga.
          </p>
        </div>

        <div className="p-3 bg-emerald-950 rounded-2xl border border-emerald-700 text-xs text-emerald-200 shrink-0 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Ditinjau oleh Komisi Fatwa MUI</span>
        </div>
      </div>

      {activeArticle ? (
        /* Reading View */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => setActiveArticle(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Artikel
          </button>

          <div className="space-y-3">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
              {activeArticle.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 leading-snug">
              {activeArticle.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 border-b border-gray-100 pb-3">
              <span className="flex items-center gap-1 font-semibold text-gray-700">
                <User className="w-3.5 h-3.5 text-emerald-700" /> {activeArticle.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" /> {activeArticle.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-700" /> {activeArticle.views} dibaca
              </span>
            </div>
          </div>

          <div className="flex justify-center my-2">
            <img
              src={activeArticle.imageUrl}
              alt={activeArticle.title}
              className="w-full max-w-[600px] aspect-[3/2] object-cover rounded-2xl shadow-md border border-slate-200"
            />
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed font-medium">
            <p className="font-bold mb-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" /> Ringkasan Artikel:
            </p>
            <p>{activeArticle.summary}</p>
          </div>

          <div className="pt-2">
            <ArticleContentRenderer content={activeArticle.content} />
          </div>

          {/* Admin Edit Link at Bottom when logged in as Role Admin */}
          {role === 'admin' && (
            <div className="mt-8 pt-6 border-t border-emerald-100 bg-amber-50/90 p-4 sm:p-5 rounded-2xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-amber-950">
                <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0" />
                <div>
                  <p className="font-extrabold text-amber-950 text-sm">Otoritas Admin Control Panel</p>
                  <p className="text-xs text-amber-900/80">
                    Anda sedang melihat artikel ini sebagai Admin. Anda dapat langsung menyunting teks, judul, atau ringkasan artikel ini.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingArticleModal(activeArticle)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span>Edit Artikel Ini</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
            {['all', 'Fatwa', 'Edukasi', 'Berita', 'Peternakan', 'Artikel Lembaga'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-900/90 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <p className="text-[10px] text-gray-400 font-semibold">{article.date} • {article.author}</p>
                    <h3 className="font-serif font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-800 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <span>Baca Selengkapnya</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

