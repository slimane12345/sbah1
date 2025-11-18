

import React, { useState, useEffect } from 'react';
import type { UserProfileData } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
);

interface ProfileSettingsProps {
    user: UserProfileData | null;
    onSave: (data: Omit<UserProfileData, 'id' | 'avatarUrl'>) => Promise<void>;
    deferredInstallPrompt: any;
    onInstallApp: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onSave, deferredInstallPrompt, onInstallApp }) => {
    const { language, setLanguage, t } = useLanguage();
    const [name, setName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const [isAppInstalled, setIsAppInstalled] = useState(false);
    useEffect(() => {
        // Check if the app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsAppInstalled(true);
        }
    }, []);

    useEffect(() => {
        if (user) {
            setName(user.fullName);
            setEmail(user.email);
            setPhone(user.phone);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage('');
        try {
            await onSave({ fullName: name, email, phone });
            setSaveMessage(t('saveSuccess'));
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            setSaveMessage(t('saveFail'));
            setTimeout(() => setSaveMessage(''), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t('profile')}</h3>
                <p className="mt-1 text-sm text-gray-500">
                    {t('profileInfoMessage')}
                </p>
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('name')}</label>
                        <div className="mt-1">
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('email')}</label>
                        <div className="mt-1">
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('phone')}</label>
                        <div className="mt-1">
                            <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                    <div className="text-left">
                        {saveMessage && <p className={`text-sm mb-2 ${saveMessage.includes('فشل') || saveMessage.includes('Échec') ? 'text-red-600' : 'text-green-600'}`}>{saveMessage}</p>}
                        <button type="submit" className="btn-customer-primary" disabled={isSaving}>
                            {isSaving ? t('saving') : t('save')}
                        </button>
                    </div>
                </form>
            </Card>

             <Card>
                <h3 className="text-lg font-medium text-gray-900">{t('languageSettings')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('languageDescription')}</p>
                <div className="mt-4 flex flex-wrap gap-4">
                    <button
                        onClick={() => setLanguage('ar')}
                        className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2 ${language === 'ar' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        🇲🇦 {t('arabic')}
                    </button>
                    <button
                        onClick={() => setLanguage('fr')}
                        className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2 ${language === 'fr' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        🇫🇷 {t('french')}
                    </button>
                     <button
                        onClick={() => setLanguage('en')}
                        className={`px-6 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-2 ${language === 'en' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        🇬🇧 {t('english')}
                    </button>
                </div>
            </Card>

            {deferredInstallPrompt && !isAppInstalled && (
                <Card>
                    <h3 className="text-lg font-medium text-gray-900">{t('appSettings')}</h3>
                    <p className="mt-1 text-sm text-gray-500">{t('installAppDescription')}</p>
                    <div className="mt-4">
                        <button 
                            onClick={onInstallApp}
                            className="btn-customer-secondary flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            {t('installApp')}
                        </button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProfileSettings;