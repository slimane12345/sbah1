
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface CustomerInfoProps {
    name: string;
    phone: string;
    setName: (name: string) => void;
    setPhone: (phone: string) => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ name, phone, setName, setPhone }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{t('customerInfo')}</span>
            </h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 sr-only">{t('fullName')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            id="fullName" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            className="w-full pr-12 pl-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                            required 
                            placeholder={t('fullName')}
                        />
                    </div>
                </div>
                <div>
                     <label htmlFor="phone" className="block text-sm font-medium text-gray-700 sr-only">{t('phone')}</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </div>
                        <input 
                            type="tel" 
                            id="phone" 
                            value={phone} 
                            onChange={e => setPhone(e.target.value)} 
                            className="w-full pr-12 pl-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                            required 
                            placeholder={t('phone')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfo;
