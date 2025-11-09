import React from 'react';
import type { Campaign } from '../types';
import CampaignStatusBadge from './CampaignStatusBadge';

interface CampaignsTableProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

const CampaignsTable: React.FC<CampaignsTableProps> = ({ campaigns, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الحملة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجمهور المستهدف</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفترة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأداء</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <CampaignStatusBadge status={campaign.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.targetAudience}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{campaign.startDate || 'N/A'}</div>
                <div>{campaign.endDate || 'N/A'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{campaign.performance}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4 space-x-reverse">
                 <button onClick={() => onEdit(campaign)} className="text-indigo-600 hover:text-indigo-900">تعديل</button>
                 <button onClick={() => onDelete(campaign)} className="text-red-600 hover:text-red-900">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
