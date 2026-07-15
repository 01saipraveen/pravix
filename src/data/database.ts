export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  price: number; // In USD
  rating: number;
  reviewsCount: number;
  stock: number;
  images: string[];
  specifications: Record<string, string>;
  reviews: Review[];
  isNew: boolean;
  isBestSeller: boolean;
  flashSaleDiscount?: number; // percentage
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'smartphones',
    name: 'Smartphones & Tablets',
    icon: 'Smartphone',
    description: 'Next-generation neural processors and stunning OLED screens.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'laptops',
    name: 'Laptops & Workstations',
    icon: 'Laptop',
    description: 'Pro-grade performance computing for creators and developers.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'audio',
    name: 'Audio & Wearables',
    icon: 'Headphones',
    description: 'Immersive soundscapes and smart bio-tracking metrics.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'smarthome',
    name: 'Smart Home & Displays',
    icon: 'Home',
    description: 'Connected living spaces with intelligent automation.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'NexusBook Pro 16',
    tagline: 'Supercharged by M3 Neural Architecture',
    description: 'The ultimate professional workstation designed for developers, artists, and power users. Featuring an incredibly bright 120Hz Liquid Retina XDR display, up to 22 hours of battery life, and the blazing fast M3 Ultra chip.',
    category: 'laptops',
    price: 2499,
    rating: 4.9,
    reviewsCount: 148,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      Processor: 'Nexus Neural M3 Ultra (16-core CPU, 40-core GPU)',
      Memory: '48GB Unified LPDDR5X Memory',
      Storage: '1TB Ultra-Fast NVMe SSD (7400MB/s)',
      Display: '16.2" Mini-LED (3024 x 1964, 1600 nits peak, 120Hz ProMotion)',
      Battery: '100Wh Lithium-Polymer (up to 22 hours active playback)',
      Weight: '2.15 kg (4.7 lbs)',
      OperatingSystem: 'NexusOS Core v14.2',
    },
    reviews: [
      {
        id: 'r1',
        author: 'Alex Mercer',
        rating: 5,
        date: '2026-06-12',
        content: 'This machine is a absolute monster. Compiles giant monorepos in seconds, and the battery lasts for an entire weekend coding session. Display is gorgeous.',
      },
      {
        id: 'r2',
        author: 'Elena Rostova',
        rating: 5,
        date: '2026-06-25',
        content: 'Perfect for video rendering. Highly recommend upgrading memory to 48GB. Silent even under max load!',
      },
    ],
    isNew: true,
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'AeroBuds Studio Max',
    tagline: 'High-Fidelity Sound. Zero Interruption.',
    description: 'Immerse yourself in concert-grade audio with custom-designed dynamic drivers and industry-leading hybrid Active Noise Cancellation (ANC). Features ultra-low latency spatial tracking.',
    category: 'audio',
    price: 349,
    rating: 4.8,
    reviewsCount: 382,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      DriverSize: '40mm Custom Dynamic Transducer',
      NoiseCancellation: 'Active Hybrid ANC with Transparency mode',
      Bluetooth: 'v5.3 LE Audio (LC3 Codec Support)',
      BatteryLife: 'Up to 45 hours (ANC off), 35 hours (ANC on)',
      Charging: 'USB-C Fast Charge (10 mins = 5 hours playback)',
      Sensors: '6-axis gyroscope for Spatial Audio head-tracking',
    },
    reviews: [
      {
        id: 'r3',
        author: 'Marcus Vance',
        rating: 5,
        date: '2026-05-18',
        content: 'The ANC is scary good. Blocked out an entire trans-atlantic flight engine noise. Audio is perfectly balanced, deep bass without muddiness.',
      },
    ],
    isNew: false,
    isBestSeller: true,
    flashSaleDiscount: 15, // 15% discount
  },
  {
    id: '3',
    name: 'Nexus Alpha 15 Pro',
    tagline: 'Sovereign of Mobile Photography',
    description: 'Redefining smartphones with a revolutionary 200MP quadruple camera setup featuring liquid lenses and AI NightSight Ultra. Powered by Snapdragon 8 Gen 5 Elite.',
    category: 'smartphones',
    price: 1199,
    rating: 4.7,
    reviewsCount: 229,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      Processor: 'Snapdragon 8 Gen 5 Elite (4nm Neural Engine)',
      Display: '6.82" Dynamic AMOLED 2X (QHD+, 144Hz, Gorilla Glass Armor)',
      RearCamera: '200MP Main + 50MP Periscope (5x optical) + 12MP Ultra-wide + 10MP Macro',
      FrontCamera: '40MP Dual-Pixel Autofocus',
      Battery: '5500mAh with 100W HyperCharge',
      WaterResistance: 'IP68 Certified dust & water proof',
    },
    reviews: [],
    isNew: true,
    isBestSeller: false,
  },
  {
    id: '4',
    name: 'Chronos Smart Watch S5',
    tagline: 'Your Health, Engineered Elegantly.',
    description: 'The premium smartwatch for serious health and athletic monitoring. Track blood-oxygen levels, continuous ECG, hydration metrics, and advanced sleep stages with military-grade GPS.',
    category: 'audio',
    price: 399,
    rating: 4.6,
    reviewsCount: 95,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      CaseMaterial: 'Aerospace-grade Titanium alloy',
      Display: '1.92" Always-on Retina OLED (2000 nits brightness)',
      Sensors: 'Biometric Heart Sensor, SpO2 sensor, ECG electrode grid, Depth gauge',
      GPS: 'Dual-frequency Precision L1 + L5 GPS',
      Waterproof: 'WR100 (100 meters dive rating)',
      Battery: 'Up to 72 hours in power reserve mode',
    },
    reviews: [
      {
        id: 'r4',
        author: 'Kenji Sato',
        rating: 4,
        date: '2026-07-02',
        content: 'Excellent build quality. Highly accurate GPS tracks my runs perfectly. Battery is slightly shorter than advertised if GPS is running constantly, but charges extremely fast.',
      },
    ],
    isNew: false,
    isBestSeller: false,
  },
  {
    id: '5',
    name: 'Nexus Aura Ambient Hub',
    tagline: 'The Core of Intelligent Living',
    description: 'The smart assistant display designed to manage your entire smart home ecosystem effortlessly. Features a stunning 10-inch glass touch panel, 360-degree high-fidelity speaker, and integrated thread/matter bridge.',
    category: 'smarthome',
    price: 249,
    rating: 4.8,
    reviewsCount: 112,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      Display: '10.1" IPS Interactive Multi-Touch Screen',
      Audio: '2.1 Channels Speaker system with passive radiators',
      SmartProtocols: 'Matter, Thread, Zigbee 3.0, Bluetooth Mesh',
      Camera: '5MP wide-angle sensor for home monitoring & calls',
      Privacy: 'Physical camera shutter and microphone disable switch',
    },
    reviews: [],
    isNew: false,
    isBestSeller: false,
    flashSaleDiscount: 20, // 20% discount
  },
  {
    id: '6',
    name: 'Tactile Pro Mechanical Keyboard',
    tagline: 'Precision tactile response for typing purists.',
    description: 'An elite wireless mechanical keyboard crafted with a CNC-milled aluminum chassis, hot-swappable custom silent-tactile switches, and double-shot PBT keycaps. Designed for premium feel and style.',
    category: 'laptops',
    price: 199,
    rating: 4.9,
    reviewsCount: 88,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: {
      Layout: '75% Compact layout (82 Keys)',
      Chassis: 'Anodized 6063 Aluminum (milled & sandblasted)',
      Switches: 'Nexus Silent-Tactile Linear (55g actuation force)',
      Connectivity: 'Bluetooth 5.1 / 2.4Ghz Wireless / USB-C Wired',
      Battery: '4000mAh (up to 150 hours RGB off)',
      Keycaps: 'Double-shot PBT Cherry Profile',
    },
    reviews: [],
    isNew: false,
    isBestSeller: true,
  },
];

export const brandLogos: string[] = [
  'Intel',
  'AMD',
  'NVIDIA',
  'Qualcomm',
  'Samsung',
  'Apple',
  'Sony',
];

export const faqs: FAQ[] = [
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, Pravix delivers products globally. International shipping rates and custom clearance values are calculated dynamically at checkout based on your country and address details.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day hassle-free return policy. Items must be returned in their original packaging and condition to qualify for a full refund.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is processed, a tracking link with estimated shipping dates is generated in your user dashboard under the Order History tab.',
  },
  {
    question: 'Are there student or developer discounts?',
    answer: 'Yes! Students and verified developers can use discount coupon code "TECH20" for an instant 20% discount on all computers and gear.',
  },
];

export const coupons: Coupon[] = [
  {
    code: 'TECH20',
    discountType: 'percentage',
    value: 20,
    description: 'Save 20% on all orders.',
  },
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    description: '10% discount for new customers.',
  },
  {
    code: 'SAVE100',
    discountType: 'fixed',
    value: 100,
    minSpend: 500,
    description: '$100 off on orders over $500.',
  },
];
