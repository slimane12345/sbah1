import React, { useState, useEffect, useRef } from 'react';
import type { RestaurantManagementData } from '../types';

declare const L: any; // Make Leaflet globally available for TypeScript

interface RestaurantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any, id: string | null) => void;
    isSubmitting: boolean;
    restaurant: RestaurantManagementData | null;
}

const RestaurantModal: React.FC<RestaurantModalProps> = ({ isOpen, onClose, onSave, isSubmitting, restaurant }) => {
    const [name, setName] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerPhone, setOwnerPhone] = useState('');
    const [location, setLocation] = useState<{ latitude: number; longitude: number; addressText: string } | null>(null);
    const [coverPhotoUrl, setCoverPhotoUrl] = useState('');

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerInstance = useRef<any>(null);
    
    useEffect(() => {
        if (isOpen) {
            if (restaurant) {
                setName(restaurant.name || '');
                setCuisine(restaurant.cuisine || '');
                setOwnerName(restaurant.ownerName);
                setOwnerEmail(restaurant.ownerEmail);
                setOwnerPhone(restaurant.ownerPhone || '');
                setLocation(restaurant.location || null);
                setCoverPhotoUrl(restaurant.coverPhotoUrl || '');
            } else {
                setName('');
                setCuisine('');
                setOwnerName('');
                setOwnerEmail('');
                setOwnerPhone('');
                setLocation(null);
                setCoverPhotoUrl('');
            }
        }
    }, [restaurant, isOpen]);

    const updateAddressFromCoords = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            const addressText = data.display_name || "لا يمكن تحديد العنوان";
            setLocation({ latitude: lat, longitude: lng, addressText });
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            setLocation({ latitude: lat, longitude: lng, addressText: "خطأ في جلب العنوان" });
        }
    };

    useEffect(() => {
        if (!isOpen) {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markerInstance.current = null;
            }
            return;
        }

        const timer = setTimeout(() => {
            if (mapContainerRef.current && !mapInstance.current) {
                const initialCoords: [number, number] = restaurant?.location 
                    ? [restaurant.location.latitude, restaurant.location.longitude] 
                    : [33.9716, -6.8498];

                const map = L.map(mapContainerRef.current).setView(initialCoords, 13);
                mapInstance.current = map;

                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri'
                }).addTo(map);

                const marker = L.marker(initialCoords, { draggable: true }).addTo(map);
                markerInstance.current = marker;

                marker.on('dragend', (e: any) => {
                    const { lat, lng } = e.target.getLatLng();
                    updateAddressFromCoords(lat, lng);
                });
                
                if (!restaurant) {
                     map.locate({ setView: true, maxZoom: 16 });
                     map.on('locationfound', (e: any) => {
                        marker.setLatLng(e.latlng);
                        updateAddressFromCoords(e.latlng.lat, e.latlng.lng);
                    });
                }
            } else if (mapInstance.current) {
                 mapInstance.current.invalidateSize();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [isOpen, restaurant]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSave(
            { name, ownerName, ownerEmail, ownerPhone, coverPhotoUrl, location: location || undefined, cuisine },
            restaurant ? restaurant.id : null
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{restaurant ? 'تعديل معلومات المطعم' : 'إضافة مطعم جديد'}</h2>
                    </div>

                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">اسم المطعم</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">نوع المطبخ</label>
                                <input type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="coverPhotoUrl" className="block text-sm font-medium text-gray-700">رابط الصورة الأساسية</label>
                            <input
                                type="url"
                                id="coverPhotoUrl"
                                value={coverPhotoUrl}
                                onChange={(e) => setCoverPhotoUrl(e.target.value)}
                                className="mt-1 w-full border-gray-300 rounded-md"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className="border-t pt-4">
                            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">اسم المالك</label>
                            <input type="text" id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">البريد الإلكتروني للمالك</label>
                                <input type="email" id="ownerEmail" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700">رقم هاتف المالك</label>
                                <input type="tel" id="ownerPhone" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">الموقع الجغرافي للمطعم</label>
                            <div ref={mapContainerRef} className="h-64 w-full rounded-md mt-1 z-0"></div>
                        </div>
                        <div>
                            <label htmlFor="manualAddress" className="block text-sm font-medium text-gray-700">العنوان (يدوي)</label>
                            <input
                                type="text"
                                id="manualAddress"
                                value={location?.addressText || ''}
                                onChange={(e) => setLocation(prev => prev ? { ...prev, addressText: e.target.value } : null)}
                                className="mt-1 w-full border-gray-300 rounded-md"
                                placeholder="اسحب العلامة على الخريطة أو أدخل العنوان هنا"
                            />
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

export default RestaurantModal;