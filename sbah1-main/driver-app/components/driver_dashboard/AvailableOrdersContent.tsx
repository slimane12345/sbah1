import React from 'react';
import type { OrderManagementData, Driver } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { calculateDistance } from '../../utils/geo.ts';

interface AvailableOrdersContentProps {
    orders: OrderManagementData[];
    onAccept: (order: OrderManagementData) => void;
    driver: Driver;
}

const AvailableOrdersContent: React.FC<AvailableOrdersContentProps> = ({ orders, onAccept, driver }) => {
    const { t, translateField } = useLanguage();

    return (
        <div className="space-y-4 pb-20 lg:pb-0">
            <h2 className="text-2xl font-bold text-gray-800">{t('newOrders')}</h2>
            {orders.length > 0 ? (
                orders.map(order => {
                    const earnings = (order.restaurantLocation && order.deliveryAddress)
                        ? (calculateDistance(
                            { lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng },
                            { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }
                          ) * (driver.ratePerKm ?? 2)).toFixed(2)
                        : 'N/A';
                    return (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                                <p className="font-bold">{translateField(order.restaurant)}</p>
                                <p className="text-sm text-gray-600">{order.deliveryAddress.addressText}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                    <span>{t('distance')}: ~{
                                        (order.restaurantLocation && order.deliveryAddress) ? 
                                        `${calculateDistance({ lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng }, { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }).toFixed(1)} ${t('km')}` : 'N/A'
                                    }</span>
                                    <span className="mx-2">|</span>
                                    <span>{t('earnings')}: {earnings} {earnings !== 'N/A' && t('currency')}</span>
                                </div>
                            </div>
                            <button onClick={() => onAccept(order)} className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold w-full sm:w-auto">
                                {t('acceptOrder')}
                            </button>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">{t('noNewOrders')}</p>
                </div>
            )}
        </div>
    );
};

export default AvailableOrdersContent;