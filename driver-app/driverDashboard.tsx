import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.tsx';
import DriverDashboardPage from './pages/DriverDashboardPage.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';

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
