import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

// Declare Leaflet global to satisfy TypeScript
declare const L: any;

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (coords: { lat: number; lng: number }) => void;
    isConfirming: boolean;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onConfirm, isConfirming }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerInstance = useRef<any>(null);
    const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
    const { t } = useLanguage();
    
    useEffect(() => {
        if (isOpen && mapContainerRef.current && !mapInstance.current) {
            const defaultPosition: [number, number] = [33.9716, -6.8498]; // Default to Rabat
            
            const map = L.map(mapContainerRef.current).setView(defaultPosition, 13);
            mapInstance.current = map;
            
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            }).addTo(map);
            
            const marker = L.marker(defaultPosition, { draggable: true }).addTo(map);
            markerInstance.current = marker;
            setSelectedCoords(marker.getLatLng());

            marker.on('dragend', (e: any) => {
                setSelectedCoords(e.target.getLatLng());
            });

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLatLng: [number, number] = [position.coords.latitude, position.coords.longitude];
                    map.setView(userLatLng, 16);
                    marker.setLatLng(userLatLng);
                    setSelectedCoords(marker.getLatLng());
                },
                (error) => console.warn("Could not get user location:", error.message)
            );
        }
        
        // Invalidate map size when modal opens to fix tile loading issues
        if (isOpen && mapInstance.current) {
             setTimeout(() => {
                mapInstance.current.invalidateSize();
            }, 10);
        }

    }, [isOpen]);

    const handleConfirm = () => {
        if (selectedCoords) {
            onConfirm(selectedCoords);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose} dir={t('language') === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">{t('selectLocationTitle')}</h2>
                </div>
                <div className="p-6">
                    <div ref={mapContainerRef} className="h-96 w-full rounded-lg z-0"></div>
                     <input 
                        type="text" 
                        id="manualAddress" 
                        placeholder={t('manualAddressPlaceholder')}
                        className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
                    <button onClick={onClose} disabled={isConfirming} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition hover:scale-105">
                        {t('cancel')}
                    </button>
                    <button onClick={handleConfirm} disabled={isConfirming} className="btn-customer-primary py-2 px-6">
                        {isConfirming ? t('confirmingLocation') : t('confirmLocation')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;