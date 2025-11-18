import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from '../scripts/firebase/firebaseConfig.js';
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { HomePageSection, Banner, Restaurant, Category } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import StatusToggle from '../components/StatusToggle';

// Default layout if nothing is found in Firestore
const DEFAULT_LAYOUT = {
    sections: [
      { id: 'categories', title: 'الفئات', enabled: true, order: 1 },
      { id: 'recommended_products', title: 'منتجات موصى بها', enabled: true, order: 2, itemCount: 4 },
      { id: 'recommended_restaurants', title: 'مطاعم موصى بها', enabled: true, order: 3 },
      { id: 'all_restaurants', title: 'جميع المطاعم', enabled: true, order: 4 },
    ],
    topBanner: { id: 'banner-top', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', title: 'خصم 50% على البيتزا', subtitle: 'عرض خاص لفترة محدودة', link: '/category/بيتزا', order: 1, enabled: true },
    middleBanner: { id: 'banner-middle', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop', title: 'برجر الشهر', subtitle: 'جرّب برجر الواغيو الجديد', link: '/restaurant/R003', order: 2, enabled: true },
};

const layoutDocRef = doc(db, 'layout_settings', 'home_page');

interface SelectableItem {
  id: string;
  name: string;
}

const nameToString = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field.ar || Object.values(field)[0] || '';
};

const HomePageManagementPage: React.FC = () => {
    const [sections, setSections] = useState<HomePageSection[]>([]);
    const [topBanner, setTopBanner] = useState<Banner | null>(null);
    const [middleBanner, setMiddleBanner] = useState<Banner | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [restaurants, setRestaurants] = useState<SelectableItem[]>([]);
    const [categories, setCategories] = useState<SelectableItem[]>([]);
    const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

    const fetchLayout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const docSnap = await getDoc(layoutDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const dbSections = (data.sections || []) as HomePageSection[];
                const mergedSections = DEFAULT_LAYOUT.sections.map(defaultSection => {
                    const dbSection = dbSections.find(s => s.id === defaultSection.id);
                    return dbSection ? { ...defaultSection, ...dbSection } : defaultSection;
                }).sort((a, b) => a.order - b.order);
                
                setSections(mergedSections);
                setTopBanner(data.topBanner || DEFAULT_LAYOUT.topBanner);
                setMiddleBanner(data.middleBanner || DEFAULT_LAYOUT.middleBanner);
            } else {
                setSections(DEFAULT_LAYOUT.sections);
                setTopBanner(DEFAULT_LAYOUT.topBanner);
                setMiddleBanner(DEFAULT_LAYOUT.middleBanner);
                await setDoc(layoutDocRef, DEFAULT_LAYOUT); // Seed if doesn't exist
            }
        } catch (err) {
            console.error(err);
            setError("فشل تحميل إعدادات الواجهة.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLayout();
        const fetchLinkables = async () => {
            try {
                const restQuery = query(collection(db, "restaurants"), where("approvalStatus", "==", "Approved"), orderBy("name"));
                const restSnapshot = await getDocs(restQuery);
                const restItems = restSnapshot.docs.map(doc => ({ id: doc.id, name: nameToString(doc.data().name) }));
                setRestaurants(restItems);

                const catQuery = query(collection(db, "categories"), orderBy("name"));
                const catSnapshot = await getDocs(catQuery);
                const catItems = catSnapshot.docs.map(doc => ({ id: nameToString(doc.data().name), name: nameToString(doc.data().name) }));
                setCategories(catItems);
            } catch (err) {
                console.error("Error fetching linkable items:", err);
            }
        };
        fetchLinkables();
    }, [fetchLayout]);

    const handleSaveLayout = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const sectionsToSave = sections.map((s, index) => ({ ...s, order: index + 1 }));
            await setDoc(layoutDocRef, { sections: sectionsToSave, topBanner, middleBanner }, { merge: true });
        } catch (err) {
            console.error(err);
            setError("فشل حفظ التغييرات.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleToggleSection = (id: string) => setSections(s => s.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec));
    const handleSectionTitleChange = (id: string, newTitle: string) => setSections(s => s.map(sec => sec.id === id ? { ...sec, title: newTitle } : sec));
    const handleSectionItemCountChange = (id: string, count: number) => {
        const newCount = isNaN(count) ? 1 : Math.max(1, Math.min(20, count));
        setSections(s => s.map(sec => sec.id === id ? { ...sec, itemCount: newCount } : sec));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => { setDraggedSectionId(id); e.dataTransfer.effectAllowed = 'move'; };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
        e.preventDefault();
        if (!draggedSectionId || draggedSectionId === targetId) return;
        const draggedIndex = sections.findIndex(s => s.id === draggedSectionId);
        const targetIndex = sections.findIndex(s => s.id === targetId);
        const newSections = [...sections];
        const [draggedItem] = newSections.splice(draggedIndex, 1);
        newSections.splice(targetIndex, 0, draggedItem);
        setSections(newSections);
        setDraggedSectionId(null);
    };
    
    const createBannerChangeHandler = (setter: React.Dispatch<React.SetStateAction<Banner | null>>) => {
        return (field: keyof Omit<Banner, 'id' | 'order'>, value: string | boolean) => {
            setter(b => b ? { ...b, [field]: value } : null);
        };
    };

    const BannerEditor: React.FC<{
        banner: Banner | null;
        onBannerChange: (field: keyof Omit<Banner, 'id' | 'order'>, value: string | boolean) => void;
        title: string;
    }> = ({ banner, onBannerChange, title }) => {
        if (!banner) return null;
        
        const linkType = banner.link.startsWith('/restaurant/') ? 'restaurant' : 'category';
        const linkValue = banner.link.replace('/restaurant/', '').replace('/category/', '');

        return (
            <div className="card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">{title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <img src={banner.imageUrl || 'https://via.placeholder.com/150'} alt="Banner preview" className="w-full h-24 object-cover rounded-md" />
                    <div className="md:col-span-2 space-y-2">
                        <input type="text" placeholder="رابط الصورة" value={banner.imageUrl} onChange={e => onBannerChange('imageUrl', e.target.value)} className="w-full border-gray-300 rounded-md text-sm" />
                        <input type="text" placeholder="العنوان" value={banner.title} onChange={e => onBannerChange('title', e.target.value)} className="w-full border-gray-300 rounded-md text-sm" />
                        <input type="text" placeholder="العنوان الفرعي (اختياري)" value={banner.subtitle || ''} onChange={e => onBannerChange('subtitle', e.target.value)} className="w-full border-gray-300 rounded-md text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                            <select value={linkType} onChange={e => { const nt = e.target.value; onBannerChange('link', nt === 'restaurant' ? '/restaurant/' : '/category/'); }} className="w-full border-gray-300 rounded-md text-sm">
                                <option value="category">فئة</option>
                                <option value="restaurant">مطعم</option>
                            </select>
                            <select value={linkValue} onChange={e => { const nl = linkType === 'restaurant' ? `/restaurant/${e.target.value}` : `/category/${e.target.value}`; onBannerChange('link', nl); }} className="w-full border-gray-300 rounded-md text-sm">
                                <option value="">اختر الوجهة</option>
                                {(linkType === 'restaurant' ? restaurants : categories).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-start items-center pt-2">
                            <StatusToggle enabled={banner.enabled} onChange={(val) => onBannerChange('enabled', val)} />
                            <span className="mr-3 text-sm">{banner.enabled ? 'مفعل' : 'معطل'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} onRetry={fetchLayout} />;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center sticky top-16 bg-gray-100/80 backdrop-blur-sm z-10 py-4 -mx-6 px-6">
                <h2 className="text-2xl font-bold text-gray-800">إدارة واجهة العميل</h2>
                <button onClick={handleSaveLayout} disabled={isSaving} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586L7.707 10.293zM3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" /></svg>
                    {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>

            <BannerEditor banner={topBanner} onBannerChange={createBannerChangeHandler(setTopBanner)} title="البانر العلوي" />
            <BannerEditor banner={middleBanner} onBannerChange={createBannerChangeHandler(setMiddleBanner)} title="البانر الأوسط (بين المنتجات والمطاعم)" />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">ترتيب أقسام الصفحة الرئيسية</h3>
                <p className="text-xs text-gray-500 mb-4">اسحب وأفلت الأقسام لترتيبها.</p>
                <div className="space-y-3">
                    {sections.map(section => (
                        <div key={section.id} draggable onDragStart={(e) => handleDragStart(e, section.id)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, section.id)} className={`flex justify-between items-center p-4 border rounded-lg transition-all cursor-grab active:cursor-grabbing ${draggedSectionId === section.id ? 'opacity-50 bg-blue-50' : 'bg-white'}`}>
                            <div className="flex items-center flex-grow">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-3" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                <input type="text" value={section.title} onChange={(e) => handleSectionTitleChange(section.id, e.target.value)} className="font-semibold text-gray-700 bg-transparent border-0 focus:ring-0 focus:border-b p-1" />
                                {section.id === 'recommended_products' && (
                                    <div className="flex items-center gap-2 mr-4">
                                        <label htmlFor={`item-count-${section.id}`} className="text-sm text-gray-600">
                                            عدد المنتجات:
                                        </label>
                                        <input
                                            type="number"
                                            id={`item-count-${section.id}`}
                                            value={section.itemCount || 4}
                                            onChange={(e) => handleSectionItemCountChange(section.id, parseInt(e.target.value, 10))}
                                            min="1"
                                            max="20"
                                            className="w-16 border-gray-300 rounded-md text-sm p-1"
                                        />
                                    </div>
                                )}
                            </div>
                            <StatusToggle enabled={section.enabled} onChange={() => handleToggleSection(section.id)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePageManagementPage;