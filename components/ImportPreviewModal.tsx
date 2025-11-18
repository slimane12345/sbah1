import React from 'react';
import type { ProductManagementData } from '../types';

interface ImportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: ProductManagementData[];
    isSubmitting: boolean;
}

const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({ isOpen, onClose, onConfirm, data, isSubmitting }) => {
    if (!isOpen) return null;

    // This logic assumes products from CSV with an ID are updates. A more robust check would involve
    // cross-referencing with existing product IDs from Firestore state.
    const newCount = data.filter(p => !p.id).length;
    const updateCount = data.length - newCount;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl m-4 h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">تأكيد الاستيراد</h2>
                    <p className="text-sm text-gray-600">
                        تم العثور على {data.length} منتج في الملف. 
                        ({newCount} منتج جديد، {updateCount} تحديث لمنتجات حالية).
                        هل ترغب في المتابعة؟
                    </p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <h3 className="font-semibold mb-2">معاينة أول 10 عناصر:</h3>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-right">الاسم</th>
                                    <th className="px-4 py-2 text-right">المطعم</th>
                                    <th className="px-4 py-2 text-right">السعر</th>
                                    <th className="px-4 py-2 text-right">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 10).map((product, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">{product.name}</td>
                                        <td className="px-4 py-2">{product.restaurant}</td>
                                        <td className="px-4 py-2">{product.price}</td>
                                        <td className="px-4 py-2">{product.id ? 'تحديث' : 'جديد'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">إلغاء</button>
                    <button type="button" onClick={onConfirm} disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isSubmitting ? 'جاري الاستيراد...' : 'تأكيد الاستيراد'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportPreviewModal;
