import React from 'react';
import type { Transaction } from '../types';
import TransactionStatusBadge from './TransactionStatusBadge';

interface FinanceTableProps {
  transactions: Transaction[];
}

const FinanceTable: React.FC<FinanceTableProps> = ({ transactions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم المعاملة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{transaction.description}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${(transaction.amount ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(transaction.amount ?? 0).toLocaleString('ar-MA')} د.م.
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <TransactionStatusBadge status={transaction.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button className="text-indigo-600 hover:text-indigo-900">عرض التفاصيل</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinanceTable;