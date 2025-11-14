import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.tsx';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language } = useLanguage();

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    return <>{children}</>;
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <AppShell>
            <App />
        </AppShell>
      </LanguageProvider>
    </React.StrictMode>
  );
} else {
    console.error("Root element with id 'root' not found.");
}
