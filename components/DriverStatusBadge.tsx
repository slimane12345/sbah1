import React from 'react';
import type { DriverStatus } from '../types';

interface DriverStatusBadgeProps {
  status: DriverStatus;
}

const statusColorMap: Record<DriverStatus, string> = {
  'متاح': 'bg-green-100 text-green-800',
  'مشغول': 'bg-yellow-100 text-yellow-800',
  'غير متصل': 'bg-gray-100 text-gray-800',
};

const DriverStatusBadge: React.FC<DriverStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default DriverStatusBadge;
