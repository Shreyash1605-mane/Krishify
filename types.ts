// FIX: Removed circular type dependency for 'Page' and defined it as a union of all possible page values.
export type Page =
  | 'login'
  | 'register'
  | 'dashboard'
  | 'products'
  | 'myProduce'
  | 'farmersMarket'
  | 'orders'
  | 'chat'
  | 'schemes'
  | 'experts'
  | 'profile'
  | 'cart';

export type UserRole = 'farmer' | 'buyer';

export interface User {
  uid: string; // Firebase Auth UID
  id: string; // Custom ID (FARM-XXXX or contact number)
  email: string;
  name: string;
  contact: string;
  address: string;
  profileImage?: string;
  password?: string; // Should not be stored in Firestore, but used for registration
  role: UserRole;
  farmDetails?: string;
  cropsGrown?: string[];
  location?: { city: string };
}

export interface Review {
  buyerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  farmer: string; // Should be farmer's UID
  farmerName: string; // Keep for display
  stock: number;
  type: 'sale' | 'rental'; // 'rental' price is per day
  category: 'produce' | 'supplies' | 'machinery';
  pricingUnit?: 'kg' | 'hour'; // optional: 'kg' for sale items, 'hour' for rental machinery
  reviews: Review[];
  location?: { city: string }; // For rental machinery
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type PaymentMethod = 'credit-card' | 'paypal' | 'bank-transfer' | 'cod';

export enum OrderStatus {
  PLACED = 'Placed',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface TrackingEvent {
    status: OrderStatus;
    date: string;
    location: string;
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string; // Buyer's UID
  buyerName: string;
  farmerId: string; // Farmer's UID
  farmer: string; // Farmer's name
  productName: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status: OrderStatus;
  trackingHistory: TrackingEvent[];
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Unpaid';
}

export interface ChatMessage {
  id:string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español (Spanish)',
  hi: 'हिन्दी (Hindi)',
  fr: 'Français (French)',
  pt: 'Português (Portuguese)',
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;


export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  language: LanguageCode;
}

export interface ExpertInteractionLog {
  id?: string;
  userId: string;
  userName: string;
  expertId: string;
  expertName: string;
  sender: 'user' | 'expert';
  interactionType: 'message' | 'call';
  callType?: 'video' | 'voice';
  message?: string;
  details: string;
  status: 'sent' | 'connected' | 'queued';
  createdAt: string;
}

export interface Expert {
    id: string;
    name: string;
    expertise: string[];
    bio: string;
    imageUrl: string;
}

export interface Scheme {
    id: string;
    title: string;
    description: string;
    link: string;
}

export interface Loan {
  id: string;
  name: string;
  provider: string;
  interestRate: string; // e.g. '7.5% p.a.'
  maxAmount: string; // e.g. '₹2,00,000'
  link: string;
}