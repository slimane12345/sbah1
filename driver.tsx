import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import DriverLoginPage from './pages/DriverLoginPage.tsx';
import DriverDashboardPage from './pages/DriverDashboardPage.tsx';
import FirebaseAppShell from './components/FirebaseAppShell.tsx';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.tsx';

const DriverAppContent: React.FC = () => {
    const [driverId, setDriverId] = useState<string | null>(() => localStorage.getItem('sbahDriverId'));
    const { language } = useLanguage();
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const handleLogin = (id: string) => {
        localStorage.setItem('sbahDriverId', id);
        setDriverId(id);
    };

    const handleLogout = () => {
        localStorage.removeItem('sbahDriverId');
        setDriverId(null);
    };

    if (driverId) {
        return <DriverDashboardPage driverId={driverId} onLogout={handleLogout} />;
    }

    return <DriverLoginPage onLoginSuccess={handleLogin} />;
};


const DriverApp: React.FC = () => {
    return (
        <FirebaseAppShell>
            <LanguageProvider>
                <DriverAppContent />
            </LanguageProvider>
        </FirebaseAppShell>
    );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
        <DriverApp />
    </React.StrictMode>
  );
} else {
    console.error("Root element with id 'root' not found.");
}