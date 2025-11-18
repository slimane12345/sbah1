import React, { useState, useMemo } from 'react';
import type { Transaction, TransactionType } from '../types';
import StatCard, { StatCardIcon } from '../components/StatCard';
import FinanceTable from '../components/FinanceTable';
import Pagination from '../components/Pagination';

const mockTransactions: Transaction[] = [
    { id: 'TRN001', date: '2023-10-28', description: 'إيراد من طلب #12345', amount: 150, type: 'إيراد طلب', status: 'مكتمل' },
    { id: 'TRN002', date: '2023-10-28', description: 'عمولة للمندوب أحمد محمود', amount: -15, type: 'عمولة مندوب', status: 'مكتمل' },
    { id: 'TRN003', date: '2023-10-28', description: 'دفعة لمطعم البيت', amount: -127.5, type: 'مدفوعات مطعم', status: 'معلق' },
    { id: 'TRN004', date: '2023-10-27', description: 'إيراد من طلب #12346', amount: 85, type: 'إيراد طلب', status: 'مكتمل' },
    { id: 'TRN005', date: '2023-10-27', description: 'عمولة للمندوب محمد عبدالله', amount: -8.5, type: 'عمولة مندوب', status: 'مكتمل' },
    { id: 'TRN006', date: '2023-10-27', description: 'رسوم خدمة طلب #12345', amount: 2.5, type: 'رسوم خدمة', status: 'مكتمل' },
    { id: 'TRN007', date: '2023-10-26', description: 'دفعة لبيتزا هت', amount: -2500, type: 'مدفوعات مطعم', status: 'مكتمل' },
    { id: 'TRN008', date: '2023-10-26', description: 'إيراد من طلب #12351', amount: 95, type: 'إيراد طلب', status: 'مكتمل' },
    { id: 'TRN009', date: '2023-10-25', description: 'عمولة للمندوب فهد المطيري', amount: -9.5, type: 'عمولة مندوب', status: 'فشل' },
    { id: 'TRN010', date: '2023-10-25', description: 'دفعة لبرجر كنج', amount: -1800, type: 'مدفوعات مطعم', status: 'مكتمل' },
    { id: 'TRN011', date: '2023-10-24', description: 'إيراد من طلب #12355', amount: 90, type: 'إيراد طلب', status: 'مكتمل' },
];

const TABS: TransactionType[] = ['إيراد طلب', 'عمولة مندوب', 'مدفوعات مطعم', 'رسوم خدمة'];
const ITEMS_PER_PAGE = 8;

const FinancePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TransactionType | 'الكل'>('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return mockTransactions.filter(transaction => {
            const matchesTab = activeTab === 'الكل' || transaction.type === activeTab;
            const matchesSearch =
                (transaction.id || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (transaction.description || '').toLowerCase().includes(lowerCaseSearchTerm);
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredTransactions]);

    const handleTabClick = (tab: TransactionType | 'الكل') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };
    
    const stats = [
        { title: 'إجمالي الإيرادات', value: '125,400 د.م.', icon: 'revenue' as StatCardIcon, change: '+5.2%', changeType: 'increase' as const },
        { title: 'عمولات المناديب', value: '12,540 د.م.', icon: 'couriers' as StatCardIcon, change: '+5.2%', changeType: 'increase' as const },
        { title: 'مدفوعات للمطاعم', value: '87,780 د.م.', icon: 'restaurants' as StatCardIcon, change: '+4.8%', changeType: 'increase' as const },
        { title: 'صافي الربح', value: '25,080 د.م.', icon: 'orders' as StatCardIcon, change: '+6.1%', changeType: 'increase' as const },
      ];

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        change={stat.change}
                        changeType={stat.changeType}
                    />
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex border-b border-gray-200 flex-wrap">
                        <button
                            onClick={() => handleTabClick('الكل')}
                            className={`px-3 py-2 text-sm font-medium ${activeTab === 'الكل' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            الكل
                        </button>
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={`px-3 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="ابحث في المعاملات..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                         <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            تصدير تقرير
                        </button>
                    </div>
                </div>

                <FinanceTable transactions={paginatedTransactions} />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    );
};

export default FinancePage;