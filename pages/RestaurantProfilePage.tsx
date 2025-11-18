


import React, { useState, useEffect } from 'react';
import type { Restaurant, Product, CartItem, CustomerPage, Review } from '../types.ts';
import RestaurantHeader from '../components/restaurant_profile/RestaurantHeader.tsx';
import Menu from '../components/restaurant_profile/Menu.tsx';
import Reviews from '../components/restaurant_profile/Reviews.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
// FIX: Import `useLanguage` hook to handle translatable fields.
import { useLanguage } from '../contexts/LanguageContext.tsx';


const mockReviews: Review[] = [];

interface RestaurantProfilePageProps {
    restaurantId: string;
    onBack: () => void;
    onAddToCart: (item: CartItem) => void;
    setCustomerPage: (page: CustomerPage) => void;
    onProductClick: (product: Product) => void;
    cartItems: CartItem[];
}

const RestaurantProfilePage: React.FC<RestaurantProfilePageProps> = ({ restaurantId, onBack, cartItems, onAddToCart, setCustomerPage, onProductClick }) => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menu, setMenu] = useState<{ [key: string]: Product[] }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { translateField } = useLanguage();

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        // Fetch restaurant details
        const fetchRestaurant = async () => {
            try {
                const restaurantRef = doc(db, "restaurants", restaurantId);
                const docSnap = await getDoc(restaurantRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Fix: Explicitly typing the fetchedRestaurant object as Restaurant resolves the type
                    // inference issue where `status` was being treated as a generic `string` instead of `RestaurantStatus`.
                    const fetchedRestaurant: Restaurant = {
                        id: docSnap.id,
                        name: data.name || 'اسم غير معروف',
                        logo: data.logoUrl || 'https://i.pravatar.cc/150?img=21',
                        cuisine: data.cuisineType || 'متنوع',
                        status: 'مفتوح',
                        rating: data.rating || 4.5,
                        totalOrders: data.totalOrders || 0,
                        commissionRate: data.commissionRate || 15,
                        coverImage: data.coverPhotoUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop',
                    };
                    setRestaurant(fetchedRestaurant);
                } else {
                   throw new Error("لم يتم العثور على المطعم.");
                }
            } catch (err) {
                console.error("Error fetching restaurant details:", err);
                setError("حدث خطأ أثناء تحميل بيانات المطعم.");
                setIsLoading(false);
            }
        };

        fetchRestaurant();
    }, [restaurantId]);

    useEffect(() => {
        if (!restaurant) return;

        // Fetch menu once restaurant details are loaded
        const restaurantNameStr = translateField(restaurant.name);
        const productsQuery = query(collection(db, "products"), where("restaurantName", "==", restaurantNameStr));

        const unsubscribe = onSnapshot(productsQuery, (querySnapshot) => {
            const fetchedProducts: Product[] = querySnapshot.docs.map(doc => {
                 const data = doc.data();
                 return {
                    id: doc.id,
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    image: data.imageUrl,
                    category: data.category,
                    options: data.options || [], // Fetch options
                    restaurant: restaurantNameStr,
                 };
            });
            
            const groupedMenu = fetchedProducts.reduce((acc, product) => {
                // FIX: Convert TranslatableString to string before using as an index.
                const category = translateField(product.category) || 'متنوع';
                if (!acc[category]) acc[category] = [];
                acc[category].push(product);
                return acc;
            }, {} as { [key: string]: Product[] });

            setMenu(groupedMenu);
            setIsLoading(false);

        }, (err) => {
            console.error("Error fetching menu:", err);
            setError("لم نتمكن من تحميل قائمة الطعام.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [restaurant, translateField]);
    
    if (isLoading) {
        return <div className="pt-20"><LoadingSpinner /></div>;
    }

    if (error || !restaurant) {
        return <div className="pt-20"><ErrorDisplay message={error || "لم يتم العثور على المطعم."} /></div>;
    }

    return (
        <div className="bg-gray-50 pb-32">
            <RestaurantHeader 
                name={restaurant.name}
                cuisine={restaurant.cuisine}
                rating={restaurant.rating}
                reviewsCount={mockReviews.length}
                coverImage={restaurant.coverImage || ''}
                logo={restaurant.logo}
                onBack={onBack}
            />
            
            <div className="max-w-4xl mx-auto px-4">
                <Menu menu={menu} onProductClick={onProductClick} />
                <Reviews reviews={mockReviews} />
            </div>

            {/* FloatingCart is now rendered globally in App.tsx */}
        </div>
    );
};

export default RestaurantProfilePage;