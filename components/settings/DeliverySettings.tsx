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

interface DeliverySettingsProps {
    initialSettings: AppSettings['delivery'];
}

const DeliverySettings: React.FC<DeliverySettingsProps> = ({ initialSettings }) => {
    const [formData, setFormData] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setFormData(initialSettings);
    }, [initialSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setToast(null);
        const settingsRef = doc(db, 'settings', 'app_config');
        try {
            await updateDoc(settingsRef, { delivery: formData });
            setToast({ text: 'تم حفظ إعدادات التوصيل بنجاح!', type: 'success' });
        } catch (err) {
            console.error(err);
            setToast({ text: 'فشل حفظ الإعدادات. يرجى المحاولة مرة أخرى.', type: 'error' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setToast(null), 4000);
        }
    };

    const handleReset = () => {
        if (window.confirm("هل أنت متأكد من رغبتك في التراجع عن التغييرات؟")) {
            setFormData(initialSettings);
        }
    };


    return (
        <>
            {toast && (
                <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in-down ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white flex items-center gap-3`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{toast.text}</span>
                </div>
            )}
            <SettingsCard title="إعدادات التوصيل">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="baseFee" className="block text-sm font-medium text-gray-700 mb-1">
                            رسوم التوصيل الأساسية
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type="number"
                                id="baseFee"
                                className="block w-full rounded-md border-gray-300 pl-16 pr-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={formData.baseFee}
                                onChange={handleChange}
                                step="0.1"
                                aria-describedby="base-fee-currency"
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm" id="base-fee-currency">د.م.</span>
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">الرسوم الثابتة التي يتم تطبيقها على كل طلب توصيل، بغض النظر عن المسافة.</p>
                    </div>
                    <div>
                        <label htmlFor="kmFee" className="block text-sm font-medium text-gray-700 mb-1">
                            رسوم لكل كيلومتر
                        </label>
                         <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type="number"
                                id="kmFee"
                                className="block w-full rounded-md border-gray-300 pl-16 pr-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={formData.kmFee}
                                onChange={handleChange}
                                step="0.1"
                                aria-describedby="km-fee-currency"
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm" id="km-fee-currency">د.م.</span>
                            </div>
                        </div>
                         <p className="mt-2 text-xs text-gray-500">التكلفة الإضافية التي يتم احتسابها لكل كيلومتر من مسافة التوصيل.</p>
                    </div>
                    <div>
                        <label htmlFor="freeDeliveryMinimum" className="block text-sm font-medium text-gray-700 mb-1">
                            الحد الأدنى للتوصيل المجاني
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                             <input
                                type="number"
                                id="freeDeliveryMinimum"
                                className="block w-full rounded-md border-gray-300 pl-16 pr-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={formData.freeDeliveryMinimum}
                                onChange={handleChange}
                                step="1"
                                aria-describedby="free-delivery-currency"
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm" id="free-delivery-currency">د.م.</span>
                            </div>
                        </div>
                         <p className="mt-2 text-xs text-gray-500">قيمة الطلب التي يصبح بعدها التوصيل مجانيًا. أدخل 0 لتعطيل هذه الميزة.</p>
                    </div>

                    <div className="text-left pt-4 border-t flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSaving}
                            className="bg-gray-100 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            إعادة تعيين
                        </button>
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
        </>
    );
};

export default DeliverySettings;