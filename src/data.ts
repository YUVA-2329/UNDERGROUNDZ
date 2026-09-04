import { ProductItem, CommunityPost, ProductReview } from './types';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'void-hoodie',
    code: '001',
    itemNumber: 'Item_01',
    name: 'THE VOID HOODIE',
    category: 'HOODIES',
    price: 320,
    originalPrice: 380,
    currency: '$',
    description: 'A premium black streetwear hoodie featuring a bold UNDERGROUNDZ logo.',
    longDescription: 'Engineered for the ultimate urban professional, The Void Hoodie combines luxury heavy cotton with an unapologetic brutalist streetwear design. Stamped with the signature UNDERGROUNDZ chest logo.',
    image: '/hoodie.png',
    images: [
      '/hoodie.png',
      '/hoodie1.png',
      '/hoodie2.png',
      '/hoodie3.png'
    ],
    model: 'MAN',
    undergroundzBranding: 'UNDERGROUNDZ Bold Chest Logo',
    specs: {
      waterproof: 'None',
      weight: '800G',
      material: '100% Heavyweight Cotton',
      hardware: 'Custom Metal Aglets',
      utility: 'Kangaroo Pocket',
      thermal: 'All Season',
      rating: 'Premium'
    },
    macroImages: [],
    origin: 'Berlin / Design Lab 01',
    editionStatus: 'Core Collection',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { id: 'void-black', name: 'VOID BLACK', hex: '#111111', borderClass: 'border-white' },
      { id: 'stealth-charcoal', name: 'STEALTH CHARCOAL', hex: '#242426', borderClass: 'border-[#555]' },
      { id: 'industrial-slate', name: 'INDUSTRIAL SLATE', hex: '#373a40', borderClass: 'border-[#666]' }
    ],
    inStock: true,
    stockCount: 14,
    reviewsCount: 5,
    ratingSummary: 4.9,
    materialInfo: '800GSM custom loopback fleece weave with pre-shrunk enzyme bath finishing.'
  },
  {
    id: 'core-tshirt',
    code: '002',
    itemNumber: 'Item_02',
    name: 'THE CORE T-SHIRT',
    category: 'TEES',
    price: 150,
    originalPrice: 190,
    currency: '$',
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
    price: 240,
    originalPrice: 295,
    currency: '$',
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
    price: 400,
    originalPrice: 470,
    currency: '$',
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
      reviewText: 'The 800g weight is phenomenal. Hangs with structural authority and the UNDERGROUNDZ chest emblem is crisp matte enamel.',
      verifiedPurchase: true,
      stylingImage: '/hoodie3.png',
      sizeWorn: 'L',
      colorWorn: 'VOID BLACK',
      isDemo: true
    },
    {
      id: 'rev-vh-2',
      productId: 'void-hoodie',
      userName: 'Marcus Sterling',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Heavy, boxy, uncompromising. Hood holds shape perfectly even during high-velocity commutes on the bike.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'XL',
      colorWorn: 'VOID BLACK',
      isDemo: true
    },
    {
      id: 'rev-vh-3',
      productId: 'void-hoodie',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Ordered size M for an oversized boyfriend fit. The metal aglets and seams scream technical high-fashion.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'M',
      colorWorn: 'STEALTH CHARCOAL',
      isDemo: true
    },
    {
      id: 'rev-vh-4',
      productId: 'void-hoodie',
      userName: 'Tariq Al-Mansoor',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 4,
      reviewDate: '2 months ago',
      reviewText: 'High quality fleece. Keep in mind it is genuinely heavyweight—best for sub-18°C weather.',
      verifiedPurchase: true,
      sizeWorn: 'L',
      colorWorn: 'VOID BLACK',
      isDemo: true
    },
    {
      id: 'rev-vh-5',
      productId: 'void-hoodie',
      userName: 'Sora Tanaka',
      userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      reviewDate: '3 months ago',
      reviewText: 'Straight out of Neo-Tokyo. Pairs effortlessly with cargo units and tech boots.',
      verifiedPurchase: true,
      stylingImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
      sizeWorn: 'S',
      colorWorn: 'INDUSTRIAL SLATE',
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


export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'KYLE_082 / FOUNDATION',
    role: 'MEMBER_VERIFIED',
    location: 'LOCATION: BERLIN_SECTOR_04',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiwcxyRV5BTbw3RlmYtqUcXAiD0jTPRyGQg2L-9hm7aTGLxC6ELLQuigEg7KPXVGzqlSPchcnoqyXcgNIj3J3owT_vJSXqyhdjvYdKSXO7Yj3L5OLKcFpj32L5vnb4q9aFtI5x-FfSjPqymZJAYR54-3dHWAaqLMrvgBNUYwN5vsAcFJg22Sd1JZnx4IdkCjvLlBJzVU-HHURrWSftGtpMNkoFanBAVKNpsEv61vT4Wul4W0J7WB9QMw',
    type: 'verified_member',
    heightClass: 'lg',
    timestamp: '2026-07-29T14:22:00Z'
  },
  {
    id: 'post-2',
    author: 'ARCHIVE_01',
    role: 'VERIFIED RIDER',
    location: 'TOKYO_SHIBUYA',
    type: 'quote',
    quote: '"A level of craftsmanship that\'s immediately noticeable. The UNDERGROUNDZ chest branding stands out in dark alleyways."',
    heightClass: 'sm',
    timestamp: '2026-07-28T09:15:00Z'
  },
  {
    id: 'post-3',
    author: 'RIDER_88',
    role: 'MECHANICAL FEED',
    location: 'HAMBURG_DOCKS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNW-H2qu9ui4sLN7GrpjTr-GZ3dgudySwDmCSfCX6z5P4fBE8Lr4V7wiQyssTmKsoZtTeBvVi_YpmXnFhUCbsPI_CS5-dBzVD5brISPy1jwWDE5OwS4ZYlLb00vWCGJiyMdEXPqIU2l33UJMPW6ha_GsklG3cBbnfaBK5Nw7hO8A5JTaJxtM7YK3_oAXs1dgvj8-34md9IRW0U--WxO56yawb9G9Xg1r-Akh1_h0H8nz0O6tOJh5UCWA',
    type: 'photo',
    title: 'ENGINE_MECHANICS_V2',
    heightClass: 'md',
    timestamp: '2026-07-27T18:40:00Z'
  },
  {
    id: 'post-4',
    author: 'VELOCITY_STUDY_09',
    role: 'FIELD RIDER',
    location: 'PARIS_TUNNELS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDNAws_4DeeAMwziU4qvarsDMHRFFRsal5bX7ImL-LF2ARqnnGdTHDvwRcFXF3sVuU9_BFIj_aeaYPsNyir_AK1DBMZFALuxNVp2vJSXzjLFL0PSkX39Tooo7wPt4EI-s5ue-lqs4-LXRNSmDNCvWIFjkT9dPaG_0wk7YmlGxw_JA2EIyRJZUB6gx_T9Yp-CIXhTfDzkpGHhix5GpQ_2ByIG3Kia5zz4lAI_lfE5tITbL6pNYlWFOQZ_w',
    type: 'velocity',
    title: 'HIGH SPEED TRANSIT',
    heightClass: 'lg',
    timestamp: '2026-07-26T22:05:00Z'
  },
  {
    id: 'post-5',
    author: 'SECTOR_CHIEF',
    role: 'ELITE EVALUATOR',
    location: 'LONDON_SUBWAY',
    type: 'review',
    quote: 'BEYOND THE FABRIC. IT\'S A TECHNICAL SHIELD FOR THE URBAN FRONTIER. THE SILHOUETTE IS AGGRESSIVE, UNAPOLOGETIC, AND PROUDLY EMBOSSED WITH UNDERGROUNDZ.',
    rating: 5.0,
    heightClass: 'md',
    timestamp: '2026-07-25T11:30:00Z'
  },
  {
    id: 'post-6',
    author: 'NEO_CONCRETE',
    role: 'ARCHITECTURAL OBSERVER',
    location: 'SPOKANE_DAM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA49SpwzYTy0cEhT3jHVVSD-O8-3XEIQR532VB7EX3WI0TQGA0QGNzFHYnwicvyBiQQdQTDhW8jdon_UmhsTMyIWbMyGM8cf5arOKqqEXBWPaiz9NCA_itfhdrWklf8pYPCEftmGGxfYXvyfoa7Pxdioww28Z_Ln2AKZgQObxgRnGerZlhTEmz9LZoWFCqkncuBjxbq4nXeqCm03ywU9_HAzkHUa_DLTdYIBfKvZoPTcaooi73ruTNdlw',
    type: 'photo',
    heightClass: 'md',
    timestamp: '2026-07-24T16:00:00Z'
  }
];

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
