import React, { useEffect, useRef } from 'react';

// Declare Leaflet to be globally available
declare const L: any;

interface Location {
    lat: number;
    lng: number;
}

interface OrderTrackingMapProps {
    driverLocation: Location | null;
    restaurantLocation: Location;
    customerLocation: Location;
}

const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({ driverLocation, restaurantLocation, customerLocation }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const driverMarker = useRef<any>(null);
    
    // Define custom icons
    const driverIcon = L.divIcon({
        html: `
            <div class="p-1 bg-white rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-blue-600 transform rotate-90">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
            </div>
        `,
        className: 'leaflet-div-icon-custom',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });

    const restaurantIcon = L.divIcon({
        html: `<div class="p-1 bg-white rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-red-600"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg></div>`,
        className: 'leaflet-div-icon-custom',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
    
    const customerIcon = L.divIcon({
         html: `<div class="p-1 bg-white rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-green-600"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 19l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg></div>`,
        className: 'leaflet-div-icon-custom',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });


    // Effect for one-time map and static marker setup
    useEffect(() => {
        if (!mapContainerRef.current || mapInstance.current) return;

        mapInstance.current = L.map(mapContainerRef.current);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
        }).addTo(mapInstance.current);

        // Add static markers
        L.marker([restaurantLocation.lat, restaurantLocation.lng], { icon: restaurantIcon }).addTo(mapInstance.current).bindPopup('المطعم');
        L.marker([customerLocation.lat, customerLocation.lng], { icon: customerIcon }).addTo(mapInstance.current).bindPopup('العميل');

        // Create driver marker
        driverMarker.current = L.marker([restaurantLocation.lat, restaurantLocation.lng], { icon: driverIcon }).addTo(mapInstance.current).bindPopup('المندوب');

        // Fit map to show both points, with padding
        const bounds = L.latLngBounds([restaurantLocation, customerLocation]);
        mapInstance.current.fitBounds(bounds.pad(0.2));

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [restaurantLocation, customerLocation]);

    // Effect to update the driver's position
    useEffect(() => {
        if (driverLocation && driverMarker.current && mapInstance.current) {
            driverMarker.current.setLatLng([driverLocation.lat, driverLocation.lng]);
            // Optional: Pan the map to follow the driver
            // mapInstance.current.panTo([driverLocation.lat, driverLocation.lng]);
        }
    }, [driverLocation]);

    return <div ref={mapContainerRef} className="w-full h-full z-0" />;
};

export default OrderTrackingMap;