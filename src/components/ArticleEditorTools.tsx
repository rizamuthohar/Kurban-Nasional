import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  Bold,
  Italic,
  List,
  X,
  Globe,
  Plus,
} from 'lucide-react';

interface ArticleImageUploaderProps {
  imageUrl: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ArticleImageUploader: React.FC<ArticleImageUploaderProps> = ({
  imageUrl,
  onChange,
  label = 'Foto Sampul Artikel (Cover Image)',
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    { label: 'Sapi Kurban 3T', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80' },
    { label: 'Domba Garut', url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Peternakan Syar’i', url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&auto=format&fit=crop&q=80' },
    { label: 'Penyaluran Daging', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80' },
    { label: 'Fatwa MUI & Halal', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran berkas gambar maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-bold text-gray-700 block text-xs flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[11px] text-emerald-800 font-semibold">Format: JPG, PNG, WEBP (Max 5MB)</span>
      </label>

      {imageUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-sm bg-slate-900 group">
          <img src={imageUrl} alt="Sampul Artikel" className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Ganti Gambar
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-emerald-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-400/40 backdrop-blur-xs">
            Gambar Terpasang
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-4 bg-emerald-50/40 hover:bg-emerald-50 transition-all text-center space-y-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-xs">Upload Gambar Sampul Artikel</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Pilih berkas gambar dari perangkat Anda atau gunakan URL / preset</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Pilih Berkas Foto
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs border border-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" /> Masukkan Link URL
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="pt-2 border-t border-emerald-200/60">
            <p className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Atau Pilih Gambar Preset Lembaga:</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(p.url)}
                  className="bg-white hover:bg-emerald-100 text-emerald-950 font-semibold px-2.5 py-1 rounded-lg text-[11px] border border-emerald-200 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* URL Input Bar */}
      {showUrlInput && (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2 text-xs">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://domain.com/gambar.jpg"
            className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-xs"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="bg-emerald-800 text-white font-bold px-3 py-2 rounded-lg cursor-pointer"
          >
            Terapkan
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

interface ArticleContentToolbarProps {
  content: string;
  onChange: (newContent: string) => void;
  orgName?: string;
}

export const ArticleContentToolbar: React.FC<ArticleContentToolbarProps> = ({
  content,
  onChange,
  orgName = 'Lembaga Kurban',
}) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Link Form State
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Body Image State
  const [bodyImageUrl, setBodyImageUrl] = useState('');
  const [bodyImageCaption, setBodyImageCaption] = useState('');
  const bodyFileInputRef = useRef<HTMLInputElement>(null);

  // Preset Backlinks
  const presetBacklinks = [
    { label: `Website Resmi ${orgName}`, url: 'https://dompetdhuafa.org' },
    { label: 'Katalog Hewan Kurban Online', url: '/katalog' },
    { label: 'Fatwa MUI No. 37/2019 tentang Kurban Online', url: 'https://mui.or.id/fatwa-kurban' },
    { label: 'Sertifikat SKKH Kementan RI', url: 'https://ditjenpkh.pertanian.go.id' },
    { label: 'Peta Distribusi Kurban 3T', url: '/stok-nasional' },
  ];

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const anchor = linkText.trim() || linkUrl.trim();
    const markdownLink = ` [${anchor}](${linkUrl.trim()}) `;
    onChange(content + markdownLink);
    setLinkText('');
    setLinkUrl('');
    setShowLinkModal(false);
  };

  const handleInsertPresetLink = (preset: { label: string; url: string }) => {
    const markdownLink = ` [${preset.label}](${preset.url}) `;
    onChange(content + markdownLink);
    setShowLinkModal(false);
  };

  const handleInsertBodyImage = () => {
    if (!bodyImageUrl.trim()) return;
    const caption = bodyImageCaption.trim() || 'Gambar Artikel';
    const markdownImg = `\n\n![${caption}](${bodyImageUrl.trim()})\n\n`;
    onChange(content + markdownImg);
    setBodyImageUrl('');
    setBodyImageCaption('');
    setShowImageModal(false);
  };

  const handleBodyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBodyImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormat = (type: 'bold' | 'italic' | 'list') => {
    if (type === 'bold') onChange(content + ' **Teks Tebal** ');
    if (type === 'italic') onChange(content + ' *Teks Miring* ');
    if (type === 'list') onChange(content + '\n- Poin Baru\n- Poin Berikutnya\n');
  };

  return (
    <div className="space-y-2">
      {/* Toolbar Bar */}
      <div className="bg-slate-100 border border-slate-200 rounded-t-xl p-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-extrabold mr-1">Alat Tulis:</span>

          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-300 flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
            title="Sisipkan Backlink atau tautan web"
          >
            <LinkIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>+ Sisipkan Backlink</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
            title="Sisipkan Foto/Gambar di dalam isi artikel"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>+ Sisipkan Foto di Isi</span>
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="bg-white hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-200 cursor-pointer"
            title="Tebal"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="bg-white hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-200 cursor-pointer"
            title="Miring"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('list')}
            className="bg-white hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-200 cursor-pointer"
            title="Daftar Poin"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-[10px] text-slate-500 font-normal">
          Dukungan Format Backlink: <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">[teks](https://url)</code>
        </span>
      </div>

      {/* BACKLINK INSERT MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-amber-600" /> Sisipkan Backlink / Link Aktif
              </h4>
              <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Teks Link (Anchor Text)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Contoh: Website Resmi BAZNAS RI"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">URL Target Backlink</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://baznas.go.id atau /katalog"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-2 border-t">
                <p className="font-bold text-slate-600 mb-1.5">Atau Pilih Rekomendasi Backlink Cepat:</p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {presetBacklinks.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleInsertPresetLink(preset)}
                      className="w-full text-left bg-slate-50 hover:bg-amber-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between gap-2 transition-all hover:border-amber-300 cursor-pointer"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{preset.label}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{preset.url}</p>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkUrl.trim()}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-extrabold px-4 py-2 rounded-xl shadow cursor-pointer"
              >
                Sisipkan Ke Teks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSERT BODY IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-700" /> Sisipkan Foto Ke Dalam Artikel
              </h4>
              <button onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Upload Foto / Berkas Gambar</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => bodyFileInputRef.current?.click()}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Pilih Berkas Foto
                  </button>
                  <input
                    ref={bodyFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBodyFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Atau Masukkan URL Gambar</label>
                <input
                  type="url"
                  value={bodyImageUrl}
                  onChange={(e) => setBodyImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan / Caption Foto</label>
                <input
                  type="text"
                  value={bodyImageCaption}
                  onChange={(e) => setBodyImageCaption(e.target.value)}
                  placeholder="Contoh: Proses Distribusi Kurban oleh Petugas Lembaga"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
              </div>

              {bodyImageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 p-2">
                  <p className="font-bold text-[10px] text-slate-500 mb-1">Preview Foto:</p>
                  <img src={bodyImageUrl} alt="" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertBodyImage}
                disabled={!bodyImageUrl.trim()}
                className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold px-4 py-2 rounded-xl shadow cursor-pointer"
              >
                Sisipkan Ke Teks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ArticleContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  // Helper to parse line text for Markdown links [text](url) and plain URLs
  const renderLineWithLinks = (lineText: string, keyPrefix: string) => {
    // Regex for [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(lineText)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        parts.push(lineText.substring(lastIndex, match.index));
      }

      const anchorText = match[1];
      const linkUrl = match[2];

      parts.push(
        <a
          key={`${keyPrefix}-link-${match.index}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-extrabold text-emerald-900 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 px-2 py-0.5 rounded-lg text-xs mx-1 my-0.5 transition-all shadow-2xs group underline decoration-amber-500 decoration-2 hover:no-underline"
        >
          <span>{anchorText}</span>
          <ExternalLink className="w-3 h-3 text-amber-700 group-hover:text-amber-800 shrink-0" />
        </a>
      );

      lastIndex = markdownLinkRegex.lastIndex;
    }

    if (lastIndex < lineText.length) {
      parts.push(lineText.substring(lastIndex));
    }

    return parts;
  };

  // Split by double newline to get paragraphs / blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="space-y-4 text-slate-800 text-sm leading-relaxed font-sans">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Check if block is markdown image ![caption](url)
        const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
          const caption = imageMatch[1];
          const imgUrl = imageMatch[2];
          return (
            <figure key={idx} className="my-5 space-y-1.5">
              <img
                src={imgUrl}
                alt={caption || 'Gambar Artikel'}
                className="w-full max-h-96 object-cover rounded-2xl border border-slate-200 shadow-md"
              />
              {caption && (
                <figcaption className="text-center text-xs text-slate-500 font-medium italic flex items-center justify-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{caption}</span>
                </figcaption>
              )}
            </figure>
          );
        }

        // Render standard paragraph with formatted backlinks
        return (
          <p key={idx} className="whitespace-pre-line">
            {renderLineWithLinks(trimmed, `p-${idx}`)}
          </p>
        );
      })}
    </div>
  );
};
