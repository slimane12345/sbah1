import React from 'react';
import type { Restaurant } from '../types';
import RestaurantStatusBadge from './RestaurantStatusBadge';

interface RestaurantsTableProps {
  restaurants: Restaurant[];
}

// Helper to safely get string from potentially bilingual field
const nameToString = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.ar || Object.values(field)[0] || '';
};

const RestaurantsTable: React.FC<RestaurantsTableProps> = ({ restaurants }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المطعم</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع المطبخ</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقييم</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجمالي الطلبات</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العمولة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-full object-cover ml-4" src={restaurant.logo} alt={nameToString(restaurant.name)} />
                  {nameToString(restaurant.name)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nameToString(restaurant.cuisine)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <RestaurantStatusBadge status={restaurant.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {restaurant.rating.toFixed(1)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.totalOrders}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{restaurant.commissionRate}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button className="text-indigo-600 hover:text-indigo-900 ml-4">عرض القائمة</button>
                 <button className="text-gray-500 hover:text-gray-700">تعديل</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantsTable;