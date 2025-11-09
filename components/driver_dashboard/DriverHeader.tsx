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
    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                    <img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <h1 className="font-bold text-gray-800">{driver.name}</h1>
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className="text-gray-500">{isOnline ? t('youAreOnline') : t('youAreOffline')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onToggleOnline} 
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition-transform duration-200 ease-in-out transform hover:scale-105 ${
                            isOnline 
                                ? 'bg-[#F59E0B] text-white' 
                                : 'bg-[#10B981] text-white'
                        }`}
                    >
                        {isOnline ? t('goOffline') : t('goOnline')}
                    </button>
                    <button onClick={onLogout} className="p-2 text-gray-500 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DriverHeader;