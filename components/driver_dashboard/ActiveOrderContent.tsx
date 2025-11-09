import React from 'react';
import type { OrderManagementData, Driver } from '../../types';
import OrderTrackingMap from '../OrderTrackingMap';
import DriverHeader from './DriverHeader';
import { useLanguage } from '../../contexts/LanguageContext';

interface ActiveOrderContentProps {
    order: OrderManagementData;
    driver: Driver;
    driverLocation: { lat: number; lng: number } | null;
    onUpdateStatus: (orderId: string, newStatus: 'picked_up' | 'delivered') => void;
    onLogout: () => void;
}

const ActiveOrderContent: React.FC<ActiveOrderContentProps> = ({ order, driver, driverLocation, onUpdateStatus, onLogout }) => {
    const { t } = useLanguage();
    const isPickupPhase = order.status === 'مؤكد';

    return (
        <div className="flex flex-col h-screen bg-[#F8FAFC]">
            <DriverHeader driver={driver} isOnline={true} onToggleOnline={() => {}} onLogout={onLogout} />
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
                <div className="lg:col-span-2 h-full min-h-[300px] rounded-lg overflow-hidden shadow-md">
                    {order.restaurantLocation && order.deliveryAddress && (
                         <OrderTrackingMap 
                            driverLocation={driverLocation}
                            restaurantLocation={order.restaurantLocation}
                            customerLocation={{ lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }}
                        />
                    )}
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                    <h2 className="font-bold text-xl border-b pb-3 mb-3">تفاصيل الطلب #{order.orderNumber}</h2>
                    <div className="flex-1 space-y-4 overflow-y-auto">
                         <div>
                            <p className="text-xs text-gray-500">{isPickupPhase ? t('pickupFrom') : t('deliverTo')}</p>
                            <p className="font-semibold text-gray-800">{isPickupPhase ? order.restaurant : order.customer.name}</p>
                            <p className="text-sm text-gray-600">{order.deliveryAddress.addressText}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">{t('payment')}</p>
                            <p className="font-semibold text-gray-800">{order.paymentMethod === 'COD' 
                                ? t('codWithAmount', { amount: order.total.toFixed(2), currency: t('currency') })
                                : t('paidElectronically')}</p>
                        </div>
                    </div>
                     <div className="mt-4">
                        {isPickupPhase ? (
                            <button onClick={() => onUpdateStatus(order.id, 'picked_up')} className="w-full bg-[#3B82F6] text-white py-3 rounded-lg font-bold text-lg">
                                {t('orderPickedUp')}
                            </button>
                        ) : (
                            <button onClick={() => onUpdateStatus(order.id, 'delivered')} className="w-full bg-[#10B981] text-white py-3 rounded-lg font-bold text-lg">
                                {t('orderDelivered')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveOrderContent;