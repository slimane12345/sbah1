import React from 'react';
import type { OrderManagementData, Driver } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import OrderTrackingMap from '../OrderTrackingMap.tsx';

interface ActiveOrderDetailProps {
    order: OrderManagementData;
    driver: Driver;
    onUpdateStatus: (orderId: string, newStatus: 'picked_up' | 'delivered') => void;
    driverLocation: { lat: number, lng: number } | null;
    onBack: () => void;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-start gap-4">
            <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
                <div className="text-gray-800 mt-1">{children}</div>
            </div>
        </div>
    </div>
);

const ActiveOrderDetail: React.FC<ActiveOrderDetailProps> = ({ order, driver, onUpdateStatus, driverLocation, onBack }) => {
    const { t } = useLanguage();

    const isPickupPhase = order.status === 'مؤكد';
    const buttonText = isPickupPhase ? t('orderPickedUp') : t('orderDelivered');
    const buttonAction = () => onUpdateStatus(order.id, isPickupPhase ? 'picked_up' : 'delivered');

    const restaurantLocation = order.restaurantLocation ? { lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng } : null;
    const customerLocation = order.deliveryAddress ? { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude } : null;

    return (
        <div className="space-y-6 pb-28 lg:pb-0">
            <button onClick={onBack} className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 mb-4">
                 &larr; {t('backToMyOrders')}
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800">{t('activeOrder')} - <span className="text-blue-600">{order.orderNumber}</span></h2>

            <div className="h-80 w-full bg-gray-200 rounded-lg shadow-md overflow-hidden">
                {restaurantLocation && customerLocation ? (
                    <OrderTrackingMap 
                        driverLocation={driverLocation}
                        restaurantLocation={restaurantLocation}
                        customerLocation={customerLocation}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">لا تتوفر بيانات الموقع لعرض الخريطة.</p>
                    </div>
                )}
            </div>

            <InfoCard title={t('pickupFrom')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}>
                <p className="font-bold text-lg">{order.restaurant}</p>
            </InfoCard>

            <InfoCard title={t('deliverTo')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
                <p className="font-bold text-lg">{order.customer.name}</p>
                <p className="text-sm text-gray-600">{order.deliveryAddress.addressText}</p>
            </InfoCard>

            <div className="bg-white p-4 rounded-lg shadow">
                 <h3 className="font-bold text-gray-800 mb-2">{t('products')}</h3>
                 <ul className="divide-y divide-gray-100 text-sm">
                    {order.items.map((item, index) => (
                        <li key={index} className="py-2 flex justify-between">
                            <span className="text-gray-700">{item.quantity} x {item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-gray-800 mb-2">{t('payment')}</h3>
                <p className="font-semibold text-lg">
                    {order.paymentMethod === 'COD' 
                        ? t('codWithAmount', { amount: order.total.toFixed(2), currency: t('currency') }) 
                        : t('paidElectronically')}
                </p>
            </div>
            <div className="fixed bottom-16 left-0 right-0 bg-white p-4 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:relative lg:bottom-0 lg:shadow-none lg:p-0 lg:bg-transparent lg:border-none">
                <div className="max-w-3xl mx-auto flex gap-4">
                    <button 
                        onClick={buttonAction} 
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-semibold text-white ${isPickupPhase ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveOrderDetail;
