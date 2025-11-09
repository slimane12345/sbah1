import React from 'react';
import type { PaymentStatus } from '../types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const statusColorMap: Record<PaymentStatus, string> = {
  'مدفوع': 'bg-green-100 text-green-800',
  'معلق': 'bg-yellow-100 text-yellow-800',
  'غير مدفوع': 'bg-red-100 text-red-800',
  'مسترجع': 'bg-gray-100 text-gray-800',
};

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default PaymentStatusBadge;
