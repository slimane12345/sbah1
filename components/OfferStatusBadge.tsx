import React from 'react';
import type { OfferStatus } from '../types';

interface OfferStatusBadgeProps {
  status: OfferStatus;
}

const statusColorMap: Record<OfferStatus, string> = {
  'نشط': 'bg-green-100 text-green-800',
  'مجدول': 'bg-blue-100 text-blue-800',
  'منتهي': 'bg-gray-100 text-gray-800',
};

const OfferStatusBadge: React.FC<OfferStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default OfferStatusBadge;
