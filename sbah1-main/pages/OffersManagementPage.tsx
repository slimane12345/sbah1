import React, { useState, useMemo, useEffect } from 'react';
import type { Offer, OfferStatus } from '../types';
import OffersTable from '../components/OffersTable';
import Pagination from '../components/Pagination';
import OfferModal from '../components/OfferModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, Timestamp, addDoc, deleteDoc } from 'firebase/firestore';

const ITEMS_PER_PAGE = 10;

// Function to determine offer status based on dates
const getOfferStatus = (validFrom: string, validTo: string): OfferStatus => {
    const now = new Date();
    const from = new Date(validFrom);
    const to = new Date(validTo);
    to.setHours(23, 59, 59, 999); // Set 'to' date to end of day

    if (now < from) {
        return 'مجدول';
    } else if (now > to) {
        return 'منتهي';
    } else {
        return 'نشط';
    }
};


const OffersManagementPage: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "offers"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedOffers: Offer[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const validFrom = data.validFrom.toDate ? data.validFrom.toDate().toISOString() : data.validFrom;
                const validTo = data.validTo.toDate ? data.validTo.toDate().toISOString() : data.validTo;

                return {
                    id: doc.id,
                    code: data.code || 'N/A',
                    description: data.description || 'N/A',
                    discountType: data.discountType || 'percentage',
                    discountValue: data.discountValue || 0,
                    status: getOfferStatus(validFrom, validTo),
                    validFrom,
                    validTo,
                    usageCount: data.usageCount || 0,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toLocaleDateString('ar-SA') : 'N/A',
                };
            });
            setOffers(fetchedOffers);
            setIsLoading(false);
        }, (err) => {
            console.error("Firebase Error:", err);
            setError("حدث خطأ أثناء جلب بيانات العروض.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddNew = () => {
        setEditingOffer(null);
        setIsModalOpen(true);
    };

    const handleEdit = (offer: Offer) => {
        setEditingOffer(offer);
        setIsModalOpen(true);
    };

    const handleSave = async (offerData: Omit<Offer, 'id' | 'usageCount' | 'status' | 'createdAt'>, id: string | null) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const dataToSave = {
                ...offerData,
                validFrom: Timestamp.fromDate(new Date(offerData.validFrom)),
                validTo: Timestamp.fromDate(new Date(offerData.validTo)),
            };

            if (id) {
                const offerRef = doc(db, 'offers', id);
                await updateDoc(offerRef, dataToSave as any);
            } else {
                await addDoc(collection(db, 'offers'), {
                    ...dataToSave,
                    usageCount: 0,
                    createdAt: Timestamp.now(),
                });
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving offer:", err);
            setError("فشل حفظ العرض.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (offer: Offer) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف العرض: "${offer.code}"؟`)) {
            try {
                await deleteDoc(doc(db, "offers", offer.id));
            } catch (err) {
                console.error("Error deleting offer:", err);
                setError("فشل حذف العرض.");
            }
        }
    };

    const filteredOffers = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return offers.filter(offer =>
            (offer.code || '').toLowerCase().includes(lowerCaseSearchTerm) ||
            (offer.description || '').toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [offers, searchTerm]);

    const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);

    const paginatedOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOffers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredOffers]);


    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">إدارة العروض والخصومات</h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="ابحث عن كود خصم..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button onClick={handleAddNew} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                            إنشاء عرض جديد
                        </button>
                    </div>
                </div>
                 {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay message={error} /> : (
                    <>
                        <OffersTable offers={paginatedOffers} onEdit={handleEdit} onDelete={handleDelete} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
             {isModalOpen && (
                <OfferModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    offer={editingOffer}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
};

export default OffersManagementPage;
