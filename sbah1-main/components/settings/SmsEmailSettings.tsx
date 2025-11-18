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

interface SmsEmailSettingsProps {
    initialSettings: AppSettings['smsEmail'];
}

const SmsEmailSettings: React.FC<SmsEmailSettingsProps> = ({ initialSettings }) => {
    const [formData, setFormData] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setFormData(initialSettings);
    }, [initialSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        const settingsRef = doc(db, 'settings', 'app_config');
        try {
            await updateDoc(settingsRef, { smsEmail: formData });
            setMessage({ text: 'تم حفظ إعدادات SMS/Email بنجاح!', type: 'success' });
        } catch (err) {
            console.error(err);
            setMessage({ text: 'فشل حفظ الإعدادات.', type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <SettingsCard title="إعدادات SMS و Email">
            <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">إعدادات Twilio (SMS)</h4>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="twilioSid" className="block text-sm font-medium text-gray-700 mb-1">
                                Account SID
                            </label>
                            <input
                                type="text"
                                id="twilioSid"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                                value={formData.twilioSid}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="twilioToken" className="block text-sm font-medium text-gray-700 mb-1">
                                Auth Token
                            </label>
                            <input
                                type="password"
                                id="twilioToken"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="************"
                                value={formData.twilioToken}
                                onChange={handleChange}
                            />
                        </div>
                         <div>
                            <label htmlFor="twilioNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Twilio Phone Number
                            </label>
                            <input
                                type="text"
                                id="twilioNumber"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="+15017122661"
                                value={formData.twilioNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t pt-8">
                    <h4 className="font-semibold text-gray-800 mb-2">إعدادات Mailgun (Email)</h4>
                     <div className="space-y-4">
                        <div>
                            <label htmlFor="mailgunKey" className="block text-sm font-medium text-gray-700 mb-1">
                                API Key
                            </label>
                            <input
                                type="password"
                                id="mailgunKey"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxx"
                                value={formData.mailgunKey}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="mailgunDomain" className="block text-sm font-medium text-gray-700 mb-1">
                                Domain
                            </label>
                            <input
                                type="text"
                                id="mailgunDomain"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="sandbox.mailgun.org"
                                value={formData.mailgunDomain}
                                onChange={handleChange}
                            />
                        </div>
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

export default SmsEmailSettings;