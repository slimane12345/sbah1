import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Rewards: React.FC = () => {
    const { t } = useLanguage();
    const points = 250;
    const pointsToNextTier = 500;
    const progress = (points / pointsToNextTier) * 100;
    
    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t('rewardsAndPoints')}</h3>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-blue-800">{t('yourCurrentPoints')}</p>
                    <p className="text-4xl font-bold text-blue-600">{points}</p>
                    <p className="text-xs text-blue-700">{t('point')}</p>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                        <span>{t('currentLevel', { level: t('silver') })}</span>
                        <span>{t('pointsToNextLevel', { points: (pointsToNextTier - points).toString(), level: t('gold') })}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold">{t('yourExclusiveRewards')}</h4>
                    <ul className="mt-2 space-y-2 list-disc list-inside text-sm text-gray-600">
                        <li>{t('reward1')}</li>
                        <li>{t('reward2')}</li>
                        <li>{t('reward3')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Rewards;