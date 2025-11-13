import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.tsx';
import DriverLoginPage from './pages/DriverLoginPage.tsx';
import DriverDashboardPage from './pages/DriverDashboardPage.tsx';
import { auth } from './scripts/firebase/firebaseConfig.js';
import { signInAnonymously } from 'firebase/auth';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ErrorDisplay from './components/ErrorDisplay.tsx';

const AppShell: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { language } = useLanguage();
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    return <>{children}</>;
};

const DriverApp: React.FC = () => {
    const [driverId, setDriverId] = useState<string | null>(() => localStorage.getItem('sbahDriverId'));
    const [isFirebaseReady, setIsFirebaseReady] = useState(false);
    const [firebaseError, setFirebaseError] = useState<React.ReactNode | null>(null);

    useEffect(() => {
        const anony_auth = async () => {
            try {
                if (!auth.currentUser) {
                    await signInAnonymously(auth);
                    console.log("Firebase signed in anonymously for driver app.");
                }
                setIsFirebaseReady(true);
            } catch (error: any) {
                if (error.code === 'auth/admin-restricted-operation') {
                    setFirebaseError(
                      <>
                        <p className="font-bold">خطأ في مصادقة Firebase</p>
                        <p className="text-sm mt-2">ميزة "تسجيل الدخول المجهول" غير مفعلة. هذه الميزة ضرورية لعمل التطبيق بشكل صحيح.</p>
                        <div className="text-left text-sm mt-4 bg-gray-800 text-white p-4 rounded-md font-mono" dir="ltr">
                          <p className="font-semibold">How to fix:</p>
                          <ol className="list-decimal list-inside mt-2 space-y-1">
                            <li>Go to your Firebase Console.</li>
                            <li>Navigate to <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong> tab.</li>
                            <li>Find and <strong>enable</strong> the <strong>Anonymous</strong> sign-in provider.</li>
                            <li>Save and refresh this page.</li>
                          </ol>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">Error code: {error.code}</p>
                      </>
                    );
                } else {
                    setFirebaseError(`حدث خطأ غير متوقع في Firebase: ${error.message}`);
                }
                setIsFirebaseReady(true);
            }
        };
        anony_auth();
    }, []);


    const handleLogin = (id: string) => {
        localStorage.setItem('sbahDriverId', id);
        setDriverId(id);
    };

    const handleLogout = () => {
        localStorage.removeItem('sbahDriverId');
        setDriverId(null);
    };
    
    if (!isFirebaseReady) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (firebaseError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
                <div className="max-w-2xl w-full">
                    <ErrorDisplay message={firebaseError} />
                </div>
            </div>
        );
    }

    if (driverId) {
        return <DriverDashboardPage driverId={driverId} onLogout={handleLogout} />;
    }

    return <DriverLoginPage onLoginSuccess={handleLogin} />;
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <AppShell>
          <DriverApp />
        </AppShell>
      </LanguageProvider>
    </React.StrictMode>
  );
} else {
    console.error("Root element with id 'root' not found.");
}