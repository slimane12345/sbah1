import React, { useState, useEffect } from 'react';
import type { Driver } from '../types';

interface DriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (driverData: any, id: string | null) => void;
    driver: Driver | null;
    isSubmitting: boolean;
}

const DriverModal: React.FC<DriverModalProps> = ({ isOpen, onClose, onSave, driver, isSubmitting }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [ratePerKm, setRatePerKm] = useState(2);
    const [totalOrderValue, setTotalOrderValue] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);

    useEffect(() => {
        if (driver) {
            setName(driver.name);
            setPhone(driver.phone || '');
            setVehicle(driver.vehicle);
            setLicensePlate(driver.licensePlate);
            setRatePerKm(driver.ratePerKm ?? 2);
            setTotalOrderValue(driver.totalOrderValue ?? 0);
            setTotalEarnings(driver.totalEarnings ?? 0);
        } else {
            setName('');
            setPhone('');
            setVehicle('');
            setLicensePlate('');
            setRatePerKm(2);
            setTotalOrderValue(0);
            setTotalEarnings(0);
        }
    }, [driver, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, phone, vehicle, licensePlate, ratePerKm, totalOrderValue, totalEarnings }, driver ? driver.id : null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{driver ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">رقم الهاتف (مع رمز الدولة)</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" placeholder="+212612345678" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">المركبة</label>
                            <input type="text" value={vehicle} onChange={e => setVehicle(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" placeholder="مثال: Toyota Yaris 2021" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">رقم لوحة المركبة</label>
                            <input type="text" value={licensePlate} onChange={e => setLicensePlate(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">أرباح الكيلومتر (د.م.)</label>
                            <input 
                                type="number" 
                                step="0.1"
                                value={ratePerKm} 
                                onChange={e => setRatePerKm(parseFloat(e.target.value) || 0)} 
                                className="mt-1 w-full border-gray-300 rounded-md" 
                                required 
                            />
                        </div>
                        <div className="border-t pt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">إجمالي قيمة الطلبات (د.م.)</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={totalOrderValue} 
                                    onChange={e => setTotalOrderValue(parseFloat(e.target.value) || 0)} 
                                    className="mt-1 w-full border-gray-300 rounded-md" 
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">أرباحي (د.م.)</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={totalEarnings} 
                                    onChange={e => setTotalEarnings(parseFloat(e.target.value) || 0)} 
                                    className="mt-1 w-full border-gray-300 rounded-md" 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-white py-2 px-4 border rounded-md">إلغاء</button>
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                            {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DriverModal;