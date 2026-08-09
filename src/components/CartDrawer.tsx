import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, setIsCheckoutOpen } = useApp();

  if (!isCartOpen) return null;

  const totalAmount = cart.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-slide-left border-l border-emerald-100">
        
        {/* Cart Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-base">Keranjang Hewan Kurban</h3>
          </div>

          <button onClick={() => setIsCartOpen(false)} className="text-emerald-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items Stream */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="font-bold text-gray-700">Keranjang Kurban Masih Kosong</p>
              <p className="text-gray-400 text-[11px] max-w-xs mx-auto">
                Pilih hewan kurban pilihan Anda dari katalog marketplace.
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const price = item.product.discountPrice || item.product.price;
              return (
                <div
                  key={item.product.id}
                  className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex gap-3 items-center"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-xl shrink-0"
                  />

                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-gray-900 line-clamp-1">{item.product.title}</p>
                    <p className="text-[10px] text-emerald-800 font-semibold">{item.product.organizationName}</p>
                    <p className="font-extrabold text-emerald-900 font-serif">
                      Rp {price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-600 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-200 space-y-3 bg-gray-50">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-600">Total Pembayaran:</span>
              <span className="text-lg font-extrabold text-emerald-900 font-serif">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold py-3.5 rounded-xl shadow-lg text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Pembayaran Midtrans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
