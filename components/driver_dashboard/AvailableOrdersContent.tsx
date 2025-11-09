import React from 'react';
import type { OrderManagementData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { calculateDistance } from '../../pages/DriverDashboardPage';

interface AvailableOrdersContentProps {
    orders: OrderManagementData[];
    onAccept: (order: OrderManagementData) => void;
}

const AvailableOrdersContent: React.FC<AvailableOrdersContentProps> = ({ orders, onAccept }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-4 pb-20 lg:pb-0">
            <h2 className="text-2xl font-bold text-gray-800">الطلبات المتاحة</h2>
            {orders.length > 0 ? (
                orders.map(order => {
                    const distance = order.restaurantLocation && order.deliveryAddress ? calculateDistance({lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng}, {lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude}) : null;
                    const earnings = distance ? (distance * 1.5) + 5 : 10;
                    return (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-900">{order.restaurant}</p>
                                    <p className="text-xs text-gray-500">{order.deliveryAddress.addressText}</p>
                                </div>
                                <span className="font-bold text-lg text-[#3B82F6]">{order.total.toFixed(2)} {t('currency')}</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-3">
                                <div className="text-sm space-y-1">
                                    <p><span className="font-semibold">{t('distance')}:</span> {distance ? `~${distance.toFixed(1)} ${t('km')}` : 'N/A'}</p>
                                    <p><span className="font-semibold">{t('earnings')}:</span> <span className="text-[#10B981] font-bold">~{earnings.toFixed(2)} {t('currency')}</span></p>
                                </div>
                                <button onClick={() => onAccept(order)} className="bg-[#10B981] text-white font-bold px-6 py-2 rounded-full">
                                    {t('acceptOrder')}
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                    <p className="text-gray-500">{t('noNewOrders')}</p>
                </div>
            )}
        </div>
    );
};

export default AvailableOrdersContent;