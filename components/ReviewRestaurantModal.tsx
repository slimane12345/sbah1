import React from 'react';
import type { RestaurantManagementData } from '../types';

interface ReviewRestaurantModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurant: RestaurantManagementData;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    isSubmitting: boolean;
}

const ReviewRestaurantModal: React.FC<ReviewRestaurantModalProps> = ({ isOpen, onClose, restaurant, onApprove, onReject, isSubmitting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">مراجعة طلب انضمام مطعم</h2>
                    <p className="text-sm text-gray-500">مراجعة البيانات واتخاذ الإجراء المناسب.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <span className="font-semibold text-gray-600">اسم المطعم:</span>
                        <p className="text-gray-800">{restaurant.name}</p>
                    </div>
                     <div>
                        <span className="font-semibold text-gray-600">اسم المالك:</span>
                        <p className="text-gray-800">{restaurant.ownerName}</p>
                    </div>
                     <div>
                        <span className="font-semibold text-gray-600">البريد الإلكتروني للمالك:</span>
                        <p className="text-gray-800">{restaurant.ownerEmail}</p>
                    </div>
                     <div>
                        <span className="font-semibold text-gray-600">تاريخ الطلب:</span>
                        <p className="text-gray-800">{restaurant.joinDate}</p>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => onReject(restaurant.id)}
                        disabled={isSubmitting}
                        className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300"
                    >
                        {isSubmitting ? 'جاري الرفض...' : 'رفض'}
                    </button>
                    <button
                        type="button"
                        onClick={() => onApprove(restaurant.id)}
                        disabled={isSubmitting}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
                    >
                        {isSubmitting ? 'جاري القبول...' : 'قبول وتفعيل'}
                    </button>
                     <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewRestaurantModal;
