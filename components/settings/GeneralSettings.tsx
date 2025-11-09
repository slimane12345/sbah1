import React, { useState, useEffect } from 'react';
import { db } from '../../scripts/firebase/firebaseConfig.js';
import { doc, updateDoc } from 'firebase/firestore';
import type { AppSettings } from '../../types';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">{title}</h3>
        {children}
    </div>
);

interface GeneralSettingsProps {
    initialSettings: AppSettings['general'];
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ initialSettings }) => {
    const [formData, setFormData] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setFormData(initialSettings);
    }, [initialSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        const settingsRef = doc(db, 'settings', 'app_config');
        try {
            await updateDoc(settingsRef, { general: formData });
            setMessage({ text: 'تم حفظ التغييرات بنجاح!', type: 'success' });
        } catch (err) {
            console.error(err);
            setMessage({ text: 'فشل حفظ التغييرات. يرجى المحاولة مرة أخرى.', type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <SettingsCard title="الإعدادات العامة">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="platformName" className="block text-sm font-medium text-gray-700 mb-1">
                        اسم المنصة
                    </label>
                    <input
                        type="text"
                        id="platformName"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.platformName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        البريد الإلكتروني للتواصل
                    </label>
                    <input
                        type="email"
                        id="contactEmail"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.contactEmail}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        العنوان
                    </label>
                    <textarea
                        id="address"
                        rows={3}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        رابط شعار المنصة (URL)
                    </label>
                    <div className="mt-1 flex items-center">
                         {formData.logoUrl ? (
                            <img src={formData.logoUrl} alt="Logo Preview" className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </span>
                        )}
                        <input
                            type="url"
                            id="logoUrl"
                            className="mr-5 flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/logo.png"
                            value={formData.logoUrl}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="text-left pt-4">
                     {message && (
                        <p className={`text-sm mb-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    >
                        {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </form>
        </SettingsCard>
    );
};

export default GeneralSettings;