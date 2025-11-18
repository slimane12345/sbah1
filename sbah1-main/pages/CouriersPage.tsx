import React, { useState, useMemo } from 'react';
import type { Courier, CourierStatus } from '../types';
import CouriersTable from '../components/CouriersTable';
import Pagination from '../components/Pagination';

const mockCouriers: Courier[] = [
  { id: 'C001', name: 'أحمد محمود', avatar: 'https://i.pravatar.cc/150?img=1', status: 'متاح', rating: 4.8, totalDeliveries: 125, acceptanceRate: 98, lastSeen: 'متصل الآن' },
  { id: 'C002', name: 'محمد عبدالله', avatar: 'https://i.pravatar.cc/150?img=2', status: 'مشغول', rating: 4.9, totalDeliveries: 210, acceptanceRate: 95, lastSeen: 'آخر ظهور منذ 5 دقائق' },
  { id: 'C003', name: 'خالد الغامدي', avatar: 'https://i.pravatar.cc/150?img=3', status: 'غير نشط', rating: 4.7, totalDeliveries: 88, acceptanceRate: 92, lastSeen: 'آخر ظهور منذ ساعتين' },
  { id: 'C004', name: 'سلطان القحطاني', avatar: 'https://i.pravatar.cc/150?img=4', status: 'متاح', rating: 4.8, totalDeliveries: 150, acceptanceRate: 100, lastSeen: 'متصل الآن' },
  { id: 'C005', name: 'ياسر الدوسري', avatar: 'https://i.pravatar.cc/150?img=5', status: 'مشغول', rating: 4.6, totalDeliveries: 95, acceptanceRate: 89, lastSeen: 'آخر ظهور منذ 15 دقيقة' },
  { id: 'C006', name: 'فهد المطيري', avatar: 'https://i.pravatar.cc/150?img=6', status: 'متاح', rating: 5.0, totalDeliveries: 300, acceptanceRate: 99, lastSeen: 'متصل الآن' },
  { id: 'C007', name: 'عبدالعزيز العمري', avatar: 'https://i.pravatar.cc/150?img=7', status: 'غير نشط', rating: 4.5, totalDeliveries: 70, acceptanceRate: 85, lastSeen: 'آخر ظهور أمس' },
  { id: 'C008', name: 'تركي الشمري', avatar: 'https://i.pravatar.cc/150?img=8', status: 'متاح', rating: 4.9, totalDeliveries: 180, acceptanceRate: 97, lastSeen: 'متصل الآن' },
  { id: 'C009', name: 'فيصل الحربي', avatar: 'https://i.pravatar.cc/150?img=9', status: 'متاح', rating: 4.7, totalDeliveries: 110, acceptanceRate: 94, lastSeen: 'متصل الآن' },
  { id: 'C010', name: 'بدر الزهراني', avatar: 'https://i.pravatar.cc/150?img=10', status: 'مشغول', rating: 4.8, totalDeliveries: 130, acceptanceRate: 96, lastSeen: 'آخر ظهور منذ 8 دقائق' },
];

const TABS: CourierStatus[] = ['متاح', 'مشغول', 'غير نشط'];
const ITEMS_PER_PAGE = 8;

const CouriersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<CourierStatus | 'الكل'>('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCouriers = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return mockCouriers.filter(courier => {
            const matchesTab = activeTab === 'الكل' || courier.status === activeTab;
            const matchesSearch = 
                (courier.id || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (courier.name || '').toLowerCase().includes(lowerCaseSearchTerm);
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredCouriers.length / ITEMS_PER_PAGE);

    const paginatedCouriers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCouriers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredCouriers]);
    
    const handleTabClick = (tab: CourierStatus | 'الكل') => {
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
                        placeholder="ابحث عن مندوب..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                        إضافة مندوب جديد
                    </button>
                </div>
            </div>
            
            <CouriersTable couriers={paginatedCouriers} />
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default CouriersPage;