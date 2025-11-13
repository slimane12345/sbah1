import React, { useState, useMemo, useEffect } from 'react';
import type { ProductManagementData, ProductOptionGroup, Category } from '../types';
import ProductsManagementTable from '../components/ProductsManagementTable';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { db } from '../scripts/firebase/firebaseConfig.js';
// Fix: 'where' was used but not imported from firestore.
import { collection, query, onSnapshot, doc, updateDoc, orderBy, Timestamp, addDoc, deleteDoc, getDocs, where } from 'firebase/firestore';

const ITEMS_PER_PAGE = 8;

const mapAvailabilityToFrontend = (isAvailable: boolean): 'متوفر' | 'غير متوفر' => {
    return isAvailable ? 'متوفر' : 'غير متوفر';
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
                    name: data.name || 'N/A',
                    image: data.imageUrl || '',
                    restaurant: data.restaurantName || 'N/A',
                    category: data.category || 'N/A',
                    price: data.price || 0,
                    availability: mapAvailabilityToFrontend(data.isAvailable),
                    description: data.description || '',
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
                const names = restSnapshot.docs.map(doc => doc.data().name.ar || doc.data().name); // Prioritize Arabic name for dropdown
                setRestaurantNames(names);

                const catQuery = query(collection(db, "categories"), orderBy("name.ar"));
                const catSnapshot = await getDocs(catQuery);
                const cats = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
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
            name: productData.name,
            restaurantName: productData.restaurant,
            category: productData.category,
            price: productData.price,
            imageUrl: productData.image,
            description: productData.description,
            isAvailable: productData.availability === 'متوفر',
            options: productData.options || [],
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
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف المنتج: ${typeof product.name === 'string' ? product.name : product.name.ar}؟`)) {
            try {
                await deleteDoc(doc(db, "products", product.id));
            } catch (err) {
                console.error("Error deleting product:", err);
                setError("فشل حذف المنتج. يرجى المحاولة مرة أخرى.");
            }
        }
    };

    const filteredProducts = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return products.filter(product => {
            const name = typeof product.name === 'string' ? product.name : product.name.ar || '';
            const category = typeof product.category === 'string' ? product.category : product.category.ar || '';
            
            return (name || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (product.restaurant || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (category || '').toLowerCase().includes(lowerCaseSearchTerm);
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
                    <div className="flex items-center gap-2">
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
                        <button onClick={handleAddNew} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                            إضافة منتج
                        </button>
                    </div>
                </div>

                {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay message={error} /> : (
                    <>
                        <ProductsManagementTable products={paginatedProducts} onEdit={handleEdit} onDelete={handleDelete} />
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
        </>
    );
};

export default ProductsManagementPage;