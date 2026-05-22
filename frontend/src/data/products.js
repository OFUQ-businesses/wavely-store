export const productsData = [
  {
    id: 1,
    name: 'Wavely Sonic 360 Toothbrush',
    price: 99.00,
    originalPrice: 129.99,
    rating: 4.9,
    reviews: 420,
    stock: 45,
    description: 'Experience professional-grade cleaning with advanced sonic technology, featuring 5 modes, smart timer, and long battery life. Designed for a brighter smile.',
    image: 'https://via.placeholder.com/400x400?text=Sonic+360+Toothbrush',
    category: 'Oral Care',
    colors: ['#1E40AF', '#DC2626', '#16A34A'],
    colorNames: ['Ocean Blue', 'Rose Red', 'Mint Green'],
    features: [
      '62,000 brush strokes per minute',
      '5 cleaning modes',
      'Smart timer with 30-second intervals',
      '14-day battery life',
      'IPX7 waterproof rating',
      'Pressure sensor to prevent gum damage'
    ],
    techSpecs: {
      'Motor Speed': '62,000 strokes/min',
      'Cleaning Modes': '5',
      'Battery Life': '14 days',
      'Charging Time': '4 hours',
      'Waterproof Rating': 'IPX7',
      'Dimensions': '2.5" × 0.8"',
      'Weight': '85g'
    },
    boxContents: [
      'Sonic 360 Toothbrush (1)',
      'Charging dock (1)',
      'Replacement brush heads (2)',
      'USB-C charging cable (1)',
      'User manual (1)',
      'Warranty card (1)'
    ],
    isNew: false,
    freeShipping: true
  },
  {
    id: 2,
    name: 'Replacement Brush Heads',
    price: 20.00,
    originalPrice: 25.00,
    rating: 4.8,
    reviews: 312,
    stock: 120,
    description: 'Compatible replacement brush heads for Sonic 360. Pack of 4 heads for continuous care.',
    image: 'https://via.placeholder.com/400x400?text=Brush+Heads',
    category: 'Accessories',
    colors: ['#1E40AF'],
    colorNames: ['Default'],
    features: [
      'Soft-bristle design',
      'Optimal cleaning angle',
      '3-month replacement recommended',
      'Easy snap-on attachment'
    ],
    techSpecs: {
      'Bristle Type': 'Soft',
      'Bristle Count': '2000+',
      'Lifespan': '3 months',
      'Compatibility': 'Sonic 360 models'
    },
    boxContents: [
      'Replacement brush heads (4)'
    ],
    isNew: false,
    freeShipping: true
  },
  {
    id: 3,
    name: 'Water Flosser Pro',
    price: 29.00,
    originalPrice: 49.99,
    rating: 4.7,
    reviews: 156,
    stock: 32,
    description: 'Advanced water flossing technology for deep cleaning between teeth. 3 pressure settings.',
    image: 'https://via.placeholder.com/400x400?text=Water+Flosser',
    category: 'Oral Care',
    colors: ['#1E40AF', '#6B7280'],
    colorNames: ['White', 'Black'],
    features: [
      '3 pressure settings',
      '200ml water tank capacity',
      'Cordless design',
      '3 interchangeable nozzles'
    ],
    techSpecs: {
      'Tank Capacity': '200ml',
      'Pressure Settings': '3',
      'Battery Life': '10 days',
      'Nozzles Included': '3'
    },
    boxContents: [
      'Water Flosser (1)',
      'Charging dock (1)',
      'Nozzles (3)',
      'Charging cable (1)'
    ],
    isNew: true,
    freeShipping: true
  },
  {
    id: 4,
    name: 'Whitening Strips Premium',
    price: 39.00,
    originalPrice: 59.99,
    rating: 4.6,
    reviews: 278,
    stock: 85,
    description: 'Professional-strength whitening strips for 8 shades whiter teeth in 14 days.',
    image: 'https://via.placeholder.com/400x400?text=Whitening+Strips',
    category: 'Whitening',
    colors: ['#F5F5F5'],
    colorNames: ['White'],
    features: [
      '8 shades whiter in 14 days',
      'Enamel-safe formula',
      '30-minute application',
      'No sensitivity formula'
    ],
    techSpecs: {
      'Strips per Box': '14 pairs',
      'Application Time': '30 minutes',
      'Results Duration': '6 months',
      'Enamel Safe': 'Yes'
    },
    boxContents: [
      'Whitening strips (14 pairs)',
      'Shade guide (1)',
      'Instructions (1)'
    ],
    isNew: false,
    freeShipping: true
  },
  {
    id: 5,
    name: 'Portable UV Sanitizer',
    price: 45.00,
    originalPrice: 69.99,
    rating: 4.8,
    reviews: 189,
    stock: 28,
    description: 'UV-C technology eliminates 99.9% of bacteria from your toothbrush in 60 seconds.',
    image: 'https://via.placeholder.com/400x400?text=UV+Sanitizer',
    category: 'Accessories',
    colors: ['#1E40AF', '#F3F4F6'],
    colorNames: ['Deep Blue', 'Light Gray'],
    features: [
      'UV-C technology',
      '99.9% bacterial elimination',
      '60-second cycle',
      'Travel-friendly size'
    ],
    techSpecs: {
      'UV Wavelength': '254nm',
      'Cycle Time': '60 seconds',
      'Power': 'USB rechargeable',
      'Dimensions': '4" × 2.5" × 1.5"'
    },
    boxContents: [
      'UV Sanitizer (1)',
      'USB cable (1)',
      'User manual (1)'
    ],
    isNew: true,
    freeShipping: false
  },
  {
    id: 6,
    name: 'Mouthwash Ultimate Clean',
    price: 12.00,
    originalPrice: 15.99,
    rating: 4.5,
    reviews: 245,
    stock: 200,
    description: 'Alcohol-free mouthwash with advanced formula for 24-hour protection.',
    image: 'https://via.placeholder.com/400x400?text=Mouthwash',
    category: 'Oral Care',
    colors: ['#4F46E5'],
    colorNames: ['Blue'],
    features: [
      'Alcohol-free formula',
      '24-hour protection',
      'Freshmint flavor',
      'Clinically tested'
    ],
    techSpecs: {
      'Volume': '500ml',
      'Type': 'Alcohol-free',
      'Flavor': 'Freshmint',
      'Shelf Life': '3 years'
    },
    boxContents: [
      'Mouthwash bottle (500ml)'
    ],
    isNew: false,
    freeShipping: true
  }
];

export const categories = ['All', 'Oral Care', 'Accessories', 'Whitening'];
export const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: '$0 - $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100+', min: 100, max: Infinity }
];
