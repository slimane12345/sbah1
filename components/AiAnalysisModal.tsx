import React from 'react';
import type { RestaurantManagementData, AiAnalysis } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface AiAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    restaurant: RestaurantManagementData | null;
    analysis: AiAnalysis | null;
    isLoading: boolean;
    error: string | null;
}

const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({ isOpen, onClose, restaurant, analysis, isLoading, error }) => {
    if (!isOpen || !restaurant) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">تحليل الأداء بواسطة Gemini</h2>
                            <p className="text-sm text-gray-600">لـ: {restaurant.name}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>
                    
                    <div className="mt-4 border-t pt-4 max-h-[60vh] overflow-y-auto pr-2">
                        {isLoading && (
                           <div className="flex flex-col items-center justify-center p-8">
                                <LoadingSpinner />
                                <p className="mt-4 text-gray-600">...جاري تحليل البيانات باستخدام Gemini</p>
                           </div>
                        )}
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                <p className="font-bold">حدث خطأ</p>
                                <p>{error}</p>
                            </div>
                        )}
                        {analysis && !isLoading && (
                            <div className="space-y-6 text-gray-700">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">📄 ملخص التحليل</h3>
                                    <p className="text-sm bg-gray-50 p-3 rounded-md">{analysis.summary}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-green-700 mb-2">👍 نقاط القوة</h3>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {analysis.strengths.map((item, index) => <li key={index}>{item}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-red-700 mb-2">👎 نقاط الضعف</h3>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {analysis.weaknesses.map((item, index) => <li key={index}>{item}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                 <div>
                                    <h3 className="text-lg font-bold text-blue-700 mb-2">💡 توصيات قابلة للتنفيذ</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {analysis.recommendations.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-end">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiAnalysisModal;
