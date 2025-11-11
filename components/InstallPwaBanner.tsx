import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface InstallPwaBannerProps {
    onInstall: () => void;
}

const InstallPwaBanner: React.FC<InstallPwaBannerProps> = ({ onInstall }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const dismissed = localStorage.getItem('pwaInstallDismissed');
        // Check if running as a standalone app
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (!dismissed && !isStandalone) {
            // A small delay to allow the user to see the page first
            setTimeout(() => {
                setIsVisible(true);
            }, 1500);
        }
    }, []);

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        localStorage.setItem('pwaInstallDismissed', 'true');
        setIsVisible(false);
    };

    const handleInstallClick = () => {
        onInstall();
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full z-50 p-2 sm:p-4 animate-fade-in-up">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.08)] p-3 sm:p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">{t('installAppTitle')}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{t('installAppPrompt')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                     <button onClick={handleDismiss} className="text-sm font-semibold text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 hidden sm:block">{t('later')}</button>
                    <button onClick={handleInstallClick} className="btn-customer-primary whitespace-nowrap px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base">{t('install')}</button>
                </div>
                 <button onClick={handleDismiss} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 sm:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

export default InstallPwaBanner;
