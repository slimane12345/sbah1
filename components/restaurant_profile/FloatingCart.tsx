import React from 'react';
import type { CartItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

// This component is now obsolete and replaced by the FAB in App.tsx
// It is kept in the codebase but will not be rendered.

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

  return null; // The component is no longer rendered from App.tsx
};

export default FloatingCart;