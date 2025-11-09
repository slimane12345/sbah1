import React from 'react';
import type { OrderManagementData, Driver } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import OrderTrackingMap from '../OrderTrackingMap.tsx';
import DriverHeader from './DriverHeader.tsx';

interface ActiveOrderContentProps {
    order: OrderManagementData;
    driver: Driver;
    driverLocation: { lat: number; lng: number } | null;
    onUpdateStatus: (orderId: string, newStatus: 'picked_up' | 'delivered') => void;
    onLogout: () => void;
}

const ActiveOrderContent: React.FC<ActiveOrderContentProps> = ({ order, driver, driverLocation, onUpdateStatus, onLogout }) => {
    const { t } = useLanguage();

    const isPickupPhase = order.status === 'confirmed';
    const destinationAddress = isPickupPhase ? order.restaurant : order.deliveryAddress.addressText;
    const buttonText = isPickupPhase ? t('orderPickedUp') : t('orderDelivered');
    const buttonAction = () => onUpdateStatus(order.id, isPickupPhase ? 'picked_up' : 'delivered');

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <DriverHeader driver={driver} isOnline={true} onToggleOnline={() => {}} onLogout={onLogout} />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Map takes up the top part */}
                <div className="h-1/2 md:h-2/3 relative">
                    {order.restaurantLocation && order.deliveryAddress && driverLocation ? (
                         <OrderTrackingMap 
                            driverLocation={driverLocation}
                            restaurantLocation={{ lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng }}
                            customerLocation={{ lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }}
                         />
                    ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <p>Loading map...</p>
                        </div>
                    )}
                </div>
                {/* Details and Actions take the bottom part */}
                <div className="bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex-1 flex flex-col justify-between">
                    <div>
                        <h2 className="font-bold text-xl">{isPickupPhase ? t('pickupFrom') : t('deliverTo')}</h2>
                        <p className="text-gray-700 text-lg">{destinationAddress}</p>
                        <div className="text-sm text-gray-500 mt-2">
                             <p>{t('payment')}: <span className="font-semibold">{order.paymentMethod === 'COD' ? t('codWithAmount', { amount: order.total.toFixed(2), currency: t('currency') }) : t('paidElectronically')}</span></p>
                        </div>
                    </div>
                    <button onClick={buttonAction} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-green-700">
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveOrderContent;
