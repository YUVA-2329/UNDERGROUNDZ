import { ProductItem, CommunityPost, ProductReview } from './types';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'void-hoodie',
    code: '001',
    itemNumber: 'Item_01',
    name: 'THE REFLECTION HOODIE',
    category: 'HOODIES',
    price: 1200,
    originalPrice: 1500,
    openingOffer: true,
    currency: '₹',
    description: 'Engineered specifically for night riders with high-intensity retro-reflective threading. Stealth black by day, radiant 360° visibility when struck by headlights after dark.',
    longDescription: 'Manufactured specifically for night riders, The Reflection Hoodie is woven with high-intensity retro-reflective filaments into a heavyweight 480 GSM cotton fleece silhouette. By day, it carries a clean, stealth-black presence. The moment vehicle headlights or street lamps hit it after dark, the reflective weave illuminates with bright 360-degree visibility. Features an ergonomic riding cut, wind-resistant ribbed cuffs, and an oversized helmet-compatible hood. Limited opening offer edition.',
    image: '/hoodie.png',
    images: [
      '/hoodie.png',
      '/hoodie1.png',
      '/hoodie2.png',
      '/hoodie3.png'
    ],
    model: 'MAN',
    undergroundzBranding: 'UNDERGROUNDZ Reflective Chest Emblem',
    specs: {
      waterproof: 'Wind & Mist Resistant',
      weight: '480GSM',
      material: '100% Cotton with Retro-Reflective Filaments',
      hardware: 'Custom Gunmetal Aglets',
      utility: 'Deep Kangaroo Pocket & Concealed Key Clip',
      thermal: 'Cold Wind Resistant',
      rating: 'Night Rider Certified'
    },
    macroImages: [],
    origin: 'Night Ride Division // Lab 01',
    editionStatus: 'Special Opening Offer',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { id: 'night-reflection', name: 'NIGHT REFLECTION', hex: '#16161a', borderClass: 'border-white' }
    ],
    inStock: true,
    stockCount: 14,
    reviewsCount: 5,
    ratingSummary: 4.9,
    materialInfo: '480GSM custom heavy loopback fleece with integrated retro-reflective yarns, pre-shrunk enzyme bath finishing.'
  },
  {
    id: 'core-tshirt',
    code: '002',
    itemNumber: 'Item_02',
    name: 'THE CORE T-SHIRT',
    category: 'TEES',
    price: 799,
    originalPrice: 1199,
    currency: '₹',
    description: 'Premium oversized black streetwear t-shirt with minimalist details.',
    longDescription: 'Crafted from 300GSM organic cotton, this boxy t-shirt offers a structured drape and subtle branding. A perfect foundation for any technical wardrobe.',
    image: '/tshirt.png',
    images: [
      '/tshirt.png',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80'
    ],
    model: 'MAN',
    undergroundzBranding: 'UNDERGROUNDZ Minimalist Print',
    specs: {
      waterproof: 'None',
      weight: '300G',
      material: '100% Organic Cotton',
      hardware: 'None',
      utility: 'Reinforced Collar',
      thermal: 'All Season',
      rating: 'Standard'
    },
    macroImages: [],
    origin: 'Tokyo / Sector 07',
    editionStatus: 'Core Collection',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { id: 'void-black', name: 'MATTE BLACK', hex: '#0f0f10', borderClass: 'border-white' },
      { id: 'washed-ash', name: 'WASHED ASH', hex: '#2b2b2d', borderClass: 'border-[#555]' }
    ],
    inStock: true,
    stockCount: 28,
    reviewsCount: 5,
    ratingSummary: 4.8,
    materialInfo: '300GSM single jersey 100% combed organic ring-spun cotton.'
  },
  {
    id: 'tech-shirt',
    code: '003',
    itemNumber: 'Item_03',
    name: 'THE TECH SHIRT',
    category: 'SHIRTS',
    price: 1499,
    originalPrice: 1999,
    currency: '₹',
    description: 'Sleek utilitarian black overshirt with technical fabrics.',
    longDescription: 'A versatile button-up shirt crafted from weather-resistant tech fabrics. It features concealed pockets and a sharp, tailored silhouette for the modern wanderer.',
    image: '/shirt.png',
    images: [
      '/shirt.png',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80'
    ],
    model: 'MAN',
    undergroundzBranding: 'UNDERGROUNDZ Subdued Tab',
    specs: {
      waterproof: 'DWR Coated',
      weight: '450G',
      material: 'Nylon Blend',
      hardware: 'Matte Snap Buttons',
      utility: 'Concealed Chest Pockets',
      thermal: 'Mild Weather',
      rating: 'Technical'
    },
    macroImages: [],
    origin: 'London / Lab 03',
    editionStatus: 'Limited Release',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { id: 'tactical-black', name: 'TACTICAL BLACK', hex: '#141416', borderClass: 'border-white' },
      { id: 'deep-slate', name: 'DEEP SLATE', hex: '#262a30', borderClass: 'border-[#555]' }
    ],
    inStock: true,
    stockCount: 9,
    reviewsCount: 4,
    ratingSummary: 4.9,
    materialInfo: 'High-tenacity nylon with fluorocarbon-free hydrophobic DWR coating.'
  },
  {
    id: 'brutal-sweater',
    code: '004',
    itemNumber: 'Item_04',
    name: 'THE BRUTALIST SWEATER',
    category: 'KNITS',
    price: 1899,
    originalPrice: 2499,
    currency: '₹',
    description: 'Luxurious heavy knit black sweater with a brutalist streetwear design.',
    longDescription: 'A thick, insulating knit sweater that embraces industrial aesthetics. Designed for extreme comfort without sacrificing the aggressive UNDERGROUNDZ visual language.',
    image: '/sweater.png',
    images: [
      '/sweater.png',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'
    ],
    model: 'MAN',
    undergroundzBranding: 'UNDERGROUNDZ Woven Label',
    specs: {
      waterproof: 'None',
      weight: '900G',
      material: 'Merino Wool Blend',
      hardware: 'None',
      utility: 'Heavy Ribbing',
      thermal: 'Winter / Cold',
      rating: 'Premium'
    },
    macroImages: [],
    origin: 'Oslo / Alpine Unit',
    editionStatus: 'Seasonal',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { id: 'obsidian-black', name: 'OBSIDIAN BLACK', hex: '#0e0e0e', borderClass: 'border-white' },
      { id: 'raw-asphalt', name: 'RAW ASPHALT', hex: '#282828', borderClass: 'border-[#555]' }
    ],
    inStock: true,
    stockCount: 6,
    reviewsCount: 5,
    ratingSummary: 5.0,
    materialInfo: '100% extrafine 19.5 micron merino wool in 5-gauge architectural cardigan rib.'
  }
];

export const PRODUCT_REVIEWS: Record<string, ProductReview[]> = {
  'void-hoodie': [
    {
      id: 'rev-vh-1',
      productId: 'void-hoodie',
      userName: 'Kaelen V.',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '2 weeks ago',
      reviewText: 'The retro-reflective weave is insane at night. Headlights catch it and the whole jacket lights up bright white, but in daytime it looks totally stealth.',
      verifiedPurchase: true,
      stylingImage: '/hoodie3.png',
      sizeWorn: 'L',
      colorWorn: 'NIGHT REFLECTION',
      isDemo: true
    },
    {
      id: 'rev-vh-2',
      productId: 'void-hoodie',
      userName: 'Marcus Sterling',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Best night riding hoodie on the market. Heavy 480GSM cotton stops wind chill completely. Worth way more than the ₹1200 opening offer.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'XL',
      colorWorn: 'NIGHT REFLECTION',
      isDemo: true
    },
    {
      id: 'rev-vh-3',
      productId: 'void-hoodie',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Ordered size M. The reflectivity is subtle in ambient light but glows brilliantly when camera flash or bike headlights strike it.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'M',
      colorWorn: 'NIGHT REFLECTION',
      isDemo: true
    },
    {
      id: 'rev-vh-4',
      productId: 'void-hoodie',
      userName: 'Tariq Al-Mansoor',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '2 months ago',
      reviewText: 'Essential gear for midnight cruising. Deep kangaroo pocket holds phone securely and hood stays locked in place.',
      verifiedPurchase: true,
      sizeWorn: 'L',
      colorWorn: 'NIGHT REFLECTION',
      isDemo: true
    },
    {
      id: 'rev-vh-5',
      productId: 'void-hoodie',
      userName: 'Sora Tanaka',
      userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '3 months ago',
      reviewText: 'High visibility without looking like a construction vest. Genuine technical streetwear for riders.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'S',
      colorWorn: 'NIGHT REFLECTION',
      isDemo: true
    }
  ],
  'core-tshirt': [
    {
      id: 'rev-ct-1',
      productId: 'core-tshirt',
      userName: 'Damon Cole',
      userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '1 week ago',
      reviewText: 'Substantial 300GSM collar that never rolls or sags after washing. The boxy drape is immaculate.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'L',
      colorWorn: 'MATTE BLACK',
      isDemo: true
    },
    {
      id: 'rev-ct-2',
      productId: 'core-tshirt',
      userName: 'Yuki Takahashi',
      userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '3 weeks ago',
      reviewText: 'Minimalist brutalism done right. The subtle typography on the chest adds just the right accent.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'M',
      colorWorn: 'MATTE BLACK',
      isDemo: true
    },
    {
      id: 'rev-ct-3',
      productId: 'core-tshirt',
      userName: 'Chloe Bennett',
      userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
      rating: 4,
      reviewDate: '1 month ago',
      reviewText: 'Heavy organic fabric with great structure. Sized up for an exaggerated silhouette.',
      verifiedPurchase: true,
      sizeWorn: 'M',
      colorWorn: 'WASHED ASH',
      isDemo: true
    },
    {
      id: 'rev-ct-4',
      productId: 'core-tshirt',
      userName: 'Andre Miller',
      userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '2 months ago',
      reviewText: 'Worth every penny. The fabric density prevents that cheap clingy look.',
      verifiedPurchase: true,
      sizeWorn: 'XL',
      colorWorn: 'MATTE BLACK',
      isDemo: true
    }
  ],
  'tech-shirt': [
    {
      id: 'rev-ts-1',
      productId: 'tech-shirt',
      userName: 'Viktor Brandt',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '3 weeks ago',
      reviewText: 'Wore this in torrential Berlin rain. Water beads straight off the DWR coating. Looks razor-sharp.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'L',
      colorWorn: 'TACTICAL BLACK',
      isDemo: true
    },
    {
      id: 'rev-ts-2',
      productId: 'tech-shirt',
      userName: 'Aria Thorne',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'The snap buttons are ultra-satisfying and the hidden chest pockets fit my transit card and phone.',
      verifiedPurchase: true,
      sizeWorn: 'S',
      colorWorn: 'DEEP SLATE',
      isDemo: true
    },
    {
      id: 'rev-ts-3',
      productId: 'tech-shirt',
      userName: 'Hassan R.',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '2 months ago',
      reviewText: 'Clean tailoring meets cyber-tactical functionality. Great layering piece over the Core Tee.',
      verifiedPurchase: true,
      sizeWorn: 'M',
      colorWorn: 'TACTICAL BLACK',
      isDemo: true
    }
  ],
  'brutal-sweater': [
    {
      id: 'rev-bs-1',
      productId: 'brutal-sweater',
      userName: 'Astrid Lind',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '2 weeks ago',
      reviewText: 'Near armor-like 900g ribbing. Soft merino that zero scratchiness, pure luxury heat.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'M',
      colorWorn: 'OBSIDIAN BLACK',
      isDemo: true
    },
    {
      id: 'rev-bs-2',
      productId: 'brutal-sweater',
      userName: 'Reece Sterling',
      userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'The heavyweight rib texture creates unmatched depth in all lighting. An architectural masterpiece.',
      verifiedPurchase: true,
      sizeWorn: 'L',
      colorWorn: 'RAW ASPHALT',
      isDemo: true
    },
    {
      id: 'rev-bs-3',
      productId: 'brutal-sweater',
      userName: 'Kai Zhen',
      userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '2 months ago',
      reviewText: 'Keeps out sub-zero Scandinavian winds with ease. Undergroundz tag on the hip is subtle perfection.',
      verifiedPurchase: true,
      sizeWorn: 'XL',
      colorWorn: 'OBSIDIAN BLACK',
      isDemo: true
    }
  ]
};


export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [];

export const SYSTEM_LOGS_MOCK = [
  '[INFO] BOOTING SYSTEM_CORE_V4.2.0...',
  '[OK] ENCRYPTED_CHANNEL_ESTABLISHED',
  '[LOG] USER_AUTH: SUCCESSFUL_HANDSHAKE',
  '[DATA] TEXTILE_SENSORS: CALIBRATING...',
  '[INFO] RETRIEVING ARCHIVE_DATA_NODE_04',
  '[WARN] SIGNAL_INTERFERENCE_DETECTED: SECTOR_G7',
  '[OK] GPS_SYNC: 52.5200° N, 13.4050° E',
  '[INFO] WEATHER_STATION: 98% HUMIDITY_DETECTED',
  '[LOG] GEAR_STATUS: EXTERNAL_SHELL_ACTIVATED',
  '[DATA] BATTERY_LEVEL: 88%_REMAINING',
  '[INFO] UPDATING_GLOBAL_INDEX...',
  '[OK] 15 COLLECTIONS ACTIVE IN CATALOG',
  '[LOG] FETCHING_RIDER_METRICS...',
  '[INFO] HARDWARE_INTEGRITY: 100% NOMINAL',
  '[DATA] THERMAL_READING: -12.4°C AMBIENT',
  '[OK] DISCORD_BOT_GATEWAY: SYNCED',
  '[LOG] MESH_NETWORK_PEERS: 12,482 ACTIVE NODES'
];
