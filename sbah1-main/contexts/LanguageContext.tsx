import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../i18n.ts';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import type { Language, LanguageContextType, TranslatableString } from '../types.ts';


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [dbTranslations, setDbTranslations] = useState<Record<string, Record<string, string>>>({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);

  useEffect(() => {
    // 1. Check for saved language in localStorage
    const savedLang = localStorage.getItem('appLanguage') as Language;
    if (savedLang && ['ar', 'fr', 'en'].includes(savedLang)) {
      setLanguage(savedLang);
    } else {
      // 2. Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') {
        setLanguage('fr');
      } else if (browserLang === 'en') {
        setLanguage('en');
      } else {
        // 3. Default to Arabic
        setLanguage('ar');
      }
    }

    const fetchTranslations = async () => {
      setIsLoadingTranslations(true);
      try {
        if (!db) {
            console.warn("Firestore (db) is not initialized, falling back to local translations.");
            setDbTranslations(translations);
            return;
        }
        const translationsCollection = collection(db, 'translations');
        const snapshot = await getDocs(translationsCollection);
        
        if (snapshot.empty) {
          console.log("Seeding translations to Firestore...");
          await Promise.all([
            setDoc(doc(db, 'translations', 'ar'), translations.ar),
            setDoc(doc(db, 'translations', 'fr'), translations.fr),
            setDoc(doc(db, 'translations', 'en'), translations.en)
          ]);
          setDbTranslations(translations);
        } else {
          const fetchedTranslations: Record<string, Record<string, string>> = {};
          snapshot.forEach(doc => {
            fetchedTranslations[doc.id] = doc.data();
          });
          // Merge with local to ensure all keys are present
          const merged = {
              ar: { ...translations.ar, ...(fetchedTranslations.ar || {}) },
              fr: { ...translations.fr, ...(fetchedTranslations.fr || {}) },
              en: { ...translations.en, ...(fetchedTranslations.en || {}) },
          };
          setDbTranslations(merged);
        }
      } catch (error) {
        console.error("Error fetching translations, falling back to local.", error);
        setDbTranslations(translations); // Fallback to local on error
      } finally {
        setIsLoadingTranslations(false);
      }
    };

    fetchTranslations();
  }, []);

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem('appLanguage', lang);
    setLanguage(lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let translation = dbTranslations[language]?.[key] || translations[language]?.[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            const regex = new RegExp(`{{${rKey}}}`, 'g');
            translation = translation.replace(regex, String(replacements[rKey]));
        });
    }
    return translation;
  };

  const translateField = (field: TranslatableString | string | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field !== 'object' || Array.isArray(field)) return '';
    // Return the translation for the current language, fallback to Arabic, then to the first available, then to empty.
    const val = field[language] || field['ar'] || Object.values(field)[0];
    if (typeof val === 'string') return val;
    return '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dbTranslations, setDbTranslations, isLoadingTranslations, translateField }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};