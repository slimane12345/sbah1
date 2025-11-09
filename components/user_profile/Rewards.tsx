import React from 'react';

const Rewards: React.FC = () => {
    const points = 250;
    const pointsToNextTier = 500;
    const progress = (points / pointsToNextTier) * 100;
    
    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">النقاط والمكافآت</h3>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-blue-800">رصيدك الحالي من النقاط</p>
                    <p className="text-4xl font-bold text-blue-600">{points}</p>
                    <p className="text-xs text-blue-700">نقطة</p>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                        <span>المستوى الحالي: فضي</span>
                        <span>{pointsToNextTier - points} نقطة للمستوى الذهبي</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold">مكافآتك الحصرية</h4>
                    <ul className="mt-2 space-y-2 list-disc list-inside text-sm text-gray-600">
                        <li>خصم 10% على طلبك القادم.</li>
                        <li>توصيل مجاني على 3 طلبات.</li>
                        <li>حلوى مجانية من مطعم "سويت ديلايتس".</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Rewards;
