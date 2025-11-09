import React from 'react';
import type { OrderAdminStatus } from '../types';

interface OrderAdminStatusBadgeProps {
  status: OrderAdminStatus;
}

const statusColorMap: Record<OrderAdminStatus, string> = {
  'مكتمل': 'bg-green-100 text-green-800',
  'قيد التجهيز': 'bg-blue-100 text-blue-800',
  'بالتوصيل': 'bg-yellow-100 text-yellow-800',
  'ملغي': 'bg-red-100 text-red-800',
  'جديد': 'bg-gray-100 text-gray-800',
  'مؤكد': 'bg-indigo-100 text-indigo-800',
  // Fix: Added 'جاهز' status to the color map to satisfy the 'OrderAdminStatus' type.
  'جاهز': 'bg-purple-100 text-purple-800',
};

const OrderAdminStatusBadge: React.FC<OrderAdminStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default OrderAdminStatusBadge;