import React from 'react';
import type { OrderManagementData, Driver } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface ActiveOrderDetailProps {
    order: OrderManagementData;
    driver: Driver;
    onUpdateStatus: (orderId: string, newStatus: 'picked_up' | 'delivered') => void;
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

const ActiveOrderDetail: React.FC<ActiveOrderDetailProps> = ({ order, onUpdateStatus, onBack }) => {
    const { t, translateField } = useLanguage();

    const isPickupPhase = order.status !== 'بالتوصيل';
    const buttonText = isPickupPhase ? t('orderPickedUp') : t('orderDelivered');
    const buttonAction = () => onUpdateStatus(order.id, isPickupPhase ? 'picked_up' : 'delivered');

    const restaurantLocation = order.restaurantLocation;
    const customerLocation = order.deliveryAddress;

    const handleTrack = () => {
        if (isPickupPhase) {
            // Driver is going TO the restaurant
            if (restaurantLocation) {
                const destination = `${restaurantLocation.lat},${restaurantLocation.lng}`;
                const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        } else {
            // Driver has the food and is going TO the customer
            if (customerLocation) {
                const destination = `${customerLocation.latitude},${customerLocation.longitude}`;
                const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        }
    };

    const isTrackingDisabled = isPickupPhase ? !restaurantLocation : !customerLocation;

    return (
        <div className="space-y-6 pb-28 lg:pb-0">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors" title={t('backToMyOrders')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800">{t('activeOrder')} - <span className="text-blue-600">{order.orderNumber}</span></h2>
            </div>
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard title={t('pickupFrom')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}>
                    <p className="font-bold text-lg">{translateField(order.restaurant)}</p>
                </InfoCard>

                <InfoCard title={t('deliverTo')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
                    <p className="font-bold text-lg">{order.customer.name}</p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress.addressText}</p>
                </InfoCard>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                 <h3 className="font-bold text-gray-800 mb-2">{t('products')}</h3>
                 <div className="text-sm bg-gray-50 p-3 rounded-lg border max-h-40 overflow-y-auto">
                    <ul className="space-y-2">
                        {order.items.map((item, index) => (
                            <li key={index}>
                                <div className="font-semibold text-gray-800">{item.quantity} x {translateField(item.name)}</div>
                                {item.options && item.options.length > 0 && (
                                    <ul className="mr-4 mt-1 text-xs text-gray-500 list-disc list-inside">
                                        {item.options.map((option, optIndex) => (
                                            <li key={optIndex}>{translateField(option)}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
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
                        onClick={handleTrack}
                        disabled={isTrackingDisabled}
                        className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 19l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {t('trackOrder')}
                    </button>
                     <button
                        onClick={() => window.open(`tel:${order.customer.phone}`, '_blank')}
                        disabled={!order.customer.phone}
                        className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        title={!order.customer.phone ? 'رقم العميل غير متوفر' : 'اتصل بالعميل'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        مكالمة
                    </button>
                    <button 
                        onClick={buttonAction} 
                        className={`flex-[2] flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-semibold text-white ${isPickupPhase ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveOrderDetail;