import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface NotificationToastProps {
  orderNumber: string;
  customerName: string;
  onNavigate: () => void;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ orderNumber, customerName, onNavigate, onClose }) => {
  const { t, language } = useLanguage();

  // Auto-close after a longer duration to ensure it's seen
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 15000); // 15 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const positionClass = language === 'ar' ? 'top-20 left-6' : 'top-20 right-6';

  return (
    <div className={`fixed ${positionClass} z-[100] w-full max-w-sm bg-white shadow-lg rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-fade-in-down`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <div className="w-0 flex-1 mx-3">
            <p className="text-sm font-bold text-gray-900">{t('newOrderNotificationTitle')}</p>
            <p className="mt-1 text-sm text-gray-600">
              {t('newOrderNotificationBody', { orderNumber, customerName })}
            </p>
            <div className="mt-3 flex gap-4">
              <button
                onClick={onNavigate}
                className="bg-blue-50 text-blue-600 text-sm font-semibold py-1 px-3 rounded-md hover:bg-blue-100"
              >
                {t('viewOrder')}
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;