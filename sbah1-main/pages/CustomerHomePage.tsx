import React, { useState, useEffect } from 'react';
import type { Restaurant, HomePageSection, UserLocation, Product, Banner } from '../types.ts';
import Categories from '../components/customer_home/Categories.tsx';
import RestaurantList from '../components/customer_home/RestaurantList.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import LocationSelector from '../components/customer_home/LocationSelector.tsx';
import RecommendedProducts from '../components/customer_home/RecommendedProducts.tsx';
import SingleBannerDisplay from '../components/customer_home/SingleBannerDisplay.tsx';
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

    const [sections, setSections] = useState<HomePageSection[]>([]);
    const [topBanner, setTopBanner] = useState<Banner | null>(null);
    const [middleBanner, setMiddleBanner] = useState<Banner | null>(null);
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
                
                const enabledAndSortedSections = (data.sections as HomePageSection[] || [])
                    .filter(s => s.enabled)
                    .sort((a, b) => a.order - b.order);
                setSections(enabledAndSortedSections);
                setTopBanner(data.topBanner || null);
                setMiddleBanner(data.middleBanner || null);

            } else {
                 setSections([]);
                 setTopBanner(null);
                 setMiddleBanner(null);
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
            setRestaurantsError("لم نتمكن من تحميل المطاعم.");
            setIsLoadingRestaurants(false);
        });

        return () => unsubscribe();
    }, []);

    const renderSection = (section: HomePageSection) => {
        if (!section.enabled) return null;
        switch (section.id) {
            case 'categories':
                return (
                    <div key={section.id}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                        <Categories onNavigateToCategory={onNavigateToCategory} />
                    </div>
                );
            case 'recommended_products':
                return (
                    <div key={section.id}>
                        <RecommendedProducts
                            title={section.title}
                            onProductClick={onNavigateToProduct}
                            itemCount={section.itemCount}
                        />
                    </div>
                );
            case 'recommended_restaurants':
                return (
                    <div key={section.id}>
                        {isLoadingRestaurants ? <LoadingSpinner /> : restaurantsError ? <ErrorDisplay message={restaurantsError} /> : (
                            <RestaurantList title={section.title} restaurants={restaurants.slice(0, 4)} onRestaurantClick={onNavigateToRestaurant} />
                        )}
                    </div>
                );
            case 'all_restaurants':
                return (
                    <div key={section.id}>
                        {isLoadingRestaurants ? <LoadingSpinner /> : restaurantsError ? <ErrorDisplay message={restaurantsError} /> : (
                            <RestaurantList title={section.title} restaurants={restaurants} onRestaurantClick={onNavigateToRestaurant} />
                        )}
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-8">
                    <LocationSelector userLocation={userLocation} onOpenModal={onOpenLocationModal} isLoading={isLocationConfirming} />
                    
                    {isLoadingLayout ? (
                        <LoadingSpinner />
                    ) : layoutError ? (
                        <ErrorDisplay message={layoutError} />
                    ) : (
                        <>
                            {topBanner && topBanner.enabled && (
                                <SingleBannerDisplay banner={topBanner} onBannerClick={handleBannerClick} />
                            )}
    
                            {sections.map(section => {
                                const sectionComponent = renderSection(section);
    
                                if (section.id === 'recommended_products') {
                                    return (
                                        <React.Fragment key="products_and_middle_banner">
                                            {sectionComponent}
                                            {middleBanner && middleBanner.enabled && (
                                                <div className="pt-8">
                                                    <SingleBannerDisplay banner={middleBanner} onBannerClick={handleBannerClick} />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                }
    
                                return sectionComponent;
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerHomePage;