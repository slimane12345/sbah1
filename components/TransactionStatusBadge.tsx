import React from 'react';
import type { TransactionStatus } from '../types';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

const statusColorMap: Record<TransactionStatus, string> = {
  'مكتمل': 'bg-green-100 text-green-800',
  'معلق': 'bg-yellow-100 text-yellow-800',
  'فشل': 'bg-red-100 text-red-800',
};

const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default TransactionStatusBadge;
