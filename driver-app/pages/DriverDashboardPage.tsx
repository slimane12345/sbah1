import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs, Timestamp, runTransaction, increment, orderBy } from 'firebase/firestore';
import type { Driver, OrderManagementData, DriverView, OrderAdminStatus, PaymentStatus, DailyEarning, TranslatableString } from '../types.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import AcceptOrderModal from '../components/AcceptOrderModal.tsx';
import DriverLayout from '../components/driver_dashboard/DriverLayout.tsx';
import DriverHeader from '../components/driver_dashboard/DriverHeader.tsx';
import OverviewContent from '../components/driver_dashboard/OverviewContent.tsx';
import AvailableOrdersContent from '../components/driver_dashboard/AvailableOrdersContent.tsx';
import EarningsContent from '../components/driver_dashboard/EarningsContent.tsx';
import ActiveOrdersContent from '../components/driver_dashboard/ActiveOrdersContent.tsx';
import ActiveOrderDetail from '../components/driver_dashboard/ActiveOrderContent.tsx';
import { calculateDistance } from '../utils/geo.ts';

interface DriverDashboardPageProps {
    driverId: string;
    onLogout: () => void;
}

const mapBackendStatusToFrontend = (status: string): OrderAdminStatus => {
    const map: { [key: string]: OrderAdminStatus } = { pending: 'جديد', confirmed: 'مؤكد', preparing: 'قيد التجهيز', ready: 'جاهز', picked_up: 'بالتوصيل', delivered: 'مكتمل', cancelled: 'ملغي' };
    return map[status] || 'جديد';
};
const mapPaymentStatusToFrontend = (status: string): PaymentStatus => {
    const map: {[key: string]: PaymentStatus} = { pending: 'معلق', paid: 'مدفوع', failed: 'غير مدفوع', refunded: 'مسترجع' };
    return map[status] || 'معلق';
};
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
            name: item.productName, // This should be a TranslatableString now
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
    const [myActiveOrders, setMyActiveOrders] = useState<OrderManagementData[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderManagementData | null>(null);

    const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [orderToAccept, setOrderToAccept] = useState<OrderManagementData | null>(null);
    const [stats, setStats] = useState<{ 
        myDailyEarnings: number;
        completedToday: number;
    }>({ 
        myDailyEarnings: 0,
        completedToday: 0
    });
    const [dailyEarnings, setDailyEarnings] = useState<DailyEarning[]>([]);
    const [isEarningsLoading, setIsEarningsLoading] = useState(false);
    const [activeView, setActiveView] = useState<DriverView>('overview');

    const { t } = useLanguage();
    const watchId = useRef<number | null>(null);
    const isOnline = driver?.status === 'متاح' || driver?.status === 'مشغول';

    // Fetch driver profile
    useEffect(() => {
        const driverRef = doc(db, 'drivers', driverId);
        const unsubscribe = onSnapshot(driverRef, (docSnap) => {
            if (docSnap.exists()) {
                const driverData = { id: docSnap.id, ...docSnap.data() } as Driver;
                setDriver(driverData);
            }
            else { 
                setError("Driver profile not found."); onLogout(); 
            }
            setIsLoading(false);
        }, (err) => { setError("Failed to load driver data."); setIsLoading(false); });
        return () => unsubscribe();
    }, [driverId, onLogout]);

    // Fetch today's stats for overview
    useEffect(() => {
        if (!driverId) return;
        
        const todayString = new Date().toISOString().split('T')[0];
        const todayDocRef = doc(db, 'drivers', driverId, 'daily_earnings', todayString);

        const unsubscribe = onSnapshot(todayDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const todayData = docSnap.data();
                setStats({
                    myDailyEarnings: todayData.earnings || 0,
                    completedToday: todayData.deliveries || 0,
                });
            } else {
                setStats({ myDailyEarnings: 0, completedToday: 0 });
            }
        });
        
        return () => unsubscribe();
    }, [driverId]);

    // Track driver's GPS location
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

    // Fetch orders (new & active)
    useEffect(() => {
        if (!driverId) return;
        const newOrdersQuery = query(collection(db, 'orders'), where('status', '==', 'confirmed'), where('driverId', '==', null));
        const unsubscribeNew = onSnapshot(newOrdersQuery, (snapshot) => {
            setAllNewOrders(snapshot.docs.map(mapFirestoreDocToOrder));
        });

        const activeOrderQuery = query(collection(db, 'orders'), where('driverId', '==', driverId), where('status', 'in', ['confirmed', 'picked_up']));
        const unsubscribeActive = onSnapshot(activeOrderQuery, (snapshot) => {
            const activeOrders = snapshot.docs.map(mapFirestoreDocToOrder);
            setMyActiveOrders(activeOrders);
            if (selectedOrder && !activeOrders.some(o => o.id === selectedOrder.id)) {
                setSelectedOrder(null);
            }
        });

        return () => { unsubscribeNew(); unsubscribeActive(); };
    }, [driverId, selectedOrder]);
    
    // Fetch daily earnings history for the earnings page
    useEffect(() => {
        if (activeView !== 'earnings' || !driverId) return;

        setIsEarningsLoading(true);
        const dailyEarningsQuery = query(
            collection(db, 'drivers', driverId, 'daily_earnings'), 
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(dailyEarningsQuery, (snapshot) => {
            const earningsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<DailyEarning, 'id'>)
            }));
            setDailyEarnings(earningsData);
            setIsEarningsLoading(false);
        }, (err) => {
            console.error("Error fetching daily earnings:", err);
            setError("فشل في تحميل سجل الأرباح.");
            setIsEarningsLoading(false);
        });

        return () => unsubscribe();
    }, [activeView, driverId]);

    const nearbyOrders = useMemo(() => {
        if (!driverLocation || !allNewOrders.length) return [];
        return allNewOrders.filter(order => {
            if (!order.restaurantLocation) return false;
            return calculateDistance(driverLocation, order.restaurantLocation) <= 10;
        });
    }, [allNewOrders, driverLocation]);

    const handleAcceptOrder = async (order: OrderManagementData) => {
        await updateDoc(doc(db, 'orders', order.id), { driverId, driverName: driver?.name, driverAvatar: driver?.avatar, status: 'confirmed' });
        await updateDoc(doc(db, 'drivers', driverId), { status: 'مشغول' });
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: 'picked_up' | 'delivered') => {
        const orderRef = doc(db, 'orders', orderId);

        try {
            if (newStatus === 'picked_up') {
                await updateDoc(orderRef, { status: newStatus });
                return;
            }

            if (newStatus === 'delivered' && driver) {
                const orderToComplete = myActiveOrders.find(o => o.id === orderId);
                if (!orderToComplete) {
                    throw new Error("Order to complete not found in active list.");
                }

                let earningForThisOrder = 0;
                const restaurantLoc = orderToComplete.restaurantLocation;
                const customerLoc = orderToComplete.deliveryAddress;
                if (restaurantLoc?.lat && restaurantLoc?.lng && customerLoc?.latitude && customerLoc?.longitude) {
                    const distance = calculateDistance({ lat: restaurantLoc.lat, lng: restaurantLoc.lng }, { lat: customerLoc.latitude, lng: customerLoc.longitude });
                    earningForThisOrder = distance * (driver.ratePerKm ?? 2);
                }

                const driverRef = doc(db, 'drivers', driverId);
                const dateString = new Date().toISOString().split('T')[0];
                const dailyEarningRef = doc(db, 'drivers', driverId, 'daily_earnings', dateString);
                
                await runTransaction(db, async (transaction) => {
                    const dailyDoc = await transaction.get(dailyEarningRef);
                    const driverDoc = await transaction.get(driverRef);
                    if (!driverDoc.exists()) {
                      throw "Driver does not exist!";
                    }

                    // Update daily earnings
                    if (dailyDoc.exists()) {
                        transaction.update(dailyEarningRef, {
                            earnings: increment(earningForThisOrder),
                            deliveries: increment(1),
                            totalValue: increment(orderToComplete.total),
                        });
                    } else {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        transaction.set(dailyEarningRef, {
                            date: Timestamp.fromDate(today),
                            earnings: earningForThisOrder,
                            deliveries: 1,
                            totalValue: orderToComplete.total,
                        });
                    }

                    // Update driver's total stats
                    transaction.update(driverRef, {
                        totalOrderValue: increment(orderToComplete.total),
                        totalEarnings: increment(earningForThisOrder),
                        totalDeliveries: increment(1),
                    });
                });
                
                // Finally, update the order status
                await updateDoc(orderRef, { status: newStatus });
                
                const remainingOrders = myActiveOrders.filter(o => o.id !== orderId);
                const newDriverStatus = remainingOrders.length > 0 ? 'مشغول' : 'متاح';
                await updateDoc(driverRef, { status: newDriverStatus });

                setSelectedOrder(null);
                setActiveView('active_orders');
            }
        } catch (err) {
            console.error("Error updating order status or calculating earnings:", err);
            setError("فشل تحديث حالة الطلب. يرجى المحاولة مرة أخرى.");
        }
    };

    const handleToggleOnline = async () => {
        if (!driver) return;
        const driverRef = doc(db, 'drivers', driverId);
        try {
            const newStatus = isOnline ? 'غير متصل' : 'متاح';
            await updateDoc(driverRef, { status: newStatus });
        } catch (err) {
            console.error("Error toggling online status:", err);
            setError("Failed to update online status.");
        }
    };

    if (isLoading) return <div className="bg-gray-100 min-h-screen"><LoadingSpinner /></div>;
    if (error && !error.includes("موقعك")) return <div className="bg-gray-100 min-h-screen"><ErrorDisplay message={error} /></div>;
    if (!driver) return <div className="bg-gray-100 min-h-screen"><ErrorDisplay message="Driver not found." /></div>;

    const renderContent = () => {
        if (selectedOrder) {
            return <ActiveOrderDetail 
                order={selectedOrder} 
                driver={driver} 
                onUpdateStatus={handleUpdateOrderStatus} 
                onBack={() => setSelectedOrder(null)}
            />;
        }

        switch (activeView) {
            case 'orders': return <AvailableOrdersContent orders={nearbyOrders} onAccept={setOrderToAccept} driver={driver} />;
            case 'active_orders': return <ActiveOrdersContent orders={myActiveOrders} onSelectOrder={setSelectedOrder} />;
            case 'earnings': return <EarningsContent stats={{ totalOrderValue: driver.totalOrderValue || 0, myTotalEarnings: driver.totalEarnings || 0 }} driver={driver} dailyEarnings={dailyEarnings} isLoading={isEarningsLoading} />;
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
                    driver={driver}
                />
            )}
        </DriverLayout>
    );
};

export default DriverDashboardPage;