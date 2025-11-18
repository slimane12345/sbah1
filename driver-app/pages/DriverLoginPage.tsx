import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import { collection, query, where, getDocs, limit, addDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface DriverLoginPageProps {
    onLoginSuccess: (driverId: string) => void;
}

const DriverLoginPage: React.FC<DriverLoginPageProps> = ({ onLoginSuccess }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { t } = useLanguage();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const driversQuery = query(
                collection(db, "drivers"),
                where("name", "==", name.trim()),
                where("phone", "==", phone.trim()),
                limit(1)
            );

            const querySnapshot = await getDocs(driversQuery);

            if (querySnapshot.empty) {
                setError(t('loginFailed'));
            } else {
                const driverDoc = querySnapshot.docs[0];
                onLoginSuccess(driverDoc.id);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(t('loginFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const phoneQuery = query(collection(db, "drivers"), where("phone", "==", phone.trim()), limit(1));
            const phoneSnapshot = await getDocs(phoneQuery);
            if (!phoneSnapshot.empty) {
                setError(t('phoneExistsError'));
                setIsLoading(false);
                return;
            }

            const newDriverData = {
                name: name.trim(),
                phone: phone.trim(),
                vehicle: vehicle.trim(),
                licensePlate: licensePlate.trim(),
                status: 'غير متصل',
                rating: 5,
                totalDeliveries: 0,
                lastSeen: new Date().toISOString(),
                avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
            };

            const docRef = await addDoc(collection(db, "drivers"), newDriverData);
            onLoginSuccess(docRef.id);

        } catch (err) {
            console.error("Registration error:", err);
            setError(t('registrationFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const isLogin = mode === 'login';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100" dir={t('language') === 'ar' ? 'rtl' : 'ltr'}>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">{isLogin ? t('driverLoginTitle') : t('driverRegisterTitle')}</h1>
                    <p className="mt-2 text-sm text-gray-600">{isLogin ? t('driverLoginSubtitle') : t('driverRegisterSubtitle')}</p>
                </div>
                <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleRegister}>
                    <div>
                        <label htmlFor="name" className="sr-only">{t('name')}</label>
                        <input id="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 text-base border border-gray-300 rounded-md" placeholder={t('name')} />
                    </div>
                    <div>
                        <label htmlFor="phone" className="sr-only">{t('phone')}</label>
                        <input id="phone" type="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 text-base border border-gray-300 rounded-md" placeholder={t('phone')} />
                    </div>
                    
                    {!isLogin && (
                        <>
                            <div>
                                <label htmlFor="vehicle" className="sr-only">{t('vehicle')}</label>
                                <input id="vehicle" type="text" required value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="w-full px-4 py-2 text-base border border-gray-300 rounded-md" placeholder={t('vehicle')} />
                            </div>
                            <div>
                                <label htmlFor="licensePlate" className="sr-only">{t('licensePlate')}</label>
                                <input id="licensePlate" type="text" required value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} className="w-full px-4 py-2 text-base border border-gray-300 rounded-md" placeholder={t('licensePlate')} />
                            </div>
                        </>
                    )}

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400">
                            {isLoading ? (isLogin ? t('loggingIn') : t('registering')) : (isLogin ? t('login') : t('register'))}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); }} className="font-medium text-blue-600 hover:underline">
                        {isLogin ? t('switchToRegister') : t('switchToLogin')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DriverLoginPage;
