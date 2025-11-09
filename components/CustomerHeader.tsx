import React, { useState, useEffect, useRef } from 'react';
import type { CustomerPage, CartItem, AppSettings } from '../types';
import CartDropdown from './CartDropdown';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface CustomerHeaderProps {
    setCustomerPage: (page: CustomerPage) => void;
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    settings: AppSettings['general'] | null;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ setCustomerPage, cartItems, setCartItems, settings }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setIsCartOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 gap-4">
          {/* Logo */}
          <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => setCustomerPage('home')}>
              {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.platformName || 'Logo'} className="h-8 w-auto object-contain" />
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
              )}
              <h1 className="text-2xl font-bold mr-2 text-gray-800 hidden sm:block">
                  {settings?.platformName || 'منصتي'}
              </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0" ref={cartRef}>
            <button onClick={() => setCustomerPage('profile')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>

            {/* Cart Button */}
            <div className="relative">
                <button onClick={() => setIsCartOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {totalCartQuantity > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                            {totalCartQuantity}
                        </span>
                    )}
                </button>
                <CartDropdown 
                    isOpen={isCartOpen} 
                    onClose={() => setIsCartOpen(false)}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    setCustomerPage={setCustomerPage}
                />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;