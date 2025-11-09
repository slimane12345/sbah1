import React from 'react';
import type { CourierStatus } from '../types';

interface CourierStatusBadgeProps {
  status: CourierStatus;
}

const statusColorMap: Record<CourierStatus, string> = {
  'متاح': 'bg-green-100 text-green-800',
  'مشغول': 'bg-yellow-100 text-yellow-800',
  'غير نشط': 'bg-gray-100 text-gray-800',
};

const CourierStatusBadge: React.FC<CourierStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default CourierStatusBadge;