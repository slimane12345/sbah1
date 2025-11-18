import React from 'react';

interface ActivityStatusBadgeProps {
  isActive: boolean;
}

const ActivityStatusBadge: React.FC<ActivityStatusBadgeProps> = ({ isActive }) => {
  const text = isActive ? 'نشط' : 'غير نشط';
  const colorClass = isActive ? 'bg-green-500' : 'bg-gray-400';

  return (
    <div className="flex items-center">
        <span className={`h-2 w-2 rounded-full ${colorClass} ml-2`}></span>
        <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
};

export default ActivityStatusBadge;