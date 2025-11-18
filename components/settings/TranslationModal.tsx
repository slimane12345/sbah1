import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n';

interface TranslationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (langCode: string, newTranslations: Record<string, string>) => void;
    langCode: string;
    translations: Record<string, string>;
    isSaving: boolean;
}

const TranslationModal: React.FC<TranslationModalProps> = ({ isOpen, onClose, onSave, langCode, translations: initialTranslations, isSaving }) => {
    const { t } = useLanguage();
    const [localTranslations, setLocalTranslations] = useState<Record<string, string>>({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLocalTranslations(initialTranslations);
    }, [initialTranslations, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (key: string, value: string) => {
        setLocalTranslations(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(langCode, localTranslations);
    };

    const defaultKeys = Object.keys(translations.ar).sort();
    
    const filteredKeys = defaultKeys.filter(key => 
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (translations.ar[key] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (localTranslations[key] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{t('editTranslationsFor', { lang: langCode.toUpperCase() })}</h2>
                        <input
                            type="text"
                            placeholder="ابحث عن مفتاح أو قيمة..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2 text-right font-semibold">{t('translationKey')}</th>
                                    <th className="px-4 py-2 text-right font-semibold">{t('defaultValue')}</th>
                                    <th className="px-4 py-2 text-right font-semibold">{t('translationValue')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredKeys.map(key => (
                                    <tr key={key}>
                                        <td className="px-4 py-2 font-mono text-xs text-gray-600 align-top">{key}</td>
                                        <td className="px-4 py-2 text-gray-500 align-top">{translations.ar[key]}</td>
                                        <td className="px-4 py-2 align-top">
                                            <textarea
                                                value={localTranslations[key] || ''}
                                                onChange={e => handleInputChange(key, e.target.value)}
                                                rows={1}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSaving} className="bg-white py-2 px-4 border rounded-md">
                            {t('cancel')}
                        </button>
                        <button type="submit" disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                            {isSaving ? t('saving') : t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TranslationModal;