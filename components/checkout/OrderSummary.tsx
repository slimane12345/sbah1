import React from 'react';
import type { CartItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface OrderSummaryProps {
  onPlaceOrder: () => void;
  cartItems: CartItem[];
  isPlacingOrder: boolean;
  deliveryFee: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ onPlaceOrder, cartItems, isPlacingOrder, deliveryFee }) => {
  const { t, translateField } = useLanguage();
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
      <h2 className="text-xl font-bold border-b pb-4 mb-4 text-gray-900">{t('orderSummary')}</h2>
      <div className="space-y-3">
        {cartItems.length > 0 ? (
          cartItems.map(item => (
            <div key={item.product.id} className="flex justify-between items-center">
              <span className="text-gray-800">{item.quantity} x {translateField(item.product.name)}</span>
              <span className="font-semibold text-gray-900">{item.totalPrice.toFixed(2)} {t('currency')}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">{t('yourCartIsEmpty')}</p>
        )}
      </div>
      <div className="border-t my-4 pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>{t('subtotal')}</span>
          <span className="font-medium text-gray-800">{subtotal.toFixed(2)} {t('currency')}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>{t('deliveryFee')}</span>
          <span className="font-medium text-gray-800">{deliveryFee.toFixed(2)} {t('currency')}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-gray-900">
          <span>{t('total')}</span>
          <span>{total.toFixed(2)} {t('currency')}</span>
        </div>
      </div>
      <button
        onClick={onPlaceOrder}
        disabled={isPlacingOrder || cartItems.length === 0}
        className="w-full btn-customer-primary mt-4"
      >
        {isPlacingOrder ? t('placingOrder') : t('confirmOrder')}
      </button>
    </div>
  );
};

export default OrderSummary;