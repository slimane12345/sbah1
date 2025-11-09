import React from 'react';
import type { OrderAdminStatus } from '../types';

interface OrderStatusSelectorProps {
  currentStatus: OrderAdminStatus;
  onStatusChange: (newStatus: OrderAdminStatus) => void;
}

// Fix: Added 'جاهز' to the status options array.
const statusOptions: OrderAdminStatus[] = ['جديد', 'مؤكد', 'قيد التجهيز', 'جاهز', 'بالتوصيل', 'مكتمل', 'ملغي'];

const statusColorMap: Record<OrderAdminStatus, string> = {
  'مكتمل': 'border-green-500 text-green-700 bg-green-50',
  'قيد التجهيز': 'border-blue-500 text-blue-700 bg-blue-50',
  'بالتوصيل': 'border-yellow-500 text-yellow-700 bg-yellow-50',
  'ملغي': 'border-red-500 text-red-700 bg-red-50',
  'جديد': 'border-gray-500 text-gray-700 bg-gray-50',
  'مؤكد': 'border-indigo-500 text-indigo-700 bg-indigo-50',
  // Fix: Added 'جاهز' status to the color map to satisfy the 'OrderAdminStatus' type.
  'جاهز': 'border-purple-500 text-purple-700 bg-purple-50',
};

const OrderStatusSelector: React.FC<OrderStatusSelectorProps> = ({ currentStatus, onStatusChange }) => {
  const colorClass = statusColorMap[currentStatus] || 'border-gray-300';

  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value as OrderAdminStatus)}
      className={`text-xs font-semibold rounded-md border p-1 pr-6 appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${colorClass}`}
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
        backgroundPosition: 'left 0.25rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.25em 1.25em',
      }}
    >
      {statusOptions.map(status => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default OrderStatusSelector;