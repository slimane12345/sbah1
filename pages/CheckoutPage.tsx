

import React, { useState, useEffect } from 'react';
import type { CartItem, UserLocation, UserProfileData, AppSettings, PastOrder } from '../types';
import OrderSummary from '../components/checkout/OrderSummary';
import AddressSelection from '../components/checkout/AddressSelection';
import PaymentMethods from '../components/checkout/PaymentMethods';
import CustomerInfo from '../components/checkout/CustomerInfo';
import OrderTracker from '../components/checkout/OrderTracker';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, addDoc, Timestamp, query, where, getDocs, limit } from 'firebase/firestore';

interface CheckoutPageProps {
    cartItems: CartItem[];
    onClearCart: () => void;
    userLocation: UserLocation | null;
    onOpenLocationModal: () => void;
    userProfile: UserProfileData | null;
    appSettings: AppSettings | null;
}

// Helper to calculate distance
function calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((loc1.lat * Math.PI) / 180) * Math.cos((loc2.lat * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, onClearCart, userLocation, onOpenLocationModal, userProfile, appSettings }) => {
    const { t } = useLanguage();
    
    // State for user inputs
    const [name, setName] = useState(userProfile?.fullName || '');
    const [phone, setPhone] = useState(userProfile?.phone || '');
    const [addressDetails, setAddressDetails] = useState('');
    const [selectedMethod, setSelectedMethod] = useState<'cod' | 'card' | null>(null);
    
    // State for order processing
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState('');
    const [placedOrder, setPlacedOrder] = useState<PastOrder | null>(null);

    // New state for dynamic fees and location
    const [deliveryFee, setDeliveryFee] = useState(appSettings?.delivery?.baseFee ?? 5);
    const [restaurantLocation, setRestaurantLocation] = useState<{lat: number, lng: number} | null>(null);

    // Populate user info from profile
    useEffect(() => {
        if (userProfile) {
            setName(userProfile.fullName);
            setPhone(userProfile.phone);
        }
    }, [userProfile]);

    // Effect to calculate delivery fee dynamically
    useEffect(() => {
        const calculateAndSetFee = async () => {
            const deliverySettings = appSettings?.delivery;
            if (!deliverySettings || !userLocation || cartItems.length === 0) {
                setDeliveryFee(deliverySettings?.baseFee ?? 5);
                return;
            }

            const restaurantName = cartItems[0].product.restaurant;
            if (!restaurantName) return;

            let restLoc: {lat: number, lng: number} | null = null;
            try {
                const restQuery = query(collection(db, 'restaurants'), where('name', '==', restaurantName), limit(1));
                const restSnapshot = await getDocs(restQuery);
                if (!restSnapshot.empty) {
                    const restData = restSnapshot.docs[0].data();
                    if (restData.location) {
                        restLoc = {
                            lat: restData.location.latitude,
                            lng: restData.location.longitude
                        };
                        setRestaurantLocation(restLoc);
                    }
                }
            } catch (e) {
                console.error("Error fetching restaurant location for fee calc:", e);
                setDeliveryFee(deliverySettings.baseFee);
                return;
            }

            if (!restLoc) {
                setDeliveryFee(deliverySettings.baseFee);
                return;
            }

            const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

            if (deliverySettings.freeDeliveryMinimum > 0 && subtotal >= deliverySettings.freeDeliveryMinimum) {
                setDeliveryFee(0);
                return;
            }

            const distance = calculateDistance(restLoc, { lat: userLocation.lat, lng: userLocation.lng });
            const calculatedFee = deliverySettings.baseFee + (distance * deliverySettings.kmFee);
            setDeliveryFee(Math.round(calculatedFee * 100) / 100);
        };

        calculateAndSetFee();
    }, [cartItems, userLocation, appSettings]);


    const handlePlaceOrder = async () => {
        setError('');
        
        // Validation
        if (cartItems.length === 0) {
            setError(t('emptyCartError'));
            return;
        }
        if (!userLocation) {
            setError(t('noAddressError'));
            return;
        }
        if (!name.trim() || !phone.trim()) {
            setError(t('customerInfoError'));
            return;
        }
        if (!selectedMethod) {
            setError(t('paymentMethodError'));
            return;
        }

        setIsPlacingOrder(true);

        try {
            const restaurantName = cartItems[0]?.product.restaurant;
            if (!restaurantName) {
                throw new Error('Restaurant information is missing from the cart.');
            }

            const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
            const total = subtotal + deliveryFee;

            const newOrder = {
                customerId: userProfile?.id || 'mock_customer_id',
                customerName: name,
                customerAvatar: userProfile?.avatarUrl || null,
                restaurantName: restaurantName,
                items: cartItems.map(item => ({
                    productName: item.product.name,
                    quantity: item.quantity,
                    unitPrice: item.product.price,
                    options: Object.values(item.selectedOptions).flat().filter(Boolean).map((opt: any) => opt.name),
                    category: item.product.category,
                })),
                finalAmount: total,
                deliveryAddress: {
                    addressText: `${userLocation.address}, ${addressDetails}`,
                    latitude: userLocation.lat,
                    longitude: userLocation.lng,
                },
                paymentMethod: selectedMethod === 'cod' ? 'cash' : 'credit_card',
                paymentStatus: selectedMethod === 'cod' ? 'pending' : 'paid',
                status: 'pending',
                orderNumber: `SBH-${Date.now().toString().slice(-6)}`,
                createdAt: Timestamp.now(),
                driverId: null,
                restaurantLocation: restaurantLocation, 
            };

            await addDoc(collection(db, 'orders'), newOrder);
            
            // FIX: Correctly map items to match PastOrder type
            const orderForTracker: PastOrder = {
                id: newOrder.orderNumber,
                restaurantName: newOrder.restaurantName,
                date: newOrder.createdAt.toDate().toLocaleDateString('ar-SA'),
                total: newOrder.finalAmount,
                status: 'جديد',
                items: newOrder.items.map(item => ({ name: item.productName, quantity: item.quantity, category: item.category })),
                deliveryAddress: newOrder.deliveryAddress,
            };

            setPlacedOrder(orderForTracker);
            onClearCart();
        } catch (e: any) {
            console.error("Error placing order: ", e);
            setError(e.message || t('placeOrderFailedError'));
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (placedOrder) {
        return <OrderTracker order={{
            orderNumber: placedOrder.id,
            deliveryAddress: { addressText: placedOrder.deliveryAddress.addressText },
        }} />;
    }

    return (
        <div className="bg-gray-100 py-12 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Order details */}
                    <div className="lg:col-span-2 space-y-6">
                        <CustomerInfo name={name} phone={phone} setName={setName} setPhone={setPhone} />
                        <AddressSelection 
                            userLocation={userLocation} 
                            onOpenLocationModal={onOpenLocationModal}
                            addressDetails={addressDetails}
                            setAddressDetails={setAddressDetails}
                        />
                        <PaymentMethods 
                            selectedMethod={selectedMethod} 
                            setSelectedMethod={setSelectedMethod}
                            settings={appSettings?.payment ?? null}
                        />
                         {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
                    </div>

                    {/* Right Column: Order summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary 
                            cartItems={cartItems} 
                            onPlaceOrder={handlePlaceOrder}
                            isPlacingOrder={isPlacingOrder}
                            deliveryFee={deliveryFee}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;