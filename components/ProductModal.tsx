import React, { useState, useEffect } from 'react';
import type { ProductManagementData, AvailabilityStatus, ProductOptionGroup, ProductOption, TranslatableString, Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import StatusToggle from './StatusToggle';

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
    const [tagInput, setTagInput] = useState('');

    const getInitialData = (): Omit<ProductManagementData, 'id'> => {
        const normalizeTranslatable = (field: TranslatableString | string | undefined): TranslatableString => {
            if (!field) return { ar: '', fr: '' };
            if (typeof field === 'string') return { ar: field, fr: '' };
            return { ar: field.ar || '', fr: field.fr || '' };
        };

        if (product) {
            const categoryString = translateField(product.category);
            const foundCategory = allCategories.find(c => translateField(c.name) === categoryString);
            
            return {
                name: normalizeTranslatable(product.name),
                restaurant: product.restaurant,
                category: foundCategory?.name || normalizeTranslatable(product.category),
                price: product.price,
                image: product.image,
                description: normalizeTranslatable(product.description),
                availability: product.availability,
                options: product.options?.map(group => ({
                    ...group,
                    name: normalizeTranslatable(group.name),
                    options: group.options.map(opt => ({...opt, name: normalizeTranslatable(opt.name)}))
                })) || [],
                tags: product.tags || [],
                calories: product.calories,
                sortOrder: product.sortOrder,
            };
        }
        
        return {
            name: { ar: '', fr: '' },
            restaurant: restaurantNames[0] || '',
            category: allCategories[0]?.name || { ar: '', fr: '' },
            price: 0,
            image: '',
            description: { ar: '', fr: '' },
            availability: 'متوفر',
            options: [],
            tags: [],
            calories: undefined,
            sortOrder: 0
        };
    };

    const [productData, setProductData] = useState<Omit<ProductManagementData, 'id'>>(getInitialData);
    
    useEffect(() => {
        if (isOpen) {
            setProductData(getInitialData());
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    // Handlers for state updates
    const handleTranslatableChange = (field: 'name' | 'description', lang: 'ar' | 'fr', value: string) => {
        setProductData(prev => ({ ...prev, [field]: { ...(prev[field] as TranslatableString), [lang]: value } }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryName = e.target.value;
        const selectedCategory = allCategories.find(c => translateField(c.name) === selectedCategoryName);
        if (selectedCategory) {
            setProductData(prev => ({ ...prev, category: selectedCategory.name }));
        }
    };
    
    // Tag handlers
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !productData.tags?.includes(newTag)) {
                setProductData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
            }
            setTagInput('');
        }
    };
    const removeTag = (tagToRemove: string) => {
        setProductData(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== tagToRemove) }));
    };

    // Option Group handlers
    const addOptionGroup = () => {
        const newGroup: ProductOptionGroup = {
            id: `group_${Date.now()}`, name: { ar: '', fr: '' }, type: 'radio', required: true, options: []
        };
        setProductData(prev => ({ ...prev, options: [...(prev.options || []), newGroup] }));
    };

    const updateOptionGroup = (groupId: string, field: keyof ProductOptionGroup, value: any) => {
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, [field]: value } : g)
        }));
    };

    const deleteOptionGroup = (groupId: string) => {
        setProductData(prev => ({...prev, options: prev.options?.filter(g => g.id !== groupId)}));
    };

    // Option handlers
    const addOption = (groupId: string) => {
        const newOption: ProductOption = { id: `opt_${Date.now()}`, name: { ar: '', fr: '' }, price: 0 };
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, options: [...g.options, newOption] } : g)
        }));
    };
    
    const updateOption = (groupId: string, optionId: string, field: keyof ProductOption, value: any) => {
         setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId 
                ? { ...g, options: g.options.map(o => o.id === optionId ? { ...o, [field]: value } : o) } 
                : g
            )
        }));
    };

    const deleteOption = (groupId: string, optionId: string) => {
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, options: g.options.filter(o => o.id !== optionId) } : g)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(productData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-h-[70vh] overflow-y-auto">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-gray-700 border-b pb-2">المعلومات الأساسية</h3>
                            <input type="text" placeholder={t('nameInArabic')} value={productData.name.ar} onChange={e => handleTranslatableChange('name', 'ar', e.target.value)} className="w-full border-gray-300 rounded-md" required />
                            <input type="text" placeholder={t('nameInFrench')} value={productData.name.fr} onChange={e => handleTranslatableChange('name', 'fr', e.target.value)} className="w-full border-gray-300 rounded-md" />
                            <textarea placeholder={t('descriptionInArabic')} value={productData.description.ar} onChange={e => handleTranslatableChange('description', 'ar', e.target.value)} rows={3} className="w-full border-gray-300 rounded-md" />
                            <textarea placeholder={t('descriptionInFrench')} value={productData.description.fr} onChange={e => handleTranslatableChange('description', 'fr', e.target.value)} rows={3} className="w-full border-gray-300 rounded-md" />
                            <div className="grid grid-cols-2 gap-4">
                                <select value={productData.restaurant} onChange={e => setProductData(p => ({...p, restaurant: e.target.value}))} className="w-full border-gray-300 rounded-md" required>{restaurantNames.map(name => <option key={name} value={name}>{name}</option>)}</select>
                                <select value={translateField(productData.category)} onChange={handleCategoryChange} className="w-full border-gray-300 rounded-md" required>{allCategories.map(cat => <option key={cat.id} value={translateField(cat.name)}>{translateField(cat.name)}</option>)}</select>
                            </div>
                            <input type="number" step="0.01" placeholder="السعر (د.م.)" value={productData.price} onChange={e => setProductData(p => ({...p, price: parseFloat(e.target.value) || 0}))} className="w-full border-gray-300 rounded-md" required />
                             <div>
                                <label className="block text-sm font-medium text-gray-700">رابط الصورة</label>
                                <input type="url" placeholder="https://..." value={productData.image} onChange={e => setProductData(p => ({...p, image: e.target.value}))} className="w-full border-gray-300 rounded-md mt-1" />
                            </div>
                        </div>

                        {/* Right Column: Options */}
                        <div className="space-y-4">
                             <h3 className="font-bold text-lg text-gray-700 border-b pb-2">خيارات المنتج</h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {productData.options?.map((group, groupIndex) => (
                                    <div key={group.id} className="p-3 border rounded-lg bg-gray-50 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <input type="text" placeholder={t('groupName')} value={group.name.ar} onChange={e => updateOptionGroup(group.id, 'name', {...group.name, ar: e.target.value})} className="font-semibold w-full border-gray-300 rounded-md text-sm" />
                                            <button type="button" onClick={() => deleteOptionGroup(group.id)} className="text-red-500 hover:text-red-700 p-1 mr-2 flex-shrink-0">&times;</button>
                                        </div>
                                        <div className="flex gap-4 text-sm">
                                            <label className="flex items-center gap-2"><input type="radio" name={`type-${group.id}`} checked={group.type === 'radio'} onChange={() => updateOptionGroup(group.id, 'type', 'radio')} /> اختيار واحد</label>
                                            <label className="flex items-center gap-2"><input type="radio" name={`type-${group.id}`} checked={group.type === 'checkbox'} onChange={() => updateOptionGroup(group.id, 'type', 'checkbox')} /> اختيار متعدد</label>
                                            <div className="flex items-center gap-2"><StatusToggle enabled={group.required} onChange={val => updateOptionGroup(group.id, 'required', val)} /><span className="text-xs">إجباري</span></div>
                                        </div>
                                        <div className="space-y-2">
                                            {group.options.map((option, optIndex) => (
                                                <div key={option.id} className="flex gap-2 items-center bg-white p-2 rounded">
                                                    <input type="text" placeholder={t('optionName')} value={option.name.ar} onChange={e => updateOption(group.id, option.id, 'name', {...option.name, ar: e.target.value})} className="w-full border-gray-300 rounded-md text-xs" />
                                                    <input type="number" step="0.01" placeholder={t('additionalPrice')} value={option.price} onChange={e => updateOption(group.id, option.id, 'price', parseFloat(e.target.value) || 0)} className="w-28 border-gray-300 rounded-md text-xs" />
                                                    <button type="button" onClick={() => deleteOption(group.id, option.id)} className="text-red-500 hover:text-red-700 p-1 flex-shrink-0">&times;</button>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={() => addOption(group.id)} className="text-blue-600 text-xs font-semibold hover:underline">+ {t('addNewOption')}</button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addOptionGroup} className="w-full bg-blue-50 text-blue-700 text-sm font-semibold py-2 rounded-md hover:bg-blue-100">+ إضافة مجموعة خيارات</button>
                        </div>
                    </div>
                    {/* Bottom Section: Advanced */}
                    <div className="p-6 border-t bg-gray-50">
                        <h3 className="font-bold text-lg text-gray-700 mb-4">إعدادات متقدمة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">الوسوم (Tags)</label>
                                <div className="mt-1 flex items-center flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white">
                                    {productData.tags?.map(tag => (
                                        <span key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">{tag} <button type="button" onClick={() => removeTag(tag)}>&times;</button></span>
                                    ))}
                                    <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="flex-grow border-0 p-0 text-sm focus:ring-0" placeholder="أضف وسم..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">السعرات الحرارية</label>
                                <input type="number" value={productData.calories || ''} onChange={e => setProductData(p => ({...p, calories: parseInt(e.target.value) || undefined}))} className="mt-1 w-full border-gray-300 rounded-md" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">ترتيب العرض</label>
                                <input type="number" value={productData.sortOrder || 0} onChange={e => setProductData(p => ({...p, sortOrder: parseInt(e.target.value) || 0}))} className="mt-1 w-full border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">التوفر</label>
                            <StatusToggle enabled={productData.availability === 'متوفر'} onChange={val => setProductData(p => ({...p, availability: val ? 'متوفر' : 'غير متوفر'}))} />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-white py-2 px-4 border rounded-md">إلغاء</button>
                            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                                {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;