import React from 'react';
import type { Customer } from '../types';
import LoyaltyBadge from './LoyaltyBadge';

interface CustomersTableProps {
  customers: Customer[];
}

const CustomersTable: React.FC<CustomersTableProps> = ({ customers }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الانضمام</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجمالي الطلبات</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مستوى الولاء</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-full object-cover ml-4" src={customer.avatar} alt={customer.name} />
                  <div>
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.email}</div>
                    <div className="text-xs text-gray-500">{customer.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.joinDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{customer.totalOrders}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <LoyaltyBadge tier={customer.loyaltyTier} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button className="text-indigo-600 hover:text-indigo-900 ml-4">عرض</button>
                 <button className="text-gray-500 hover:text-gray-700">تعديل</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;