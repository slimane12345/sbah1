import React, { useState, useEffect } from 'react';
import { db } from '../../scripts/firebase/firebaseConfig.js';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import type { Category } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import ErrorDisplay from '../ErrorDisplay';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface CategoriesProps {
    onNavigateToCategory: (categoryName: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onNavigateToCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t, translateField } = useLanguage();

    useEffect(() => {
        setIsLoading(true);
        const categoriesQuery = query(collection(db, "categories"), orderBy("name.ar"), limit(8));

        const unsubscribe = onSnapshot(categoriesQuery, (querySnapshot) => {
            const fetchedCategories: Category[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                image: doc.data().image,
                slug: doc.data().slug,
            }));
            setCategories(fetchedCategories);
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching categories:", err);
            setError("لم نتمكن من تحميل الفئات.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center py-8"><LoadingSpinner /></div>;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    return (
        <div className="mt-8">
            {categories.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {categories.map((category) => (
                        <button 
                            onClick={() => onNavigateToCategory(translateField(category.name))}
                            key={category.id} 
                            className="text-center group transition-transform transform hover:scale-105">
                            <div className="relative w-full" style={{paddingBottom: '100%'}}>
                                <img 
                                    src={category.image}
                                    alt={translateField(category.name)}
                                    className="absolute inset-0 w-full h-full object-cover rounded-full shadow-sm group-hover:shadow-md"
                                />
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm truncate mt-2">{translateField(category.name)}</h4>
                        </button>
                    ))}
                </div>
            ) : (
                 <p className="text-center text-gray-600">{t('noCategoriesAvailable')}</p>
            )}
        </div>
    );
};

export default Categories;