import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { ProductManagementData, ProductOptionGroup, Category } from '../types';
import ProductsManagementTable from '../components/ProductsManagementTable';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import ImportPreviewModal from '../components/ImportPreviewModal'; // New Import
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, Timestamp, addDoc, deleteDoc, getDocs, where, writeBatch } from 'firebase/firestore';

const ITEMS_PER_PAGE = 8;

const mapAvailabilityToFrontend = (isAvailable: boolean): 'متوفر' | 'غير متوفر' => {
    return isAvailable ? 'متوفر' : 'غير متوفر';
};

// Helper to safely get string from potentially bilingual field
const nameToString = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.ar || Object.values(field)[0] || '';
};

const ProductsManagementPage: React.FC = () => {
    const [products, setProducts] = useState<ProductManagementData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductManagementData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // New state for import functionality
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importData, setImportData] = useState<ProductManagementData[]>([]);
    const importFileInputRef = useRef<HTMLInputElement>(null);
    
    // State for restaurant names and categories to populate dropdowns in modal
    const [restaurantNames, setRestaurantNames] = useState<string[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);


    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedProducts: ProductManagementData[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: nameToString(data.name) || 'N/A',
                    image: data.imageUrl || '',
                    restaurant: data.restaurantName || 'N/A',
                    category: nameToString(data.category) || 'N/A',
                    price: data.price || 0,
                    availability: mapAvailabilityToFrontend(data.isAvailable),
                    description: nameToString(data.description) || '',
                    options: data.options || [],
                    tags: data.tags || [],
                    calories: data.calories,
                    sortOrder: data.sortOrder,
                };
            });
            setProducts(fetchedProducts);
            setIsLoading(false);
        }, (err) => {
            console.error("Firebase Error:", err);
            setError("حدث خطأ أثناء جلب بيانات المنتجات.");
            setIsLoading(false);
        });

        // Fetch restaurants and categories for the modal
        const fetchDropdownData = async () => {
            try {
                const restQuery = query(collection(db, "restaurants"), where("approvalStatus", "==", "Approved"));
                const restSnapshot = await getDocs(restQuery);
                const names = restSnapshot.docs.map(doc => nameToString(doc.data().name));
                setRestaurantNames(names);

                const catQuery = query(collection(db, "categories"), orderBy("name"));
                const catSnapshot = await getDocs(catQuery);
                const cats = catSnapshot.docs.map(doc => ({ id: doc.id, name: nameToString(doc.data().name), image: doc.data().image, slug: doc.data().slug }));
                setAllCategories(cats);

            } catch (err) {
                console.error("Error fetching dropdown data:", err);
            }
        };

        fetchDropdownData();

        return () => unsubscribe();
    }, []);

    const handleEdit = (product: ProductManagementData) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleSave = async (productData: Omit<ProductManagementData, 'id'>) => {
        setIsSubmitting(true);
        const dataToSave = {
            name: { ar: productData.name },
            restaurantName: productData.restaurant,
            category: { ar: productData.category },
            price: productData.price,
            imageUrl: productData.image,
            description: { ar: productData.description },
            isAvailable: productData.availability === 'متوفر',
            options: productData.options?.map(group => ({
                ...group,
                name: { ar: group.name },
                options: group.options.map(opt => ({...opt, name: { ar: opt.name }}))
            })) || [],
            tags: productData.tags || [],
            calories: productData.calories || null,
            sortOrder: productData.sortOrder || 0,
        };

        try {
            if (editingProduct) {
                const productRef = doc(db, 'products', editingProduct.id);
                await updateDoc(productRef, dataToSave);
            } else {
                await addDoc(collection(db, 'products'), {
                    ...dataToSave,
                    createdAt: Timestamp.now(),
                });
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving product:", err);
            // Optionally set an error state for the modal
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (product: ProductManagementData) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف المنتج: ${product.name}؟`)) {
            try {
                await deleteDoc(doc(db, "products", product.id));
            } catch (err) {
                console.error("Error deleting product:", err);
                setError("فشل حذف المنتج. يرجى المحاولة مرة أخرى.");
            }
        }
    };

    const handleExport = () => {
        const headers = ['id', 'name', 'restaurant', 'category', 'price', 'availability', 'description', 'image', 'options', 'tags', 'calories', 'sortOrder'];
        const csvRows = [headers.join(',')];

        for (const product of products) {
            const optionsString = JSON.stringify(product.options || []).replace(/"/g, '""');
            const tagsString = JSON.stringify(product.tags || []).replace(/"/g, '""');
            const values = [
                product.id,
                `"${product.name.replace(/"/g, '""')}"`,
                `"${product.restaurant.replace(/"/g, '""')}"`,
                `"${product.category.replace(/"/g, '""')}"`,
                product.price,
                product.availability,
                `"${(product.description || '').replace(/"/g, '""')}"`,
                product.image,
                `"${optionsString}"`,
                `"${tagsString}"`,
                product.calories || '',
                product.sortOrder || 0
            ];
            csvRows.push(values.join(','));
        }

        const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'products.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const lines = text.split(/\r?\n/).filter(line => line.trim());
                if (lines.length < 2) throw new Error("الملف فارغ أو يحتوي على رأس فقط.");
                
                const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                const requiredHeaders = ['name', 'restaurant', 'category', 'price', 'availability'];
                if (!requiredHeaders.every(h => headers.includes(h))) {
                    throw new Error(`الملف يجب أن يحتوي على الأعمدة التالية على الأقل: ${requiredHeaders.join(', ')}`);
                }

                const parsedData = lines.slice(1).map(line => {
                    const obj: any = {};
                    const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
                    headers.forEach((header, i) => {
                        let value = (values[i] || '').trim();
                        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                        value = value.replace(/""/g, '"');

                        if (header === 'options' || header === 'tags') {
                            obj[header] = value ? JSON.parse(value) : [];
                        } else if (['price', 'calories', 'sortOrder'].includes(header)) {
                            obj[header] = parseFloat(value) || (header === 'price' ? 0 : undefined);
                        } else {
                            obj[header] = value;
                        }
                    });
                    return obj as ProductManagementData;
                });
                setImportData(parsedData);
                setIsImportModalOpen(true);
            } catch (err: any) {
                setError(`فشل في معالجة الملف: ${err.message}`);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input to allow re-uploading the same file
    };

    const handleConfirmImport = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const batch = writeBatch(db);
            const productsCollection = collection(db, 'products');

            for (const product of importData) {
                const dataToSave = {
                    name: { ar: product.name },
                    restaurantName: product.restaurant,
                    category: { ar: product.category },
                    price: product.price ?? 0,
                    imageUrl: product.image || '',
                    description: { ar: product.description || '' },
                    isAvailable: product.availability === 'متوفر',
                    options: product.options?.map(group => ({
                        ...group,
                        name: { ar: nameToString(group.name) },
                        options: group.options.map(opt => ({...opt, name: { ar: nameToString(opt.name) }}))
                    })) || [],
                    tags: product.tags || [],
                    calories: product.calories || null,
                    sortOrder: product.sortOrder || 0,
                };

                if (product.id && products.some(existing => existing.id === product.id)) {
                    const docRef = doc(productsCollection, product.id);
                    batch.update(docRef, dataToSave);
                } else {
                    const docRef = doc(productsCollection);
                    batch.set(docRef, { ...dataToSave, createdAt: Timestamp.now() });
                }
            }

            await batch.commit();
            alert(`تم استيراد ${importData.length} منتج بنجاح!`);
        } catch (err: any) {
            console.error("Error importing products:", err);
            setError(`فشل استيراد المنتجات: ${err.message}`);
        } finally {
            setIsSubmitting(false);
            setIsImportModalOpen(false);
        }
    };

    const filteredProducts = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return products.filter(product => {
            const name = product.name || '';
            const category = product.category || '';
            
            return (name).toLowerCase().includes(lowerCaseSearchTerm) ||
                (product.restaurant || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (category).toLowerCase().includes(lowerCaseSearchTerm);
        });
    }, [products, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredProducts]);

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">إدارة المنتجات</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <input
                            type="text"
                            placeholder="ابحث عن منتج..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                         <input type="file" ref={importFileInputRef} onChange={handleFileSelect} accept=".csv" className="hidden" />
                        <button onClick={() => importFileInputRef.current?.click()} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            استيراد
                        </button>
                        <button onClick={handleExport} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            تصدير
                        </button>
                        <button onClick={handleAddNew} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                            إضافة منتج
                        </button>
                    </div>
                </div>

                {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay message={error} /> : (
                    <>
                        <ProductsManagementTable 
                            products={paginatedProducts} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete}
                        />
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                )}
            </div>
            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    product={editingProduct}
                    isSubmitting={isSubmitting}
                    restaurantNames={restaurantNames}
                    allCategories={allCategories}
                />
            )}
            {isImportModalOpen && (
                <ImportPreviewModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onConfirm={handleConfirmImport}
                    data={importData}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
};

export default ProductsManagementPage;