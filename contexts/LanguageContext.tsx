import React, { createContext, useState, useContext, useEffect } from 'react';

// This context is no longer in use and is pending complete removal.
// For now, it provides a dummy implementation to prevent crashes in components that still import it.

const dummyTranslate = (key: string) => key;
const dummyTranslateField = (field: any) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.ar || Object.values(field)[0] || '';
};

const dummyContext: any = {
  language: 'ar',
  setLanguage: () => {},
  t: dummyTranslate,
  dbTranslations: {},
  setDbTranslations: () => {},
  isLoadingTranslations: false,
  translateField: dummyTranslateField,
};

const LanguageContext = createContext<any>(dummyContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The provider's functionality has been removed. It now only renders its children.
  return (
    <LanguageContext.Provider value={dummyContext}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): any => {
  // This hook now returns a dummy context to prevent crashes.
  return useContext(LanguageContext);
};
