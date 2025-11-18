import React from 'react';
import type { Restaurant } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onClick: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
    const { translateField } = useLanguage();
    return (
        <div onClick={onClick} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group">
            <div className="relative">
                {/* Main Image */}
                <img src={restaurant.coverImage} alt={translateField(restaurant.name)} className="w-full h-48 object-cover" />
                
                {/* Logo */}
                <div className="absolute top-4 left-4 h-14 w-14 bg-white rounded-lg shadow-md flex items-center justify-center">
                    <img src={restaurant.logo} alt={`${translateField(restaurant.name)} logo`} className="h-12 w-12 rounded-md object-contain" />
                </div>

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white focus:outline-none transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                </button>

                {/* Delivery Tag */}
                <div className="absolute bottom-4 left-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    توصيل مجاني
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 right-4 bg-white text-gray-900 text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {restaurant.rating.toFixed(1)}
                    <span className="font-normal text-gray-500">({restaurant.totalOrders > 99 ? '99+' : restaurant.totalOrders})</span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg truncate">{translateField(restaurant.name)}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                    <span>{translateField(restaurant.cuisine)}</span>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-semibold">20-40 دقيقة</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;