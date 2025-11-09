import React from 'react';
import type { ApprovalStatus } from '../types';

interface ApprovalStatusBadgeProps {
  status: ApprovalStatus;
}

const statusMap: Record<ApprovalStatus, { label: string; color: string }> = {
  'Pending': { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800' },
  'Approved': { label: 'مقبول', color: 'bg-green-100 text-green-800' },
  'Rejected': { label: 'مرفوض', color: 'bg-red-100 text-red-800' },
};

const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({ status }) => {
  const { label, color } = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {label}
    </span>
  );
};

export default ApprovalStatusBadge;
