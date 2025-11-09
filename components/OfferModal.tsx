import React, { useState, useEffect } from 'react';
import type { Offer, OfferStatus } from '../types';

interface OfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (offerData: Omit<Offer, 'id' | 'usageCount' | 'status' | 'createdAt'>, id: string | null) => void;
    offer: Offer | null;
    isSubmitting: boolean;
}

const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onClose, onSave, offer, isSubmitting }) => {
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
    const [discountValue, setDiscountValue] = useState(0);
    const [validFrom, setValidFrom] = useState('');
    const [validTo, setValidTo] = useState('');

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    useEffect(() => {
        if (offer) {
            setCode(offer.code);
            setDescription(offer.description);
            setDiscountType(offer.discountType);
            setDiscountValue(offer.discountValue);
            setValidFrom(formatDateForInput(offer.validFrom));
            setValidTo(formatDateForInput(offer.validTo));
        } else {
            // Reset for new offer
            setCode('');
            setDescription('');
            setDiscountType('percentage');
            setDiscountValue(0);
            setValidFrom('');
            setValidTo('');
        }
    }, [offer, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            code,
            description,
            discountType,
            discountValue,
            validFrom,
            validTo
        }, offer ? offer.id : null);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{offer ? 'تعديل العرض' : 'إنشاء عرض جديد'}</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">كود الخصم</label>
                            <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="mt-1 w-full border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الوصف</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 w-full border-gray-300 rounded-md" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">نوع الخصم</label>
                                <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="mt-1 w-full border-gray-300 rounded-md">
                                    <option value="percentage">نسبة مئوية (%)</option>
                                    <option value="fixed">مبلغ ثابت (د.م.)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">قيمة الخصم</label>
                                <input type="number" step="0.01" value={discountValue} onChange={e => setDiscountValue(parseFloat(e.target.value))} className="mt-1 w-full border-gray-300 rounded-md" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">صالح من</label>
                                <input type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">صالح إلى</label>
                                <input type="date" value={validTo} onChange={e => setValidTo(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" required />
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

export default OfferModal;
