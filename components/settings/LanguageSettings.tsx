import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../scripts/firebase/firebaseConfig.js';
import { doc, setDoc } from 'firebase/firestore';
import TranslationModal from './TranslationModal';
import LoadingSpinner from '../LoadingSpinner';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode, description?: string }> = ({ title, children, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500 border-b pb-4 mb-6">{description}</p>}
        {children}
    </div>
);

const LanguageSettings: React.FC = () => {
  const { dbTranslations, setDbTranslations, isLoadingTranslations, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<{ code: string; data: Record<string, string> } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleEdit = (langCode: string) => {
    setSelectedLang({ code: langCode, data: dbTranslations[langCode] || {} });
    setIsModalOpen(true);
  };
  
  const handleSave = async (langCode: string, newTranslations: Record<string, string>) => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await setDoc(doc(db, 'translations', langCode), newTranslations);
      setDbTranslations(prev => ({ ...prev, [langCode]: newTranslations }));
      setSaveMessage('تم حفظ الترجمات بنجاح!');
      setTimeout(() => setSaveMessage(''), 3000);
      setIsModalOpen(false);
    } catch (e) {
      console.error("Error saving translations:", e);
      setSaveMessage('فشل حفظ الترجمات.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingTranslations) {
      return <SettingsCard title={t('languageAndTranslations')}><LoadingSpinner /></SettingsCard>
  }

  return (
    <>
        <SettingsCard title={t('languageAndTranslations')} description={t('manageAppLanguages')}>
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">{t('availableLanguages')}</h4>
                {Object.keys(dbTranslations).map(langCode => (
                    <div key={langCode} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                        <span className="font-bold text-gray-700">{langCode.toUpperCase()}</span>
                        <button
                            onClick={() => handleEdit(langCode)}
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 text-sm"
                        >
                            {t('editTranslations')}
                        </button>
                    </div>
                ))}
            </div>
             {saveMessage && <p className={`text-sm mt-4 ${saveMessage.includes('فشل') ? 'text-red-600' : 'text-green-600'}`}>{saveMessage}</p>}
        </SettingsCard>

        {isModalOpen && selectedLang && (
            <TranslationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                langCode={selectedLang.code}
                translations={selectedLang.data}
                isSaving={isSaving}
            />
        )}
    </>
  );
};

export default LanguageSettings;