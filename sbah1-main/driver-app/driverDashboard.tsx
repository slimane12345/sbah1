import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.tsx';
import DriverDashboardPage from './pages/DriverDashboardPage.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import { firebaseInitializationError } from './firebase/firebaseConfig.js';
import ErrorDisplay from '../components/ErrorDisplay.tsx';


const AppShell: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { language } = useLanguage();
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    return <>{children}</>;
};

const DashboardApp: React.FC = () => {
    const [driverId, setDriverId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    if (firebaseInitializationError) {
        let detailedMessage: React.ReactNode = `An unexpected Firebase initialization error occurred: ${firebaseInitializationError.message}`;
        if (firebaseInitializationError.message.includes('firestore is not available')) {
            detailedMessage = (
                <>
                  <p className="font-bold">خطأ في إعداد Firebase Firestore</p>
                  <p className="text-sm mt-2">خدمة Firestore غير متاحة. هذا يعني غالبًا أن قاعدة بيانات Firestore لم يتم إنشاؤها في مشروعك على Firebase.</p>
                  <div className="text-left text-sm mt-4 bg-gray-800 text-white p-4 rounded-md font-mono" dir="ltr">
                    <p className="font-semibold">How to fix:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Firebase Console</a>.</li>
                      <li>In the left menu, click <strong>Build</strong> &rarr; <strong>Firestore Database</strong>.</li>
                      <li>Click <strong>Create database</strong>.</li>
                      <li>Choose <strong>Start in production mode</strong> (or test mode).</li>
                      <li>Select a location and click <strong>Enable</strong>.</li>
                    </ol>
                  </div>
                </>
            );
        }
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
                <div className="max-w-2xl w-full">
                    <ErrorDisplay message={detailedMessage} />
                </div>
            </div>
        );
    }
    
    useEffect(() => {
        const storedDriverId = localStorage.getItem('sbahDriverId');
        if (storedDriverId) {
            setDriverId(storedDriverId);
        } else {
            window.location.href = '/driver-login.html';
        }
        setIsLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sbahDriverId');
        window.location.href = '/driver-login.html';
    };
    
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (driverId) {
        return <DriverDashboardPage driverId={driverId} onLogout={handleLogout} />;
    }

    // This case should be handled by the redirect, but as a fallback:
    return <p>Redirecting to login...</p>;
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <AppShell>
          <DashboardApp />
        </AppShell>
      </LanguageProvider>
    </React.StrictMode>
  );
}
