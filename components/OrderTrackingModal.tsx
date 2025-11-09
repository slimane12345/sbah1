import React, { useState, useEffect } from 'react';
import type { OrderManagementData } from '../types';
import OrderTrackingMap from './OrderTrackingMap';
import ErrorDisplay from './ErrorDisplay';
import { db } from '../firebase/firebaseConfig.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface OrderTrackingModalProps {
  order: OrderManagementData | null;
  onClose: () => void;
}

const DEFAULT_LOCATION = { lat: 33.9716, lng: -6.8498 }; // Default to Rabat

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
  const [driverLocation, setDriverLocation] = useState<({ lat: number; lng: number }) | null>(null);
  const [sourceLocation, setSourceLocation] = useState<({ lat: number; lng: number }) | null>(null);

  useEffect(() => {
    if (!order) return;

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
      const restQuery = query(collection(db, 'restaurants'), where('name', '==', order.restaurant));
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
  }, [order]);

  const customerLocation = order?.deliveryAddress 
    ? { lat: order.deliveryAddress.latitude, lng: order.deliveryAddress.longitude }
    : null;

  // Simulate driver movement from source to customer
  useEffect(() => {
    if (!customerLocation || !order || !sourceLocation) {
        setDriverLocation(sourceLocation);
        return;
    };

    setDriverLocation(sourceLocation);
    
    let currentStep = 0;
    const totalSteps = 20; // Simulate the journey in 20 steps

    const interval = setInterval(() => {
        currentStep++;
        if (currentStep > totalSteps) {
            clearInterval(interval);
            setDriverLocation(customerLocation); // Ensure it ends exactly at the destination
            return;
        }

        const fraction = currentStep / totalSteps;
        const newLat = sourceLocation.lat + (customerLocation.lat - sourceLocation.lat) * fraction;
        const newLng = sourceLocation.lng + (customerLocation.lng - sourceLocation.lng) * fraction;

        setDriverLocation({ lat: newLat, lng: newLng });
        
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);

  }, [order, customerLocation, sourceLocation]);

  if (!order) return null;

   if (!customerLocation || !sourceLocation) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 p-6" onClick={e => e.stopPropagation()}>
                {!sourceLocation && <div className="animate-pulse">جاري تحديد موقع الانطلاق...</div>}
                {!customerLocation && <ErrorDisplay message="لا توجد بيانات موقع للعميل في هذا الطلب." />}
                <div className="mt-4 text-left">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">إغلاق</button>
                </div>
            </div>
        </div>
    );
  }

  const courier = order.courier || { name: 'مندوب غير معين', avatar: 'https://i.pravatar.cc/150' };
  const eta = '15 دقيقة';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-800">تتبع الطلب: {order.orderNumber}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gray-100 rounded-lg h-96">
             <OrderTrackingMap 
                driverLocation={driverLocation}
                restaurantLocation={sourceLocation}
                customerLocation={customerLocation}
             />
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-b pb-2">تفاصيل التوصيل</h3>
            <div className="flex items-center">
              <img src={courier.avatar} alt={courier.name} className="h-12 w-12 rounded-full object-cover" />
              <div className="mr-3">
                <p className="font-semibold">{courier.name}</p>
                <p className="text-sm text-gray-500">مندوب التوصيل</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">الوقت المتوقع للوصول</p>
              <p className="font-bold text-2xl text-blue-600">{eta}</p>
            </div>
             <div>
              <p className="text-sm text-gray-500">حالة الطلب الحالية</p>
              <p className="font-semibold text-green-600">{order.status}</p>
            </div>
             <div>
              <p className="text-sm text-gray-500">وجهة التوصيل</p>
              <p className="font-semibold">{order.deliveryAddress?.addressText || 'العنوان غير متوفر'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
