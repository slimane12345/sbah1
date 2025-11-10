import React from 'react';
import type { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
    showDescription?: boolean;
    layout?: 'horizontal' | 'vertical';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, showDescription = true, layout = 'horizontal' }) => {
    const { t, translateField } = useLanguage();

    if (layout === 'vertical') {
        return (
            <div onClick={onClick} className="bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col overflow-hidden h-full">
                {product.image && (
                    <div className="w-full h-32 sm:h-40 overflow-hidden">
                        <img src={product.image} alt={translateField(product.name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                )}
                <div className="p-3 flex flex-col flex-1">
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 h-10 sm:h-12">{translateField(product.name)}</h4>
                        {showDescription && (
                             <p className="text-xs text-gray-600 mt-1 line-clamp-2">{translateField(product.description)}</p>
                        )}
                        <p className="font-extrabold text-gray-900 mt-2 text-base">{product.price.toLocaleString('ar-MA')} {t('currency')}</p>
                    </div>
                    <div className="flex-grow" />
                </div>
            </div>
        );
    }
    
    // Horizontal layout (original)
    const containerClasses = `flex p-4 bg-white rounded-lg border border-transparent hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer group ${showDescription ? 'items-start' : 'items-center'}`;
    const imageContainerClasses = `flex-shrink-0 ml-4 rounded-md overflow-hidden ${showDescription ? 'w-28 h-28' : 'w-24 h-24'}`;
    const priceClasses = `font-extrabold text-gray-900 ${showDescription ? 'mt-3' : 'mt-2'}`;

    return (
        <div onClick={onClick} className={containerClasses}>
            <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-base">{translateField(product.name)}</h4>
                {showDescription && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 h-10">{translateField(product.description)}</p>
                )}
                <p className={priceClasses}>{product.price.toLocaleString('ar-MA')} {t('currency')}</p>
            </div>
            {product.image && (
                <div className={imageContainerClasses}>
                    <img src={product.image} alt={translateField(product.name)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
            )}
        </div>
    );
};

export default ProductCard;