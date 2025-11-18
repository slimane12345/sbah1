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

const Toggle: React.FC<{ enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ enabled, setEnabled }) => (
    <button
        type="button"
        className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
        onClick={() => setEnabled(!enabled)}
    >
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);

interface PaymentSettingsProps {
    initialSettings: AppSettings['payment'];
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ initialSettings }) => {
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

    const handleToggle = (key: keyof AppSettings['payment']) => {
        setFormData(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        const settingsRef = doc(db, 'settings', 'app_config');
        try {
            await updateDoc(settingsRef, { payment: formData });
            setMessage({ text: 'تم حفظ إعدادات الدفع بنجاح!', type: 'success' });
        } catch (err) {
            console.error(err);
            setMessage({ text: 'فشل حفظ الإعدادات.', type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <SettingsCard title="إعدادات الدفع">
            <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                    {/* Cash on Delivery */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-gray-800">الدفع عند الاستلام</h4>
                            <p className="text-sm text-gray-500">السماح للعملاء بالدفع نقدًا عند استلام الطلب.</p>
                        </div>
                        <Toggle enabled={formData.codEnabled} setEnabled={() => handleToggle('codEnabled')} />
                    </div>

                    {/* Stripe */}
                    <div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-gray-800">Stripe</h4>
                                <p className="text-sm text-gray-500">قبول المدفوعات عبر البطاقات الائتمانية.</p>
                            </div>
                            <Toggle enabled={formData.stripeEnabled} setEnabled={() => handleToggle('stripeEnabled')} />
                        </div>
                        {formData.stripeEnabled && (
                            <div className="mt-4 space-y-4 pr-10 border-r-2 border-gray-100">
                                <div>
                                    <label htmlFor="stripeKey" className="block text-sm font-medium text-gray-700 mb-1">
                                        Publishable Key
                                    </label>
                                    <input type="text" id="stripeKey" value={formData.stripeKey} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="stripeSecret" className="block text-sm font-medium text-gray-700 mb-1">
                                        Secret Key
                                    </label>
                                    <input type="password" id="stripeSecret" value={formData.stripeSecret} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* PayPal */}
                    <div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-gray-800">PayPal</h4>
                                <p className="text-sm text-gray-500">قبول المدفوعات عبر حسابات PayPal.</p>
                            </div>
                            <Toggle enabled={formData.paypalEnabled} setEnabled={() => handleToggle('paypalEnabled')} />
                        </div>
                        {formData.paypalEnabled && (
                            <div className="mt-4 space-y-4 pr-10 border-r-2 border-gray-100">
                                <div>
                                    <label htmlFor="paypalId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Client ID
                                    </label>
                                    <input type="text" id="paypalId" value={formData.paypalId} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm"/>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-left pt-4 border-t mt-6">
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
                </div>
            </form>
        </SettingsCard>
    );
};

export default PaymentSettings;