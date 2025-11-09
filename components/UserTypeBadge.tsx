import React from 'react';
import type { UserType } from '../types';

interface UserTypeBadgeProps {
  type: UserType;
}

const typeMap: Record<UserType, { label: string; color: string }> = {
  admin: { label: 'مدير', color: 'bg-red-100 text-red-800' },
  customer: { label: 'عميل', color: 'bg-blue-100 text-blue-800' },
  driver: { label: 'مندوب', color: 'bg-green-100 text-green-800' },
  restaurant_owner: { label: 'صاحب مطعم', color: 'bg-purple-100 text-purple-800' },
};

const UserTypeBadge: React.FC<UserTypeBadgeProps> = ({ type }) => {
  const { label, color } = typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {label}
    </span>
  );
};

export default UserTypeBadge;