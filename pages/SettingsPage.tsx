import React, { useState, useEffect } from 'react';
import GeneralSettings from '../components/settings/GeneralSettings';
import PaymentSettings from '../components/settings/PaymentSettings';
import DeliverySettings from '../components/settings/DeliverySettings';
import PushNotificationsSettings from '../components/settings/PushNotificationsSettings';
import SmsEmailSettings from '../components/settings/SmsEmailSettings';
import LanguageSettings from '../components/settings/LanguageSettings';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { AppSettings } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

type SettingsTab = 'general' | 'payment' | 'delivery' | 'push' | 'sms' | 'language';

const TABS: { id: SettingsTab; label: string; icon: React.ReactElement }[] = [
    { id: 'general', label: 'إعدادات عامة', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 'payment', label: 'إعدادات الدفع', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
    { id: 'delivery', label: 'إعدادات التوصيل', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1z" /></svg> },
    { id: 'language', label: 'اللغات والترجمة', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h-3.234c-.386 0-.763-.08-1.1-.222m-2.226-2.226c-.222-.222-.424-.46-.612-.702M12 12a6 6 0 100-12 6 6 0 000 12z" /></svg> },
    { id: 'push', label: 'إشعارات البوش', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
    { id: 'sms', label: 'إعدادات SMS/Email', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
];

const DEFAULT_SETTINGS: AppSettings = {
  general: { platformName: 'Sbah ☀️', contactEmail: 'contact@sbah.ma', address: '123 Avenue Mohammed V, Rabat, Morocco', logoUrl: '' },
  payment: { codEnabled: true, stripeEnabled: false, stripeKey: '', stripeSecret: '', paypalEnabled: false, paypalId: '' },
  delivery: { baseFee: 10, kmFee: 1.5, freeDeliveryMinimum: 200 },
  notifications: { fcmServerKey: '', fcmVapidKey: '', notifyRestaurantNewOrder: true, notifyCustomerStatusUpdate: true, notifyDriverNewOrder: true, notifyMarketingOffers: false },
  smsEmail: { twilioSid: '', twilioToken: '', twilioNumber: '', mailgunKey: '', mailgunDomain: '' }
};

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const settingsDocRef = doc(db, 'settings', 'app_config');

    const fetchSettings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const docSnap = await getDoc(settingsDocRef);
            if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                // Merge with defaults to prevent crashes if some keys are missing from DB
                const mergedSettings: AppSettings = {
                    general: { ...DEFAULT_SETTINGS.general, ...fetchedData.general },
                    payment: { ...DEFAULT_SETTINGS.payment, ...fetchedData.payment },
                    delivery: { ...DEFAULT_SETTINGS.delivery, ...fetchedData.delivery },
                    notifications: { ...DEFAULT_SETTINGS.notifications, ...fetchedData.notifications },
                    smsEmail: { ...DEFAULT_SETTINGS.smsEmail, ...fetchedData.smsEmail },
                };
                setSettings(mergedSettings);
            } else {
                // If doc doesn't exist, use default values and save them for the first time
                await setDoc(settingsDocRef, DEFAULT_SETTINGS);
                setSettings(DEFAULT_SETTINGS);
            }
        } catch (err) {
            console.error(err);
            setError("فشل تحميل الإعدادات. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const renderContent = () => {
        if (isLoading) return <div className="bg-white p-6 rounded-lg shadow-md"><LoadingSpinner /></div>;
        if (error) return <div className="bg-white p-6 rounded-lg shadow-md"><ErrorDisplay message={error} onRetry={fetchSettings} /></div>;
        if (!settings) return null;

        switch (activeTab) {
            case 'general':
                return <GeneralSettings initialSettings={settings!.general} />;
            case 'payment':
                return <PaymentSettings initialSettings={settings!.payment} />;
            case 'delivery':
                return <DeliverySettings initialSettings={settings!.delivery} />;
            case 'language':
                return <LanguageSettings />;
            case 'push':
                return <PushNotificationsSettings initialSettings={settings!.notifications} />;
            case 'sms':
                return <SmsEmailSettings initialSettings={settings!.smsEmail} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">أقسام الإعدادات</h3>
                    <nav className="space-y-2">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center w-full text-right px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
            <div className="flex-1">
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsPage;