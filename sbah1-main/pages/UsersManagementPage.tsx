import React, { useState, useMemo } from 'react';
import type { SystemUser, UserType } from '../types';
import UsersTable from '../components/UsersTable';
import Pagination from '../components/Pagination';

const mockSystemUsers: SystemUser[] = [
  { id: 'uuid-admin-1', fullName: 'مدير النظام', email: 'admin@myplatform.com', phone: '0512345678', userType: 'admin', avatarUrl: 'https://i.pravatar.cc/150?img=50', isVerified: true, isActive: true, createdAt: '2022-01-01' },
  { id: 'uuid-owner-1', fullName: 'صاحب مطعم البيت', email: 'owner.albayt@example.com', phone: '0598765432', userType: 'restaurant_owner', avatarUrl: 'https://i.pravatar.cc/150?img=51', isVerified: true, isActive: true, createdAt: '2022-05-10' },
  { id: 'uuid-driver-1', fullName: 'أحمد محمود', email: 'ahmed.m@driver.com', phone: '0501112233', userType: 'driver', avatarUrl: 'https://i.pravatar.cc/150?img=1', isVerified: true, isActive: false, createdAt: '2022-08-20' },
  { id: 'uuid-customer-1', fullName: 'علي محمد', email: 'ali.m@example.com', phone: '0501234567', userType: 'customer', avatarUrl: 'https://i.pravatar.cc/150?img=11', isVerified: false, isActive: true, createdAt: '2023-01-15' },
  { id: 'uuid-driver-2', fullName: 'فهد المطيري', email: 'fahad.m@driver.com', phone: '0555667788', userType: 'driver', avatarUrl: 'https://i.pravatar.cc/150?img=6', isVerified: true, isActive: true, createdAt: '2023-02-18' },
  { id: 'uuid-customer-2', fullName: 'فاطمة الزهراء', email: 'fatima.z@example.com', phone: '0559876543', userType: 'customer', avatarUrl: 'https://i.pravatar.cc/150?img=12', isVerified: true, isActive: true, createdAt: '2022-11-20' },
  { id: 'uuid-owner-2', fullName: 'مالك بيتزا روما', email: 'owner.pizza@example.com', phone: '0544332211', userType: 'restaurant_owner', avatarUrl: 'https://i.pravatar.cc/150?img=52', isVerified: false, isActive: false, createdAt: '2023-03-01' },
];

const USER_TYPE_TABS: UserType[] = ['admin', 'restaurant_owner', 'driver', 'customer'];
const STATUS_TABS = [{label: 'نشط', value: true}, {label: 'غير نشط', value: false}];
const ITEMS_PER_PAGE = 8;

const UsersManagementPage: React.FC = () => {
    const [activeTypeTab, setActiveTypeTab] = useState<UserType | 'الكل'>('الكل');
    const [activeStatusTab, setActiveStatusTab] = useState<'الكل' | boolean>('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return mockSystemUsers.filter(user => {
            const matchesType = activeTypeTab === 'الكل' || user.userType === activeTypeTab;
            const matchesStatus = activeStatusTab === 'الكل' || user.isActive === activeStatusTab;
            const matchesSearch =
                (user.fullName || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (user.email || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (user.phone || '').includes(searchTerm);
            return matchesType && matchesStatus && matchesSearch;
        });
    }, [activeTypeTab, activeStatusTab, searchTerm]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredUsers]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex flex-col gap-4 w-full">
                    {/* User Type Filters */}
                    <div className="flex border-b border-gray-200 flex-wrap">
                        <button onClick={() => { setActiveTypeTab('الكل'); setCurrentPage(1); }} className={`px-3 py-2 text-sm font-medium ${activeTypeTab === 'الكل' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>الكل</button>
                        {USER_TYPE_TABS.map(tab => <button key={tab} onClick={() => { setActiveTypeTab(tab); setCurrentPage(1); }} className={`px-3 py-2 text-sm font-medium ${activeTypeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>{tab}</button>)}
                    </div>
                    {/* Status and Search Filters */}
                    <div className="flex justify-between items-center">
                         <div className="flex bg-gray-100 p-1 rounded-md">
                            <button onClick={() => { setActiveStatusTab('الكل'); setCurrentPage(1); }} className={`px-3 py-1 text-sm rounded-md ${activeStatusTab === 'الكل' ? 'bg-white shadow' : ''}`}>الكل</button>
                            {STATUS_TABS.map(tab => <button key={tab.label} onClick={() => { setActiveStatusTab(tab.value); setCurrentPage(1); }} className={`px-3 py-1 text-sm rounded-md ${activeStatusTab === tab.value ? 'bg-white shadow' : ''}`}>{tab.label}</button>)}
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="text" placeholder="ابحث بالاسم، البريد أو الهاتف..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">إضافة مستخدم</button>
                        </div>
                    </div>
                </div>
            </div>

            <UsersTable users={paginatedUsers} />

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default UsersManagementPage;