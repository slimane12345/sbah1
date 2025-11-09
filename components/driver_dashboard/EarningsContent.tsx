import React from 'react';
import type { Driver } from '../../types';
import DriverStatCard from './DriverStatCard';
import EarningsChart from './EarningsChart';
import { useLanguage } from '../../contexts/LanguageContext';

interface EarningsContentProps {
    stats: { totalEarnings: number };
    driver: Driver;
}

const EarningsContent: React.FC<EarningsContentProps> = ({ stats, driver }) => {
    const { t } = useLanguage();
    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            <h2 className="text-2xl font-bold text-gray-800">الأرباح والإحصائيات</h2>
            <div className="grid grid-cols-2 gap-4">
                <DriverStatCard title="إجمالي الأرباح" value={`${stats.totalEarnings.toFixed(2)} ${t('currency')}`} icon="cash" />
                <DriverStatCard title="إجمالي التوصيلات" value={driver.totalDeliveries.toString()} icon="check" />
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-gray-800 mb-4">الأرباح الأسبوعية</h3>
                <div className="h-64">
                    <EarningsChart />
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-gray-800 mb-4">طرق السحب</h3>
                <p className="text-sm text-gray-500">سيتم إضافة خيارات سحب الأرباح قريباً.</p>
            </div>
        </div>
    );
};

export default EarningsContent;