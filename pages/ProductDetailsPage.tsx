import React, { useState, useMemo } from 'react';
import type { Product, CartItem, ProductOption, CustomerPage } from '../types';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface ProductDetailsPageProps {
    product: Product;
    onBack: () => void;
    onAddToCart: (item: CartItem) => void;
    cartItems: CartItem[];
    setCustomerPage: (page: CustomerPage) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, onBack, onAddToCart, cartItems, setCustomerPage }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: any }>({});
    const { t, translateField } = useLanguage();
    
    const handleOptionChange = (groupdId: string, option: ProductOption, type: 'radio' | 'checkbox') => {
        setSelectedOptions(prev => {
            const newOptions = {...prev};
            if (type === 'radio') {
                newOptions[groupdId] = option;
            } else {
                const current = newOptions[groupdId] || [];
                const isSelected = current.some((o: ProductOption) => o.id === option.id);
                if (isSelected) {
                    newOptions[groupdId] = current.filter((o: ProductOption) => o.id !== option.id);
                } else {
                    newOptions[groupdId] = [...current, option];
                }
            }
            return newOptions;
        });
    };

    const calculateItemTotalPrice = () => {
        let optionsPrice = 0;
        Object.values(selectedOptions).forEach(optionOrOptions => {
            if (Array.isArray(optionOrOptions)) {
                optionsPrice += (optionOrOptions as ProductOption[]).reduce((sum, o) => sum + o.price, 0);
            } else if (optionOrOptions) {
                optionsPrice += (optionOrOptions as ProductOption).price;
            }
        });
        return (product.price + optionsPrice) * quantity;
    };
    
    const totalPrice = useMemo(calculateItemTotalPrice, [quantity, selectedOptions, product]);

    const handleAddToCartClick = () => {
        onAddToCart({
            product,
            quantity,
            selectedOptions,
            totalPrice
        });
    };

    return (
        <div className="bg-white pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button onClick={onBack} className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    {t('backToMenu')}
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Column */}
                    <div>
                        <img src={product.image || 'https://via.placeholder.com/400'} alt={translateField(product.name)} className="w-full h-auto aspect-square object-cover rounded-2xl shadow-lg"/>
                    </div>

                    {/* Details Column */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-extrabold text-gray-900">{translateField(product.name)}</h1>
                        <p className="text-gray-600 mt-3 text-lg">{translateField(product.description)}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-4">{product.price.toLocaleString('ar-MA')} {t('currency')}</p>

                        {/* Options */}
                        <div className="mt-6 space-y-6">
                            {product.options?.map(group => (
                                <div key={group.id}>
                                    <h4 className="font-bold text-gray-900 text-lg border-b pb-2 mb-3">{translateField(group.name)}</h4>
                                    <div className="space-y-3">
                                        {group.options.map(option => (
                                            <label key={option.id} className="flex items-center justify-between p-3 rounded-lg border has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 cursor-pointer transition-colors">
                                                <div className="flex items-center">
                                                    <input 
                                                        type={group.type} 
                                                        name={group.id} 
                                                        onChange={() => handleOptionChange(group.id, option, group.type)}
                                                        className="h-4 w-4"
                                                    />
                                                    <span className="mr-3 text-gray-800 font-medium">{translateField(option.name)}</span>
                                                </div>
                                                {option.price > 0 && <span className="text-sm font-semibold text-gray-700">+{option.price} {t('currency')}</span>}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-8">
                            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-full border-2 border-black bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors">+</button>
                                    <span className="font-bold text-xl w-8 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-full border-2 border-black bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors">-</button>
                                </div>
                                <button 
                                    onClick={handleAddToCartClick}
                                    className="btn-customer-primary btn-customer-black flex-1"
                                >
                                    {t('addToCartWithPrice', { price: totalPrice.toFixed(2)})}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* FloatingCart is now rendered globally in App.tsx */}
        </div>
    );
};

export default ProductDetailsPage;