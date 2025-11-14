import React from 'react';
import type { CustomerPage, AppSettings } from '../types';

interface CustomerHeaderProps {
    setCustomerPage: (page: CustomerPage) => void;
    settings: AppSettings['general'] | null;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ setCustomerPage, settings }) => {
  return (
    <header className="bg-red-600 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 h-16">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
             <button className="p-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </button>
          </div>

          {/* Centered Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => setCustomerPage('home')}
          >
            {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.platformName} className="h-10 object-contain" />
            ) : (
              <div className="bg-white text-red-600 font-bold text-2xl px-4 py-1 rounded-lg">
                fantastic
              </div>
            )}
          </div>
          
          <div className="flex-1">
             {/* This empty div helps in centering the logo */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
