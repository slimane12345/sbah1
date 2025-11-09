import React from 'react';
import type { Restaurant } from '../../types';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onClick: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
    return (
        <div onClick={onClick} className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group">
            <div className="relative">
                <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 text-xs font-bold">
                    {restaurant.deliveryTime}
                </div>
                 <img src={restaurant.logo} alt={`${restaurant.name} logo`} className="absolute bottom-2 right-2 h-14 w-14 rounded-full border-2 border-white shadow-md object-cover" />
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg truncate">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 truncate">{restaurant.cuisine}</p>
                <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center font-bold text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 ml-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        {restaurant.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-600">{restaurant.cuisine}</span>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;