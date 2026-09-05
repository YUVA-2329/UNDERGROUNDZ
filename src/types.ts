export type ViewType = 'home' | 'collection' | 'product' | 'community' | 'checkout' | 'order-confirmation' | 'my-orders' | 'intro';

export interface ProductSpec {
  waterproof: string;
  weight: string;
  material: string;
  hardware: string;
  utility: string;
  thermal: string;
  rating: string;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  borderClass?: string;
}

export interface ProductItem {
  id: string;
  code: string;
  itemNumber: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  openingOffer?: boolean;
  currency: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  model: 'MAN' | 'WOMAN';
  undergroundzBranding: string;
  specs: ProductSpec;
  macroImages: {
    title: string;
    sub: string;
    image: string;
  }[];
  origin: string;
  editionStatus: string;
  availableSizes: string[];
  availableColors: ProductColor[];
  inStock: boolean;
  stockCount: number;
  reviewsCount: number;
  ratingSummary: number;
  materialInfo: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  reviewDate: string;
  reviewText: string;
  verifiedPurchase: boolean;
  stylingImage?: string;
  sizeWorn?: string;
  colorWorn?: string;
  isDemo: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  role: string;
  location: string;
  image?: string;
  type: 'verified_member' | 'quote' | 'photo' | 'review' | 'velocity';
  quote?: string;
  rating?: number;
  title?: string;
  alt?: string;
  heightClass?: 'sm' | 'md' | 'lg';
  timestamp: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  size: string;
  color: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'demo_paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type OrderStatus =
  | 'Pending Payment'
  | 'Payment Processing'
  | 'Paid'
  | 'Demo Order Confirmed'
  | 'DEMO ORDER'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Payment Failed'
  | 'Refunded';

export interface Order {
  order_id: string;
  user_id?: string;
  items: CartItem[];
  amount: number;
  currency: string;
  customer: CustomerDetails;
  payment_gateway_order_id?: string;
  payment_id?: string;
  demo_transaction_id?: string;
  is_demo?: boolean;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  estimated_delivery?: string;
}

export interface FieldReport {
  id: string;
  callsign: string;
  sector: string;
  gearUsed: string;
  reportText: string;
  timestamp: string;
  status: 'VERIFIED' | 'PENDING';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  shippingAddress?: CustomerDetails;
  callsign?: string;
  sector?: string;
  avatarUrl?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

