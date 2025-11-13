import React, { useState, useMemo, useEffect } from 'react';
import type { CategoryManagementData, TranslatableString } from '../types';
import CategoriesManagementTable from '../components/CategoriesManagementTable';
import CategoryModal from '../components/CategoryModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import Pagination from '../components/Pagination';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, Timestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';

const ITEMS_PER_PAGE = 8;

const translateText = async (text: string, targetLanguage: 'French' | 'Arabic'): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Translate the following text to ${targetLanguage}. Return only the translated text, without any introductory phrases or explanations.\n\nText: "${text}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
};

const CategoriesManagementPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryManagementData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryManagementData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Translation state
    const [translatingCategoryId, setTranslatingCategoryId] = useState<string | null>(null);
    const [isBulkTranslating, setIsBulkTranslating] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "categories"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedCategories: CategoryManagementData[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || { ar: 'N/A', fr: '' },
                    image: data.image || '',
                    slug: data.slug || 'N/A',
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toLocaleDateString('ar-SA') : 'N/A',
                    location: data.location || undefined,
                };
            });
            setCategories(fetchedCategories);
            setIsLoading(false);
        }, (err) => {
            console.error("Firebase Error:", err);
            setError("حدث خطأ أثناء جلب بيانات الفئات.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);
    
    const handleTranslateCategory = async (categoryId: string) => {
        setTranslatingCategoryId(categoryId);
        setError(null);
        try {
            const category = categories.find(c => c.id === categoryId);
            if (!category) throw new Error("Category not found");

            const categoryRef = doc(db, 'categories', categoryId);
            const name = typeof category.name === 'string' ? { ar: category.name, fr: '' } : category.name;

            if (name?.ar && !name?.fr) {
                const translatedName = await translateText(name.ar, 'French');
                await updateDoc(categoryRef, { 'name.fr': translatedName });
            }
        } catch (err: any) {
            console.error("Translation error:", err);
            setError(`فشل الترجمة: ${err.message}`);
        } finally {
            setTranslatingCategoryId(null);
        }
    };

    const handleBulkTranslate = async () => {
        setIsBulkTranslating(true);
        setError(null);
        const categoriesToTranslate = categories.filter(c => {
            const name = typeof c.name === 'string' ? { ar: c.name, fr: '' } : c.name;
            return name?.ar && !name?.fr;
        });

        if (categoriesToTranslate.length === 0) {
            alert('لا توجد فئات تحتاج إلى ترجمة.');
            setIsBulkTranslating(false);
            return;
        }

        for (const category of categoriesToTranslate) {
            await handleTranslateCategory(category.id);
        }

        setIsBulkTranslating(false);
        alert(`تمت ترجمة ${categoriesToTranslate.length} فئة بنجاح.`);
    };

    const handleEdit = (category: CategoryManagementData) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleSave = async (categoryData: { name: TranslatableString; image: string; location: { latitude: number; longitude: number; addressText: string; } | null }) => {
        setIsSubmitting(true);
        setError(null);
        
        const slug = (categoryData.name.ar || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        const dataToSave = {
            name: categoryData.name,
            image: categoryData.image,
            location: categoryData.location || null,
            slug: slug
        };

        try {
            if (editingCategory) {
                const categoryRef = doc(db, 'categories', editingCategory.id);
                await updateDoc(categoryRef, dataToSave);
            } else {
                await addDoc(collection(db, 'categories'), {
                    ...dataToSave,
                    createdAt: Timestamp.now(),
                });
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving category:", err);
            setError("فشل حفظ الفئة.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (category: CategoryManagementData) => {
        const categoryName = typeof category.name === 'string' ? category.name : (category.name.ar || category.id);
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف الفئة: ${categoryName}؟`)) {
            try {
                await deleteDoc(doc(db, "categories", category.id));
            } catch (err) {
                console.error("Error deleting category:", err);
                setError("فشل حذف الفئة.");
            }
        }
    };
    
    const filteredCategories = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return categories.filter(category => {
            const name = typeof category.name === 'string' ? category.name : category.name.ar || '';
            return (name || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (category.slug || '').toLowerCase().includes(lowerCaseSearchTerm)
        });
    }, [categories, searchTerm]);

    const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

    const paginatedCategories = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredCategories]);

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">إدارة الفئات</h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="ابحث عن فئة..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                         <button onClick={handleBulkTranslate} disabled={isBulkTranslating} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 text-sm disabled:bg-teal-300 whitespace-nowrap">
                            {isBulkTranslating ? 'جاري الترجمة...' : 'ترجمة كل الحقول الناقصة'}
                        </button>
                        <button onClick={handleAddNew} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                            إضافة فئة
                        </button>
                    </div>
                </div>

                {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay message={error} /> : (
                    <>
                        <CategoriesManagementTable 
                            categories={paginatedCategories} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                            onTranslate={handleTranslateCategory}
                            translatingCategoryId={translatingCategoryId}
                        />
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                )}
            </div>
            {isModalOpen && (
                <CategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    category={editingCategory}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
};

export default CategoriesManagementPage;