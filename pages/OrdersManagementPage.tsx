import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { OrderManagementData, OrderAdminStatus, PaymentStatus, Driver, AppSettings } from '../types';
import OrdersManagementTable from '../components/OrdersManagementTable';
import Pagination from '../components/Pagination';
import OrderDetailsModal from '../components/OrderDetailsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import OrderTrackingModal from '../components/OrderTrackingModal';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, Timestamp, getDoc } from 'firebase/firestore';


const ITEMS_PER_PAGE = 10;

// Mock Data for fallback
const mockOrdersManagementData: OrderManagementData[] = [
    { id: 'OM-001', orderNumber: '#12357', customer: { name: 'علي محمد', avatar: 'https://i.pravatar.cc/150?img=11' }, restaurant: 'مطعم البيت السعودي', total: 150, status: 'مكتمل', paymentStatus: 'مدفوع', paymentMethod: 'Credit Card', date: '2023-10-28', courier: { name: 'أحمد محمود', avatar: 'https://i.pravatar.cc/150?img=1' }, items: [{ name: 'كبسة دجاج', quantity: 2, price: 25 }], deliveryAddress: { latitude: 33.97, longitude: -6.85, addressText: "123 شارع النخيل، حي الرياض، الرباط" } },
    { id: 'OM-002', orderNumber: '#12358', customer: { name: 'فاطمة الزهراء', avatar: 'https://i.pravatar.cc/150?img=12' }, restaurant: 'بيتزا روما', total: 95, status: 'قيد التجهيز', paymentStatus: 'مدفوع', paymentMethod: 'Credit Card', date: '2023-10-28', courier: { name: 'محمد عبدالله', avatar: 'https://i.pravatar.cc/150?img=2' }, items: [{ name: 'بيتزا مارجريتا', quantity: 1, price: 35 }], deliveryAddress: { latitude: 33.98, longitude: -6.86, addressText: "456 شارع المحيط، حي الأمان، الرباط" } }
];

const mapBackendStatusToFrontend = (status: string): OrderAdminStatus => {
    const map: { [key: string]: OrderAdminStatus } = {
        pending: 'جديد',
        confirmed: 'مؤكد',
        preparing: 'قيد التجهيز',
        ready: 'جاهز',
        picked_up: 'بالتوصيل',
        delivered: 'مكتمل',
        cancelled: 'ملغي'
    };
    return map[status] || 'جديد';
};

const mapFrontendStatusToBackend = (status: OrderAdminStatus): string => {
    const map: { [key in OrderAdminStatus]: string } = {
        'جديد': 'pending',
        'مؤكد': 'confirmed',
        'قيد التجهيز': 'preparing',
        'جاهز': 'ready',
        'بالتوصيل': 'picked_up',
        'مكتمل': 'delivered',
        'ملغي': 'cancelled'
    };
    return map[status] || 'pending';
}

const mapPaymentStatusToFrontend = (status: string): PaymentStatus => {
    const map: {[key: string]: PaymentStatus} = {
        pending: 'معلق',
        paid: 'مدفوع',
        failed: 'غير مدفوع',
        refunded: 'مسترجع',
    };
    return map[status] || 'معلق';
};


const OrdersManagementPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderManagementData[]>([]);
    const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appSettings, setAppSettings] = useState<AppSettings | null>(null);

    const [activeTab, setActiveTab] = useState<OrderAdminStatus | 'الكل'>('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderManagementData | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        
        const unsubscribeOrders = onSnapshot(q, (querySnapshot) => {
            const fetchedOrders: OrderManagementData[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    orderNumber: data.orderNumber || 'N/A',
                    customer: { name: data.customerName || 'N/A', avatar: data.customerAvatar || '' },
                    restaurant: data.restaurantName || 'N/A',
                    total: data.finalAmount || 0,
                    status: mapBackendStatusToFrontend(data.status),
                    paymentStatus: mapPaymentStatusToFrontend(data.paymentStatus),
                    paymentMethod: data.paymentMethod === 'cash' ? 'COD' : 'Credit Card',
                    date: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toLocaleDateString('ar-SA') : 'N/A',
                    courier: data.driverId ? { name: data.driverName || 'N/A', avatar: data.driverAvatar || '' } : null,
                    driverId: data.driverId || null,
                    items: data.items.map((item: any) => ({
                        name: item.productName,
                        quantity: item.quantity,
                        price: item.unitPrice,
                        options: item.options
                    })),
                    deliveryAddress: data.deliveryAddress,
                    restaurantLocation: data.restaurantLocation || null,
                    customerNotes: data.customerNotes || '',
                };
            });
            setOrders(fetchedOrders);
            setIsLoading(false);
        }, (err) => {
            console.error("Firebase Error:", err);
            setOrders(mockOrdersManagementData);
            setError("حدث خطأ أثناء جلب البيانات. يتم عرض بيانات تجريبية.");
            setIsLoading(false);
        });

        const driversQuery = query(collection(db, "drivers"), orderBy("name"));
        const unsubscribeDrivers = onSnapshot(driversQuery, (querySnapshot) => {
            const fetchedDrivers: Driver[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Driver));
            setAllDrivers(fetchedDrivers);
        });
        
        const fetchAppSettings = async () => {
            const settingsDocRef = doc(db, 'settings', 'app_config');
            try {
                const docSnap = await getDoc(settingsDocRef);
                if (docSnap.exists()) {
                    setAppSettings(docSnap.data() as AppSettings);
                }
            } catch (error) {
                console.error("Error fetching app settings in Orders Mgmt:", error);
            }
        };

        fetchAppSettings();


        return () => {
            unsubscribeOrders();
            unsubscribeDrivers();
        };
    }, []);

    const handleViewDetails = (order: OrderManagementData) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };
    
    const handleTrackOrder = (order: OrderManagementData) => {
        setSelectedOrder(order);
        setIsTrackingModalOpen(true);
    };

    const handleStatusChange = async (orderId: string, newStatus: OrderAdminStatus) => {
        const orderRef = doc(db, 'orders', orderId);
        try {
            await updateDoc(orderRef, {
                status: mapFrontendStatusToBackend(newStatus)
            });
        } catch (err) {
            console.error("Error updating status:", err);
            setError("فشل تحديث حالة الطلب.");
        }
    };

    const handleAssignDriver = async (orderId: string, driverId: string) => {
        const orderRef = doc(db, 'orders', orderId);
        const currentOrder = orders.find(o => o.id === orderId);
        if (!currentOrder) return;

        let updateData: any = {};

        if (!driverId) {
            updateData = { driverId: null, driverName: null, driverAvatar: null };
        } else {
            const selectedDriver = allDrivers.find(d => d.id === driverId);
            if (!selectedDriver) return;

            updateData = {
                driverId: selectedDriver.id,
                driverName: selectedDriver.name,
                driverAvatar: selectedDriver.avatar,
            };

            if (currentOrder.status === 'جديد') {
                updateData.status = mapFrontendStatusToBackend('مؤكد');
            }
        }

        try {
            await updateDoc(orderRef, updateData);
            
            // Send Push Notification
            if (driverId && appSettings?.notifications.fcmServerKey) {
                const assignedDriver = allDrivers.find(d => d.id === driverId);
                if (assignedDriver?.fcmToken) {
                    console.log(`Sending notification to ${assignedDriver.name} with token ${assignedDriver.fcmToken}`);
                    
                    const url = `${window.location.origin}/driver.html?view=active_orders`;
                    const message = {
                        to: assignedDriver.fcmToken,
                        notification: {
                            title: "طلب جديد!",
                            body: `لقد تم تعيين طلب جديد لك من مطعم ${currentOrder.restaurant}.`,
                            icon: '/assets/icons/icon-192x192.png'
                        },
                        webpush: {
                            fcm_options: {
                                link: url
                            }
                        },
                        data: {
                            url: url
                        }
                    };
                    
                    try {
                        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
                            method: 'POST',
                            headers: {
                                'Authorization': `key=${appSettings.notifications.fcmServerKey}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(message)
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            console.error("FCM send error:", errorData);
                        } else {
                            console.log("Notification sent successfully");
                        }
                    } catch (fcmError) {
                        console.error("Error sending FCM message:", fcmError);
                    }
                }
            }

        } catch (err) {
            console.error("Error assigning driver:", err);
            setError("فشل في تعيين الموزع.");
        }
    };
    
    const filteredOrders = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return orders.filter(order => {
            const matchesTab = activeTab === 'الكل' || order.status === activeTab;
            const matchesSearch =
                (order.orderNumber || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (order.customer.name || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (order.restaurant || '').toLowerCase().includes(lowerCaseSearchTerm);
            return matchesTab && matchesSearch;
        });
    }, [orders, activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredOrders]);
    
    const TABS: OrderAdminStatus[] = ['جديد', 'مؤكد', 'قيد التجهيز', 'جاهز', 'بالتوصيل', 'مكتمل', 'ملغي'];

    const handleTabClick = (tab: OrderAdminStatus | 'الكل') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                     <div className="flex border-b border-gray-200 flex-wrap">
                        <button onClick={() => handleTabClick('الكل')} className={`px-3 py-2 text-sm font-medium ${activeTab === 'الكل' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>الكل</button>
                        {TABS.map(tab => <button key={tab} onClick={() => handleTabClick(tab)} className={`px-3 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>{tab}</button>)}
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="ابحث برقم الطلب، العميل..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>

                {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay message={error} /> : (
                    <>
                        <OrdersManagementTable
                            orders={paginatedOrders}
                            allDrivers={allDrivers}
                            onViewDetails={handleViewDetails}
                            onStatusChange={handleStatusChange}
                            onTrack={handleTrackOrder}
                            onAssignDriver={handleAssignDriver}
                        />
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                )}
            </div>
            
            {isDetailsModalOpen && selectedOrder && (
                <OrderDetailsModal order={selectedOrder} onClose={() => setIsDetailsModalOpen(false)} />
            )}
            {isTrackingModalOpen && selectedOrder && (
                <OrderTrackingModal order={selectedOrder} onClose={() => setIsTrackingModalOpen(false)} />
            )}
        </>
    );
};

export default OrdersManagementPage;