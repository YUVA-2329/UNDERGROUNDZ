export type ViewType = 'home' | 'collection' | 'product' | 'community';

export interface ProductSpec {
  waterproof: string;
  weight: string;
  material: string;
  hardware: string;
  utility: string;
  thermal: string;
  rating: string;
}

export interface ProductItem {
  id: string;
  code: string;
  itemNumber: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  longDescription: string;
  image: string;
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
