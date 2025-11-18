import React from 'react';
import type { Driver, DailyEarning } from '../../types';
import DriverStatCard from './DriverStatCard';
import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../LoadingSpinner';
import type { Timestamp } from 'firebase/firestore';

interface EarningsContentProps {
    stats: { totalOrderValue: number; myTotalEarnings: number; };
    driver: Driver;
    dailyEarnings: DailyEarning[];
    isLoading: boolean;
}

const EarningsContent: React.FC<EarningsContentProps> = ({ stats, driver, dailyEarnings, isLoading }) => {
    const { t } = useLanguage();
    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            <h2 className="text-2xl font-bold text-gray-800">الأرباح والإحصائيات</h2>
            
            {/* Total Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DriverStatCard title={t('totalOrdersValue')} value={`${(stats.totalOrderValue || 0).toFixed(2)} ${t('currency')}`} icon="cash" />
                <DriverStatCard title={t('myEarnings')} value={`${(stats.myTotalEarnings || 0).toFixed(2)} ${t('currency')}`} icon="thumbUp" />
                <DriverStatCard title={t('totalDeliveries')} value={(driver.totalDeliveries || 0).toString()} icon="check" />
            </div>

            {/* Daily Earnings Log */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-gray-800 mb-4">{t('dailyEarningsLog')}</h3>
                {isLoading ? (
                    <LoadingSpinner />
                ) : dailyEarnings.length > 0 ? (
                    <div className="space-y-3">
                        {dailyEarnings.map(day => (
                            <div key={day.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-gray-800">
                                        {new Date((day.date as Timestamp).seconds * 1000).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <p className="font-bold text-lg text-green-600">
                                        {day.earnings.toFixed(2)} {t('currency')}
                                    </p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mt-1">
                                    <span>{day.deliveries} {t('deliveries')}</span>
                                    <span>{t('totalValue')}: {day.totalValue.toFixed(2)} {t('currency')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">{t('noEarningsHistory')}</p>
                )}
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-gray-800 mb-4">طرق السحب</h3>
                <p className="text-sm text-gray-500">سيتم إضافة خيارات سحب الأرباح قريباً.</p>
            </div>
        </div>
    );
};

export default EarningsContent;