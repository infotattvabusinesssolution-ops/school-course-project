import React from 'react';
import Modal from './Modal';
import { CartIcon, TrashIcon } from './icons/Icons';

export default function CartModal({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onRemoveItem, 
  onProceedToCheckout 
}) {
  const defaultItems = [
    {
      id: 1,
      title: "CRMISA – How to Find Buyers Worldwide Marketing, Fairs, B2B Portals & Smart Outreach",
      price: 499
    }
  ];

  const itemsToDisplay = cartItems.length > 0 ? cartItems : defaultItems;

  const calculateGrandTotal = () => {
    return itemsToDisplay.reduce((total, item) => {
      const numericPrice = typeof item.price === 'number' 
        ? item.price 
        : parseInt(String(item.price).replace(/[^0-9]/g, '')) || 499;
      return total + numericPrice;
    }, 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Cart" maxWidth="max-w-3xl">
      <div className="py-2 space-y-6">
        
        {/* Cart Container Card matching Image */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Bar (Dark Navy) matching Image */}
          <div className="bg-[#1c3c78] px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2.5">
              <CartIcon className="w-5 h-5 text-white" />
              <h3 className="text-lg font-black tracking-tight">My Cart</h3>
            </div>
            <span className="bg-white text-[#1c3c78] text-xs font-black px-4 py-1 rounded-full shadow-xs">
              {itemsToDisplay.length} item(s)
            </span>
          </div>

          {/* Table Header matching Image */}
          <div className="grid grid-cols-12 bg-slate-100 px-6 py-3 text-[11px] font-black uppercase tracking-wider text-slate-600 border-b border-slate-200">
            <div className="col-span-8 text-center sm:text-left">BOOK NAME</div>
            <div className="col-span-2 text-center">PRICE (R)</div>
            <div className="col-span-2 text-center">REMOVE</div>
          </div>

          {/* Table Rows matching Image */}
          <div className="divide-y divide-slate-100">
            {itemsToDisplay.map((item, idx) => (
              <div key={item.id || idx} className="grid grid-cols-12 px-6 py-4 items-center text-xs sm:text-sm">
                
                {/* Book Name */}
                <div className="col-span-8 font-semibold text-slate-800 pr-2">
                  {item.title}
                </div>

                {/* Price */}
                <div className="col-span-2 text-center font-black text-[#0284c7]">
                  R{typeof item.price === 'number' ? item.price : String(item.price).replace(/[^0-9]/g, '') || 499}
                </div>

                {/* Remove Trash Button matching Image */}
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => onRemoveItem && onRemoveItem(item.id || idx)}
                    className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-transform hover:scale-110 shadow"
                    title="Remove item"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Grand Total Footer Row matching Image */}
          <div className="grid grid-cols-12 bg-sky-50/50 px-6 py-3.5 border-t border-slate-200 items-center text-xs sm:text-sm font-bold">
            <div className="col-span-8 text-right font-black text-slate-800 pr-4">
              Grand Total
            </div>
            <div className="col-span-2 text-center font-black text-[#0284c7] text-base">
              R{calculateGrandTotal()}
            </div>
            <div className="col-span-2" />
          </div>

        </div>

        {/* Bottom Right Proceed to Checkout Button matching Image */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              onClose();
              if (onProceedToCheckout) onProceedToCheckout();
            }}
            className="px-6 py-3 bg-[#1c3c78] hover:bg-crmisa-navy text-white font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm flex items-center space-x-2"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>Proceed to Checkout</span>
          </button>
        </div>

      </div>
    </Modal>
  );
}
