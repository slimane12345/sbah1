import React from 'react';
import type { OrderManagementData } from '../types';
import OrderAdminStatusBadge from './OrderAdminStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface OrderDetailsModalProps {
  order: OrderManagementData;
  onClose: () => void;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-800 flex items-center mb-3">
            {icon}
            <span className="mr-2">{title}</span>
        </h3>
        <div className="text-sm text-gray-700">
            {children}
        </div>
    </div>
);

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const { translateField } = useLanguage();
  const subtotal = order.items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
  const deliveryFee = (order.total ?? 0) - subtotal;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">تفاصيل الطلب</h2>
            <p className="text-sm text-blue-600 font-semibold">{order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 mb-4">محتويات الطلب</h3>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-right font-semibold text-gray-600">المنتج</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600">الكمية</th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-600">سعر الوحدة</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3">
                                      <div className="font-semibold">{translateField(item.name)}</div>
                                      {item.options && item.options.length > 0 && (
                                          <ul className="list-disc list-inside text-xs text-gray-500 mt-1 mr-2">
                                              {item.options.map((opt, i) => <li key={i}>{translateField(opt)}</li>)}
                                          </ul>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                                    <td className="px-4 py-3 text-center">{(item.price ?? 0).toLocaleString('ar-MA')} د.م.</td>
                                    <td className="px-4 py-3 text-left font-semibold">{((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString('ar-MA')} د.م.</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Totals Section */}
                <div className="mt-6 flex justify-end">
                    <div className="w-full max-w-sm space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">المجموع الفرعي:</span>
                            <span className="font-medium text-gray-800">{(subtotal ?? 0).toLocaleString('ar-MA')} د.م.</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">رسوم التوصيل:</span>
                            <span className="font-medium text-gray-800">{deliveryFee.toFixed(2)} د.م.</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                            <span>الإجمالي الكلي:</span>
                            <span className="font-bold">{(order.total ?? 0).toLocaleString('ar-MA')} د.م.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-6">
                <InfoCard title="العميل" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}>
                    <div className="flex items-center">
                        <img src={order.customer.avatar} alt={order.customer.name} className="h-10 w-10 rounded-full object-cover" />
                        <span className="mr-3 font-semibold">{order.customer.name}</span>
                    </div>
                </InfoCard>

                <InfoCard title="المندوب" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>}>
                     {order.courier ? (
                        <div className="flex items-center">
                            <img src={order.courier.avatar} alt={order.courier.name} className="h-10 w-10 rounded-full object-cover" />
                            <p className="mr-3 font-semibold">{order.courier.name}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">لم يتم تعيين مندوب بعد</p>
                    )}
                </InfoCard>

                <InfoCard title="معلومات الطلب" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h3a1 1 0 100-2H7z" clipRule="evenodd" /></svg>}>
                    <ul className="space-y-2">
                        <li className="flex justify-between items-center"><span>المطعم:</span> <span className="font-semibold">{order.restaurant}</span></li>
                        <li className="flex justify-between items-center"><span>الحالة:</span> <OrderAdminStatusBadge status={order.status} /></li>
                        <li className="flex justify-between items-center"><span>الدفع:</span> <PaymentStatusBadge status={order.paymentStatus} /></li>
                        <li className="flex justify-between items-center"><span>الطريقة:</span> <span className="font-semibold">{order.paymentMethod === 'COD' ? 'عند الاستلام' : 'بطاقة'}</span></li>
                        <li className="flex justify-between items-center"><span>التاريخ:</span> <span className="font-semibold text-left">{order.date}</span></li>
                    </ul>
                </InfoCard>

                {order.customerNotes && (
                    <InfoCard title="ملاحظات العميل" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>}>
                        <p className="whitespace-pre-wrap">{order.customerNotes}</p>
                    </InfoCard>
                )}
            </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                طباعة الفاتورة
            </button>
            <button type="button" onClick={onClose} className="bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">
                إغلاق
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;