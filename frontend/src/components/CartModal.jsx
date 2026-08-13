import React from 'react';
import Modal from './Modal';
import { useCart } from '../context/CartContext';
import { TrashIcon } from './icons/Icons';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartModal({ 
  isOpen, 
  onClose,
  onProceedToCheckout 
}) {
  const { cartItems, removeFromCart, getCartTotal } = useCart();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart" maxWidth="max-w-2xl">
      <div className="py-2 flex flex-col min-h-[400px]">
        
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12">
            <ShoppingBag className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-crmisa-navy mb-2">Your cart is empty</h3>
            <p className="text-sm mb-6 text-center max-w-sm">
              Looks like you haven't added any courses or e-books to your cart yet.
            </p>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6">
              {cartItems.map((item, idx) => {
                const isEbook = item.type === 'ebook';
                const imageSrc = item.coverImage || item.thumbnail;
                
                return (
                  <div key={item._id || item.id || idx} className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-xs relative group">
                    
                    {/* Thumbnail */}
                    <div className={`shrink-0 w-20 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center ${isEbook ? 'aspect-[3/4]' : 'aspect-video w-28'}`}>
                      {imageSrc ? (
                        <img src={imageSrc} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{isEbook ? 'E-book' : 'Course'}</div>
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm inline-block mb-1.5">
                            {isEbook ? 'Digital E-book' : 'Online Course'}
                          </span>
                          <button
                            onClick={() => removeFromCart(item._id || item.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-crmisa-navy text-sm sm:text-base leading-tight pr-6">
                          {item.title}
                        </h4>
                      </div>
                      
                      <div className="font-black text-crmisa-navy mt-2">
                        R{typeof item.price === 'number' ? item.price : String(item.price).replace(/[^0-9]/g, '') || 0}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grand Total Footer */}
            <div className="border-t border-slate-100 pt-6 mt-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 font-medium">Total</span>
                <span className="text-3xl font-black text-crmisa-navy">
                  R{getCartTotal()}
                </span>
              </div>
              
              <button
                onClick={() => {
                  onClose();
                  if (onProceedToCheckout) onProceedToCheckout();
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all text-base flex items-center justify-center gap-2 group"
              >
                <span>Checkout Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
