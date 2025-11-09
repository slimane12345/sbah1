import React, { useState, useMemo } from 'react';
import type { Customer } from '../types';
import CustomersTable from '../components/CustomersTable';
import Pagination from '../components/Pagination';

const mockCustomers: Customer[] = [
  { id: 'U001', name: 'علي محمد', avatar: 'https://i.pravatar.cc/150?img=11', email: 'ali.m@example.com', phone: '0501234567', joinDate: '2023-01-15', totalOrders: 45, loyaltyTier: 'ذهبي' },
  { id: 'U002', name: 'فاطمة الزهراء', avatar: 'https://i.pravatar.cc/150?img=12', email: 'fatima.z@example.com', phone: '0559876543', joinDate: '2022-11-20', totalOrders: 88, loyaltyTier: 'بلاتيني' },
  { id: 'U003', name: 'خالد عبدالله', avatar: 'https://i.pravatar.cc/150?img=13', email: 'khalid.a@example.com', phone: '0533219876', joinDate: '2023-05-10', totalOrders: 12, loyaltyTier: 'فضي' },
  { id: 'U004', name: 'سارة إبراهيم', avatar: 'https://i.pravatar.cc/150?img=14', email: 'sara.i@example.com', phone: '0544561234', joinDate: '2023-08-01', totalOrders: 5, loyaltyTier: 'برونزي' },
  { id: 'U005', name: 'يوسف أحمد', avatar: 'https://i.pravatar.cc/150?img=15', email: 'yousef.a@example.com', phone: '0567894321', joinDate: '2021-06-25', totalOrders: 150, loyaltyTier: 'بلاتيني' },
  { id: 'U006', name: 'نورة خالد', avatar: 'https://i.pravatar.cc/150?img=16', email: 'noura.k@example.com', phone: '0581237654', joinDate: '2023-02-28', totalOrders: 25, loyaltyTier: 'فضي' },
  { id: 'U007', name: 'محمد علي', avatar: 'https://i.pravatar.cc/150?img=17', email: 'mohammed.a@example.com', phone: '0598761234', joinDate: '2023-09-05', totalOrders: 2, loyaltyTier: 'برونزي' },
  { id: 'U008', name: 'ريم عبدالله', avatar: 'https://i.pravatar.cc/150?img=18', email: 'reem.a@example.com', phone: '0576549871', joinDate: '2022-03-12', totalOrders: 60, loyaltyTier: 'ذهبي' },
];

const ITEMS_PER_PAGE = 8;

const CustomersPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return mockCustomers.filter(customer =>
            (customer.name || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (customer.email || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (customer.phone || '').includes(searchTerm)
        );
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredCustomers]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h3 className="text-xl font-semibold text-gray-800">قائمة العملاء</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="ابحث عن عميل..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                        إضافة عميل جديد
                    </button>
                </div>
            </div>

            <CustomersTable customers={paginatedCustomers} />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default CustomersPage;