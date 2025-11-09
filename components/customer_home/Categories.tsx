import React, { useState, useEffect } from 'react';
import { db } from '../../scripts/firebase/firebaseConfig.js';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { Category } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import ErrorDisplay from '../ErrorDisplay';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface CategoriesProps {
    title: string;
    onNavigateToCategory: (categoryName: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ title, onNavigateToCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        setIsLoading(true);
        const categoriesQuery = query(collection(db, "categories"), orderBy("name"));

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
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
            {categories.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map((category) => (
                        <button 
                            onClick={() => onNavigateToCategory(category.name)}
                            key={category.id} 
                            className="text-center no-underline transition-opacity duration-300 ease-in-out hover:opacity-80 group w-24 flex-shrink-0">
                            <img 
                                src={category.image}
                                alt={category.name}
                                className="w-full h-24 object-cover rounded-lg mb-2 shadow-sm"
                            />
                            <h4 className="font-semibold text-gray-800 text-sm truncate">{category.name}</h4>
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