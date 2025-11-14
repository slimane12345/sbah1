import React from 'react';
import type { ProductManagementData } from '../types';
import AvailabilityStatusBadge from './AvailabilityStatusBadge';

interface ProductsManagementTableProps {
  products: ProductManagementData[];
  onEdit: (product: ProductManagementData) => void;
  onDelete: (product: ProductManagementData) => void;
}

const ProductsManagementTable: React.FC<ProductsManagementTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المطعم</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفئة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التوفر</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            return (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-md object-cover ml-4" src={product.image} alt={product.name} />
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.restaurant}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{product.price.toLocaleString('ar-MA')} د.م.</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <AvailabilityStatusBadge status={product.availability} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4 space-x-reverse">
                   <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900">تعديل</button>
                   <button onClick={() => onDelete(product)} className="text-red-600 hover:text-red-900">حذف</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsManagementTable;