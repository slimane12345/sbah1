import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { db } from '../../scripts/firebase/firebaseConfig.js';
import { collection, query, where, limit, onSnapshot, orderBy } from 'firebase/firestore';
import LoadingSpinner from '../LoadingSpinner';
import ErrorDisplay from '../ErrorDisplay';
import ProductCard from '../restaurant_profile/ProductCard';

interface RecommendedProductsProps {
    title: string;
    onProductClick: (product: Product) => void;
    itemCount?: number;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ title, onProductClick, itemCount }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const productsQuery = query(
            collection(db, "products"), 
            where("isAvailable", "==", true),
            // orderBy("name"), // This requires a composite index. Removing to fix the error.
            limit(itemCount || 4)
        );

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
                    options: data.options || [],
                    restaurant: data.restaurantName || 'مطعم متنوع'
                 };
            });
            setProducts(fetchedProducts);
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching recommended products:", err);
            setError("لم نتمكن من تحميل المنتجات الموصى بها.");
            setIsLoading(false);
        });
        
        return () => unsubscribe();
    }, [itemCount]);

    if (isLoading) {
        return <div className="py-8"><LoadingSpinner /></div>;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (products.length === 0) {
        return null; // Don't render the section if there are no products
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
           
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {products.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={() => onProductClick(product)}
                        showDescription={false}
                        layout="vertical"
                    />
                ))}
            </div>
        </div>
    );
};

export default RecommendedProducts;