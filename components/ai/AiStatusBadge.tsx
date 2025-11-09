import React from 'react';
import type { AiAlgorithmStatus } from '../../types';

interface AiStatusBadgeProps {
  status: AiAlgorithmStatus;
}

const statusColorMap: Record<AiAlgorithmStatus, string> = {
  'نشط': 'bg-green-100 text-green-800',
  'غير نشط': 'bg-gray-100 text-gray-800',
  'تحت الصيانة': 'bg-yellow-100 text-yellow-800',
};

const AiStatusBadge: React.FC<AiStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default AiStatusBadge;