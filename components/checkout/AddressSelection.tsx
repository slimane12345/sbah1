
import React from 'react';
import type { UserLocation } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface AddressSelectionProps {
    userLocation: UserLocation | null;
    onOpenLocationModal: () => void;
    addressDetails: string;
    setAddressDetails: (details: string) => void;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({ userLocation, onOpenLocationModal, addressDetails, setAddressDetails }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{t('deliveryAddress')}</span>
                </h2>
                <button onClick={onOpenLocationModal} className="text-sm text-blue-600 font-semibold hover:underline">
                    {userLocation ? t('change') : t('selectDeliveryLocation')}
                </button>
            </div>
            {userLocation ? (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">{userLocation.address}</p>
                    </div>
                    <div>
                        <label htmlFor="addressDetails" className="block text-sm font-medium text-gray-700 sr-only">
                            {t('additionalAddressDetails')}
                        </label>
                         <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="addressDetails"
                                value={addressDetails}
                                onChange={(e) => setAddressDetails(e.target.value)}
                                className="w-full pr-12 pl-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder={t('additionalAddressPlaceholder')}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-gray-600">{t('pleaseSelectAddress')}</p>
                     <button onClick={onOpenLocationModal} className="mt-2 text-sm text-blue-600 font-semibold hover:underline">
                        {t('selectDeliveryLocation')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddressSelection;
