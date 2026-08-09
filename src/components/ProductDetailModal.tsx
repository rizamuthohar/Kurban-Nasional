import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Scale, 
  Calendar, 
  FileText, 
  Video, 
  RotateCw, 
  ShoppingCart, 
  Building2, 
  Heart,
  Share2,
  Star
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCheckoutOpen } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is360Active, setIs360Active] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  if (!selectedProduct) return null;

  const currentPrice = selectedProduct.discountPrice || selectedProduct.price;

  const handleInstantBuy = () => {
    addToCart(selectedProduct, 1);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-emerald-100 my-8 relative animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Visual Media Gallery */}
          <div className="lg:col-span-6 bg-slate-900 p-6 flex flex-col justify-between relative min-h-[380px]">
            
            {/* Main Image or 360° View - Strictly 3:2 Aspect Ratio */}
            <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              {is360Active ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center text-white">
                  <img
                    src={selectedProduct.images[0]}
                    alt="360 view"
                    style={{ transform: `rotate(${rotationAngle}deg) scale(1.05)` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-200"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur p-3 rounded-xl flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-amber-400">
                      <RotateCw className="w-4 h-4 animate-spin" /> Simulasi Look 360°
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(Number(e.target.value))}
                      className="w-1/2 accent-amber-400"
                    />
                  </div>
                </div>
              ) : (
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {selectedProduct.type} • {selectedProduct.breed}
                </span>
                {selectedProduct.isPremiumUnik && (
                  <span className="bg-amber-500 text-emerald-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Kurban Sultan (VIP)
                  </span>
                )}
              </div>
            </div>

            {/* Media Controls Toolbar */}
            <div className="flex items-center justify-between gap-2 mt-4 text-xs text-white">
              <div className="flex items-center gap-2">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setIs360Active(false);
                    }}
                    className={`w-14 aspect-[3/2] rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx && !is360Active
                        ? 'border-amber-400 scale-105'
                        : 'border-slate-700 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {selectedProduct.has360View && (
                  <button
                    onClick={() => setIs360Active(!is360Active)}
                    className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
                      is360Active
                        ? 'bg-amber-500 text-emerald-950 border-amber-400'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" /> 360°
                  </button>
                )}

                {selectedProduct.videoUrl && (
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5 text-red-400" /> Video Kandang
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Product Specs & Purchase CTAs */}
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Organization Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedProduct.organizationLogo}
                    alt={selectedProduct.organizationName}
                    className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-xs">{selectedProduct.organizationName}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Lembaga Terverifikasi Kemenag RI
                    </p>
                  </div>
                </div>
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="text-xl font-extrabold font-serif text-gray-900 leading-snug">
                  {selectedProduct.title}
                </h2>

                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold font-serif text-emerald-800">
                    Rp {currentPrice.toLocaleString('id-ID')}
                  </span>
                  {selectedProduct.discountPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      Rp {selectedProduct.price.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              </div>

              {/* Specs Cards Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Estimasi Bobot</span>
                  <span className="font-extrabold text-gray-900 flex items-center gap-1 mt-0.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-700" /> {selectedProduct.weightKg} kg
                  </span>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Umur Hewan</span>
                  <span className="font-extrabold text-gray-900 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" /> {selectedProduct.ageMonths} Bulan (Poel Cukup)
                  </span>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 col-span-2 space-y-1">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">
                    {selectedProduct.isPremiumUnik ? 'Lokasi Kandang & Provinsi (VIP)' : 'Lokasi Provinsi Penyaluran'}
                  </span>
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    {selectedProduct.isPremiumUnik && selectedProduct.locationDetails
                      ? `${selectedProduct.locationDetails}, ${selectedProduct.province}`
                      : selectedProduct.province}
                  </span>

                  {/* Province Allocations Breakdown Badge */}
                  {selectedProduct.provinceAllocations && selectedProduct.provinceAllocations.length > 0 && (
                    <div className="pt-1.5 flex flex-wrap gap-1.5 border-t border-gray-200/60 mt-1">
                      {selectedProduct.provinceAllocations.map((alloc, idx) => (
                        <span key={idx} className="bg-emerald-100/80 text-emerald-950 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-emerald-200">
                          {alloc.province}: <span className="text-amber-800 font-black">{alloc.stock} ekor</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Dokumen SKKH</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1 mt-0.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {selectedProduct.healthCertNumber}
                  </span>
                </div>
              </div>

              {/* VIP Kandang Notice */}
              {selectedProduct.isPremiumUnik && (
                <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-emerald-950 font-extrabold p-3 rounded-2xl text-xs flex items-center gap-2 border border-amber-300 shadow-sm">
                  <Star className="w-4 h-4 text-emerald-950 shrink-0" />
                  <span>Kandang Kurban Sultan (VIP) tersedia untuk pengiriman Jabodetabek dan Surabaya (Free)</span>
                </div>
              )}

              {/* Description */}
              <div className="text-xs text-gray-600 leading-relaxed space-y-1 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                <p className="font-bold text-emerald-950">Deskripsi & Program:</p>
                <p>{selectedProduct.description}</p>
              </div>

              {/* Target Beneficiaries Notice */}
              {selectedProduct.targetBeneficiaries && (
                <div className="text-xs text-amber-900 bg-amber-50 p-3 rounded-2xl border border-amber-200/80 flex items-start gap-2">
                  <Star className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Sasaran Distribusi:</span> {selectedProduct.targetBeneficiaries}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  addToCart(selectedProduct, 1);
                  setSelectedProduct(null);
                }}
                className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Masukkan Keranjang
              </button>

              <button
                onClick={handleInstantBuy}
                className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold py-3 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
              >
                <span>Beli Sekarang</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Preview Sub-Modal */}
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-black rounded-2xl p-4 max-w-2xl w-full relative">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-2 right-2 text-white bg-slate-800 p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <h4 className="text-white text-sm font-bold mb-3">Video Kondisi Hewan Kandang</h4>
              <video controls autoPlay className="w-full rounded-xl">
                <source src={selectedProduct.videoUrl} type="video/mp4" />
                Browser tidak mendukung pemutaran video.
              </video>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
