import React from 'react';
import type { Driver } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface PayDuesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    driver: Driver | null;
    isSubmitting: boolean;
}

const PayDuesModal: React.FC<PayDuesModalProps> = ({ isOpen, onClose, onConfirm, driver, isSubmitting }) => {
    const { t } = useLanguage();

    if (!isOpen || !driver) return null;

    const earnings = driver.totalEarnings ?? 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">{t('confirmPaymentTitle')}</h2>
                </div>
                <div className="p-6">
                    <p className="text-gray-700">
                        {t('confirmPaymentMessage', { 
                            driverName: driver.name, 
                            amount: earnings.toFixed(2), 
                            currency: t('currency') 
                        })}
                    </p>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-white py-2 px-4 border border-gray-300 rounded-md">
                        {t('cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 disabled:bg-green-300"
                    >
                        {isSubmitting ? t('paying') : t('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayDuesModal;