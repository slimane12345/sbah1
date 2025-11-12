import React from 'react';
import type { Driver, OrderManagementData, DriverView } from '../../types';
import DriverStatCard from './DriverStatCard';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { calculateDistance } from '../../utils/geo.ts';

interface OverviewContentProps {
    driver: Driver;
    stats: { myDailyEarnings: number; completedToday: number };
    nearbyOrders: OrderManagementData[];
    setActiveView: (view: DriverView) => void;
    onAcceptOrder: (order: OrderManagementData) => void;
}

const OverviewContent: React.FC<OverviewContentProps> = ({ driver, stats, nearbyOrders, setActiveView, onAcceptOrder }) => {
    const { t, translateField } = useLanguage();
    const isOnline = driver.status === 'متاح' || driver.status === 'مشغول';

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DriverStatCard title={t('myDailyEarnings')} value={`${stats.myDailyEarnings.toFixed(2)} ${t('currency')}`} icon="cash" />
                <DriverStatCard title={t('totalDeliveries')} value={stats.completedToday.toString()} icon="check" />
                <DriverStatCard title="التقييم" value={driver.rating.toFixed(1)} icon="star" />
            </div>

            {/* Orders Section */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">{t('newOrders')}</h3>
                    <button onClick={() => setActiveView('orders')} className="text-sm font-semibold text-blue-600 hover:underline">
                        {t('viewAll')}
                    </button>
                </div>
                {isOnline ? (
                    <div className="space-y-4">
                        {nearbyOrders.length > 0 ? (
                            nearbyOrders.map(order => {
                                const earnings = (order.restaurantLocation && order.deliveryAddress)
                                    ? (calculateDistance(
                                        { lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng },
                                        { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }
                                      ) * (driver.ratePerKm ?? 2)).toFixed(2)
                                    : 'N/A';
                                return (
                                <div key={order.id} className="border p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                                    <button onClick={() => onAcceptOrder(order)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold w-full sm:w-auto">
                                        {t('acceptOrder')}
                                    </button>
                                </div>
                            )})
                        ) : (
                            <p className="text-center text-gray-500 py-4">{t('noNewOrders')}</p>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-700">{t('youAreOffline')}</p>
                        <p className="text-sm text-gray-500 mt-1">اذهب "أونلاين" لترى الطلبات الجديدة.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverviewContent;