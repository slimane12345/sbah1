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

interface PushNotificationsSettingsProps {
    initialSettings: AppSettings['notifications'];
}

const PushNotificationsSettings: React.FC<PushNotificationsSettingsProps> = ({ initialSettings }) => {
    const [formData, setFormData] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setFormData(initialSettings);
    }, [initialSettings]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [id]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        const settingsRef = doc(db, 'settings', 'app_config');
        try {
            await updateDoc(settingsRef, { notifications: formData });
            setMessage({ text: 'تم حفظ إعدادات الإشعارات بنجاح!', type: 'success' });
        } catch (err) {
            console.error(err);
            setMessage({ text: 'فشل حفظ الإعدادات.', type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <SettingsCard title="إعدادات إشعارات البوش">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">إعدادات Firebase (FCM)</h4>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fcmServerKey" className="block text-sm font-medium text-gray-700 mb-1">
                                Server Key
                            </label>
                            <input
                                type="text"
                                id="fcmServerKey"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="أدخل مفتاح الخادم الخاص بك"
                                value={formData.fcmServerKey}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="fcmVapidKey" className="block text-sm font-medium text-gray-700 mb-1">
                                VAPID Key (Web Push)
                            </label>
                            <input
                                type="text"
                                id="fcmVapidKey"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                placeholder="أدخل مفتاح VAPID الخاص بك"
                                value={formData.fcmVapidKey}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-800 mb-4">أنواع الإشعارات</h4>
                    <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <label htmlFor="notifyRestaurantNewOrder" className="text-sm font-medium text-gray-700">إشعار بطلب جديد للمطعم</label>
                            <input type="checkbox" id="notifyRestaurantNewOrder" checked={formData.notifyRestaurantNewOrder} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                         </div>
                         <div className="flex items-center justify-between">
                            <label htmlFor="notifyCustomerStatusUpdate" className="text-sm font-medium text-gray-700">تحديثات حالة الطلب للعميل</label>
                             <input type="checkbox" id="notifyCustomerStatusUpdate" checked={formData.notifyCustomerStatusUpdate} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                         </div>
                         <div className="flex items-center justify-between">
                            <label htmlFor="notifyDriverNewOrder" className="text-sm font-medium text-gray-700">إشعار بطلب جديد للمندوب</label>
                             <input type="checkbox" id="notifyDriverNewOrder" checked={formData.notifyDriverNewOrder} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                         </div>
                         <div className="flex items-center justify-between">
                            <label htmlFor="notifyMarketingOffers" className="text-sm font-medium text-gray-700">العروض التسويقية</label>
                            <input type="checkbox" id="notifyMarketingOffers" checked={formData.notifyMarketingOffers} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
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

export default PushNotificationsSettings;