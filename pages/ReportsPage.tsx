import React from 'react';
import SalesTrendChart from '../components/SalesTrendChart';
import CustomerSegmentsChart from '../components/CustomerSegmentsChart';
import TopCouriersList from '../components/TopCouriersList';
import GeographicHeatmap from '../components/GeographicHeatmap';

const ReportsPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center bg-white shadow-sm rounded-lg p-2">
                    <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-md">اليوم</button>
                    <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-md mx-2">أسبوع</button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-md">شهر</button>
                </div>
                 <div className="flex items-center gap-2">
                    <input type="date" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                    <span className="text-gray-500">إلى</span>
                    <input type="date" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Report */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">تقرير المبيعات</h3>
                    <SalesTrendChart />
                </div>

                {/* Customer Report */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">تقرير العملاء</h3>
                    <CustomerSegmentsChart />
                </div>

                {/* Couriers Report */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">تقرير المناديب (الأفضل أداءً)</h3>
                    <TopCouriersList />
                </div>

                {/* Geographic Report */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">التقرير الجغرافي (المناطق الأكثر طلباً)</h3>
                    <GeographicHeatmap />
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
