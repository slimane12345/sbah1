

import React from 'react';
import type { PastOrder } from '../../types';
import StatusBadge from '../StatusBadge';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface OrderHistoryProps {
    orders: PastOrder[];
    onTrackOrder: (order: PastOrder) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onTrackOrder }) => {
    const { t, translateField } = useLanguage();
    
    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t('orderHistory')}</h3>
                <div className="mt-6 space-y-4">
                    {orders.length > 0 ? (
                        orders.map(order => {
                            const canTrack = order.status !== 'مكتمل' && order.status !== 'ملغي' && !!order.deliveryAddress;
                            return (
                                <div key={order.id} className="border p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-blue-600">{order.id}</p>
                                            <p className="font-semibold">{order.restaurantName}</p>
                                            <p className="text-sm text-gray-500">{order.date}</p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        {order.items.map(item => `${item.quantity} x ${translateField(item.name)}`).join(', ')}
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="font-bold">{order.total.toLocaleString('ar-MA')} د.م.</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onTrackOrder(order)}
                                                disabled={!canTrack}
                                                className="btn-customer-primary"
                                                title={!canTrack ? t('trackOrderDisabledTooltip') : t('trackOrder')}
                                            >
                                                {t('trackOrder')}
                                            </button>
                                            <button className="btn-customer-secondary">
                                                {t('reorder')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 py-8">{t('noPastOrders')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;