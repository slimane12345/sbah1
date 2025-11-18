import React from 'react';
import type { CartItem, CustomerPage, ProductOption } from '../types';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setCustomerPage: (page: CustomerPage) => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose, cartItems, setCartItems, setCustomerPage }) => {
  const { t, translateField } = useLanguage();

  const handleRemoveItem = (itemIndex: number) => {
    setCartItems(prevItems => prevItems.filter((_, index) => index !== itemIndex));
  };

  const handleClearCart = () => {
    if (window.confirm(t('emptyCartConfirm'))) {
      setCartItems([]);
    }
  };
  
  const totalPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0);

  const handleCheckout = () => {
      setCustomerPage('checkout');
      onClose();
  };

  const cartContent = (
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">{t('yourCart')}</h3>
              {cartItems.length > 0 && (
                <button onClick={handleClearCart} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                    {t('emptyCart')}
                </button>
              )}
          </div>

          {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-gray-700 mb-4">{t('yourCartIsEmpty')}</p>
                  <button
                    onClick={onClose}
                    className="btn-customer-primary"
                  >
                    {t('startShopping')}
                  </button>
              </div>
          ) : (
              <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {cartItems.map((item, index) => (
                          <div key={`${item.product.id}-${index}`} className="flex items-center gap-4">
                              <img src={item.product.image || 'https://via.placeholder.com/48'} alt={translateField(item.product.name)} className="w-12 h-12 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                  <p className="font-bold text-gray-900 text-sm truncate">{item.quantity} x {translateField(item.product.name)}</p>
                                  <p className="text-xs text-gray-600 truncate">
                                      {Object.values(item.selectedOptions).flat().map((opt: any) => translateField(opt.name)).join(', ')}
                                  </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                  <p className="font-semibold text-sm text-gray-800">{item.totalPrice.toFixed(2)} {t('currency')}</p>
                                  <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 mt-1 float-right">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                      <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold text-gray-900">{t('total')}:</span>
                          <span className="font-bold text-xl text-gray-900">{totalPrice.toFixed(2)} {t('currency')}</span>
                      </div>
                      <button 
                        onClick={handleCheckout} 
                        className="w-full btn-customer-primary"
                      >
                          {t('checkout')}
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full text-center text-gray-700 font-semibold py-2 mt-2 hover:underline"
                      >
                        {t('continueShopping')}
                      </button>
                  </div>
              </>
          )}
      </div>
  );
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Mobile Side Panel */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-transparent transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="h-full py-4 pl-4 pr-0">
                {cartContent}
           </div>
        </div>
      </div>

      {/* Desktop Dropdown */}
      <div className={`hidden md:block absolute top-full mt-3 z-50 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${useLanguage().language === 'ar' ? 'left-0' : 'right-0'}`}>
          <div className="w-96">
              {cartContent}
              <div className={`absolute top-0 -mt-2 w-4 h-4 bg-white transform rotate-45 ${useLanguage().language === 'ar' ? 'left-6' : 'right-6'}`}></div>
          </div>
      </div>
    </>
  );
};

export default CartDropdown;