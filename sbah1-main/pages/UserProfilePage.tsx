

import React, { useState } from 'react';
import ProfileSettings from '../components/user_profile/ProfileSettings.tsx';
import OrderHistory from '../components/user_profile/OrderHistory.tsx';
import SavedAddresses from '../components/user_profile/SavedAddresses.tsx';
import Rewards from '../components/user_profile/Rewards.tsx';
import type { UserProfileData, PastOrder, SavedAddress } from '../types.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

type ProfileTab = 'profile' | 'orders' | 'addresses' | 'rewards';

interface UserProfilePageProps {
    user: UserProfileData | null;
    orders: PastOrder[];
    addresses: SavedAddress[];
    isLoading: boolean;
    onUpdateProfile: (data: Omit<UserProfileData, 'id' | 'avatarUrl'>) => Promise<void>;
    onSaveAddress: (address: SavedAddress) => Promise<void>;
    onDeleteAddress: (id: string) => Promise<void>;
    onTrackOrder: (order: PastOrder) => void;
    deferredInstallPrompt: any;
    onInstallApp: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
    user,
    orders,
    addresses,
    isLoading,
    onUpdateProfile,
    onSaveAddress,
    onDeleteAddress,
    onTrackOrder,
    deferredInstallPrompt,
    onInstallApp
}) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
    const { t } = useLanguage();

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
        }
        
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings 
                            user={user} 
                            onSave={onUpdateProfile} 
                            deferredInstallPrompt={deferredInstallPrompt}
                            onInstallApp={onInstallApp}
                        />;
            case 'orders':
                return <OrderHistory orders={orders} onTrackOrder={onTrackOrder} />;
            case 'addresses':
                return <SavedAddresses addresses={addresses} onSave={onSaveAddress} onDelete={onDeleteAddress} />;
            case 'rewards':
                return <Rewards />;
            default:
                return <ProfileSettings 
                            user={user} 
                            onSave={onUpdateProfile} 
                            deferredInstallPrompt={deferredInstallPrompt}
                            onInstallApp={onInstallApp}
                        />;
        }
    };
    
    const tabs: {id: ProfileTab, label: string}[] = [
        {id: 'profile', label: t('profileSettings')},
        {id: 'orders', label: t('orderHistory')},
        {id: 'addresses', label: t('savedAddresses')},
        {id: 'rewards', label: t('rewardsAndPoints')},
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
                <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-right group rounded-md px-3 py-2 flex items-center text-sm font-medium ${
                                    activeTab === tab.id
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="truncate">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;