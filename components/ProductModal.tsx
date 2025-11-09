import React, { useState, useEffect } from 'react';
import type { ProductManagementData, AvailabilityStatus, ProductOptionGroup, ProductOption } from '../types';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: Omit<ProductManagementData, 'id'>) => void;
    product: ProductManagementData | null;
    isSubmitting: boolean;
    restaurantNames: string[];
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product, isSubmitting, restaurantNames }) => {
    const [productData, setProductData] = useState<Omit<ProductManagementData, 'id'>>({
        name: '',
        restaurant: restaurantNames[0] || '',
        category: '',
        price: 0,
        image: '',
        description: '',
        availability: 'متوفر',
        options: []
    });

    useEffect(() => {
        if (product) {
            setProductData({
                name: product.name,
                restaurant: product.restaurant,
                category: product.category,
                price: product.price,
                image: product.image,
                description: product.description || '',
                availability: product.availability,
                options: product.options || []
            });
        } else {
            setProductData({
                name: '',
                restaurant: restaurantNames[0] || '',
                category: '',
                price: 0,
                image: '',
                description: '',
                availability: 'متوفر',
                options: []
            });
        }
    }, [product, isOpen, restaurantNames]);

    if (!isOpen) return null;

    const handleInputChange = (field: keyof Omit<ProductManagementData, 'id' | 'options'>, value: string | number) => {
        setProductData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddOptionGroup = () => {
        const newGroup: ProductOptionGroup = {
            id: `group-${Date.now()}`,
            name: '',
            type: 'radio',
            options: [],
        };
        setProductData(prev => ({ ...prev, options: [...(prev.options || []), newGroup] }));
    };
    
    const handleRemoveOptionGroup = (groupId: string) => {
        setProductData(prev => ({ ...prev, options: prev.options?.filter(g => g.id !== groupId) }));
    };

    const handleGroupChange = (groupId: string, field: 'name' | 'type', value: string) => {
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, [field]: value } : g)
        }));
    };
    
    const handleAddOption = (groupId: string) => {
        const newOption: ProductOption = { id: `option-${Date.now()}`, name: '', price: 0 };
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, options: [...g.options, newOption] } : g)
        }));
    };
    
    const handleRemoveOption = (groupId: string, optionId: string) => {
         setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => g.id === groupId ? { ...g, options: g.options.filter(o => o.id !== optionId) } : g)
        }));
    };
    
    const handleOptionChange = (groupId: string, optionId: string, field: 'name' | 'price', value: string | number) => {
        setProductData(prev => ({
            ...prev,
            options: prev.options?.map(g => 
                g.id === groupId 
                    ? { ...g, options: g.options.map(o => o.id === optionId ? { ...o, [field]: value } : o) } 
                    : g
            )
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(productData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-900">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* Basic Info */}
                        <input type="text" placeholder="اسم المنتج" value={productData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full border-gray-300 rounded-md" required />
                        <select value={productData.restaurant} onChange={e => handleInputChange('restaurant', e.target.value)} className="w-full border-gray-300 rounded-md" required>{restaurantNames.map(name => <option key={name} value={name}>{name}</option>)}</select>
                        <input type="text" placeholder="الفئة" value={productData.category} onChange={e => handleInputChange('category', e.target.value)} className="w-full border-gray-300 rounded-md" required />
                        <textarea placeholder="الوصف" value={productData.description} onChange={e => handleInputChange('description', e.target.value)} rows={2} className="w-full border-gray-300 rounded-md" />
                        <input type="number" step="0.01" placeholder="السعر (د.م.)" value={productData.price} onChange={e => handleInputChange('price', parseFloat(e.target.value))} className="w-full border-gray-300 rounded-md" required />
                        <input type="text" placeholder="رابط الصورة" value={productData.image} onChange={e => handleInputChange('image', e.target.value)} className="w-full border-gray-300 rounded-md" />
                        <select value={productData.availability} onChange={e => handleInputChange('availability', e.target.value)} className="w-full border-gray-300 rounded-md"><option value="متوفر">متوفر</option><option value="غير متوفر">غير متوفر</option></select>
                        
                        {/* Dynamic Options */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-gray-700 mb-2">خيارات المنتج المتغيرة</h3>
                            <div className="space-y-4">
                                {productData.options?.map((group) => (
                                    <div key={group.id} className="p-3 bg-gray-50 rounded-md border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <input type="text" placeholder="اسم المجموعة (مثال: الحجم)" value={group.name} onChange={e => handleGroupChange(group.id, 'name', e.target.value)} className="flex-1 border-gray-300 rounded-md text-sm" />
                                            <select value={group.type} onChange={e => handleGroupChange(group.id, 'type', e.target.value)} className="border-gray-300 rounded-md text-sm"><option value="radio">اختيار واحد</option><option value="checkbox">اختيارات متعددة</option></select>
                                            <button type="button" onClick={() => handleRemoveOptionGroup(group.id)} className="text-red-500 hover:text-red-700 text-xs">حذف المجموعة</button>
                                        </div>
                                        <div className="space-y-2 pr-4 border-r-2">
                                            {group.options.map((option) => (
                                                 <div key={option.id} className="flex items-center gap-2">
                                                     <input type="text" placeholder="اسم الخيار" value={option.name} onChange={e => handleOptionChange(group.id, option.id, 'name', e.target.value)} className="flex-1 border-gray-300 rounded-md text-sm" />
                                                     <input type="number" step="0.01" placeholder="سعر إضافي" value={option.price} onChange={e => handleOptionChange(group.id, option.id, 'price', parseFloat(e.target.value))} className="w-28 border-gray-300 rounded-md text-sm" />
                                                     <button type="button" onClick={() => handleRemoveOption(group.id, option.id)} className="text-red-500 hover:text-red-700 text-xs">X</button>
                                                 </div>
                                            ))}
                                             <button type="button" onClick={() => handleAddOption(group.id)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2">+ إضافة خيار</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <button type="button" onClick={handleAddOptionGroup} className="mt-4 bg-blue-100 text-blue-700 text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-200">+ إضافة مجموعة خيارات</button>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-white py-2 px-4 border rounded-md">إلغاء</button>
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isSubmitting ? 'جاري الحفظ...' : 'حفظ'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;