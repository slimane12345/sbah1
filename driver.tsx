import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.tsx';
import DriverLoginPage from './pages/DriverLoginPage.tsx';
import DriverDashboardPage from './pages/DriverDashboardPage.tsx';

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