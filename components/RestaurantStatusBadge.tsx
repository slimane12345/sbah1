import React from 'react';
import type { RestaurantStatus } from '../types';

interface RestaurantStatusBadgeProps {
  status: RestaurantStatus;
}

const statusColorMap: Record<RestaurantStatus, string> = {
  'مفتوح': 'bg-green-100 text-green-800',
  'مغلق': 'bg-gray-100 text-gray-800',
  'قيد المراجعة': 'bg-yellow-100 text-yellow-800',
};

const RestaurantStatusBadge: React.FC<RestaurantStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default RestaurantStatusBadge;
