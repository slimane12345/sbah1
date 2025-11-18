import React from 'react';
import type { OrderManagementData, Driver } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateDistance } from '../pages/DriverDashboardPage.tsx';

interface AcceptOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    order: OrderManagementData | null;
    driver: Driver | null;
}

const AcceptOrderModal: React.FC<AcceptOrderModalProps> = ({ isOpen, onClose, onConfirm, order, driver }) => {
    const { t, translateField } = useLanguage();

    if (!isOpen || !order) return null;

    const distance = (order.restaurantLocation && order.deliveryAddress)
        ? calculateDistance(
            { lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng },
            { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }
          ).toFixed(1)
        : 'N/A';
    
    const earnings = (order.restaurantLocation && order.deliveryAddress && driver)
        ? (calculateDistance(
            { lat: order.restaurantLocation.lat, lng: order.restaurantLocation.lng },
            { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }
          ) * (driver.ratePerKm ?? 2))
        : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">{t('confirmAcceptanceTitle')}</h2>
                </div>
                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Location & Earnings Info */}
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="text-gray-400 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">{t('from')}</p>
                                <p className="font-semibold text-gray-800">{order.restaurant}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="text-gray-400 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 19l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">{t('to')}</p>
                                <p className="font-semibold text-gray-800">{order.deliveryAddress.addressText}</p>
                            </div>
                        </div>
                        <div className="flex justify-between border-t pt-4">
                            <div className="flex items-center gap-2">
                                <div className="text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <p><span className="font-semibold">{distance}</span> {t('km')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                 <div className="text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.167-.217c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.346 0 .68-.07.983-.195v1.698c-.288-.063-.567-.144-.829-.248a4.5 4.5 0 01-2.652-7.518 4.5 4.5 0 014.5-4.5c.615 0 1.206.12 1.74.341V5.518a4.5 4.5 0 01-2.652-7.518 4.5 4.5 0 014.5-4.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5c-.346 0-.68-.07-.983-.195v-1.698c.288.063.567.144.829.248a4.5 4.5 0 012.652 7.518 4.5 4.5 0 01-4.5 4.5c-.615 0-1.206-.12-1.74-.341V14.482a4.5 4.5 0 012.652 7.518 4.5 4.5 0 01-4.5 4.5c-1.38 0-2.5-1.12-2.5-2.5s1.12 2.5 2.5 2.5c.346 0 .68-.07.983.195v1.698c-.288.063-.567.144-.829.248a4.5 4.5 0 01-2.652-7.518 4.5 4.5 0 014.5-4.5z" /></svg>
                                 </div>
                                <p className="font-semibold text-green-600">{earnings !== null ? `${earnings.toFixed(2)} ${t('currency')}` : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Products List */}
                    <div>
                        <p className="text-gray-500 text-sm mb-2 font-medium">{t('products')}</p>
                        <div className="text-sm bg-gray-50 p-3 rounded-lg border max-h-32 overflow-y-auto">
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
                    
                    {/* Payment Info */}
                    <div>
                        <p className="text-gray-500 text-sm mb-1 font-medium">{t('payment')}</p>
                        <p className="font-semibold">
                            {order.paymentMethod === 'COD' 
                                ? t('codWithAmount', { amount: order.total.toFixed(2), currency: t('currency') }) 
                                : t('paidElectronically')}
                        </p>
                    </div>

                    {/* Customer Notes */}
                    {order.customerNotes && (
                        <div>
                            <p className="text-gray-500 text-sm mb-1 font-medium">{t('customerNotes')}</p>
                            <div className="text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <p className="text-amber-800 font-semibold">{order.customerNotes}</p>
                            </div>
                        </div>
                    )}
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