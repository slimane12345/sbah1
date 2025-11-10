import React from 'react';
import type { Driver } from '../types';
import DriverStatusBadge from './DriverStatusBadge';

interface DriversManagementTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  onPayDues: (driver: Driver) => void;
}

const DriversManagementTable: React.FC<DriversManagementTableProps> = ({ drivers, onEdit, onDelete, onPayDues }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السائق</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجمالي الطلبات</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الأرباح</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">معدل الربح</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجمالي التوصيلات</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {drivers.map((driver) => (
            <tr key={driver.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-full object-cover ml-4" src={driver.avatar} alt={driver.name} />
                  <div>
                    <div className="font-semibold">{driver.name}</div>
                    <div className="text-xs text-gray-500">{driver.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <DriverStatusBadge status={driver.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{(driver.totalOrderValue ?? 0).toFixed(2)} د.م.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{(driver.totalEarnings ?? 0).toFixed(2)} د.م.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{driver.ratePerKm} د.م./كم</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.totalDeliveries}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button onClick={() => onPayDues(driver)} className="text-green-600 hover:text-green-900 ml-4">دفع المستحقات</button>
                 <button onClick={() => onEdit(driver)} className="text-indigo-600 hover:text-indigo-900 ml-4">تعديل</button>
                 <button onClick={() => onDelete(driver)} className="text-red-600 hover:text-red-900">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriversManagementTable;