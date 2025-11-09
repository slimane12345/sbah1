import React from 'react';
import type { Driver, OrderManagementData, DriverView } from '../../types';
import DriverStatCard from './DriverStatCard';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { calculateDistance } from '../../pages/DriverDashboardPage.tsx';

interface OverviewContentProps {
    driver: Driver;
    stats: { dailyEarnings: number; completedToday: number };
    nearbyOrders: OrderManagementData[];
    setActiveView: (view: DriverView) => void;
    onAcceptOrder: (order: OrderManagementData) => void;
    activeOrderCount: number;
}

const OverviewContent: React.FC<OverviewContentProps> = ({ driver, stats, nearbyOrders, setActiveView, onAcceptOrder, activeOrderCount }) => {
    const { t } = useLanguage();
    const isOnline = driver.status === 'متاح';

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DriverStatCard title={t('totalEarningsValue')} value={`${stats.dailyEarnings.toFixed(2)} ${t('currency')}`} icon="cash" />
                <DriverStatCard title={t('totalDeliveries')} value={stats.completedToday.toString()} icon="check" />
                <DriverStatCard title="التقييم" value={driver.rating.toFixed(1)} icon="star" />
            </div>

            {/* Active Orders Summary */}
            {activeOrderCount > 0 && (
                <div 
                    onClick={() => setActiveView('my-orders')}
                    className="bg-blue-600 text-white p-4 rounded-lg shadow-lg flex justify-between items-center cursor-pointer hover:bg-blue-700 transition-colors"
                >
                    <div>
                        <p className="font-bold text-lg">لديك {activeOrderCount} طلبات نشطة</p>
                        <p className="text-sm opacity-90">انقر هنا لإدارة توصيلاتك الحالية</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
            )}

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
                            nearbyOrders.map(order => (
                                <div key={order.id} className="border p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-bold">{order.restaurant}</p>
                                        <p className="text-sm text-gray-600">{order.deliveryAddress.addressText}</p>
                                        <div className="text-xs text-gray-500 mt-1">
                                            <span>{t('distance')}: ~{
                                                (order.restaurantLocation && order.deliveryAddress) ? 
                                                `${calculateDistance({ lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng }, { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }).toFixed(1)} ${t('km')}` : 'N/A'
                                            }</span>
                                            <span className="mx-2">|</span>
                                            <span>{t('earnings')}: {(order.total * 0.1).toFixed(2)} {t('currency')}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => onAcceptOrder(order)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm font-semibold w-full sm:w-auto">
                                        {t('acceptOrder')}
                                    </button>
                                </div>
                            ))
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