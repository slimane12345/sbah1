import React from 'react';
import type { Restaurant } from '../../types';
import RestaurantCard from './RestaurantCard';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface RestaurantListProps {
    title: string;
    restaurants: Restaurant[];
    onRestaurantClick: (restaurantId: string) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({ title, restaurants, onRestaurantClick }) => {
    const { t } = useLanguage();
    if (!restaurants || restaurants.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                 <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">{t('viewAll')}</a>
            </div>
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {restaurants.map(restaurant => (
                    <RestaurantCard 
                        key={restaurant.id} 
                        restaurant={restaurant} 
                        onClick={() => onRestaurantClick(restaurant.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;