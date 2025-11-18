import React from 'react';
import type { OrderManagementData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ActiveOrdersContentProps {
    orders: OrderManagementData[];
    onSelectOrder: (order: OrderManagementData) => void;
}

const ActiveOrdersContent: React.FC<ActiveOrdersContentProps> = ({ orders, onSelectOrder }) => {
    const { t, translateField } = useLanguage();

    return (
        <div className="space-y-4 pb-20 lg:pb-0">
            <h2 className="text-2xl font-bold text-gray-800">{t('myActiveOrders')}</h2>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <p className="font-bold text-blue-600">{order.orderNumber}</p>
                            <p className="font-semibold">{translateField(order.restaurant)}</p>
                            <p className="text-sm text-gray-600">{order.deliveryAddress.addressText}</p>
                        </div>
                        <button onClick={() => onSelectOrder(order)} className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 text-sm font-semibold w-full sm:w-auto">
                            {t('viewDetails')}
                        </button>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">{t('noActiveOrdersMessage')}</p>
                </div>
            )}
        </div>
    );
};

export default ActiveOrdersContent;
