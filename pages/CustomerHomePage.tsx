

import React, { useState, useEffect } from 'react';
import type { Restaurant, HomePageSection, UserLocation, Product, Banner } from '../types.ts';
import Categories from '../components/customer_home/Categories.tsx';
import RestaurantList from '../components/customer_home/RestaurantList.tsx';
import RecommendedProducts from '../components/customer_home/RecommendedProducts.tsx';
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

    const [layout, setLayout] = useState<HomePageSection[]>([]);
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
    
    // Effect for fetching layout with real-time updates
    useEffect(() => {
        setIsLoadingLayout(true);
        const layoutDocRef = doc(db, 'layout_settings', 'home_page');
        
        const unsubscribe = onSnapshot(layoutDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const enabledAndSortedSections = (data.sections as HomePageSection[])
                    .filter(s => s.enabled)
                    .sort((a, b) => a.order - b.order);
                setLayout(enabledAndSortedSections);
                
                const enabledAndSortedBanners = (data.banners as Banner[])
                    .filter(b => b.enabled)
                    .sort((a, b) => a.order - b.order);
                setBanners(enabledAndSortedBanners);

            } else {
                // Fallback to default if no settings are found
                setLayout([
                    { id: 'banners', title: 'البانرات الإعلانية', enabled: true, order: 1 },
                    { id: 'categories', title: 'الفئات', enabled: true, order: 2 },
                    { id: 'recommended_products', title: 'منتجات موصى بها', enabled: true, order: 3 },
                    { id: 'recommended_restaurants', title: 'مطاعم موصى بها', enabled: true, order: 4 },
                    { id: 'all_restaurants', title: 'جميع المطاعم', enabled: true, order: 5 },
                ]);
                 setBanners([]); // No default banners if layout is not set
            }
            setIsLoadingLayout(false);
        }, (err) => {
            console.error("Layout listener error:", err);
            setLayoutError("خطأ في تحميل تصميم الصفحة.");
            setIsLoadingLayout(false);
        });

        // Cleanup listener on component unmount
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

    const renderSection = (section: HomePageSection) => {
        switch (section.id) {
            case 'banners':
                return <OffersCarousel key={section.id} banners={banners} onBannerClick={handleBannerClick} />;
            case 'categories':
                return <Categories key={section.id} title={section.title} onNavigateToCategory={onNavigateToCategory} />;
            case 'recommended_products':
                return <RecommendedProducts key={section.id} title={section.title} onProductClick={onNavigateToProduct} />;
            case 'recommended_restaurants':
                return (
                    <RestaurantList 
                        key={section.id}
                        title={section.title}
                        restaurants={restaurants.slice(0, 8)}
                        onRestaurantClick={onNavigateToRestaurant} 
                    />
                );
            case 'all_restaurants':
                 return (
                    <RestaurantList 
                        key={section.id}
                        title={section.title}
                        restaurants={restaurants} 
                        onRestaurantClick={onNavigateToRestaurant} 
                    />
                 );
            default:
                return null;
        }
    };

    if (isLoadingLayout) {
        return <LoadingSpinner />;
    }
    
    if (layoutError) {
        return <ErrorDisplay message={layoutError} />;
    }

    return (
        <div className="bg-transparent pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <LocationSelector 
                    userLocation={userLocation}
                    onOpenModal={onOpenLocationModal}
                    isLoading={isLocationConfirming}
                />
                <div className="space-y-6">
                   {layout.map(section => {
                       if ((section.id.includes('restaurant') || section.id.includes('products')) && isLoadingRestaurants) {
                           return <div key={section.id}><LoadingSpinner /></div>;
                       }
                       if ((section.id.includes('restaurant') || section.id.includes('products')) && restaurantsError) {
                           return <div key={section.id}><ErrorDisplay message={restaurantsError} /></div>;
                       }
                       return renderSection(section);
                   })}
                </div>
            </div>
        </div>
    );
};

export default CustomerHomePage;