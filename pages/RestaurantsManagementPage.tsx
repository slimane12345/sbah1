import React, { useState, useMemo, useEffect } from 'react';
import type { RestaurantManagementData, ApprovalStatus, AiAnalysis } from '../types';
import RestaurantsManagementTable from '../components/RestaurantsManagementTable';
import Pagination from '../components/Pagination';
import AiAnalysisModal from '../components/AiAnalysisModal';
import ReviewRestaurantModal from '../components/ReviewRestaurantModal';
import RestaurantModal from '../components/AddRestaurantModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { GoogleGenAI, Type } from "@google/genai";
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, Timestamp, addDoc } from 'firebase/firestore';

const ITEMS_PER_PAGE = 8;

const mapApprovalStatus = (status: string): ApprovalStatus => {
    if (status === 'Approved' || status === 'Pending' || status === 'Rejected') {
        return status;
    }
    return 'Pending';
};

// Helper to safely get string from potentially bilingual field
const nameToString = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    // Assuming 'ar' is the primary language
    return field.ar || Object.values(field)[0] || '';
};

const RestaurantsManagementPage: React.FC = () => {
    const [restaurants, setRestaurants] = useState<RestaurantManagementData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [activeTab, setActiveTab] = useState<ApprovalStatus | 'الكل'>('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantManagementData | null>(null);
    
    const [analysisResult, setAnalysisResult] = useState<AiAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "restaurants"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedRestaurants: RestaurantManagementData[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: nameToString(data.name) || 'N/A',
                    ownerName: data.ownerName || 'N/A',
                    ownerEmail: data.ownerEmail || 'N/A',
                    ownerPhone: data.ownerPhone || 'N/A',
                    joinDate: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toLocaleDateString('ar-SA') : 'N/A',
                    approvalStatus: mapApprovalStatus(data.approvalStatus || 'Pending'),
                    isActive: data.isActive === true,
                    location: data.location || undefined,
                    coverPhotoUrl: data.coverPhotoUrl || '',
                    cuisine: nameToString(data.cuisineType) || '',
                };
            });
            setRestaurants(fetchedRestaurants);
            setIsLoading(false);
        }, (err) => {
            console.error("Firebase Error:", err);
            setError("حدث خطأ أثناء جلب بيانات المطاعم. يرجى المحاولة مرة أخرى.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = async (restaurantId: string) => {
        setIsSubmitting(true);
        try {
            const restaurantRef = doc(db, 'restaurants', restaurantId);
            await updateDoc(restaurantRef, {
                approvalStatus: 'Approved',
                isActive: true
            });
            setIsReviewModalOpen(false);
        } catch (err) {
            console.error("Error approving restaurant:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async (restaurantId: string) => {
        setIsSubmitting(true);
        try {
            const restaurantRef = doc(db, 'restaurants', restaurantId);
            await updateDoc(restaurantRef, {
                approvalStatus: 'Rejected',
                isActive: false
            });
             setIsReviewModalOpen(false);
        } catch (err) {
            console.error("Error rejecting restaurant:", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleToggleActive = async (restaurant: RestaurantManagementData) => {
        const restaurantRef = doc(db, 'restaurants', restaurant.id);
        try {
            await updateDoc(restaurantRef, {
                isActive: !restaurant.isActive
            });
        } catch (err) {
             console.error("Error toggling active status:", err);
        }
    };
    
    const handleSaveRestaurant = async (
        newData: Omit<RestaurantManagementData, 'id' | 'joinDate' | 'approvalStatus' | 'isActive'>, 
        id: string | null
    ) => {
        setIsSubmitting(true);
        try {
            const dataToSave = {
                name: { ar: newData.name }, // Save in the old bilingual format for now
                ownerName: newData.ownerName,
                ownerEmail: newData.ownerEmail,
                ownerPhone: newData.ownerPhone,
                coverPhotoUrl: newData.coverPhotoUrl,
                location: newData.location,
                cuisineType: { ar: newData.cuisine }, // Save in the old bilingual format
            };

            if (id) {
                const restaurantRef = doc(db, 'restaurants', id);
                await updateDoc(restaurantRef, dataToSave);
            } else {
                await addDoc(collection(db, 'restaurants'), {
                    ...dataToSave,
                    approvalStatus: 'Approved',
                    isActive: true,
                    createdAt: Timestamp.now(),
                });
            }
            setIsRestaurantModalOpen(false);
            setSelectedRestaurant(null);
        } catch (err) {
            console.error("Error saving restaurant:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenReviewModal = (restaurant: RestaurantManagementData) => {
        setSelectedRestaurant(restaurant);
        setIsReviewModalOpen(true);
    };
    
    const handleOpenAddModal = () => {
        setSelectedRestaurant(null);
        setIsRestaurantModalOpen(true);
    };
    
    const handleOpenEditModal = (restaurant: RestaurantManagementData) => {
        setSelectedRestaurant(restaurant);
        setIsRestaurantModalOpen(true);
    };
    
    const filteredData = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return restaurants.filter(req => {
            const matchesTab = activeTab === 'الكل' || req.approvalStatus === activeTab;
            
            const name = req.name || '';

            const matchesSearch =
                (name || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (req.ownerName || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (req.ownerEmail || '').toLowerCase().includes(lowerCaseSearchTerm);
            return matchesTab && matchesSearch;
        });
    }, [restaurants, activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredData]);

    const TABS: ApprovalStatus[] = ['Pending', 'Approved', 'Rejected'];

    const handleTabClick = (tab: ApprovalStatus | 'الكل') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleOpenAnalysisModal = async (restaurant: RestaurantManagementData) => {
        setSelectedRestaurant(restaurant);
        setIsAnalysisModalOpen(true);
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);

        try {
            if (!process.env.API_KEY) throw new Error("API_KEY environment variable is not set.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `أنت خبير استشاري...`; 

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: { type: Type.STRING },
                            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                    },
                },
            });
            
            setAnalysisResult(JSON.parse(response.text));

        } catch (err: any) {
            setAnalysisError("حدث خطأ أثناء تحليل البيانات.");
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const handleCloseAnalysisModal = () => {
        setIsAnalysisModalOpen(false);
        setSelectedRestaurant(null);
        setAnalysisResult(null);
        setAnalysisError(null);
    };
    
    const handleCloseRestaurantModal = () => {
        setIsRestaurantModalOpen(false);
        setSelectedRestaurant(null);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex border-b border-gray-200">
                        <button onClick={() => handleTabClick('الكل')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'الكل' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>الكل</button>
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => handleTabClick(tab)} className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                {tab === 'Pending' ? 'قيد المراجعة' : tab === 'Approved' ? 'مقبول' : 'مرفوض'}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="ابحث عن مطعم أو مالك..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                         <button 
                            onClick={handleOpenAddModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm whitespace-nowrap"
                        >
                            إضافة مطعم جديد
                        </button>
                    </div>
                </div>

                {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay message={error} /> : (
                    <>
                        <RestaurantsManagementTable 
                            data={paginatedData} 
                            onOpenAnalysis={handleOpenAnalysisModal} 
                            onReview={handleOpenReviewModal} 
                            onToggleActive={handleToggleActive} 
                            onEdit={handleOpenEditModal}
                        />
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                )}
            </div>
            
            <AiAnalysisModal isOpen={isAnalysisModalOpen} onClose={handleCloseAnalysisModal} restaurant={selectedRestaurant} analysis={analysisResult} isLoading={isAnalyzing} error={analysisError} />
            
            {isReviewModalOpen && selectedRestaurant && (
                <ReviewRestaurantModal 
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    restaurant={selectedRestaurant}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isSubmitting={isSubmitting}
                />
            )}

            {isRestaurantModalOpen && (
                <RestaurantModal
                    isOpen={isRestaurantModalOpen}
                    onClose={handleCloseRestaurantModal}
                    onSave={handleSaveRestaurant}
                    isSubmitting={isSubmitting}
                    restaurant={selectedRestaurant}
                />
            )}
        </>
    );
};

export default RestaurantsManagementPage;