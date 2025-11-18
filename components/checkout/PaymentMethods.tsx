import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import type { AppSettings } from '../../types';

interface PaymentMethodsProps {
    selectedMethod: 'cod' | 'card' | null;
    setSelectedMethod: (method: 'cod' | 'card' | null) => void;
    settings: AppSettings['payment'] | null;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedMethod, setSelectedMethod, settings }) => {
    const { t } = useLanguage();

    if (!settings) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <h2 className="text-xl font-bold mb-4 h-6 bg-gray-200 rounded w-1/3"></h2>
                <div className="space-y-4">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    const noMethodsAvailable = !settings.codEnabled && !settings.stripeEnabled && !settings.paypalEnabled;

    if (noMethodsAvailable) {
        return (
             <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">{t('paymentMethod')}</h2>
                <p className="text-red-600">{t('noPaymentMethodsAvailable')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">{t('paymentMethod')}</h2>
            <div className="space-y-4">
                {/* Cash on Delivery */}
                {settings.codEnabled && (
                    <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'cod' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-400'}`}
                        onClick={() => setSelectedMethod('cod')}
                    >
                        <p className="font-bold text-gray-900">{t('cod')}</p>
                        <p className="text-sm text-gray-600">{t('codDescription')}</p>
                    </div>
                )}

                {/* Credit Card (Stripe) */}
                {settings.stripeEnabled && (
                    <div
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-400'}`}
                        onClick={() => setSelectedMethod('card')}
                    >
                        <p className="font-bold text-gray-900">{t('card')}</p>
                        <p className="text-sm text-gray-600">{t('cardDescription')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentMethods;