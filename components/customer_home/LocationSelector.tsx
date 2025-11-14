import React from 'react';
import type { UserLocation } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface LocationSelectorProps {
    userLocation: UserLocation | null;
    onOpenModal: () => void;
    isLoading: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ userLocation, onOpenModal, isLoading }) => {
    const { t } = useLanguage();
    const locationText = userLocation ? userLocation.address : t('selectDeliveryLocation');

    return (
        <div className="mb-6">
            <button
                onClick={onOpenModal}
                className="w-full bg-white rounded-lg p-3 flex items-center text-right no-underline transition-all duration-300 ease-in-out hover:bg-gray-50 group"
            >
                <div className="ml-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 19l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className="font-semibold truncate text-gray-800 flex-1">{locationText}</p>
                 {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 mr-3"></div>}
            </button>
        </div>
    );
};

export default LocationSelector;