import React from 'react';
import type { ProductManagementData } from '../types';
import AvailabilityStatusBadge from './AvailabilityStatusBadge';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductsManagementTableProps {
  products: ProductManagementData[];
  onEdit: (product: ProductManagementData) => void;
  onDelete: (product: ProductManagementData) => void;
  onTranslate: (productId: string) => void;
  translatingProductId: string | null;
}

const ProductsManagementTable: React.FC<ProductsManagementTableProps> = ({ products, onEdit, onDelete, onTranslate, translatingProductId }) => {
  const { translateField } = useLanguage();
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
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ترجمة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            const isTranslating = product.id === translatingProductId;
            const name = typeof product.name === 'string' ? { ar: product.name, fr: '' } : product.name;
            const needsTranslation = name?.ar && !name?.fr;
            
            return (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-md object-cover ml-4" src={product.image} alt={translateField(product.name)} />
                    {translateField(product.name)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.restaurant}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{translateField(product.category)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{product.price.toLocaleString('ar-MA')} د.م.</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <AvailabilityStatusBadge status={product.availability} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {isTranslating ? (
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري...
                    </div>
                  ) : (
                    <button onClick={() => onTranslate(product.id)} disabled={!needsTranslation} className="disabled:opacity-40 disabled:cursor-not-allowed">
                       <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${needsTranslation ? 'text-teal-500 hover:text-teal-700' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h-3.236c-.131 0-.24-.103-.24-.229l.004-.004.01-.02.022-.04.028-.052.042-.075.052-.09.06-.104.064-.112.068-.116.072-.12.072-.12.072-.119.072-.116.072-.112.068-.104.064-.09.052-.075.042-.052.028-.04.022-.02.01-.004L15 15.229c.332-1.07.332-2.31 0-3.382l-.004-.01-.01-.02-.022-.04-.028-.052-.042-.075-.052-.09-.06-.104-.064-.112-.068-.116-.072-.12-.072-.12-.072-.119-.072-.116-.072-.112-.068-.104-.064-.09-.052-.075-.042-.052-.028-.04.022-.02.01-.004L15 9.172l.004-.01.01-.02.022-.04.028-.052.042-.075.052-.09.06-.104.064-.112.068-.116.072-.12.072-.12.072-.119.072-.116.072-.112.068-.104.064-.09.052-.075.042-.052.028-.04.022-.02.01-.004L15 6.771c.332 1.07.332 2.31 0 3.382zM12 17.5a4.5 4.5 0 01-3.236-1.5" /></svg>
                    </button>
                  )}
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