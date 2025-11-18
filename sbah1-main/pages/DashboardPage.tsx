import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard.tsx';
import OrdersChart from '../components/OrdersChart.tsx';
import RevenueChart from '../components/RevenueChart.tsx';
import OrdersTable from '../components/OrdersTable.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import type { Order, OrderStatus } from '../types.ts';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, getDocs, query, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

interface DashboardStats {
    orders: number;
    revenue: number;
    customers: number;
    restaurants: number;
}

// Fix: Add mapping function to correctly convert backend status to frontend status type.
const mapBackendStatusToFrontend = (status: string): OrderStatus => {
    const map: { [key: string]: OrderStatus } = {
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

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<React.ReactNode | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch stats
                const ordersCollection = collection(db, 'orders');
                const usersCollection = collection(db, 'users');
                const restaurantsCollection = collection(db, 'restaurants');

                const [ordersSnapshot, usersSnapshot, restaurantsSnapshot] = await Promise.all([
                    getCountFromServer(ordersCollection),
                    getCountFromServer(query(usersCollection, /* where('userType', '==', 'customer') */)), // Assuming a userType field
                    getCountFromServer(restaurantsCollection)
                ]);

                // Fetch recent orders
                const ordersQuery = query(ordersCollection, orderBy("createdAt", "desc"), limit(5));
                const recentOrdersSnapshot = await getDocs(ordersQuery);
                const fetchedOrders: Order[] = recentOrdersSnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Assuming data is denormalized in Firestore
                    return {
                        id: data.orderNumber || doc.id,
                        customer: data.customerName || 'عميل غير معروف',
                        restaurant: data.restaurantName || 'مطعم غير معروف',
                        total: data.finalAmount || 0,
                        // Fix: Use the mapping function to ensure correct status typing.
                        status: mapBackendStatusToFrontend(data.status),
                        date: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toLocaleDateString('ar-SA') : new Date().toLocaleDateString('ar-SA'),
                    };
                });
                
                // For revenue, a more complex aggregation would be needed in a real scenario
                // For now, we'll keep it static as a placeholder.
                setStats({
                    orders: ordersSnapshot.data().count,
                    customers: usersSnapshot.data().count,
                    restaurants: restaurantsSnapshot.data().count,
                    revenue: 125400, // Placeholder
                });
                setRecentOrders(fetchedOrders);

            } catch (err: any) {
                console.error("Error fetching dashboard data from Firebase:", err);
                if (err.message.includes('database does not exist')) {
                     console.warn("Firebase DB not found. Falling back to mock data for Dashboard.");
                     setStats({
                         orders: 1234,
                         revenue: 125400,
                         customers: 567,
                         restaurants: 78,
                     });
                     setRecentOrders([
                         { id: '#12350', customer: 'نورة خالد', restaurant: 'مطعم البيت', total: 130, status: 'جاهز', date: '2023-10-27' },
                         { id: '#12349', customer: 'يوسف أحمد', restaurant: 'شاورما كلاسك', total: 55, status: 'جديد', date: '2023-10-27' },
                         { id: '#12347', customer: 'خالد عبدالله', restaurant: 'برجر كنج', total: 120, status: 'بالتوصيل', date: '2023-10-27' },
                         { id: '#12346', customer: 'فاطمة الزهراء', restaurant: 'بيتزا هت', total: 85, status: 'قيد التجهيز', date: '2023-10-27' },
                         { id: '#12345', customer: 'علي محمد', restaurant: 'مطعم البيت', total: 150, status: 'مكتمل', date: '2023-10-27' },
                     ]);
                } else {
                     setError("حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard icon="orders" title="إجمالي الطلبات" value={(stats?.orders ?? 0).toLocaleString('ar-SA')} change="+12%" changeType="increase" />
        <StatCard icon="revenue" title="إجمالي الإيرادات" value={`${(stats?.revenue ?? 0).toLocaleString('ar-MA')} د.م.`} change="+5.2%" changeType="increase" />
        <StatCard icon="customers" title="إجمالي العملاء" value={(stats?.customers ?? 0).toLocaleString('ar-SA')} change="+2.5%" changeType="increase" />
        <StatCard icon="couriers" title="المناديب النشطين" value="45" change="-1.1%" changeType="decrease" />
        <StatCard icon="restaurants" title="المطاعم النشطة" value={(stats?.restaurants ?? 0).toLocaleString('ar-SA')} change="+0.5%" changeType="increase" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">الطلبات خلال الأسبوع</h3>
          <OrdersChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">الإيرادات الشهرية</h3>
          <RevenueChart />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">أحدث الطلبات</h3>
        <OrdersTable orders={recentOrders} />
      </div>
    </div>
  );
};

export default DashboardPage;