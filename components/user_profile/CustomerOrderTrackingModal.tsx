import React, { useState, useEffect } from 'react';
import type { PastOrder } from '../../types';
import OrderTrackingMap from '../OrderTrackingMap';
import ErrorDisplay from '../ErrorDisplay';
import StatusBadge from '../StatusBadge';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { db } from '../../scripts/firebase/firebaseConfig.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface CustomerOrderTrackingModalProps {
  order: PastOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_LOCATION = { lat: 33.9716, lng: -6.8498 }; // Mock Restaurant Location in Rabat

const CustomerOrderTrackingModal: React.FC<CustomerOrderTrackingModalProps> = ({ order, isOpen, onClose }) => {
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sourceLocation, setSourceLocation] = useState<({ lat: number; lng: number }) | null>(null);
  const { t } = useLanguage();

  const customerLocation = order?.deliveryAddress 
    ? { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }
    : null;
    
  useEffect(() => {
    if (!isOpen || !order) return;

    const fetchSourceLocation = async () => {
      // 1. Try to get location from the first product's category
      const categoryName = order.items?.[0]?.category;
      if (categoryName) {
        const catQuery = query(collection(db, 'categories'), where('name', '==', categoryName));
        const catSnapshot = await getDocs(catQuery);
        if (!catSnapshot.empty) {
          const catData = catSnapshot.docs[0].data();
          if (catData.location?.latitude && catData.location?.longitude) {
            setSourceLocation({ lat: catData.location.latitude, lng: catData.location.longitude });
            return;
          }
        }
      }

      // 2. Fallback to restaurant location
      const restQuery = query(collection(db, 'restaurants'), where('name', '==', order.restaurantName));
      const restSnapshot = await getDocs(restQuery);
      if (!restSnapshot.empty) {
        const restData = restSnapshot.docs[0].data();
        if (restData.location?.latitude && restData.location?.longitude) {
          setSourceLocation({ lat: restData.location.latitude, lng: restData.location.longitude });
          return;
        }
      }

      // 3. Final fallback to default location
      setSourceLocation(DEFAULT_LOCATION);
    };

    fetchSourceLocation();
  }, [isOpen, order]);


  useEffect(() => {
    if (!isOpen || !customerLocation || !order || !sourceLocation) {
      setDriverLocation(sourceLocation);
      return;
    }

    setDriverLocation(sourceLocation);
    
    let currentStep = 0;
    const totalSteps = 20; // Simulate the journey in 20 steps

    const interval = setInterval(() => {
        currentStep++;
        if (currentStep > totalSteps) {
            clearInterval(interval);
            setDriverLocation(customerLocation); // End at destination
            return;
        }

        const fraction = currentStep / totalSteps;
        const newLat = sourceLocation.lat + (customerLocation.lat - sourceLocation.lat) * fraction;
        const newLng = sourceLocation.lng + (customerLocation.lng - sourceLocation.lng) * fraction;

        setDriverLocation({ lat: newLat, lng: newLng });
        
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);

  }, [isOpen, order, customerLocation, sourceLocation]);

  if (!isOpen || !order) return null;

  const etaRangeStart = 10;
  const etaRangeEnd = 15;
  const etaDisplay = t('etaCustomerValue', { start: etaRangeStart.toString(), end: etaRangeEnd.toString() });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{t('trackOrderTitle')}</h2>
            <p className="text-sm text-blue-600 font-semibold">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        {!customerLocation || !sourceLocation ? (
            <div className="p-6">
                {!sourceLocation && <div className="animate-pulse">جاري تحديد موقع الانطلاق...</div>}
                {!customerLocation && <ErrorDisplay message={t('noLocationDataForTracking')} />}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-2 h-96 md:h-auto">
                    <OrderTrackingMap 
                        driverLocation={driverLocation}
                        restaurantLocation={sourceLocation}
                        customerLocation={customerLocation}
                    />
                </div>
                <div className="p-6 space-y-4 border-r">
                    <h3 className="font-bold text-lg border-b pb-2">{t('deliveryDetails')}</h3>
                    <div>
                        <p className="text-sm text-gray-500">{t('currentOrderStatus')}</p>
                        <StatusBadge status={order.status} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{t('etaCustomer')}</p>
                        <p className="font-bold text-xl text-blue-600">{etaDisplay}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{t('deliveryDestination')}</p>
                        <p className="font-semibold">{order.deliveryAddress?.addressText}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">{t('restaurant')}</p>
                        <p className="font-semibold">{order.restaurantName}</p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrderTrackingModal;