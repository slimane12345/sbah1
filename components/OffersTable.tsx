import React from 'react';
import type { Offer } from '../types';
import OfferStatusBadge from './OfferStatusBadge';

interface OffersTableProps {
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
}

const OffersTable: React.FC<OffersTableProps> = ({ offers, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكود</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">قيمة الخصم</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">فترة الصلاحية</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الاستخدامات</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {offers.map((offer) => (
            <tr key={offer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">{offer.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{offer.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `${offer.discountValue} د.م.`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <OfferStatusBadge status={offer.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>من: {new Date(offer.validFrom).toLocaleDateString('ar-SA')}</div>
                <div>إلى: {new Date(offer.validTo).toLocaleDateString('ar-SA')}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{offer.usageCount}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4 space-x-reverse">
                 <button onClick={() => onEdit(offer)} className="text-indigo-600 hover:text-indigo-900">تعديل</button>
                 <button onClick={() => onDelete(offer)} className="text-red-600 hover:text-red-900">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OffersTable;
