import React, { useState, useEffect } from 'react';
import type { Page, CustomerPage, ViewMode, CartItem, Restaurant, Product, UserLocation, UserProfileData, PastOrder, SavedAddress, OrderStatus, AppSettings } from './types.ts';
import { db, auth, firebaseInitializationError } from './scripts/firebase/firebaseConfig.js';
import { signInAnonymously } from 'firebase/auth';
// FIX: Imported 'getDoc' to fetch single documents from Firestore.
import { doc, setDoc, Timestamp, collection, query, where, getDocs, getDoc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

// Admin view components
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import OrdersManagementPage from './pages/OrdersManagementPage.tsx';
import RestaurantsManagementPage from './pages/RestaurantsManagementPage.tsx';
import ProductsManagementPage from './pages/ProductsManagementPage.tsx';
import CategoriesManagementPage from './pages/CategoriesManagementPage.tsx'; // New
import DriversManagementPage from './pages/DriversManagementPage.tsx';
import UsersManagementPage from './pages/UsersManagementPage.tsx';
import FinancePage from './pages/FinancePage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import MarketingPage from './pages/MarketingPage.tsx';
import OffersManagementPage from './pages/OffersManagementPage.tsx';
import HomePageManagementPage from './pages/HomePageManagementPage.tsx';
import AiAlgorithmsPage from './pages/AiAlgorithmsPage.tsx';
import SupportChatbotPage from './pages/SupportChatbotPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';

// Customer view components
import CustomerHeader from './components/CustomerHeader.tsx';
import CustomerHomePage from './pages/CustomerHomePage.tsx';
import RestaurantProfilePage from './pages/RestaurantProfilePage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import UserProfilePage from './pages/UserProfilePage.tsx';
import FloatingCart from './components/restaurant_profile/FloatingCart.tsx';
import CategoryProductsPage from './pages/CategoryProductsPage.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage.tsx';
import LocationModal from './components/customer_home/LocationModal.tsx';
import CustomerOrderTrackingModal from './components/user_profile/CustomerOrderTrackingModal.tsx';
import InstallPwaBanner from './components/InstallPwaBanner.tsx';

// Driver view components
import DriverLoginPage from './pages/DriverLoginPage.tsx';
import DriverDashboardPage from './pages/DriverDashboardPage.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ErrorDisplay from './components/ErrorDisplay.tsx';

const pageTitles: Record<Page, string> = {
    dashboard: 'لوحة التحكم الرئيسية',
    'orders-management': 'إدارة الطلبات',
    'restaurants-management': 'إدارة المطاعم',
    'products-management': 'إدارة المنتجات',
    'categories-management': 'إدارة الفئات', // New
    'drivers-management': 'إدارة السائقين',
    'users-management': 'إدارة المستخدمين',
    finance: 'المالية',
    reports: 'التقارير',
    marketing: 'التسويق والحملات',
    'offers-management': 'إدارة العروض والخصومات',
    'home-page-management': 'إدارة واجهة العميل',
    'ai-algorithms': 'خوارزميات الذكاء الاصطناعي',
    'support-chatbot': 'محادثات الدعم',
    settings: 'الإعدادات',
    // Deprecated pages, mapping for completeness
    orders: 'الطلبات',
    couriers: 'المناديب',
    customers: 'العملاء',
    restaurants: 'المطاعم',
};

const mapBackendStatusToFrontend = (status: string): OrderStatus => {
    const map: { [key: string]: OrderStatus } = {
        pending: 'جديد',
        confirmed: 'مؤكد',
        preparing: 'قيد التجهيز',
        ready: 'جاهز',
        picked_up: 'بالتوصيل',
        delivered: 'مكتمل',
        cancelled: 'ملغي'
    };
    return map[status] || 'جديد';
};

const MainApp: React.FC = () => {
    if (firebaseInitializationError) {
        let detailedMessage: React.ReactNode = `An unexpected Firebase initialization error occurred: ${firebaseInitializationError.message}`;

        if (firebaseInitializationError.message.includes('firestore is not available')) {
            detailedMessage = (
                <>
                  <p className="font-bold">خطأ في إعداد Firebase Firestore</p>
                  <p className="text-sm mt-2">خدمة Firestore غير متاحة. هذا يعني غالبًا أن قاعدة بيانات Firestore لم يتم إنشاؤها في مشروعك على Firebase.</p>
                  <div className="text-left text-sm mt-4 bg-gray-800 text-white p-4 rounded-md font-mono" dir="ltr">
                    <p className="font-semibold">How to fix:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Firebase Console</a>.</li>
                      <li>In the left menu, click <strong>Build</strong> &rarr; <strong>Firestore Database</strong>.</li>
                      <li>Click <strong>Create database</strong>.</li>
                      <li>Choose <strong>Start in production mode</strong> (or test mode).</li>
                      <li>Select a location and click <strong>Enable</strong>.</li>
                      <li>Once the database is created, refresh this page.</li>
                    </ol>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Error message: {firebaseInitializationError.message}</p>
                </>
            );
        }
        
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
                <div className="max-w-2xl w-full">
                    <ErrorDisplay message={detailedMessage} />
                </div>
            </div>
        );
    }

    // Determine view mode based on the HTML file being served. This is now fixed per entry point.
    const path = window.location.pathname;
    const isCustomerPath = path.includes('/customer.html');
    const isDriverPath = path.includes('/driver.html');
    const viewMode: ViewMode = isDriverPath ? 'driver' : isCustomerPath ? 'customer' : 'admin';
    
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [customerPage, setCustomerPage] = useState<CustomerPage>('home');
    const [previousCustomerPage, setPreviousCustomerPage] = useState<CustomerPage>('home');
    
    // Customer view state
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Global location state
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isLocationConfirming, setIsLocationConfirming] = useState(false);
    
    // User profile state
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
    const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    // Order tracking state
    const [orderToTrack, setOrderToTrack] = useState<PastOrder | null>(null);
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    
    // App-wide settings state
    const [appSettings, setAppSettings] = useState<AppSettings | null>(null);

    // PWA Install Prompt State
    const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);

    // Driver state
    const [driverId, setDriverId] = useState<string | null>(() => localStorage.getItem('sbahDriverId'));
    
    // Firebase initialization state
    const [isFirebaseReady, setIsFirebaseReady] = useState(false);
    const [firebaseError, setFirebaseError] = useState<React.ReactNode | null>(null);

    const MOCK_USER_ID = 'mock_customer_id';

    // Handle Firebase Anonymous Auth
    useEffect(() => {
        // Set document direction to RTL
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        
        const anony_auth = async () => {
          try {
            if (auth && !auth.currentUser) {
              await signInAnonymously(auth);
              console.log("Firebase signed in anonymously for main app.");
            }
            setIsFirebaseReady(true);
          } catch (error: any) {
            if (error.code === 'auth/admin-restricted-operation') {
              setFirebaseError(
                <>
                  <p className="font-bold">خطأ في مصادقة Firebase</p>
                  <p className="text-sm mt-2">ميزة "تسجيل الدخول المجهول" غير مفعلة. هذه الميزة ضرورية لعمل التطبيق بشكل صحيح.</p>
                  <div className="text-left text-sm mt-4 bg-gray-800 text-white p-4 rounded-md font-mono" dir="ltr">
                    <p className="font-semibold">How to fix:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to your Firebase Console.</li>
                      <li>Navigate to <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong> tab.</li>
                      <li>Find and <strong>enable</strong> the <strong>Anonymous</strong> sign-in provider.</li>
                      <li>Save and refresh this page.</li>
                    </ol>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Error code: {error.code}</p>
                </>
              );
            } else {
              setFirebaseError(`حدث خطأ غير متوقع في Firebase: ${error.message}`);
            }
            // Still set ready to true to show the error screen instead of loading forever
            setIsFirebaseReady(true);
          }
        };
        anony_auth();
      }, []);

    const handleDriverLogin = (id: string) => {
        localStorage.setItem('sbahDriverId', id);
        setDriverId(id);
    };

    const handleDriverLogout = () => {
        localStorage.removeItem('sbahDriverId');
        setDriverId(null);
        // Redirect to the driver login page after logout.
        window.location.href = '/driver.html';
    };

    // Service Worker and PWA Install Prompt Logic
    useEffect(() => {
        if (viewMode === 'customer') {
            // Register service worker
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').then(registration => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, err => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
                });
            }

            // Listen for the install prompt
            const handleBeforeInstallPrompt = (e: Event) => {
                e.preventDefault();
                setDeferredInstallPrompt(e);
            };
            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            return () => {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            };
        }
    }, [viewMode]);

    const handleInstallApp = async () => {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            const { outcome } = await deferredInstallPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            setDeferredInstallPrompt(null);
        }
    };


    useEffect(() => {
        const fetchAppSettings = async () => {
            const settingsDocRef = doc(db, 'settings', 'app_config');
            try {
                const docSnap = await getDoc(settingsDocRef);
                if (docSnap.exists()) {
                    setAppSettings(docSnap.data() as AppSettings);
                }
            } catch (error) {
                console.error("Error fetching app settings:", error);
            }
        };

        fetchAppSettings();
    }, []);

    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            try {
                setUserLocation(JSON.parse(savedLocation));
            } catch (e) {
                console.error("Failed to parse userLocation from localStorage", e);
            }
        }
    }, []);

    // Fetch user profile as soon as we enter customer view
    useEffect(() => {
        if (viewMode !== 'customer' || userProfile) {
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const userDocRef = doc(db, 'users', MOCK_USER_ID);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUserProfile({
                        id: userSnap.id,
                        fullName: data.fullName || 'علي محمد',
                        email: data.email || 'ali.m@example.com',
                        phone: data.phone || '0501234567',
                        avatarUrl: data.avatarUrl || 'https://i.pravatar.cc/150?img=11'
                    });
                } else {
                    const mockProfile = { fullName: 'علي محمد', email: 'ali.m@example.com', phone: '0501234567', avatarUrl: 'https://i.pravatar.cc/150?img=11' };
                    await setDoc(userDocRef, mockProfile);
                    setUserProfile({id: MOCK_USER_ID, ...mockProfile});
                }
            } catch (e) {
                console.error("Error fetching user profile", e);
            }
        };

        fetchUserProfile();
    }, [viewMode, userProfile]);
    
    // Fetch extra data only for the profile page
    useEffect(() => {
        if (customerPage !== 'profile') return;

        const fetchProfilePageData = async () => {
            setIsProfileLoading(true);
            try {
                // Fetch Past Orders
                const ordersQuery = query(collection(db, "orders"), where("customerId", "==", MOCK_USER_ID));
                const ordersSnapshot = await getDocs(ordersQuery);
                const fetchedOrders: PastOrder[] = ordersSnapshot.docs
                    .map(doc => ({ data: doc.data(), id: doc.id }))
                    .sort((a, b) => b.data.createdAt.toMillis() - a.data.createdAt.toMillis())
                    .map(({ data, id }) => ({
                        id: data.orderNumber || id,
                        restaurantName: data.restaurantName || 'مطعم غير معروف',
                        date: data.createdAt.toDate().toLocaleDateString('ar-SA'),
                        total: data.finalAmount,
                        status: mapBackendStatusToFrontend(data.status),
                        items: data.items.map((i: any) => ({ name: i.productName, quantity: i.quantity, category: i.category })),
                        deliveryAddress: data.deliveryAddress,
                    }));
                setPastOrders(fetchedOrders);

                // Fetch Saved Addresses
                const addressesCollectionRef = collection(db, 'users', MOCK_USER_ID, 'addresses');
                const addressesSnapshot = await getDocs(addressesCollectionRef);
                const fetchedAddresses: SavedAddress[] = addressesSnapshot.docs.map(addrDoc => ({ id: addrDoc.id, ...addrDoc.data() } as SavedAddress));
                if (fetchedAddresses.length === 0) {
                    const mockAddr = { name: "المنزل", details: "1234 شارع الملك فهد، حي العليا، الرياض", isDefault: true };
                    const newAddrRef = await addDoc(addressesCollectionRef, mockAddr);
                    setSavedAddresses([{ ...mockAddr, id: newAddrRef.id }]);
                } else {
                    setSavedAddresses(fetchedAddresses);
                }

            } catch (e) {
                console.error("Error fetching profile page data", e);
            } finally {
                setIsProfileLoading(false);
            }
        };

        fetchProfilePageData();
    }, [customerPage]);


    const handleLocationConfirm = async (coords: { lat: number, lng: number }) => {
        setIsLocationModalOpen(false);
        setIsLocationConfirming(true);

        let address = "موقع غير محدد بدقة";
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
            const data = await response.json();
            address = data.display_name || address;
            
            const locationToStore: UserLocation = { lat: coords.lat, lng: coords.lng, address };
            localStorage.setItem("userLocation", JSON.stringify(locationToStore));

            const userDocRef = doc(db, 'users', MOCK_USER_ID);
            await setDoc(userDocRef, {
                lastKnownLocation: {
                    latitude: coords.lat,
                    longitude: coords.lng,
                    timestamp: Timestamp.now(),
                    addressText: address,
                }
            }, { merge: true });

            setUserLocation(locationToStore);
        } catch (error) {
            console.error('Error during location confirmation:', error);
        } finally {
            setIsLocationConfirming(false);
        }
    };
    
    const handleUpdateProfile = async (newData: Omit<UserProfileData, 'id' | 'avatarUrl'>) => {
        const userDocRef = doc(db, 'users', MOCK_USER_ID);
        await updateDoc(userDocRef, newData);
        setUserProfile(prev => prev ? { ...prev, ...newData } : null);
    };

    const handleSaveAddress = async (address: SavedAddress) => {
        const addressesCollectionRef = collection(db, 'users', MOCK_USER_ID, 'addresses');
        if (address.id && address.id !== '0') {
            const addressDocRef = doc(db, 'users', MOCK_USER_ID, 'addresses', address.id);
            await updateDoc(addressDocRef, { name: address.name, details: address.details, isDefault: address.isDefault });
            setSavedAddresses(prev => prev.map(a => a.id === address.id ? address : a));
        } else {
            const { id, ...dataToSave } = address;
            const newDocRef = await addDoc(addressesCollectionRef, dataToSave);
            setSavedAddresses(prev => [...prev, { ...dataToSave, id: newDocRef.id }]);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        const addressDocRef = doc(db, 'users', MOCK_USER_ID, 'addresses', addressId);
        await deleteDoc(addressDocRef);
        setSavedAddresses(prev => prev.filter(a => a.id !== addressId));
    };

    const handleTrackOrder = (order: PastOrder) => {
        setOrderToTrack(order);
        setIsTrackingModalOpen(true);
    };


    const addToCart = (newItem: CartItem) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(
                item => item.product.id === newItem.product.id && JSON.stringify(item.selectedOptions) === JSON.stringify(newItem.selectedOptions)
            );
            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += newItem.quantity;
                updatedItems[existingItemIndex].totalPrice += newItem.totalPrice;
                return updatedItems;
            } else {
                return [...prevItems, newItem];
            }
        });
        
        setNotificationMessage(`تمت إضافة "${newItem.product.name}" إلى سلتك!`);
        setTimeout(() => setNotificationMessage(null), 3000);
    };
    
    const handleBackFromProduct = () => {
        setSelectedProduct(null);
        setCustomerPage(previousCustomerPage);
    };
    
    const handleAddToCartFromDetails = (item: CartItem) => {
        addToCart(item);
    };

    const handleNavigateToProduct = (product: Product) => {
        setSelectedProduct(product);
        setPreviousCustomerPage(customerPage);
        setCustomerPage('product-details');
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const renderAdminPage = () => {
        switch (activePage) {
            case 'dashboard': return <DashboardPage />;
            case 'orders-management': return <OrdersManagementPage />;
            case 'restaurants-management': return <RestaurantsManagementPage />;
            case 'products-management': return <ProductsManagementPage />;
            case 'categories-management': return <CategoriesManagementPage />;
            case 'drivers-management': return <DriversManagementPage />;
            case 'users-management': return <UsersManagementPage />;
            case 'finance': return <FinancePage />;
            case 'reports': return <ReportsPage />;
            case 'marketing': return <MarketingPage />;
            case 'offers-management': return <OffersManagementPage />;
            case 'home-page-management': return <HomePageManagementPage />;
            case 'ai-algorithms': return <AiAlgorithmsPage />;
            case 'support-chatbot': return <SupportChatbotPage />;
            case 'settings': return <SettingsPage />;
            case 'orders': return <OrdersManagementPage />;
            case 'couriers': return <DriversManagementPage />;
            case 'restaurants': return <RestaurantsManagementPage />;
            case 'customers': return <UsersManagementPage />;
            default: return <DashboardPage />;
        }
    };
    
    const renderCustomerPage = () => {
        switch (customerPage) {
            case 'home':
                return <CustomerHomePage 
                    onNavigateToRestaurant={(restaurantId) => {
                        setSelectedRestaurantId(restaurantId);
                        setCustomerPage('restaurant');
                    }} 
                    onNavigateToCategory={(categoryName) => {
                        setSelectedCategory(categoryName);
                        setCustomerPage('category-products');
                    }}
                    onNavigateToProduct={handleNavigateToProduct}
                    userLocation={userLocation}
                    onOpenLocationModal={() => setIsLocationModalOpen(true)}
                    isLocationConfirming={isLocationConfirming}
                />;
            case 'restaurant':
                if (!selectedRestaurantId) {
                    setCustomerPage('home');
                    return null;
                }
                return <RestaurantProfilePage 
                    restaurantId={selectedRestaurantId} 
                    onBack={() => {
                        setSelectedRestaurantId(null);
                        setCustomerPage('home');
                    }}
                    onAddToCart={addToCart}
                    setCustomerPage={setCustomerPage}
                    onProductClick={handleNavigateToProduct}
                    cartItems={cartItems}
                />;
            case 'category-products':
                if (!selectedCategory) {
                    setCustomerPage('home');
                    return null;
                }
                return <CategoryProductsPage
                    categoryName={selectedCategory}
                    onBack={() => {
                        setSelectedCategory(null);
                        setCustomerPage('home');
                    }}
                    onProductClick={handleNavigateToProduct}
                />;
             case 'product-details':
                if (!selectedProduct) {
                    setCustomerPage(previousCustomerPage || 'home');
                    return null;
                }
                return <ProductDetailsPage
                            product={selectedProduct}
                            onBack={handleBackFromProduct}
                            onAddToCart={handleAddToCartFromDetails}
                            cartItems={cartItems}
                            setCustomerPage={setCustomerPage}
                        />;
            case 'checkout':
                return <CheckoutPage 
                            cartItems={cartItems} 
                            onClearCart={clearCart} 
                            userLocation={userLocation}
                            onOpenLocationModal={() => setIsLocationModalOpen(true)}
                            userProfile={userProfile}
                            appSettings={appSettings}
                        />;
            case 'profile':
                 return <UserProfilePage
                    user={userProfile}
                    orders={pastOrders}
                    addresses={savedAddresses}
                    isLoading={isProfileLoading}
                    onUpdateProfile={handleUpdateProfile}
                    onSaveAddress={handleSaveAddress}
                    onDeleteAddress={handleDeleteAddress}
                    onTrackOrder={handleTrackOrder}
                    deferredInstallPrompt={deferredInstallPrompt}
                    onInstallApp={handleInstallApp}
                />;
            default:
                return <CustomerHomePage 
                            onNavigateToRestaurant={() => {}} 
                            onNavigateToCategory={() => {}}
                            onNavigateToProduct={handleNavigateToProduct}
                            userLocation={userLocation}
                            onOpenLocationModal={() => setIsLocationModalOpen(true)}
                            isLocationConfirming={isLocationConfirming}
                        />;
        }
    };

    if (!isFirebaseReady) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (firebaseError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
                <div className="max-w-2xl w-full">
                    <ErrorDisplay message={firebaseError} />
                </div>
            </div>
        );
    }


    if (viewMode === 'driver') {
        if (driverId) {
            return <DriverDashboardPage driverId={driverId} onLogout={handleDriverLogout} />;
        }
        return <DriverLoginPage onLoginSuccess={handleDriverLogin} />;
    }

    if (viewMode === 'admin') {
         return (
            <div className="relative min-h-screen bg-gray-100 lg:flex" dir="rtl">
                <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={isSidebarOpen} setOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col">
                    <Header title={pageTitles[activePage] || 'لوحة التحكم'} onMenuClick={() => setIsSidebarOpen(true)} />
                    <main className="flex-1 p-6 bg-gray-100">
                        {renderAdminPage()}
                    </main>
                </div>
            </div>
        );
    }

    // Customer View
    return (
        <div className="min-h-screen">
            <CustomerHeader 
              setCustomerPage={setCustomerPage} 
              cartItems={cartItems}
              setCartItems={setCartItems}
              settings={appSettings?.general ?? null}
            />
            <main>{renderCustomerPage()}</main>
            
            {cartItems.length > 0 && customerPage !== 'checkout' && (
                <FloatingCart 
                    cartItems={cartItems} 
                    onCheckout={() => setCustomerPage('checkout')} 
                />
            )}
             {notificationMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#3E2F1C] text-white flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-semibold">{notificationMessage}</span>
                </div>
            )}
             <LocationModal 
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onConfirm={handleLocationConfirm}
                isConfirming={isLocationConfirming}
            />
            <CustomerOrderTrackingModal
                order={orderToTrack}
                isOpen={isTrackingModalOpen}
                onClose={() => setIsTrackingModalOpen(false)}
            />
            {deferredInstallPrompt && (
                <InstallPwaBanner onInstall={handleInstallApp} />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <MainApp />
    );
};

export default App;