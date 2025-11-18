import React, { useState, useEffect, useRef } from 'react';
import type { CategoryManagementData } from '../types';

declare const L: any; // Make Leaflet globally available for TypeScript

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; image: string; location: { latitude: number; longitude: number; addressText: string; } | null }) => void;
    category: CategoryManagementData | null;
    isSubmitting: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, category, isSubmitting }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [location, setLocation] = useState<{ latitude: number; longitude: number; addressText: string } | null>(null);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerInstance = useRef<any>(null);

    useEffect(() => {
        setName(category?.name || '');
        setImage(category?.image || '');
        setLocation(category?.location || null);
    }, [category, isOpen]);
    
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
                const initialCoords: [number, number] = category?.location 
                    ? [category.location.latitude, category.location.longitude] 
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
                
                 if (!category?.location) {
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
    }, [isOpen, category]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, image, location });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{category ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">اسم الفئة</label>
                            <input
                                type="text"
                                id="categoryName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">رابط الصورة</label>
                            <input
                                type="url"
                                id="categoryImage"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الموقع الجغرافي للفئة (اختياري)</label>
                            <div ref={mapContainerRef} className="h-64 w-full rounded-md mt-1 z-0"></div>
                        </div>
                         <div>
                            <label htmlFor="manualAddress" className="block text-sm font-medium text-gray-700">العنوان</label>
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

export default CategoryModal;