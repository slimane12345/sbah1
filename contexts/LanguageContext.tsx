import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../i18n.ts';

// Define types here to avoid touching types.ts and keep changes minimal
export type Language = 'ar' | 'fr';

// FIX: Added dbTranslations, setDbTranslations, and isLoadingTranslations to provide state management for translations, resolving type errors.
export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  translateField: (field: any) => string;
  dbTranslations: Record<string, Record<string, string>>;
  setDbTranslations: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>;
  isLoadingTranslations: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  // FIX: Re-introduced state for dbTranslations to allow it to be updated by settings components.
  const [dbTranslations, setDbTranslations] = useState(translations);


  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') as Language;
    if (savedLang && (savedLang === 'ar' || savedLang === 'fr')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem('appLanguage', lang);
    setLanguage(lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let translation = (dbTranslations[language] as Record<string, string>)?.[key] ?? key;
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        const regex = new RegExp(`{{${rKey}}}`, 'g');
        translation = translation.replace(regex, String(replacements[rKey]));
      });
    }
    return translation;
  };

  const translateField = (field: any | string | undefined): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (typeof field !== 'object' || Array.isArray(field)) return '';
      // Return the translation for the current language, fallback to Arabic, then to the first available, then to empty.
      return field[language] || field['ar'] || Object.values(field)[0] || '';
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
    // FIX: Provided state and state setter for translations to match the updated context type.
    dbTranslations: dbTranslations, 
    setDbTranslations: setDbTranslations, 
    isLoadingTranslations: false, // Always false for local implementation
    translateField,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // This fallback prevents crashes in components that still use the old dummy context structure
    // but the app itself will use the real provider.
    return {
        language: 'ar',
        setLanguage: () => {},
        t: (key: string) => key,
        translateField: (field: any) => typeof field === 'string' ? field : (field?.ar || ''),
        dbTranslations: {},
        // FIX: Cast the dummy function to match the expected type for the fallback scenario.
        setDbTranslations: (() => {}) as React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>,
        isLoadingTranslations: true,
    }
  }
  return context;
};
