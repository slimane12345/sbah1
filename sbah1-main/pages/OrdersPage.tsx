import React, { useState, useMemo } from 'react';
import type { Order, OrderStatus } from '../types.ts';
import OrdersTable from '../components/OrdersTable.tsx';
import Pagination from '../components/Pagination.tsx';

const mockOrders: Order[] = [
  { id: '#12345', customer: 'علي محمد', restaurant: 'مطعم البيت', total: 150, status: 'مكتمل', date: '2023-10-27' },
  { id: '#12346', customer: 'فاطمة الزهراء', restaurant: 'بيتزا هت', total: 85, status: 'قيد التجهيز', date: '2023-10-27' },
  { id: '#12347', customer: 'خالد عبدالله', restaurant: 'برجر كنج', total: 120, status: 'بالتوصيل', date: '2023-10-27' },
  { id: '#12348', customer: 'سارة إبراهيم', restaurant: 'مطعم الواحة', total: 210, status: 'ملغي', date: '2023-10-26' },
  { id: '#12349', customer: 'يوسف أحمد', restaurant: 'شاورما كلاسك', total: 55, status: 'جديد', date: '2023-10-27' },
  { id: '#12350', customer: 'نورة خالد', restaurant: 'مطعم البيت', total: 130, status: 'جاهز', date: '2023-10-27' },
  { id: '#12351', customer: 'محمد علي', restaurant: 'بيتزا هت', total: 95, status: 'مكتمل', date: '2023-10-26' },
  { id: '#12352', customer: 'أحمد حسين', restaurant: 'برجر كنج', total: 70, status: 'مكتمل', date: '2023-10-25' },
  { id: '#12353', customer: 'عبدالرحمن وليد', restaurant: 'مطعم الواحة', total: 180, status: 'قيد التجهيز', date: '2023-10-27' },
  { id: '#12354', customer: 'ريم عبدالله', restaurant: 'شاورما كلاسك', total: 60, status: 'بالتوصيل', date: '2023-10-27' },
  { id: '#12355', customer: 'سلطان فهد', restaurant: 'مطعم البيت', total: 90, status: 'مكتمل', date: '2023-10-24' },
  { id: '#12356', customer: 'جواهر محمد', restaurant: 'بيتزا هت', total: 110, status: 'ملغي', date: '2023-10-26' },
];

const TABS: OrderStatus[] = ['جديد', 'قيد التجهيز', 'جاهز', 'بالتوصيل', 'مكتمل', 'ملغي'];
const ITEMS_PER_PAGE = 8;

const OrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<OrderStatus | 'الكل'>('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return mockOrders.filter(order => {
            const matchesTab = activeTab === 'الكل' || order.status === activeTab;
            const matchesSearch = 
                (order.id || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (order.customer || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (order.restaurant || '').toLowerCase().includes(lowerCaseSearchTerm);
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredOrders]);
    
    const handleTabClick = (tab: OrderStatus | 'الكل') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex border-b border-gray-200">
                    <button 
                        onClick={() => handleTabClick('الكل')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'الكل' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        الكل
                    </button>
                    {TABS.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => handleTabClick(tab)}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                 <div className="flex items-center gap-2">
                    <input 
                        type="text"
                        placeholder="ابحث عن طلب..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                        إضافة طلب جديد
                    </button>
                </div>
            </div>
            
            <OrdersTable orders={paginatedOrders} />
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default OrdersPage;