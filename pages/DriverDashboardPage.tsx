import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import type { Driver, OrderManagementData, DriverView, OrderAdminStatus, PaymentStatus } from '../types.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
// Fix: Added '.tsx' extension to component imports.
import AcceptOrderModal from '../components/AcceptOrderModal.tsx';
import DriverLayout from '../components/driver_dashboard/DriverLayout.tsx';
// Fix: Added '.tsx' extension to component imports.
import DriverHeader from '../components/driver_dashboard/DriverHeader.tsx';
// Fix: Added '.tsx' extension to component imports.
import OverviewContent from '../components/driver_dashboard/OverviewContent.tsx';
// Fix: Added '.tsx' extension to component imports.
import AvailableOrdersContent from '../components/driver_dashboard/AvailableOrdersContent.tsx';
import EarningsContent from '../components/driver_dashboard/EarningsContent.tsx';
// Fix: Added '.tsx' extension to component imports.
import ActiveOrderContent from '../components/driver_dashboard/ActiveOrderContent.tsx';

interface DriverDashboardPageProps {
    driverId: string;
    onLogout: () => void;
}

// Helper functions (could be moved to a utils file)
const mapBackendStatusToFrontend = (status: string): OrderAdminStatus => {
    const map: { [key: string]: OrderAdminStatus } = { pending: 'جديد', confirmed: 'مؤكد', preparing: 'قيد التجهيز', ready: 'جاهز', picked_up: 'بالتوصيل', delivered: 'مكتمل', cancelled: 'ملغي' };
    return map[status] || 'جديد';
};
const mapPaymentStatusToFrontend = (status: string): PaymentStatus => {
    const map: {[key: string]: PaymentStatus} = { pending: 'معلق', paid: 'مدفوع', failed: 'غير مدفوع', refunded: 'مسترجع' };
    return map[status] || 'معلق';
};
// Fix: Exported the utility function so it can be imported and used in other components.
export function calculateDistance(loc1: { lat: number, lng: number }, loc2: { lat: number, lng: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Maps a Firestore document to the OrderManagementData type
const mapFirestoreDocToOrder = (doc: any): OrderManagementData => {
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
        items: (data.items || []).map((item: any) => ({
            name: item.productName,
            quantity: item.quantity,
            price: item.unitPrice,
            options: item.options || []
        })),
        deliveryAddress: data.deliveryAddress,
        restaurantLocation: data.restaurantLocation || null,
        driverId: data.driverId || null
    };
};


const DriverDashboardPage: React.FC<DriverDashboardPageProps> = ({ driverId, onLogout }) => {
    const [driver, setDriver] = useState<Driver | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [allNewOrders, setAllNewOrders] = useState<OrderManagementData[]>([]);
    const [activeOrder, setActiveOrder] = useState<OrderManagementData | null>(null);
    const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [orderToAccept, setOrderToAccept] = useState<OrderManagementData | null>(null);
    const [stats, setStats] = useState<{ totalEarnings: number, dailyEarnings: number, completedToday: number }>({ totalEarnings: 0, dailyEarnings: 0, completedToday: 0 });
    const [activeView, setActiveView] = useState<DriverView>('overview');

    const { t } = useLanguage();
    const watchId = useRef<number | null>(null);
    const isOnline = driver?.status === 'متاح' || driver?.status === 'مشغول';

    // Calculate total & daily earnings, completed orders today
    useEffect(() => {
        if (!driverId) return;

        const fetchCompletedOrders = async () => {
            const q = query(collection(db, 'orders'), where('driverId', '==', driverId), where('status', '==', 'delivered'));
            const querySnapshot = await getDocs(q);
            let totalEarnings = 0;
            let dailyEarnings = 0;
            let completedToday = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            querySnapshot.forEach(doc => {
                const order = doc.data();
                const earnings = order.deliveryFee || 10; // Use deliveryFee if available, else fallback
                totalEarnings += earnings;
                
                if (order.createdAt.toDate() >= today) {
                    dailyEarnings += earnings;
                    completedToday++;
                }
            });
            setStats({ totalEarnings, dailyEarnings, completedToday });
        };

        fetchCompletedOrders();
    }, [driverId, driver?.totalDeliveries]);

    // Fetch driver details
    useEffect(() => {
        const driverRef = doc(db, 'drivers', driverId);
        const unsubscribe = onSnapshot(driverRef, (docSnap) => {
            if (docSnap.exists()) setDriver({ id: docSnap.id, ...docSnap.data() } as Driver);
            else { setError("Driver profile not found."); onLogout(); }
            setIsLoading(false);
        }, (err) => { setError("Failed to load driver data."); setIsLoading(false); });
        return () => unsubscribe();
    }, [driverId, onLogout]);

    // Get Driver's location
    useEffect(() => {
        if (isOnline) {
            if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
            watchId.current = navigator.geolocation.watchPosition(
                (position) => { setDriverLocation({ lat: position.coords.latitude, lng: position.coords.longitude }); setError(null); },
                (error) => { setError("لا يمكن الحصول على موقعك. يرجى تفعيل خدمات الموقع."); setDriverLocation(null); },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            if (watchId.current) { navigator.geolocation.clearWatch(watchId.current); watchId.current = null; }
            setDriverLocation(null);
        }
        return () => { if (watchId.current) navigator.geolocation.clearWatch(watchId.current); };
    }, [isOnline]);

    // Fetch new & active orders
    useEffect(() => {
        if (!driver) return;
        const newOrdersQuery = query(collection(db, 'orders'), where('status', '==', 'confirmed'), where('driverId', '==', null));
        const unsubscribeNew = onSnapshot(newOrdersQuery, (snapshot) => {
            const orders = snapshot.docs.map(mapFirestoreDocToOrder);
            setAllNewOrders(orders);
        });

        const activeOrderQuery = query(collection(db, 'orders'), where('driverId', '==', driverId), where('status', 'in', ['confirmed', 'picked_up']));
        const unsubscribeActive = onSnapshot(activeOrderQuery, (snapshot) => {
            if (snapshot.empty) {
                setActiveOrder(null);
            } else {
                const docRef = snapshot.docs[0];
                setActiveOrder(mapFirestoreDocToOrder(docRef));
            }
        });

        return () => { unsubscribeNew(); unsubscribeActive(); };
    }, [driver, driverId]);

    const nearbyOrders = useMemo(() => {
        if (!driverLocation || !allNewOrders.length) return [];
        return allNewOrders.filter(order => {
            if (!order.restaurantLocation) return false;
            return calculateDistance(driverLocation, order.restaurantLocation) <= 10; // 10km radius
        });
    }, [allNewOrders, driverLocation]);

    const handleToggleOnline = async () => {
        if (!driver) return;
        const newStatus = driver.status === 'متاح' ? 'غير متصل' : 'متاح';
        await updateDoc(doc(db, 'drivers', driverId), { status: newStatus });
    };

    const handleAcceptOrder = async (order: OrderManagementData) => {
        if (activeOrder) return;
        await updateDoc(doc(db, 'orders', order.id), { driverId, driverName: driver?.name, driverAvatar: driver?.avatar, status: 'confirmed' });
        await updateDoc(doc(db, 'drivers', driverId), { status: 'مشغول' });
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: 'picked_up' | 'delivered') => {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
        if (newStatus === 'delivered') {
            await updateDoc(doc(db, 'drivers', driverId), { status: 'متاح', totalDeliveries: (driver?.totalDeliveries || 0) + 1 });
            setActiveOrder(null);
        }
    };

    if (isLoading) return <div className="bg-gray-100 min-h-screen"><LoadingSpinner /></div>;
    if (error && !error.includes("موقعك")) return <div className="bg-gray-100 min-h-screen"><ErrorDisplay message={error} /></div>;
    if (!driver) return <div className="bg-gray-100 min-h-screen"><ErrorDisplay message="Driver not found." /></div>;

    if (activeOrder) {
        return <ActiveOrderContent order={activeOrder} driver={driver} onUpdateStatus={handleUpdateOrderStatus} onLogout={onLogout} driverLocation={driverLocation} />;
    }

    const renderContent = () => {
        switch (activeView) {
            case 'orders': return <AvailableOrdersContent orders={nearbyOrders} onAccept={setOrderToAccept} />;
            case 'earnings': return <EarningsContent stats={stats} driver={driver} />;
            case 'profile': return <div className="bg-white p-6 rounded-lg shadow-md">{t('profileSettings')} (coming soon)</div>;
            case 'overview':
            default:
                return <OverviewContent driver={driver} stats={stats} nearbyOrders={nearbyOrders.slice(0, 3)} setActiveView={setActiveView} onAcceptOrder={setOrderToAccept} />;
        }
    };

    return (
        <DriverLayout activeView={activeView} setActiveView={setActiveView}>
            <DriverHeader driver={driver} isOnline={isOnline} onToggleOnline={handleToggleOnline} onLogout={onLogout} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {error && <div className="mb-4"><ErrorDisplay message={error} /></div>}
                {renderContent()}
            </main>
            {orderToAccept && (
                <AcceptOrderModal
                    isOpen={!!orderToAccept}
                    onClose={() => setOrderToAccept(null)}
                    onConfirm={() => { orderToAccept && handleAcceptOrder(orderToAccept); setOrderToAccept(null); }}
                    order={orderToAccept}
                />
            )}
        </DriverLayout>
    );
};

export default DriverDashboardPage;