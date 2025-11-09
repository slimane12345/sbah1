import React from 'react';
import type { OrderManagementData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface MyOrdersContentProps {
    orders: OrderManagementData[];
    onUpdateStatus: (orderId: string, newStatus: 'picked_up' | 'delivered') => void;
    onViewOnMap: (order: OrderManagementData) => void;
}

const MyOrdersContent: React.FC<MyOrdersContentProps> = ({ orders, onUpdateStatus, onViewOnMap }) => {
    const { t } = useLanguage();

    const sortedOrders = [...orders].sort((a, b) => (a.status === 'بالتوصيل' ? 1 : -1));

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            <h2 className="text-2xl font-bold text-gray-800">طلباتي النشطة ({orders.length})</h2>

            {orders.length === 0 ? (
                 <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">{t('noActiveOrder')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedOrders.map(order => {
                        const isPickupPhase = order.status === 'مؤكد';
                        return (
                             <div key={order.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-bold text-blue-700">{order.orderNumber}</p>
                                        <div className="mt-2 text-sm space-y-1">
                                            <p><strong className="text-gray-500">{t('from')}:</strong> {order.restaurant}</p>
                                            <p><strong className="text-gray-500">{t('to')}:</strong> {order.deliveryAddress.addressText}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                                        <button 
                                            onClick={() => onUpdateStatus(order.id, isPickupPhase ? 'picked_up' : 'delivered')}
                                            className={`w-full text-white font-semibold py-2 px-4 rounded-md transition-colors ${isPickupPhase ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}
                                        >
                                            {isPickupPhase ? 'استلمت الطلب' : 'وصلت الطلب'}
                                        </button>
                                        <button 
                                            onClick={() => onViewOnMap(order)}
                                            className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-200"
                                        >
                                            عرض على الخريطة
                                        </button>
                                    </div>
                                </div>
                             </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrdersContent;