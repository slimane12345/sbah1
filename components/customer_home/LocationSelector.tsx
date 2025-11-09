

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
    const hasLocation = !!userLocation;

    const renderIcon = () => {
        if (isLoading) {
            return <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>;
        }
        if (hasLocation) {
             return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        );
    };
    
    return (
        <div className="mb-8">
            <button
                onClick={onOpenModal}
                className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between text-right no-underline transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5 group"
            >
                <div className="flex items-center min-w-0">
                    <div className="ml-4 flex-shrink-0">
                        {renderIcon()}
                    </div>
                    <div className="min-w-0">
                        <h4 className={`font-bold truncate ${hasLocation ? 'text-green-700' : 'text-gray-800'}`}>{locationText}</h4>
                        <p className="text-sm text-gray-500">{t('fastAndAccurateDelivery')}</p>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-700 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
        </div>
    );
};

export default LocationSelector;