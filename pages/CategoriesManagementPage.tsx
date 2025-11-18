import React, { useState, useMemo, useEffect } from 'react';
import type { CategoryManagementData } from '../types';
import CategoriesManagementTable from '../components/CategoriesManagementTable';
import CategoryModal from '../components/CategoryModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import Pagination from '../components/Pagination';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, Timestamp, addDoc, deleteDoc } from 'firebase/firestore';

const ITEMS_PER_PAGE = 8;

// Helper to safely get string from potentially bilingual field
const nameToString = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.ar || Object.values(field)[0] || '';
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

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "categories"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedCategories: CategoryManagementData[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: nameToString(data.name) || 'N/A',
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

    const handleEdit = (category: CategoryManagementData) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleSave = async (categoryData: { name: string; image: string; location: { latitude: number; longitude: number; addressText: string; } | null }) => {
        setIsSubmitting(true);
        setError(null);
        
        const slug = (categoryData.name || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        const dataToSave = {
            name: { ar: categoryData.name },
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
        const categoryName = category.name || category.id;
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
            const name = category.name || '';
            return (name).toLowerCase().includes(lowerCaseSearchTerm) ||
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