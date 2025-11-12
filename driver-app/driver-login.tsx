import React from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.tsx';
import DriverLoginPage from './pages/DriverLoginPage.tsx';

const AppShell: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { language } = useLanguage();
    
    React.useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    return <>{children}</>;
};

const LoginApp: React.FC = () => {
    const handleLoginSuccess = (driverId: string) => {
        localStorage.setItem('sbahDriverId', driverId);
        window.location.href = '/driverDashboard.html';
    };

    return <DriverLoginPage onLoginSuccess={handleLoginSuccess} />;
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <AppShell>
          <LoginApp />
        </AppShell>
      </LanguageProvider>
    </React.StrictMode>
  );
}
