import React, { useState, useMemo, useEffect } from 'react';
import type { Driver, DriverStatus } from '../types';
import DriversManagementTable from '../components/DriversManagementTable';
import Pagination from '../components/Pagination';
import DriverModal from '../components/DriverModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import PayDuesModal from '../components/PayDuesModal';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, Timestamp, addDoc, deleteDoc } from 'firebase/firestore';

const ITEMS_PER_PAGE = 8;
const TABS: DriverStatus[] = ['متاح', 'مشغول', 'غير متصل'];

const DriversManagementPage: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<DriverStatus | 'الكل'>('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [payingDriver, setPayingDriver] = useState<Driver | null>(null);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "drivers"), orderBy("name"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedDrivers: Driver[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'N/A',
                    avatar: data.avatar || 'https://i.pravatar.cc/150',
                    status: data.status || 'غير متصل',
                    vehicle: data.vehicle || 'N/A',
                    licensePlate: data.licensePlate || 'N/A',
                    phone: data.phone || 'N/A',
                    rating: data.rating || 0,
                    totalDeliveries: data.totalDeliveries || 0,
                    lastSeen: data.lastSeen ? new Date(data.lastSeen).toLocaleString('ar-SA') : 'N/A',
                    ratePerKm: data.ratePerKm ?? 2,
                    totalOrderValue: data.totalOrderValue || 0,
                    totalEarnings: data.totalEarnings || 0,
                };
            });
            setDrivers(fetchedDrivers);
            setIsLoading(false);
        }, (err) => {
            console.error("Firebase Error:", err);
            setError("حدث خطأ أثناء جلب بيانات السائقين.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddNew = () => {
        setEditingDriver(null);
        setIsModalOpen(true);
    };

    const handleEdit = (driver: Driver) => {
        setEditingDriver(driver);
        setIsModalOpen(true);
    };
    
    const handleDelete = async (driver: Driver) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف السائق: ${driver.name}؟`)) {
            try {
                await deleteDoc(doc(db, "drivers", driver.id));
            } catch (err) {
                console.error("Error deleting driver:", err);
                setError("فشل حذف السائق.");
            }
        }
    };

    const handleSave = async (driverData: Omit<Driver, 'id' | 'status' | 'rating' | 'totalDeliveries' | 'lastSeen' | 'avatar'>, id: string | null) => {
        setIsSubmitting(true);
        try {
            const dataToSave = {
                name: driverData.name,
                phone: driverData.phone,
                vehicle: driverData.vehicle,
                licensePlate: driverData.licensePlate,
                ratePerKm: driverData.ratePerKm,
                totalOrderValue: driverData.totalOrderValue || 0,
                totalEarnings: driverData.totalEarnings || 0,
            };

            if (id) {
                const driverRef = doc(db, 'drivers', id);
                await updateDoc(driverRef, dataToSave);
            } else {
                await addDoc(collection(db, 'drivers'), {
                    ...dataToSave,
                    status: 'غير متصل',
                    rating: 5,
                    totalDeliveries: 0,
                    lastSeen: new Date().toISOString(),
                    avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
                });
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving driver:", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleOpenPayModal = (driver: Driver) => {
        setPayingDriver(driver);
        setIsPayModalOpen(true);
    };
    
    const handleConfirmPayment = async () => {
        if (!payingDriver) return;
        setIsSubmitting(true);
        try {
            const driverRef = doc(db, 'drivers', payingDriver.id);
            await updateDoc(driverRef, {
                totalOrderValue: 0,
                totalEarnings: 0
            });
            setIsPayModalOpen(false);
            setPayingDriver(null);
        } catch (err) {
            console.error("Error paying dues:", err);
            setError("فشل في تصفير مستحقات السائق.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const filteredDrivers = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return drivers.filter(driver => {
            const matchesTab = activeTab === 'الكل' || driver.status === activeTab;
            const matchesSearch =
                (driver.name || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (driver.licensePlate || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (driver.phone || '').includes(searchTerm);
            return matchesTab && matchesSearch;
        });
    }, [drivers, activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);

    const paginatedDrivers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredDrivers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredDrivers]);

    const handleTabClick = (tab: DriverStatus | 'الكل') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex border-b border-gray-200">
                        <button onClick={() => handleTabClick('الكل')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'الكل' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>الكل</button>
                        {TABS.map(tab => <button key={tab} onClick={() => handleTabClick(tab)} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>{tab}</button>)}
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="ابحث عن سائق..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                        <button onClick={handleAddNew} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">إضافة سائق</button>
                    </div>
                </div>

                {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay message={error} /> : (
                    <>
                        <DriversManagementTable drivers={paginatedDrivers} onEdit={handleEdit} onDelete={handleDelete} onPayDues={handleOpenPayModal} />
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                )}
            </div>
            {isModalOpen && (
                <DriverModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    driver={editingDriver}
                    isSubmitting={isSubmitting}
                />
            )}
            {isPayModalOpen && (
                <PayDuesModal
                    isOpen={isPayModalOpen}
                    onClose={() => setIsPayModalOpen(false)}
                    onConfirm={handleConfirmPayment}
                    driver={payingDriver}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
};

export default DriversManagementPage;