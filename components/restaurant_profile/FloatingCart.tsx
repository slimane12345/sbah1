import React from 'react';
import type { CartItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface FloatingCartProps {
    cartItems: CartItem[];
    onCheckout: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ cartItems, onCheckout }) => {
  const { t } = useLanguage();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-40">
        <div className="max-w-4xl mx-auto px-4 pb-4 sm:pb-6">
            <div className="bg-white rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.08)] p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-gray-100 rounded-md h-8 w-8 flex items-center justify-center font-bold text-lg text-gray-800">
                           {totalItems}
                        </div>
                        <div className="mr-4">
                             <h3 className="font-bold text-lg text-gray-900">{total.toFixed(2)} {t('currency')}</h3>
                             <p className="text-sm text-gray-500">{t('total')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onCheckout}
                        className="btn-customer-primary btn-customer-black"
                    >
                        <span>{t('goToCheckout')}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FloatingCart;