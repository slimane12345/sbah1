import React from 'react';
import type { CustomerPage, AppSettings } from '../types';

interface CustomerHeaderProps {
    setCustomerPage: (page: CustomerPage) => void;
    settings: AppSettings['general'] | null;
    cartItemCount: number;
    onCartClick: () => void;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ setCustomerPage, settings, cartItemCount, onCartClick }) => {
  return (
    <header className="bg-red-600 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 h-16">
          {/* Right side in RTL: Notification Icon */}
          <div className="flex-1 flex justify-start">
             <button className="p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </button>
          </div>

          {/* Centered Logo */}
          <div 
            className="flex items-center cursor-pointer h-10" 
            onClick={() => setCustomerPage('home')}
          >
            {settings?.logoUrl && (
                <img src={settings.logoUrl} alt={settings.platformName} className="h-10 object-contain" />
            )}
          </div>
          
           {/* Left side in RTL: Cart Icon */}
          <div className="flex-1 flex justify-end">
             <div className="relative">
                <button onClick={onCartClick} className="p-2 text-white relative">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                   {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-white text-red-600 text-xs font-bold border-2 border-red-600">
                            {cartItemCount}
                        </span>
                    )}
                </button>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;