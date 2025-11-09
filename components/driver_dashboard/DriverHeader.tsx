import React from 'react';
import type { Driver } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface DriverHeaderProps {
    driver: Driver;
    isOnline: boolean;
    onToggleOnline: () => void;
    onLogout: () => void;
}

const DriverHeader: React.FC<DriverHeaderProps> = ({ driver, isOnline, onToggleOnline, onLogout }) => {
    const { t } = useLanguage();
    const statusText = isOnline ? t('youAreOnline') : t('youAreOffline');
    const buttonText = isOnline ? t('goOffline') : t('goOnline');

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-3">
                <img src={driver.avatar} alt={driver.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                    <h2 className="font-bold text-lg text-gray-800">{driver.name}</h2>
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <p className="text-sm font-medium text-gray-600">{statusText}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleOnline}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${isOnline ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                    {buttonText}
                </button>
                <button onClick={onLogout} title={t('logout')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default DriverHeader;
