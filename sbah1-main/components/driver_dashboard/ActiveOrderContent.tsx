import React from 'react';
import type { OrderManagementData, Driver } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface ActiveOrderDetailProps {
    order: OrderManagementData;
    driver: Driver;
    onUpdateStatus: (orderId: string, newStatus: 'picked_up' | 'delivered') => void;
    onBack: () => void;
}

const ActiveOrderDetail: React.FC<ActiveOrderDetailProps> = ({ order, onUpdateStatus, onBack }) => {
    const { t, translateField } = useLanguage();

    const isPickupPhase = order.status !== 'بالتوصيل';
    const buttonText = isPickupPhase ? t('orderPickedUp') : t('orderDelivered');
    const buttonAction = () => onUpdateStatus(order.id, isPickupPhase ? 'picked_up' : 'delivered');

    const restaurantLocation = order.restaurantLocation;
    const customerLocation = order.deliveryAddress;

    const handleGetDirections = (phase: 'pickup' | 'delivery') => {
        let destination: string | null = null;
        if (phase === 'pickup' && restaurantLocation) {
            destination = `${restaurantLocation.lat},${restaurantLocation.lng}`;
        } else if (phase === 'delivery' && customerLocation) {
            destination = `${customerLocation.latitude},${customerLocation.longitude}`;
        }

        if (destination) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50" dir="rtl">
            {/* Header */}
            <header className="p-4 bg-gray-50 sticky top-0 z-10 lg:static">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors" title={t('backToMyOrders')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">{t('activeOrder')} - <span className="text-blue-600">{order.orderNumber}</span></h2>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto px-4 space-y-4 pb-40 lg:pb-4">
                {/* Step 1: Pickup */}
                <div className={`bg-white p-4 rounded-lg shadow-sm border-2 transition-colors ${isPickupPhase ? 'border-blue-500' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 mt-1 h-10 w-10 flex items-center justify-center rounded-full ${isPickupPhase ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">{t('pickupFrom')}</h3>
                            <p className="font-bold text-lg text-gray-800">{translateField(order.restaurant)}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                         <button onClick={() => handleGetDirections('pickup')} disabled={!restaurantLocation} className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            {t('getDirections')}
                        </button>
                    </div>
                </div>

                {/* Connector */}
                <div className="h-8 w-px bg-gray-300 mx-auto"></div>

                {/* Step 2: Delivery */}
                <div className={`bg-white p-4 rounded-lg shadow-sm border-2 transition-colors ${!isPickupPhase ? 'border-blue-500' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 mt-1 h-10 w-10 flex items-center justify-center rounded-full ${!isPickupPhase ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">{t('deliverTo')}</h3>
                            <p className="font-bold text-lg text-gray-800">{order.customer.name}</p>
                            <p className="text-sm text-gray-600">{order.deliveryAddress.addressText}</p>
                        </div>
                    </div>
                     <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                        <button onClick={() => handleGetDirections('delivery')} disabled={!customerLocation} className="flex-1 flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            {t('getDirections')}
                        </button>
                        <button onClick={() => window.open(`tel:${order.customer.phone}`, '_blank')} disabled={!order.customer.phone} className="flex-1 flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" title={!order.customer.phone ? 'رقم العميل غير متوفر' : 'اتصل بالعميل'}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                            {t('callCustomer')}
                        </button>
                    </div>
                </div>

                {/* Details Accordion */}
                <details className="bg-white rounded-lg shadow-sm">
                    <summary className="p-4 font-bold cursor-pointer list-none flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            {t('orderDetails')}
                        </div>
                        <svg className="w-5 h-5 transition-transform transform details-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        <style>{`details[open] .details-arrow { transform: rotate(180deg); }`}</style>
                    </summary>
                    <div className="p-4 border-t border-gray-100 space-y-6">
                        {/* Products List */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                <span>{t('products')}</span>
                            </h4>
                            <ul className="text-sm space-y-3">
                                {order.items.map((item, index) => (
                                    <li key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                                        <div className="flex justify-between items-start">
                                            <span className="font-semibold text-gray-800">{item.quantity} x {translateField(item.name)}</span>
                                            <span className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} {t('currency')}</span>
                                        </div>
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

                        {/* Customer Notes */}
                        {order.customerNotes && (
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    <span>{t('customerNotes')}</span>
                                </h4>
                                <p className="text-sm p-3 bg-amber-50 text-amber-800 rounded-md border border-amber-200">{order.customerNotes}</p>
                            </div>
                        )}

                        {/* Payment Details */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <span>{t('payment')}</span>
                            </h4>
                            <div className="text-sm bg-gray-50 p-3 rounded-lg border space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('total')}</span>
                                    <span className="font-bold text-lg text-gray-900">{order.total.toFixed(2)} {t('currency')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('paymentMethod')}</span>
                                    <span className="font-semibold">
                                        {order.paymentMethod === 'COD' 
                                            ? t('cod') 
                                            : t('paidElectronically')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </details>
            </main>

            {/* Sticky Footer */}
            <footer className="fixed bottom-16 left-0 right-0 bg-white p-4 border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:relative lg:bottom-0 lg:shadow-none lg:p-4 lg:bg-transparent lg:border-none">
                <div className="max-w-3xl mx-auto">
                    <button 
                        onClick={buttonAction} 
                        className={`w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-lg shadow-sm font-semibold text-white text-lg ${isPickupPhase ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {buttonText}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ActiveOrderDetail;