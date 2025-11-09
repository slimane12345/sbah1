import React from 'react';
import type { AvailabilityStatus } from '../types';

interface AvailabilityStatusBadgeProps {
  status: AvailabilityStatus;
}

const statusColorMap: Record<AvailabilityStatus, string> = {
  'متوفر': 'bg-green-100 text-green-800',
  'غير متوفر': 'bg-red-100 text-red-800',
};

const AvailabilityStatusBadge: React.FC<AvailabilityStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default AvailabilityStatusBadge;
