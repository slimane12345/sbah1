import React, { useState, useEffect } from 'react';
import type { ProductManagementData, AvailabilityStatus, ProductOptionGroup, ProductOption, TranslatableString, Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: Omit<ProductManagementData, 'id'>) => Promise<void>;
    product: ProductManagementData | null;
    isSubmitting: boolean;
    restaurantNames: string[];
    allCategories: Category[];
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product, isSubmitting, restaurantNames, allCategories }) => {
    const { t, translateField } = useLanguage();

    const normalizeTranslatable = (field: TranslatableString | string | undefined): TranslatableString => {
        if (!field) return { ar: '', fr: '' };
        if (typeof field === 'string') return { ar: field, fr: '' };
        return { ar: field.ar || '', fr: field.fr || '' };
    };

    const [productData, setProductData] = useState<Omit<ProductManagementData, 'id'>>({
        name: { ar: '', fr: '' },
        restaurant: restaurantNames[0] || '',
        category: { ar: '', fr: '' },
        price: 0,
        image: '',
        description: { ar: '', fr: '' },
        availability: 'متوفر',
        options: []
    });
    
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (product) {
            const categoryString = translateField(product.category);
            const foundCategory = allCategories.find(c => translateField(c.name) === categoryString);
            
            setProductData({
                name: normalizeTranslatable(product.name),
                restaurant: product.restaurant,
                category: foundCategory?.name || normalizeTranslatable(product.category),
                price: product.price,
                image: product.image,
                description: normalizeTranslatable(product.description),
                availability: product.availability,
                options: product.options || [] // Keep existing options data
            });
            setImagePreview(product.image || '');
        } else {
            setProductData({
                name: { ar: '', fr: '' },
                restaurant: restaurantNames[0] || '',
                category: allCategories[0]?.name || { ar: '', fr: '' },
                price: 0,
                image: '',
                description: { ar: '', fr: '' },
                availability: 'متوفر',
                options: []
            });
            setImagePreview('');
        }
    }, [product, isOpen, restaurantNames, allCategories, translateField]);

    if (!isOpen) return null;

    const handleInputChange = (field: keyof Omit<ProductManagementData, 'id' | 'options' | 'name' | 'description' | 'category'>, value: string | number) => {
        setProductData(prev => ({ ...prev, [field]: value }));
    };

    const handleTranslatableChange = (field: 'name' | 'description', lang: 'ar' | 'fr', value: string) => {
        setProductData(prev => ({
            ...prev,
            [field]: { ...(prev[field] as TranslatableString), [lang]: value }
        }));
    };
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryName = e.target.value;
        const selectedCategory = allCategories.find(c => translateField(c.name) === selectedCategoryName);
        if (selectedCategory) {
            setProductData(prev => ({ ...prev, category: selectedCategory.name }));
        }
    };
    
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setProductData(prev => ({ ...prev, image: url }));
        setImagePreview(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(productData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder={t('nameInArabic')} value={(productData.name as TranslatableString).ar} onChange={e => handleTranslatableChange('name', 'ar', e.target.value)} className="w-full border-gray-300 rounded-md" required />
                            <input type="text" placeholder={t('nameInFrench')} value={(productData.name as TranslatableString).fr} onChange={e => handleTranslatableChange('name', 'fr', e.target.value)} className="w-full border-gray-300 rounded-md" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <select value={productData.restaurant} onChange={e => handleInputChange('restaurant', e.target.value)} className="w-full border-gray-300 rounded-md" required>{restaurantNames.map(name => <option key={name} value={name}>{name}</option>)}</select>
                            <select value={translateField(productData.category)} onChange={handleCategoryChange} className="w-full border-gray-300 rounded-md" required>
                                {allCategories.map(cat => <option key={cat.id} value={translateField(cat.name)}>{translateField(cat.name)}</option>)}
                            </select>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <textarea placeholder={t('descriptionInArabic')} value={(productData.description as TranslatableString).ar} onChange={e => handleTranslatableChange('description', 'ar', e.target.value)} rows={2} className="w-full border-gray-300 rounded-md" />
                            <textarea placeholder={t('descriptionInFrench')} value={(productData.description as TranslatableString).fr} onChange={e => handleTranslatableChange('description', 'fr', e.target.value)} rows={2} className="w-full border-gray-300 rounded-md" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" step="0.01" placeholder="السعر (د.م.)" value={productData.price} onChange={e => handleInputChange('price', parseFloat(e.target.value))} className="w-full border-gray-300 rounded-md" required />
                            <select value={productData.availability} onChange={e => handleInputChange('availability', e.target.value)} className="w-full border-gray-300 rounded-md"><option value="متوفر">متوفر</option><option value="غير متوفر">غير متوفر</option></select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">صورة المنتج</label>
                            <div className="mt-1 flex items-center gap-4">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="معاينة المنتج" className="h-20 w-20 rounded-md object-cover flex-shrink-0" />
                                ) : (
                                    <div className="h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                )}
                                <div className="w-full">
                                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
                                    <input
                                        id="imageUrl"
                                        type="url"
                                        placeholder="الصق رابط الصورة هنا"
                                        value={productData.image}
                                        onChange={handleUrlChange}
                                        className="w-full border-gray-300 rounded-md text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-white py-2 px-4 border rounded-md">إلغاء</button>
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                             {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;