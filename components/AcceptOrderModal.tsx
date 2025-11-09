import React from 'react';
import type { OrderManagementData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateDistance } from '../pages/DriverDashboardPage.tsx';

interface AcceptOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    order: OrderManagementData | null;
}

const AcceptOrderModal: React.FC<AcceptOrderModalProps> = ({ isOpen, onClose, onConfirm, order }) => {
    const { t } = useLanguage();

    if (!isOpen || !order) return null;

    const distance = (order.restaurantLocation && order.deliveryAddress)
        ? calculateDistance(
            { lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng },
            { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }
          ).toFixed(1)
        : 'N/A';
    
    const subtotal = order.items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
    const deliveryFee = (order.total ?? 0) - subtotal;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">{t('confirmAcceptanceTitle')}</h2>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">{t('from')}</p>
                            <p className="font-semibold">{order.restaurant}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">{t('to')}</p>
                            <p className="font-semibold">{order.deliveryAddress.addressText}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">{t('distance')}</p>
                            <p className="font-semibold">{distance} {t('km')}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">{t('earnings')}</p>
                            <p className="font-semibold text-green-600">{deliveryFee.toFixed(2)} {t('currency')}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">{t('products')}</p>
                        <div className="text-sm bg-gray-50 p-2 rounded-md border max-h-24 overflow-y-auto">
                            {order.items.map(item => (
                                <div key={item.name}>{item.quantity} x {item.name}</div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">{t('payment')}</p>
                        <p className="font-semibold">
                            {order.paymentMethod === 'COD' 
                                ? t('codWithAmount', { amount: order.total.toFixed(2), currency: t('currency') }) 
                                : t('paidElectronically')}
                        </p>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">
                        {t('cancel')}
                    </button>
                    <button onClick={onConfirm} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                        {t('confirmAcceptance')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AcceptOrderModal;
