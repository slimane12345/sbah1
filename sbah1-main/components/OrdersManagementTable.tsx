import React from 'react';
import type { OrderManagementData, OrderAdminStatus, Driver } from '../types';
import PaymentStatusBadge from './PaymentStatusBadge';
import OrderStatusSelector from './OrderStatusSelector';

interface OrdersManagementTableProps {
  orders: OrderManagementData[];
  allDrivers: Driver[];
  onViewDetails: (order: OrderManagementData) => void;
  onStatusChange: (orderId: string, newStatus: OrderAdminStatus) => void;
  onTrack: (order: OrderManagementData) => void;
  onAssignDriver: (orderId: string, driverId: string) => void;
}

const OrdersManagementTable: React.FC<OrdersManagementTableProps> = ({ orders, onViewDetails, onStatusChange, onTrack, allDrivers, onAssignDriver }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المطعم</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجمالي</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الطلب</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموزع</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الدفع</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الطلب</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.orderNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-full object-cover ml-3" src={order.customer.avatar} alt={order.customer.name} />
                  {order.customer.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.restaurant}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(order.total ?? 0).toLocaleString('ar-MA')} د.م.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <OrderStatusSelector currentStatus={order.status} onStatusChange={(newStatus) => onStatusChange(order.id, newStatus)} />
              </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm">
                 <select
                    value={order.driverId || ''}
                    onChange={(e) => onAssignDriver(order.id, e.target.value)}
                    className="block w-full text-xs p-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    disabled={order.status === 'مكتمل' || order.status === 'ملغي'}
                  >
                    <option value="">اختر موزع...</option>
                    {allDrivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <PaymentStatusBadge status={order.paymentStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button onClick={() => onViewDetails(order)} className="text-indigo-600 hover:text-indigo-900">عرض التفاصيل</button>
                 <button
                    onClick={() => onTrack(order)}
                    disabled={!order.deliveryAddress || !order.driverId}
                    className="mr-4 text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                    title={!order.deliveryAddress || !order.driverId ? 'لا يمكن التتبع بدون موزع وعنوان' : 'تتبع الطلب'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    تتبع
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersManagementTable;