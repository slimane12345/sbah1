import React, { useState, useEffect } from 'react';
import type { Restaurant, HomePageSection, UserLocation, Product, Banner } from '../types.ts';
import Categories from '../components/customer_home/Categories.tsx';
import RestaurantList from '../components/customer_home/RestaurantList.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import LocationSelector from '../components/customer_home/LocationSelector.tsx';
import OffersCarousel from '../components/customer_home/OffersCarousel.tsx';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';


interface CustomerHomePageProps {
    onNavigateToRestaurant: (restaurantId: string) => void;
    onNavigateToCategory: (categoryName: string) => void;
    onNavigateToProduct: (product: Product) => void;
    userLocation: UserLocation | null;
    onOpenLocationModal: () => void;
    isLocationConfirming: boolean;
}

const CustomerHomePage: React.FC<CustomerHomePageProps> = ({ 
    onNavigateToRestaurant, 
    onNavigateToCategory,
    onNavigateToProduct,
    userLocation,
    onOpenLocationModal,
    isLocationConfirming
}) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
    const [restaurantsError, setRestaurantsError] = useState<string | null>(null);

    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoadingLayout, setIsLoadingLayout] = useState(true);
    const [layoutError, setLayoutError] = useState<string | null>(null);

    const handleBannerClick = (link: string) => {
        if (link.startsWith('/category/')) {
            const categoryName = link.replace('/category/', '');
            onNavigateToCategory(categoryName);
        } else if (link.startsWith('/restaurant/')) {
            const restaurantId = link.replace('/restaurant/', '');
            onNavigateToRestaurant(restaurantId);
        }
    };
    
    // Effect for fetching banners with real-time updates
    useEffect(() => {
        setIsLoadingLayout(true);
        const layoutDocRef = doc(db, 'layout_settings', 'home_page');
        
        const unsubscribe = onSnapshot(layoutDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const enabledAndSortedBanners = (data.banners as Banner[])
                    .filter(b => b.enabled)
                    .sort((a, b) => a.order - b.order);
                setBanners(enabledAndSortedBanners);
            } else {
                 setBanners([]); 
            }
            setIsLoadingLayout(false);
        }, (err) => {
            console.error("Layout listener error:", err);
            setLayoutError("خطأ في تحميل تصميم الصفحة.");
            setIsLoadingLayout(false);
        });

        return () => unsubscribe();
    }, []);

    // Effect for fetching restaurants
    useEffect(() => {
        setIsLoadingRestaurants(true);
        const restaurantsQuery = query(
            collection(db, "restaurants"), 
            where("approvalStatus", "==", "Approved"),
            where("isActive", "==", true)
        );

        const unsubscribe = onSnapshot(restaurantsQuery, (querySnapshot) => {
            const fetchedRestaurants: Restaurant[] = querySnapshot.docs.map(doc => {
                 const data = doc.data();
                 return {
                    id: doc.id,
                    name: data.name,
                    logo: data.logoUrl || 'https://i.pravatar.cc/150?img=21',
                    cuisine: data.cuisineType || 'متنوع',
                    status: 'مفتوح',
                    rating: data.rating || 4.5,
                    commissionRate: data.commissionRate || 15,
                    totalOrders: data.totalOrders || 0,
                    coverImage: data.coverPhotoUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop',
                 };
            });
            setRestaurants(fetchedRestaurants);
            setIsLoadingRestaurants(false);
        }, (err) => {
            console.error("Error fetching restaurants:", err);
            setRestaurantsError("لم نتمكن من العثور على مطاعم. يرجى المحاولة مرة أخرى.");
            setIsLoadingRestaurants(false);
        });
        
        return () => unsubscribe();
    }, []);

    const renderContent = () => {
        if (isLoadingRestaurants || isLoadingLayout) {
            return <LoadingSpinner />;
        }
        if (restaurantsError || layoutError) {
            return <ErrorDisplay message={restaurantsError || layoutError} />;
        }
        return (
            <div className="space-y-8">
                <OffersCarousel banners={banners} onBannerClick={handleBannerClick} />
                <Categories onNavigateToCategory={onNavigateToCategory} />
                <RestaurantList 
                    title="جميع المطاعم"
                    restaurants={restaurants} 
                    onRestaurantClick={onNavigateToRestaurant} 
                />
            </div>
        );
    };

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                 {/* Search Bar */}
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="ابحث عن المتاجر والمنتجات التي تريدها"
                        className="w-full bg-white border border-gray-300 rounded-lg py-3 pr-10 pl-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
                
                {/* Location Bar */}
                <LocationSelector 
                    userLocation={userLocation}
                    onOpenModal={onOpenLocationModal}
                    isLoading={isLocationConfirming}
                />

                {renderContent()}
            </div>
        </div>
    );
};

export default CustomerHomePage;