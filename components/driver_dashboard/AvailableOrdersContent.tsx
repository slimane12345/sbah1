import React from 'react';
import type { OrderManagementData, Driver } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { calculateDistance } from '../../pages/DriverDashboardPage.tsx';

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
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-bold">{translateField(order.restaurant)}</p>
                                    {order.customerNotes && (
                                        <div className="group relative flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <span className="absolute bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -translate-x-1/2 left-1/2 z-10">
                                                {order.customerNotes}
                                            </span>
                                        </div>
                                    )}
                                </div>
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