import React, { useState, useMemo, useEffect } from 'react';
import type { Campaign, CampaignStatus } from '../types';
import CampaignsTable from '../components/CampaignsTable';
import Pagination from '../components/Pagination';
import CampaignModal from '../components/CampaignModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { db } from '../scripts/firebase/firebaseConfig.js';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, Timestamp, addDoc, deleteDoc } from 'firebase/firestore';

const ITEMS_PER_PAGE = 8;
const TABS: CampaignStatus[] = ['نشطة', 'مجدولة', 'مكتملة', 'مسودة'];

const MarketingPage: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<CampaignStatus | 'الكل'>('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedCampaigns: Campaign[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'N/A',
                    type: data.type || 'Push Notification',
                    status: data.status || 'مسودة',
                    targetAudience: data.targetAudience || 'N/A',
                    startDate: data.startDate || '',
                    endDate: data.endDate || '',
                    performance: data.performance || 'N/A',
                };
            });
            setCampaigns(fetchedCampaigns);
            setIsLoading(false);
        }, (err) => {
            console.error("Firebase Error:", err);
            setError("حدث خطأ أثناء جلب بيانات الحملات.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddNew = () => {
        setEditingCampaign(null);
        setIsModalOpen(true);
    };

    const handleEdit = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        setIsModalOpen(true);
    };

    const handleSave = async (campaignData: Omit<Campaign, 'id' | 'performance'>, id: string | null) => {
        setIsSubmitting(true);
        try {
            if (id) {
                const campaignRef = doc(db, 'campaigns', id);
                await updateDoc(campaignRef, campaignData as any);
            } else {
                await addDoc(collection(db, 'campaigns'), {
                    ...campaignData,
                    performance: 'N/A', // Default performance for new campaigns
                    createdAt: Timestamp.now(),
                });
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving campaign:", err);
            setError("فشل حفظ الحملة.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (campaign: Campaign) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف حملة: "${campaign.name}"؟`)) {
            try {
                await deleteDoc(doc(db, "campaigns", campaign.id));
            } catch (err) {
                console.error("Error deleting campaign:", err);
                setError("فشل حذف الحملة.");
            }
        }
    };

    const filteredCampaigns = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return campaigns.filter(campaign => {
            const matchesTab = activeTab === 'الكل' || campaign.status === activeTab;
            const matchesSearch =
                (campaign.name || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (campaign.targetAudience || '').toLowerCase().includes(lowerCaseSearchTerm);
            return matchesTab && matchesSearch;
        });
    }, [campaigns, activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);

    const paginatedCampaigns = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCampaigns.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredCampaigns]);

    const handleTabClick = (tab: CampaignStatus | 'الكل') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => handleTabClick('الكل')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'الكل' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            الكل
                        </button>
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="ابحث عن حملة..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button onClick={handleAddNew} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                            إنشاء حملة جديدة
                        </button>
                    </div>
                </div>
                 {isLoading ? <LoadingSpinner /> : error ? <ErrorDisplay message={error} /> : (
                    <>
                        <CampaignsTable campaigns={paginatedCampaigns} onEdit={handleEdit} onDelete={handleDelete} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
             {isModalOpen && (
                <CampaignModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    campaign={editingCampaign}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
};

export default MarketingPage;