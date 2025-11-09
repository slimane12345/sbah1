
import React from 'react';
import type { OrderManagementData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AcceptOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    order: OrderManagementData;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div>
        <h4 className="text-sm font-semibold text-gray-500 flex items-center">{icon}<span className="mr-2">{label}</span></h4>
        <div className="mt-1 text-base text-gray-800 font-medium pl-6">{value}</div>
    </div>
);

const AcceptOrderModal: React.FC<AcceptOrderModalProps> = ({ isOpen, onClose, onConfirm, order }) => {
    const { t } = useLanguage();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('confirmAcceptanceTitle')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5">
                    <InfoRow 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>}
                        label={t('from')}
                        value={order.restaurant}
                    />
                    <InfoRow 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 19l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
                        label={t('to')}
                        value={<>{order.customer.name}<p className="text-sm font-normal text-gray-600">{order.deliveryAddress.addressText}</p></>}
                    />
                     <InfoRow 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>}
                        label={t('products')}
                        value={
                            <ul className="list-disc list-inside text-sm font-normal text-gray-700">
                                {order.items.map((item, index) => (
                                    <li key={index}>
                                        {item.quantity} x {item.name}
                                        {item.options && item.options.length > 0 && 
                                            <span className="text-xs text-gray-500"> ({item.options.join(', ')})</span>
                                        }
                                    </li>
                                ))}
                            </ul>
                        }
                    />
                     <InfoRow 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>}
                        label={t('payment')}
                        value={order.paymentMethod === 'COD' 
                                ? t('codWithAmount', { amount: order.total.toFixed(2), currency: t('currency') })
                                : t('paidElectronically')}
                    />
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        {t('cancel')}
                    </button>
                    <button onClick={onConfirm} className="bg-green-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-green-700">
                        {t('confirmAcceptance')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AcceptOrderModal;
