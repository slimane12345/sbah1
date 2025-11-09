import type { Timestamp } from 'firebase/firestore';

// ========= GENERAL & APP SHELL =========

export type Page =
  | 'dashboard'
  | 'orders-management'
  | 'restaurants-management'
  | 'products-management'
  | 'categories-management'
  | 'drivers-management'
  | 'users-management'
  | 'finance'
  | 'reports'
  | 'marketing'
  | 'offers-management'
  | 'home-page-management'
  | 'ai-algorithms'
  | 'support-chatbot'
  | 'settings'
  // Deprecated pages
  | 'orders'
  | 'couriers'
  | 'customers'
  | 'restaurants';

export type CustomerPage = 'home' | 'restaurant' | 'category-products' | 'product-details' | 'checkout' | 'profile';

export type ViewMode = 'admin' | 'customer' | 'driver';

// ========= MODELS & DATA STRUCTURES =========

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  type: 'radio' | 'checkbox';
  options: ProductOption[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  options?: ProductOptionGroup[];
  restaurant: string;
}

export type RestaurantStatus = 'مفتوح' | 'مغلق' | 'قيد المراجعة';

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  cuisine: string;
  status: RestaurantStatus;
  rating: number;
  commissionRate: number;
  totalOrders: number;
  coverImage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions: { [key: string]: ProductOption | ProductOption[] };
  totalPrice: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export type OrderStatus = 'جديد' | 'مؤكد' | 'قيد التجهيز' | 'جاهز' | 'بالتوصيل' | 'مكتمل' | 'ملغي';
export type OrderAdminStatus = OrderStatus; // They are the same.

export interface PastOrder {
  id: string;
  restaurantName: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: { name: string; quantity: number; category: string }[];
  deliveryAddress: { addressText: string; latitude: number; longitude: number };
}

export interface SavedAddress {
  id: string;
  name: string;
  details: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  customer: string;
  restaurant: string;
  total: number;
  status: OrderStatus;
  date: string;
}

export type CourierStatus = 'متاح' | 'مشغول' | 'غير نشط';

export interface Courier {
  id: string;
  name: string;
  avatar: string;
  status: CourierStatus;
  rating: number;
  totalDeliveries: number;
  acceptanceRate: number;
  lastSeen: string;
}

export type LoyaltyTier = 'برونزي' | 'فضي' | 'ذهبي' | 'بلاتيني';

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  loyaltyTier: LoyaltyTier;
}

export type TransactionStatus = 'مكتمل' | 'معلق' | 'فشل';
export type TransactionType = 'إيراد طلب' | 'عمولة مندوب' | 'مدفوعات مطعم' | 'رسوم خدمة';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
}

export type AiAlgorithmStatus = 'نشط' | 'غير نشط' | 'تحت الصيانة';

export interface AiAlgorithm {
  id: string;
  name: string;
  description: string;
  status: AiAlgorithmStatus;
  modelName: string;
  metrics: Record<string, string>;
  enabled: boolean;
}

export interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

export interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

// ========= ADMIN & MANAGEMENT =========

export type UserType = 'admin' | 'restaurant_owner' | 'driver' | 'customer';

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  userType: UserType;
  avatarUrl: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface RestaurantManagementData {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  joinDate: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  location?: { latitude: number; longitude: number; addressText: string };
  coverPhotoUrl?: string;
}

export interface AiAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export type AvailabilityStatus = 'متوفر' | 'غير متوفر';

export interface ProductManagementData {
  id: string;
  name: string;
  image: string;
  restaurant: string;
  category: string;
  price: number;
  availability: AvailabilityStatus;
  description?: string;
  options?: ProductOptionGroup[];
}

export type DriverStatus = 'متاح' | 'مشغول' | 'غير متصل';

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  status: DriverStatus;
  vehicle: string;
  licensePlate: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  lastSeen: string;
}

export type PaymentStatus = 'معلق' | 'مدفوع' | 'غير مدفوع' | 'مسترجع';

export interface OrderManagementData {
  id: string;
  orderNumber: string;
  customer: { name: string; avatar: string };
  restaurant: string;
  total: number;
  status: OrderAdminStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'COD' | 'Credit Card';
  date: string;
  courier: { name: string; avatar: string } | null;
  items: { name: string; quantity: number; price: number; options?: string[]; category?: string }[];
  deliveryAddress: { latitude: number; longitude: number; addressText: string };
  restaurantLocation?: { lat: number, lng: number }; // For DriverDashboardPage
  driverId?: string | null;
}

export type CampaignStatus = 'نشطة' | 'مجدولة' | 'مكتملة' | 'مسودة';

export interface Campaign {
    id: string;
    name: string;
    type: 'Push Notification' | 'SMS' | 'Email';
    status: CampaignStatus;
    targetAudience: string;
    startDate: string;
    endDate: string;
    performance: string;
}

export type OfferStatus = 'نشط' | 'مجدول' | 'منتهي';

export interface Offer {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  status: OfferStatus;
  validFrom: string; // ISO String date
  validTo: string; // ISO String date
  usageCount: number;
  createdAt: string;
}


export interface CategoryManagementData {
  id: string;
  name: string;
  image: string;
  slug: string;
  createdAt: string;
  location?: { latitude: number; longitude: number; addressText: string; };
}


// ========= CHARTS & REPORTING =========

export interface OrderDataPoint {
  day: string;
  orders: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface SalesDataPoint {
  date: string;
  sales: number;
}

export interface CustomerSegment {
  name: string;
  value: number;
}

export interface TopCourier {
  id: string;
  name: string;
  avatar: string;
  deliveries: number;
}

// ========= SETTINGS =========

export interface AppSettings {
  general: {
    platformName: string;
    contactEmail: string;
    address: string;
    logoUrl: string;
  };
  payment: {
    codEnabled: boolean;
    stripeEnabled: boolean;
    stripeKey: string;
    stripeSecret: string;
    paypalEnabled: boolean;
    paypalId: string;
  };
  delivery: {
    baseFee: number;
    kmFee: number;
    freeDeliveryMinimum: number;
  };
  notifications: {
    fcmServerKey: string;
    fcmVapidKey: string;
    notifyRestaurantNewOrder: boolean;
    notifyCustomerStatusUpdate: boolean;
    notifyDriverNewOrder: boolean;
    notifyMarketingOffers: boolean;
  };
  smsEmail: {
    twilioSid: string;
    twilioToken: string;
    twilioNumber: string;
    mailgunKey: string;
    mailgunDomain: string;
  };
}

// ========= HOME PAGE LAYOUT =========

export interface HomePageSection {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  link: string;
  order: number;
  enabled: boolean;
}