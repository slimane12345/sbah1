import React, { useState, useEffect } from 'react';
import type { Campaign, CampaignStatus } from '../types';

interface CampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (campaignData: Omit<Campaign, 'id' | 'performance'>, id: string | null) => void;
    campaign: Campaign | null;
    isSubmitting: boolean;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSave, campaign, isSubmitting }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'Push Notification' | 'SMS' | 'Email'>('Push Notification');
    const [status, setStatus] = useState<CampaignStatus>('مسودة');
    const [targetAudience, setTargetAudience] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (campaign) {
            setName(campaign.name);
            setType(campaign.type);
            setStatus(campaign.status);
            setTargetAudience(campaign.targetAudience);
            setStartDate(campaign.startDate || '');
            setEndDate(campaign.endDate || '');
        } else {
            // Reset for new campaign
            setName('');
            setType('Push Notification');
            setStatus('مسودة');
            setTargetAudience('');
            setStartDate('');
            setEndDate('');
        }
    }, [campaign, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, type, status, targetAudience, startDate, endDate }, campaign ? campaign.id : null);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{campaign ? 'تعديل الحملة' : 'إنشاء حملة جديدة'}</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">اسم الحملة</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">نوع الحملة</label>
                                <select value={type} onChange={e => setType(e.target.value as any)} className="mt-1 w-full border-gray-300 rounded-md">
                                    <option value="Push Notification">Push Notification</option>
                                    <option value="SMS">SMS</option>
                                    <option value="Email">Email</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">الحالة</label>
                                <select value={status} onChange={e => setStatus(e.target.value as CampaignStatus)} className="mt-1 w-full border-gray-300 rounded-md">
                                    <option value="نشطة">نشطة</option>
                                    <option value="مجدولة">مجدولة</option>
                                    <option value="مكتملة">مكتملة</option>
                                    <option value="مسودة">مسودة</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الجمهور المستهدف</label>
                            <input type="text" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" placeholder="مثال: كل العملاء، عملاء الرياض" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">تاريخ البدء</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">تاريخ الانتهاء</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-white py-2 px-4 border border-gray-300 rounded-md">إلغاء</button>
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                            {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignModal;
