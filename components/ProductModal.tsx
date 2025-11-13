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

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        type="button"
        className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
        onClick={() => onChange(!enabled)}
    >
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);


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
                options: (product.options || []).map(g => ({
                    ...g,
                    id: g.id || `group-${crypto.randomUUID()}`, // Ensure ID exists
                    required: g.required !== undefined ? g.required : true,
                    name: normalizeTranslatable(g.name),
                    options: (g.options || []).map(o => ({
                        ...o, 
                        id: o.id || `option-${crypto.randomUUID()}`, // Ensure ID exists
                        name: normalizeTranslatable(o.name)
                    }))
                }))
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

    const handleAddOptionGroup = () => {
        setProductData(prev => ({
            ...prev,
            options: [
                ...(prev.options || []),
                {
                    id: `group-${crypto.randomUUID()}`,
                    name: { ar: '', fr: '' },
                    type: 'radio',
                    required: true,
                    options: [],
                }
            ]
        }));
    };
    
    const handleRemoveOptionGroup = (groupId: string) => {
        setProductData(prev => ({ ...prev, options: prev.options?.filter(g => g.id !== groupId) }));
    };

    const handleGroupChange = (groupId: string, field: 'type' | 'required', value: 'radio' | 'checkbox' | boolean) => {
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, [field]: value } : g)
        }));
    };

    const handleGroupTranslatableChange = (groupId: string, lang: 'ar' | 'fr', value: string) => {
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, name: { ...(normalizeTranslatable(g.name)), [lang]: value } } : g)
        }));
    };
    
    const handleAddOption = (groupId: string) => {
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => 
                g.id === groupId 
                ? { ...g, options: [...g.options, { id: `option-${crypto.randomUUID()}`, name: { ar: '', fr: '' }, price: 0 }] } 
                : g
            )
        }));
    };
    
    const handleRemoveOption = (groupId: string, optionId: string) => {
         setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, options: g.options.filter(o => o.id !== optionId) } : g)
        }));
    };
    
    const handleOptionChange = (groupId: string, optionId: string, field: 'price', value: number) => {
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, options: g.options.map(o => o.id === optionId ? { ...o, [field]: value } : o) } : g)
        }));
    };

    const handleOptionTranslatableChange = (groupId: string, optionId: string, lang: 'ar' | 'fr', value: string) => {
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, options: g.options.map(o => o.id === optionId ? { ...o, name: { ...(normalizeTranslatable(o.name)), [lang]: value } } : g) } : g)
        }));
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

                        {/* Dynamic Options */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-gray-700 mb-2">خيارات المنتج المتغيرة</h3>
                            <div className="space-y-4">
                                {productData.options?.map((group) => (
                                    <div key={group.id} className="p-4 bg-gray-50 rounded-lg border space-y-3">
                                        {/* Group Header */}
                                        <div className="flex justify-between items-center gap-2">
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <input type="text" placeholder={`${t('groupName')} (${t('arabic')})`} value={normalizeTranslatable(group.name).ar} onChange={e => handleGroupTranslatableChange(group.id, 'ar', e.target.value)} className="border-gray-300 rounded-md text-sm" />
                                                <input type="text" placeholder={`${t('groupName')} (${t('french')})`} value={normalizeTranslatable(group.name).fr} onChange={e => handleGroupTranslatableChange(group.id, 'fr', e.target.value)} className="flex-1 border-gray-300 rounded-md text-sm" />
                                            </div>
                                            <select value={group.type} onChange={e => handleGroupChange(group.id, 'type', e.target.value as 'radio' | 'checkbox')} className="border-gray-300 rounded-md text-sm"><option value="radio">اختيار واحد</option><option value="checkbox">اختيارات متعددة</option></select>
                                            <div className="flex items-center gap-2">
                                                <ToggleSwitch enabled={group.required} onChange={(val) => handleGroupChange(group.id, 'required', val)} />
                                                <label className="text-sm font-medium text-gray-700">{t('required')}</label>
                                            </div>
                                            <button type="button" onClick={() => handleRemoveOptionGroup(group.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                                                <TrashIcon />
                                            </button>
                                        </div>

                                        {/* Options List */}
                                        <div className="space-y-2 pr-4 border-r-2 border-gray-200">
                                            {group.options.map((option) => (
                                                 <div key={option.id} className="flex items-center gap-2">
                                                     <input type="text" placeholder={`${t('optionName')} (${t('arabic')})`} value={normalizeTranslatable(option.name).ar} onChange={e => handleOptionTranslatableChange(group.id, option.id, 'ar', e.target.value)} className="flex-1 border-gray-300 rounded-md text-sm" />
                                                     <input type="text" placeholder={`${t('optionName')} (${t('french')})`} value={normalizeTranslatable(option.name).fr} onChange={e => handleOptionTranslatableChange(group.id, option.id, 'fr', e.target.value)} className="flex-1 border-gray-300 rounded-md text-sm" />
                                                     <div className="relative w-32">
                                                        <input type="number" step="0.01" placeholder={t('additionalPrice')} value={option.price} onChange={e => handleOptionChange(group.id, option.id, 'price', parseFloat(e.target.value) || 0)} className="w-full border-gray-300 rounded-md text-sm pl-7" />
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">{t('currency')}</span>
                                                     </div>
                                                     <button type="button" onClick={() => handleRemoveOption(group.id, option.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"><TrashIcon /></button>
                                                 </div>
                                            ))}
                                             <button type="button" onClick={() => handleAddOption(group.id)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold pt-2">+ {t('addNewOption')}</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <button type="button" onClick={handleAddOptionGroup} className="mt-4 bg-blue-100 text-blue-700 text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-200">+ إضافة مجموعة خيارات</button>
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