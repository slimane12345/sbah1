import React, { useState, useMemo, useEffect } from 'react';
import type { Product, ProductOption, CartItem, ProductOptionGroup } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface CustomizationModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (item: CartItem) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ product, onClose, onAddToCart }) => {
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: ProductOption | ProductOption[] }>({});
    const { t } = useLanguage();

    // Reset state when product changes
    useEffect(() => {
        setSelectedOptions({});
    }, [product]);
    
    const handleOptionChange = (group: ProductOptionGroup, option: ProductOption) => {
        setSelectedOptions(prev => {
            const newOptions = {...prev};
            if (group.type === 'radio') {
                newOptions[group.id] = option;
            } else { // checkbox
                const currentSelection = (prev[group.id] as ProductOption[]) || [];
                const isSelected = currentSelection.some(o => o.id === option.id);
                if (isSelected) {
                    newOptions[group.id] = currentSelection.filter(o => o.id !== option.id);
                } else {
                    newOptions[group.id] = [...currentSelection, option];
                }
            }
            return newOptions;
        });
    };

    const calculateTotalPrice = () => {
        let optionsPrice = 0;
        Object.values(selectedOptions).forEach(optionOrOptions => {
            if (Array.isArray(optionOrOptions)) {
                optionsPrice += optionOrOptions.reduce((sum, o) => sum + o.price, 0);
            } else if (optionOrOptions) {
                optionsPrice += (optionOrOptions as ProductOption).price;
            }
        });
        return product.price + optionsPrice;
    };
    
    const totalPrice = useMemo(calculateTotalPrice, [selectedOptions, product]);

    const handleAddToCartClick = () => {
        // Validation for required options can be added here
        
        onAddToCart({
            product,
            quantity: 1, // Quantity is fixed to 1 as per the new design
            selectedOptions,
            totalPrice
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-0 sm:p-4" onClick={onClose} dir={t('language') === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white rounded-none sm:rounded-2xl shadow-xl w-full h-full sm:h-auto sm:max-w-md sm:max-h-[90vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 left-4 bg-gray-100/80 backdrop-blur-sm rounded-full h-8 w-8 flex items-center justify-center z-20 hover:bg-gray-200 transition-colors"
                    aria-label={t('close')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                {product.image && <img src={product.image} alt={product.name} className="w-full h-52 object-cover sm:rounded-t-2xl" />}
                
                <div className="flex-1 overflow-y-auto p-6">
                    <h2 className="text-3xl font-extrabold text-gray-900">{product.name}</h2>
                    <p className="text-xl font-semibold text-gray-700 mt-1">{product.price.toFixed(2)} {t('currency')}</p>
                    
                    <div className="space-y-6 mt-6">
                        {product.options?.map(group => (
                            <div key={group.id} className="border-t pt-5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{group.name}</h3>
                                        <p className="text-sm text-gray-500">{t('chooseOne')}</p>
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-md">{t('required')}</span>
                                </div>
                                
                                <div className="mt-4 space-y-3">
                                    {group.options.map(option => {
                                        const isChecked = (selectedOptions[group.id] as ProductOption)?.id === option.id;
                                        return (
                                            <label key={option.id} className="flex items-center justify-between cursor-pointer">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{option.name}</p>
                                                    {option.price > 0 && <p className="text-sm text-gray-600">+{option.price.toFixed(2)} {t('currency')}</p>}
                                                </div>
                                                <div className="relative">
                                                    <input 
                                                        type="radio" 
                                                        name={group.id}
                                                        checked={isChecked}
                                                        onChange={() => handleOptionChange(group, option)}
                                                        className="sr-only"
                                                    />
                                                     <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? 'border-yellow-600 bg-white' : 'border-gray-400'}`}>
                                                        {isChecked && <div className="h-2.5 w-2.5 rounded-full bg-yellow-600"></div>}
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-white sm:rounded-b-2xl">
                    <button 
                        onClick={handleAddToCartClick}
                        className="w-full bg-[#FC883A] text-white rounded-lg py-4 font-bold text-base hover:bg-[#F07C2A] transition-colors"
                    >
                        {t('addOneForPrice', { price: totalPrice.toFixed(2) })}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizationModal;