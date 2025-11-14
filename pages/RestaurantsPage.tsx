

import React, { useState, useMemo } from 'react';
import type { Restaurant, RestaurantStatus } from '../types';
import RestaurantsTable from '../components/RestaurantsTable';
import Pagination from '../components/Pagination';

const mockRestaurants: Restaurant[] = [
  { id: 'R001', name: 'مطعم البيت السعودي', logo: 'https://i.pravatar.cc/150?img=21', cuisine: 'سعودي', status: 'مفتوح', rating: 4.5, commissionRate: 15, totalOrders: 1204 },
  { id: 'R002', name: 'بيتزا روما', logo: 'https://i.pravatar.cc/150?img=22', cuisine: 'إيطالي', status: 'مغلق', rating: 4.8, commissionRate: 12, totalOrders: 2580 },
  { id: 'R003', name: 'برجر فاكتوري', logo: 'https://i.pravatar.cc/150?img=23', cuisine: 'أمريكي', status: 'مفتوح', rating: 4.2, commissionRate: 18, totalOrders: 980 },
  { id: 'R004', name: 'نكهة الهند', logo: 'https://i.pravatar.cc/150?img=24', cuisine: 'هندي', status: 'قيد المراجعة', rating: 4.9, commissionRate: 14, totalOrders: 1540 },
  { id: 'R005', name: 'سوشي هاوس', logo: 'https://i.pravatar.cc/150?img=25', cuisine: 'ياباني', status: 'مفتوح', rating: 4.7, commissionRate: 20, totalOrders: 850 },
  { id: 'R006', name: 'شاورما المعلم', logo: 'https://i.pravatar.cc/150?img=26', cuisine: 'شرق أوسطي', status: 'مغلق', rating: 4.6, commissionRate: 15, totalOrders: 3210 },
  { id: 'R007', name: 'المذاق الشامي', logo: 'https://i.pravatar.cc/150?img=27', cuisine: 'سوري', status: 'مفتوح', rating: 4.4, commissionRate: 16, totalOrders: 1100 },
  { id: 'R008', name: 'تاكو بيل', logo: 'https://i.pravatar.cc/150?img=28', cuisine: 'مكسيكي', status: 'مفتوح', rating: 4.0, commissionRate: 17, totalOrders: 750 },
];

const TABS: RestaurantStatus[] = ['مفتوح', 'مغلق', 'قيد المراجعة'];
const ITEMS_PER_PAGE = 8;

// Helper to safely get string from potentially bilingual field
const nameToString = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.ar || Object.values(field)[0] || '';
};


const RestaurantsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<RestaurantStatus | 'الكل'>('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRestaurants = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return mockRestaurants.filter(restaurant => {
            const matchesTab = activeTab === 'الكل' || restaurant.status === activeTab;
            const restaurantName = nameToString(restaurant.name);
            const restaurantCuisine = nameToString(restaurant.cuisine);
            const matchesSearch = 
                (restaurantName).toLowerCase().includes(lowerCaseSearchTerm) ||
                (restaurantCuisine).toLowerCase().includes(lowerCaseSearchTerm);
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);

    const paginatedRestaurants = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredRestaurants]);
    
    const handleTabClick = (tab: RestaurantStatus | 'الكل') => {
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
                        placeholder="ابحث عن مطعم..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                        إضافة مطعم جديد
                    </button>
                </div>
            </div>
            
            <RestaurantsTable restaurants={paginatedRestaurants} />
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default RestaurantsPage;