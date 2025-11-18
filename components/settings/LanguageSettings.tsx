import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { db } from '../../scripts/firebase/firebaseConfig.js';
import { doc, setDoc } from 'firebase/firestore';
import TranslationModal from './TranslationModal';
import LoadingSpinner from '../LoadingSpinner';
import { GoogleGenAI } from '@google/genai';

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
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);

  const handleEdit = (langCode: string) => {
    setSelectedLang({ code: langCode, data: dbTranslations[langCode] || {} });
    setIsModalOpen(true);
  };
  
  const handleSave = async (langCode: string, newTranslations: Record<string, string>) => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await setDoc(doc(db, 'translations', langCode), newTranslations, { merge: true });
      setDbTranslations(prev => ({ ...prev, [langCode]: { ...prev[langCode], ...newTranslations } }));
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

  const handleAutoTranslateUI = async (targetLang: 'fr') => {
    setIsAutoTranslating(true);
    setSaveMessage('جاري تحضير الترجمة...');

    try {
        const sourceTranslations = dbTranslations.ar;
        const targetTranslations = dbTranslations[targetLang] || {};
        const keysToTranslate = Object.keys(sourceTranslations).filter(key => !targetTranslations[key] || targetTranslations[key].trim() === '');
        
        if (keysToTranslate.length === 0) {
            setSaveMessage('لا توجد مفاتيح جديدة لترجمتها.');
            setTimeout(() => setSaveMessage(''), 3000);
            setIsAutoTranslating(false);
            return;
        }

        const batchToTranslate = keysToTranslate.reduce((acc, key) => {
            acc[key] = sourceTranslations[key];
            return acc;
        }, {} as Record<string, string>);

        if (!process.env.API_KEY) throw new Error("API_KEY is not set.");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        setSaveMessage(`جاري ترجمة ${keysToTranslate.length} مفتاح...`);

        const prompt = `Translate only the JSON values from Arabic to French. Keep the original JSON keys. Return only the valid JSON object.\n\nInput:\n${JSON.stringify(batchToTranslate, null, 2)}\n\nOutput:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        let translatedJson;
        try {
            translatedJson = JSON.parse(response.text);
        } catch (e) {
            console.error("Failed to parse Gemini response:", response.text);
            throw new Error("Received invalid JSON from the translation API.");
        }

        const updatedTranslations = { ...targetTranslations, ...translatedJson };
        
        await handleSave(targetLang, updatedTranslations);
        setSaveMessage(`تمت ترجمة ${Object.keys(translatedJson).length} مفتاح بنجاح!`);
        setTimeout(() => setSaveMessage(''), 4000);

    } catch (error) {
        console.error("Auto-translation failed:", error);
        setSaveMessage('فشل في الترجمة التلقائية.');
        setTimeout(() => setSaveMessage(''), 3000);
    } finally {
        setIsAutoTranslating(false);
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
                    <div key={langCode} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                        <span className="font-bold text-gray-700">{langCode.toUpperCase()}</span>
                        <div className="flex gap-2">
                           {langCode !== 'ar' && (
                                <button
                                    onClick={() => handleAutoTranslateUI(langCode as 'fr')}
                                    disabled={isAutoTranslating}
                                    className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 text-sm disabled:bg-teal-300"
                                >
                                    {isAutoTranslating ? 'جاري الترجمة...' : 'ترجمة تلقائية للقيم المفقودة'}
                                </button>
                           )}
                            <button
                                onClick={() => handleEdit(langCode)}
                                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 text-sm"
                            >
                                {t('editTranslations')}
                            </button>
                        </div>
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