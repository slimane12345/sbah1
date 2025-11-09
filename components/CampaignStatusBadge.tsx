import React from 'react';
import type { CampaignStatus } from '../types';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

const statusColorMap: Record<CampaignStatus, string> = {
  'نشطة': 'bg-green-100 text-green-800',
  'مجدولة': 'bg-blue-100 text-blue-800',
  'مكتملة': 'bg-gray-100 text-gray-800',
  'مسودة': 'bg-yellow-100 text-yellow-800',
};

const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default CampaignStatusBadge;
