import React from 'react';
import type { Driver, DriverView, OrderManagementData } from '../../types';
import DriverStatCard from './DriverStatCard';
import { useLanguage } from '../../contexts/LanguageContext';

interface OverviewContentProps {
    driver: Driver;
    stats: { dailyEarnings: number; completedToday: number };
    nearbyOrders: OrderManagementData[];
    setActiveView: (view: DriverView) => void;
    onAcceptOrder: (order: OrderManagementData) => void;
}

const OverviewContent: React.FC<OverviewContentProps> = ({ driver, stats, nearbyOrders, setActiveView, onAcceptOrder }) => {
    const { t } = useLanguage();

    const statCards = [
        { title: "أرباح اليوم", value: `${stats.dailyEarnings.toFixed(2)} ${t('currency')}`, icon: 'cash' as const },
        { title: "طلبات مكتملة", value: stats.completedToday.toString(), icon: 'check' as const },
        { title: "متوسط التقييم", value: driver.rating.toFixed(1), icon: 'star' as const },
        { title: "نسبة القبول", value: '95%', icon: 'thumbUp' as const }, // Mock data
    ];

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map(stat => <DriverStatCard key={stat.title} {...stat} />)}
            </div>
            
            {/* Available Orders Section */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg text-gray-800">طلبات جديدة قريبة منك</h3>
                    <button onClick={() => setActiveView('orders')} className="text-sm font-semibold text-[#3B82F6] hover:underline">
                        عرض الكل
                    </button>
                </div>
                <div className="space-y-3">
                    {nearbyOrders.length > 0 ? (
                        nearbyOrders.map(order => (
                            <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800">{order.restaurant}</p>
                                    <p className="text-xs text-gray-500">{order.deliveryAddress.addressText}</p>
                                </div>
                                <button onClick={() => onAcceptOrder(order)} className="bg-[#10B981] text-white font-bold text-sm px-4 py-2 rounded-full">
                                    قبول
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                            <p className="text-gray-500">{t('noNewOrders')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewContent;