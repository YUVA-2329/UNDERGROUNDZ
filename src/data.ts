import { ProductItem, CommunityPost } from './types';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'void-hoodie',
    code: '001',
    itemNumber: 'Item_01',
    name: 'THE VOID HOODIE',
    category: 'HOODIES',
    price: 320,
    currency: '$',
    description: 'A premium black streetwear hoodie featuring a bold UNDERGROUNDZ logo.',
    longDescription: 'Engineered for the ultimate urban professional, The Void Hoodie combines luxury heavy cotton with an unapologetic brutalist streetwear design. Stamped with the signature UNDERGROUNDZ chest logo.',
    image: '/hoodie.png',
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
    availableSizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'core-tshirt',
    code: '002',
    itemNumber: 'Item_02',
    name: 'THE CORE T-SHIRT',
    category: 'TEES',
    price: 150,
    currency: '$',
    description: 'Premium oversized black streetwear t-shirt with minimalist details.',
    longDescription: 'Crafted from 300GSM organic cotton, this boxy t-shirt offers a structured drape and subtle branding. A perfect foundation for any technical wardrobe.',
    image: '/tshirt.png',
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
    availableSizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'tech-shirt',
    code: '003',
    itemNumber: 'Item_03',
    name: 'THE TECH SHIRT',
    category: 'SHIRTS',
    price: 240,
    currency: '$',
    description: 'Sleek utilitarian black overshirt with technical fabrics.',
    longDescription: 'A versatile button-up shirt crafted from weather-resistant tech fabrics. It features concealed pockets and a sharp, tailored silhouette for the modern wanderer.',
    image: '/shirt.png',
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
    availableSizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'brutal-sweater',
    code: '004',
    itemNumber: 'Item_04',
    name: 'THE BRUTALIST SWEATER',
    category: 'KNITS',
    price: 400,
    currency: '$',
    description: 'Luxurious heavy knit black sweater with a brutalist streetwear design.',
    longDescription: 'A thick, insulating knit sweater that embraces industrial aesthetics. Designed for extreme comfort without sacrificing the aggressive UNDERGROUNDZ visual language.',
    image: '/sweater.png',
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
    availableSizes: ['S', 'M', 'L', 'XL']
  }
];

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
