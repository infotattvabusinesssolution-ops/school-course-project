import React, { useState } from 'react';
import { XIcon, CartIcon, HeartIcon, CheckIcon } from './icons/Icons';

export default function CartWishlistDrawer({ 
  isOpen, 
  onClose, 
  wishlistCount, 
  cartCount,
  onOpenEnrol
}) {
  const [activeTab, setActiveTab] = useState('cart');

  const cartItems = [
    {
      id: 1,
      title: 'Import & Export Full Course',
      price: 'R15,000',
      tag: 'Best Seller',
      perks: 'Free Company Registration + Website'
    }
  ];

  const wishlistItems = [
    {
      id: 2,
      title: 'Customs Procedures & Documentation Mastery',
      price: 'R4,500',
      tag: 'Specialist Module'
    },
    {
      id: 3,
      title: 'Calculating Landed Costs & Pricing Strategies',
      price: 'R3,800',
      tag: 'Finance Module'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-transform animate-slide-up">
          
          {/* Header & Tabs */}
          <div>
            <div className="flex items-center justify-between px-6 py-4 bg-crmisa-navy text-white">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">Your Saved Items</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-lg text-slate-300 hover:text-white focus:outline-none"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                onClick={() => setActiveTab('cart')}
                className={`flex-1 py-3 text-center text-xs font-bold transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'cart'
                    ? 'border-b-2 border-crmisa-navy text-crmisa-navy bg-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CartIcon className="w-4 h-4" />
                <span>Cart ({cartCount})</span>
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`flex-1 py-3 text-center text-xs font-bold transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'wishlist'
                    ? 'border-b-2 border-crmisa-navy text-crmisa-navy bg-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <HeartIcon className="w-4 h-4" />
                <span>Wishlist ({wishlistCount})</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {activeTab === 'cart' ? (
                cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-extrabold px-2 py-0.5 bg-crmisa-lightBlue text-crmisa-navy rounded">
                          {item.tag}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{item.price}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-sm">{item.title}</h5>
                      <p className="text-xs text-blue-700 font-semibold flex items-center">
                        <CheckIcon className="w-3.5 h-3.5 mr-1" />
                        {item.perks}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 text-sm py-8">Your cart is empty.</p>
                )
              ) : (
                wishlistItems.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-extrabold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                        {item.tag}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{item.price}</span>
                    </div>
                    <h5 className="font-bold text-slate-800 text-sm">{item.title}</h5>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex justify-between text-sm font-bold text-slate-800">
              <span>Subtotal:</span>
              <span className="text-crmisa-navy text-lg font-black">R15,000</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenEnrol();
              }}
              className="w-full py-3.5 bg-crmisa-navy hover:bg-crmisa-accentNavy text-white font-extrabold rounded-xl shadow-md text-sm transition-all"
            >
              Proceed to Checkout &gt;&gt;
            </button>
          </div>

        </div>
      </aside>
    </div>
  );
}
