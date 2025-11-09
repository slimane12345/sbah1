import React, { useState, useEffect, useRef } from 'react';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { Driver, OrderManagementData } from '../types.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import OrderTrackingMap from '../components/OrderTrackingMap.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import AcceptOrderModal from '../components/AcceptOrderModal.tsx';


interface DriverDashboardPageProps {
    driverId: string;
    onLogout: () => void;
}

const mapBackendStatusToFrontend = (status: string): any => {
    const map: { [key: string]: any } = {
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

const mapPaymentStatusToFrontend = (status: string): any => {
    const map: {[key: string]: any} = {
        pending: 'معلق',
        paid: 'مدفوع',
        failed: 'غير مدفوع',
        refunded: 'مسترجع',
    };
    return map[status] || 'معلق';
};

// Helper to calculate distance between two lat/lng points
function calculateDistance(loc1: { lat: number, lng: number }, loc2: { lat: number, lng: number }): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


const DriverDashboardPage: React.FC<DriverDashboardPageProps> = ({ driverId, onLogout }) => {
    const [driver, setDriver] = useState<Driver | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [allNewOrders, setAllNewOrders] = useState<OrderManagementData[]>([]);
    const [nearbyOrders, setNearbyOrders] = useState<OrderManagementData[]>([]);
    const [activeOrder, setActiveOrder] = useState<OrderManagementData | null>(null);
    const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null);
    
    const [orderToAccept, setOrderToAccept] = useState<OrderManagementData | null>(null);
    const [stats, setStats] = useState<{ totalEarnings: number }>({ totalEarnings: 0 });

    const { t } = useLanguage();
    const watchId = useRef<number | null>(null);

    const isOnline = driver?.status === 'متاح' || driver?.status === 'مشغول';
    
    // Calculate total earnings
    useEffect(() => {
        if (!driverId) return;

        const fetchCompletedOrders = async () => {
            const q = query(
                collection(db, 'orders'),
                where('driverId', '==', driverId),
                where('status', '==', 'delivered')
            );
            const querySnapshot = await getDocs(q);
            let totalEarnings = 0;
            querySnapshot.forEach(doc => {
                const order = doc.data();
                if (order.restaurantLocation && order.deliveryAddress) {
                    const distance = calculateDistance(
                        { lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng },
                        { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }
                    );
                    const earnings = (distance * 1.5) + 5; // Use the same mock logic
                    totalEarnings += earnings;
                } else {
                    totalEarnings += 10; // Fallback earning if location is missing
                }
            });
            setStats({ totalEarnings });
        };

        fetchCompletedOrders();
    }, [driverId, driver?.totalDeliveries]);

    // Fetch driver details and listen for changes
    useEffect(() => {
        const driverRef = doc(db, 'drivers', driverId);
        const unsubscribe = onSnapshot(driverRef, (docSnap) => {
            if (docSnap.exists()) {
                setDriver({ id: docSnap.id, ...docSnap.data() } as Driver);
            } else {
                setError("Driver profile not found.");
                onLogout();
            }
            setIsLoading(false);
        }, (err) => {
            console.error(err);
            setError("Failed to load driver data.");
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [driverId, onLogout]);

    // Get Driver's location when they go online
    useEffect(() => {
        if (isOnline) {
            // Clear any existing watch
            if (watchId.current) {
                navigator.geolocation.clearWatch(watchId.current);
            }

            // Start watching position
            watchId.current = navigator.geolocation.watchPosition(
                (position) => {
                    setDriverLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    // Clear location error if we get a successful read
                    setError(prev => (prev && (prev.includes("location") || prev.includes("موقعك"))) ? null : prev);
                },
                (error) => {
                    console.error("Error watching driver location:", error);
                    setError("لا يمكن الحصول على موقعك. يرجى تفعيل خدمات الموقع والتأكد من وجود إشارة GPS.");
                    setDriverLocation(null); // Clear location on error
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            // If offline, clear the watch and reset location
            if (watchId.current) {
                navigator.geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
            setDriverLocation(null);
        }

        // Cleanup function for when the component unmounts or isOnline changes
        return () => {
            if (watchId.current) {
                navigator.geolocation.clearWatch(watchId.current);
            }
        };
    }, [isOnline]);


    // Fetch new orders and active order
    useEffect(() => {
        if (!driver) return;

        // Listen for new, unassigned orders that have been confirmed by the restaurant
        const newOrdersQuery = query(
            collection(db, 'orders'),
            where('status', '==', 'confirmed'),
            where('driverId', '==', null)
        );
        const unsubscribeNew = onSnapshot(newOrdersQuery, (snapshot) => {
            const orders: OrderManagementData[] = snapshot.docs.map(docRef => {
                const data = docRef.data();
                return {
                    id: docRef.id,
                    orderNumber: data.orderNumber,
                    customer: { name: data.customerName, avatar: data.customerAvatar },
                    restaurant: data.restaurantName,
                    total: data.finalAmount,
                    status: mapBackendStatusToFrontend(data.status),
                    paymentStatus: mapPaymentStatusToFrontend(data.paymentStatus),
                    paymentMethod: data.paymentMethod === 'cash' ? 'COD' : 'Credit Card',
                    date: data.createdAt.toDate().toLocaleDateString(),
                    courier: null,
                    items: data.items.map((item: any) => ({
                        name: item.productName,
                        quantity: item.quantity,
                        price: item.unitPrice,
                        options: item.options,
                        category: item.category,
                    })),
                    deliveryAddress: data.deliveryAddress,
                    restaurantLocation: data.restaurantLocation || null,
                };
            });
            setAllNewOrders(orders);
        });

        // Listen for the driver's currently active order
        const activeOrderQuery = query(
            collection(db, 'orders'),
            where('driverId', '==', driverId),
            where('status', 'in', ['confirmed', 'picked_up'])
        );
        const unsubscribeActive = onSnapshot(activeOrderQuery, (snapshot) => {
             if (snapshot.empty) {
                setActiveOrder(null);
            } else {
                const docRef = snapshot.docs[0];
                const data = docRef.data();
                setActiveOrder({
                    id: docRef.id,
                    orderNumber: data.orderNumber,
                    customer: { name: data.customerName, avatar: data.customerAvatar },
                    restaurant: data.restaurantName,
                    total: data.finalAmount,
                    status: mapBackendStatusToFrontend(data.status),
                    paymentStatus: mapPaymentStatusToFrontend(data.paymentStatus),
                    paymentMethod: data.paymentMethod === 'cash' ? 'COD' : 'Credit Card',
                    date: data.createdAt.toDate().toLocaleDateString(),
                    courier: null,
                    items: data.items.map((item: any) => ({
                        name: item.productName,
                        quantity: item.quantity,
                        price: item.unitPrice,
                        options: item.options,
                        category: item.category,
                    })),
                    deliveryAddress: data.deliveryAddress,
                    restaurantLocation: data.restaurantLocation || null,
                });
            }
        });

        return () => {
            unsubscribeNew();
            unsubscribeActive();
        };

    }, [driver, driverId]);

    // Filter orders to show only nearby ones
    useEffect(() => {
        if (!driverLocation || !allNewOrders.length) {
            setNearbyOrders([]);
            return;
        }

        const MAX_DISTANCE_KM = 10; // Only show orders where the restaurant is within 10km

        const filtered = allNewOrders.filter(order => {
            if (!order.restaurantLocation) return false;
            const distance = calculateDistance(driverLocation, order.restaurantLocation);
            return distance <= MAX_DISTANCE_KM;
        });

        setNearbyOrders(filtered);

    }, [allNewOrders, driverLocation]);


    const handleToggleOnline = async () => {
        if (!driver) return;
        const driverRef = doc(db, 'drivers', driverId);
        const newStatus = driver.status === 'متاح' ? 'غير متصل' : 'متاح';
        await updateDoc(driverRef, { status: newStatus });
    };

    const handleAcceptOrder = async (order: OrderManagementData) => {
        if (activeOrder) {
            alert("You already have an active order.");
            return;
        }
        const orderRef = doc(db, 'orders', order.id);
        await updateDoc(orderRef, { 
            driverId: driverId,
            driverName: driver?.name,
            driverAvatar: driver?.avatar,
            status: 'confirmed'
        });
        const driverRef = doc(db, 'drivers', driverId);
        await updateDoc(driverRef, { status: 'مشغول' });
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: 'picked_up' | 'delivered') => {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status: newStatus });
        
        if (newStatus === 'delivered') {
            const driverRef = doc(db, 'drivers', driverId);
            await updateDoc(driverRef, { 
                status: 'متاح',
                totalDeliveries: (driver?.totalDeliveries || 0) + 1
            });
            setActiveOrder(null);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error && !(error.includes("location") || error.includes("موقعك"))) return <ErrorDisplay message={error} />;
    if (!driver) return <ErrorDisplay message="Driver not found." />;
    
    return (
        <div className="bg-gray-100 min-h-screen" dir={t('language') === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{t('driverDashboard')}</h1>
                        <p className="text-sm text-gray-500">{driver.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className="text-sm font-semibold">{isOnline ? t('youAreOnline') : t('youAreOffline')}</span>
                        </div>
                        <button onClick={handleToggleOnline} className={`px-4 py-2 rounded-md font-semibold text-sm ${isOnline ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                            {isOnline ? t('goOffline') : t('goOnline')}
                        </button>
                         <button onClick={onLogout} className="text-sm font-medium text-red-600 hover:underline">{t('logout')}</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (error.includes("location") || error.includes("موقعك")) && <div className="mb-4"><ErrorDisplay message={error}/></div>}
                
                 {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('totalDeliveries')}</p>
                            <p className="text-2xl font-bold text-gray-900">{driver.totalDeliveries}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('totalEarningsValue')}</p>
                            <p className="text-2xl font-bold text-green-600">{stats.totalEarnings.toFixed(2)} {t('currency')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Order Section */}
                    <div className="lg:col-span-2">
                         <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('activeOrder')}</h2>
                         {activeOrder && activeOrder.restaurantLocation ? (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-96">
                                    <OrderTrackingMap 
                                        driverLocation={driverLocation}
                                        restaurantLocation={activeOrder.restaurantLocation}
                                        customerLocation={{ lat: activeOrder.deliveryAddress.latitude, lng: activeOrder.deliveryAddress.longitude }}
                                    />
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                         <h3 className="text-lg font-bold">#{activeOrder.orderNumber}</h3>
                                         <span className="font-bold text-xl">{activeOrder.total.toFixed(2)} {t('currency')}</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-semibold">{t('pickupFrom')}:</span> {activeOrder.restaurant}</p>
                                        <p><span className="font-semibold">{t('deliverTo')}:</span> {activeOrder.deliveryAddress.addressText}</p>
                                    </div>
                                    
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-gray-700 mb-2">{t('products')}</h4>
                                        <ul className="divide-y divide-gray-200">
                                            {activeOrder.items.map((item, index) => (
                                                <li key={index} className="py-3">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">{item.quantity} x {item.name}</p>
                                                            {item.options && item.options.length > 0 && (
                                                                <div className="text-xs text-gray-600 mt-1 pl-2">
                                                                    {item.options.map((opt, i) => <p key={i}>- {opt}</p>)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="font-semibold text-gray-800 whitespace-nowrap pl-4">
                                                            {((item.price || 0) * item.quantity).toFixed(2)} {t('currency')}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="flex gap-4 pt-2">
                                        {activeOrder.status === 'مؤكد' && (
                                            <button onClick={() => handleUpdateOrderStatus(activeOrder.id, 'picked_up')} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold">{t('orderPickedUp')}</button>
                                        )}
                                        {activeOrder.status === 'بالتوصيل' && (
                                            <button onClick={() => handleUpdateOrderStatus(activeOrder.id, 'delivered')} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold">{t('orderDelivered')}</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                         ) : (
                             <div className="text-center bg-white p-12 rounded-lg shadow-md">
                                <p className="text-gray-600">{t('noActiveOrder')}</p>
                             </div>
                         )}
                    </div>
                    {/* New Orders Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('newOrders')}</h2>
                        <div className="space-y-4">
                            {isOnline && !activeOrder && nearbyOrders.length > 0 ? nearbyOrders.map(order => {
                                const distance = order.restaurantLocation && order.deliveryAddress ? calculateDistance({lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng}, {lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude}) : null;
                                const earnings = distance ? (distance * 1.5) + 5 : 10; // Mock earnings calc: 5 base + 1.5/km
                                
                                return (
                                <div key={order.id} className="bg-white rounded-lg shadow-md p-4 space-y-2">
                                    <div className="flex justify-between items-center font-bold">
                                        <span>#{order.orderNumber}</span>
                                        <span>{order.total.toFixed(2)} {t('currency')}</span>
                                    </div>
                                    <p className="text-sm"><span className="font-semibold">{t('pickupFrom')}:</span> {order.restaurant}</p>
                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <div>
                                            <p className="font-semibold">{t('distance')}: <span className="font-normal">{distance ? `~${distance.toFixed(1)} ${t('km')}` : 'N/A'}</span></p>
                                            <p className="font-semibold">{t('earnings')}: <span className="font-normal text-green-600">~{earnings.toFixed(2)} {t('currency')}</span></p>
                                        </div>
                                        <button onClick={() => setOrderToAccept(order)} className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold">{t('acceptOrder')}</button>
                                    </div>
                                </div>
                            )}) : (
                                 <div className="text-center bg-white p-12 rounded-lg shadow-md">
                                    <p className="text-gray-600">{!isOnline ? t('goOnline') : activeOrder ? 'لديك طلب نشط' : t('noNewOrders')}</p>
                                 </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            {orderToAccept && (
                <AcceptOrderModal
                    isOpen={!!orderToAccept}
                    onClose={() => setOrderToAccept(null)}
                    onConfirm={() => {
                        handleAcceptOrder(orderToAccept);
                        setOrderToAccept(null);
                    }}
                    order={orderToAccept}
                />
            )}
        </div>
    );
};

export default DriverDashboardPage;