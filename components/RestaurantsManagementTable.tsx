import React from 'react';
import type { RestaurantManagementData } from '../types';
import ApprovalStatusBadge from './ApprovalStatusBadge';
import StatusToggle from './StatusToggle';

interface RestaurantsManagementTableProps {
  data: RestaurantManagementData[];
  onOpenAnalysis: (restaurant: RestaurantManagementData) => void;
  onReview: (restaurant: RestaurantManagementData) => void;
  onToggleActive: (restaurant: RestaurantManagementData) => void;
  onEdit: (restaurant: RestaurantManagementData) => void;
}

const RestaurantsManagementTable: React.FC<RestaurantsManagementTableProps> = ({ 
  data, 
  onOpenAnalysis, 
  onReview, 
  onToggleActive, 
  onEdit
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المطعم</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">بيانات المالك</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الطلب</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الطلب</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة النشاط</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {req.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-semibold">{req.ownerName}</div>
                      <div className="text-xs text-gray-500">{req.ownerEmail}</div>
                      <div className="text-xs text-gray-500">{req.ownerPhone}</div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.joinDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <ApprovalStatusBadge status={req.approvalStatus} />
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm">
                   <StatusToggle 
                      enabled={req.isActive}
                      onChange={() => onToggleActive(req)}
                      disabled={req.approvalStatus !== 'Approved'}
                   />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4 space-x-reverse">
                    <>
                      {req.approvalStatus === 'Approved' && (
                        <button onClick={() => onOpenAnalysis(req)} className="inline-flex items-center text-teal-600 hover:text-teal-900">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            تحليل AI
                        </button>
                      )}
                      {req.approvalStatus === 'Pending' && (
                        <button onClick={() => onReview(req)} className="text-indigo-600 hover:text-indigo-900">مراجعة</button>
                      )}
                      <button onClick={() => onEdit(req)} className="text-gray-600 hover:text-gray-900">تعديل</button>
                    </>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantsManagementTable;