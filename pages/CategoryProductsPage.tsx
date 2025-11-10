
import React, { useState, useEffect } from 'react';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import type { Product } from '../types.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import ProductCard from '../components/restaurant_profile/ProductCard.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface CategoryProductsPageProps {
    categoryName: string;
    onBack: () => void;
    onProductClick: (product: Product) => void;
}

const CategoryProductsPage: React.FC<CategoryProductsPageProps> = ({ categoryName, onBack, onProductClick }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Fix: Destructure translateField to handle translatable strings.
    const { t, translateField } = useLanguage();

    useEffect(() => {
        setIsLoading(true);
        // This query is tricky because category name is now an object.
        // Firestore doesn't support querying nested object keys directly like `where("category.ar", "==", categoryName)`.
        // A better data model would use a category ID.
        // For now, we fetch all products and filter client-side, which is inefficient but works for this structure.
        const productsQuery = query(collection(db, "products"));

        const unsubscribe = onSnapshot(productsQuery, (querySnapshot) => {
            const fetchedProducts: Product[] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                // Fix: Use translateField to correctly get the category name string for comparison.
                const productCategory = translateField(data.category); // Check object then string
                if (productCategory === categoryName) {
                     fetchedProducts.push({
                        id: doc.id,
                        name: data.name,
                        price: data.price,
                        description: data.description,
                        image: data.imageUrl,
                        category: data.category,
                        options: data.options || [],
                        restaurant: data.restaurantName || 'مطعم غير معروف',
                    });
                }
            });
            setProducts(fetchedProducts);
            setIsLoading(false);
        }, (err) => {
            console.error(`Error fetching products for category ${categoryName}:`, err);
            setError("لم نتمكن من تحميل المنتجات لهذه الفئة.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    // Fix: Add translateField to the dependency array.
    }, [categoryName, translateField]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="ml-4 p-2 rounded-full hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900">{categoryName}</h1>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <ErrorDisplay message={error} />
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-600">{t('noProductsInCategory')}</p>
                </div>
            )}
        </div>
    );
};

export default CategoryProductsPage;
