
import type { User, Product, Order, Expert, Scheme } from './types';
import { OrderStatus } from './types';

export const USERS: User[] = [
  {
    // FIX: Added missing 'uid' and 'email' properties to conform to the User type.
    uid: 'farmer-uid-1',
    email: 'rajesh@example.com',
    id: 'FARM-8675',
    name: 'Rajesh Kumar',
    contact: '1234567890',
    address: '123 Kisaan Lane, Sonipat',
    password: 'password',
    role: 'farmer',
    farmDetails: '5-acre organic farm specializing in vegetables.',
    cropsGrown: ['Tomatoes', 'Carrots', 'Lettuce'],
    location: { city: 'Sonipat' },
  },
  {
    // FIX: Added missing 'uid' property to conform to the User type.
    uid: 'buyer-uid-1',
    id: '0987654321', 
    name: 'Priya Sharma',
    contact: '0987654321',
    address: '456 City Ave, Delhi',
    password: 'password',
    role: 'buyer',
    email: 'priya@example.com',
    location: { city: 'Delhi' },
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod1',
    name: 'Organic Tomatoes',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=2070&auto=format&fit=crop',
    // FIX: Changed 'farmer' to a UID and added the required 'farmerName' property.
    farmer: 'farmer-uid-1',
    farmerName: 'Rajesh Kumar',
    stock: 50,
    type: 'sale',
    category: 'produce',
    reviews: [
        { buyerName: 'Priya Sharma', rating: 5, comment: 'Very fresh and delicious!', date: new Date('2023-10-28T10:00:00Z').toISOString() }
    ],
    location: { city: 'Sonipat' },
  },
  {
    id: 'prod2',
    name: 'Fresh Carrots',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1590422248917-a0a4c2d3e073?q=80&w=2070&auto=format&fit=crop',
    // FIX: Changed 'farmer' to a UID and added the required 'farmerName' property.
    farmer: 'farmer-uid-1',
    farmerName: 'Rajesh Kumar',
    stock: 100,
    type: 'sale',
    category: 'produce',
    reviews: [],
    location: { city: 'Sonipat' },
  },
  {
    id: 'prod3',
    name: 'Crisp Lettuce',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556801712-9c1d9b003a21?q=80&w=2070&auto=format&fit=crop',
    // FIX: Changed 'farmer' to a UID and added the required 'farmerName' property.
    farmer: 'farmer-uid-1',
    farmerName: 'Rajesh Kumar',
    stock: 30,
    type: 'sale',
    category: 'produce',
    reviews: [],
    location: { city: 'Sonipat' },
  },
  {
    id: 'prod4',
    name: 'Sweet Corn',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1551754439-4456a7d53c23?q=80&w=1974&auto=format&fit=crop',
    // FIX: Changed 'farmer' to a UID and added the required 'farmerName' property.
    farmer: 'farmer-uid-1',
    farmerName: 'Rajesh Kumar',
    stock: 0,
    type: 'sale',
    category: 'produce',
    reviews: [],
    location: { city: 'Sonipat' },
  },
  {
    id: 'prod5',
    name: 'Heavy Duty Tractor',
    price: 2000, // Price per day
    imageUrl: 'https://images.unsplash.com/photo-1563729924255-66a6a169f46b?q=80&w=2070&auto=format&fit=crop',
    // FIX: Changed 'farmer' to a UID and added the required 'farmerName' property.
    farmer: 'agricorp-rentals-uid',
    farmerName: 'AgriCorp Rentals',
    stock: 1,
    type: 'rental',
    category: 'machinery',
    reviews: [],
    location: { city: 'Sonipat' },
  },
  {
    id: 'prod6',
    name: 'Premium Fertilizer',
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1615114813299-4d8618a539a0?q=80&w=1964&auto=format&fit=crop',
    // FIX: Changed 'farmer' to a UID and added the required 'farmerName' property.
    farmer: 'agricorp-supplies-uid',
    farmerName: 'AgriCorp Supplies',
    stock: 200,
    type: 'sale',
    category: 'supplies',
    reviews: [],
    location: { city: 'Sonipat' },
  },
];

export const ORDERS: Order[] = [
    {
        id: 'order1',
        productId: 'prod1',
        // FIX: Corrected buyerId to use the user's UID as per the type definition.
        buyerId: 'buyer-uid-1', 
        buyerName: 'Priya Sharma',
        // FIX: Added the missing 'farmerId' property and ensured 'farmer' contains the name.
        farmerId: 'farmer-uid-1',
        farmer: 'Rajesh Kumar',
        productName: 'Organic Tomatoes',
        quantity: 2,
        totalPrice: 80,
        orderDate: new Date('2023-10-26T10:00:00Z').toISOString(),
        status: OrderStatus.DELIVERED,
        trackingHistory: [
            { status: OrderStatus.PLACED, date: new Date('2023-10-26T10:00:00Z').toISOString(), location: 'Farmhouse'},
            { status: OrderStatus.PROCESSING, date: new Date('2023-10-26T12:00:00Z').toISOString(), location: 'Packing Station'},
            { status: OrderStatus.SHIPPED, date: new Date('2023-10-27T09:00:00Z').toISOString(), location: 'In Transit'},
            { status: OrderStatus.DELIVERED, date: new Date('2023-10-27T14:30:00Z').toISOString(), location: 'Delhi'},
        ],
        paymentMethod: 'credit-card',
        paymentStatus: 'Paid',
    },
    {
        id: 'order2',
        productId: 'prod2',
        // FIX: Corrected buyerId to use the user's UID as per the type definition.
        buyerId: 'buyer-uid-1',
        buyerName: 'Priya Sharma',
        // FIX: Added the missing 'farmerId' property and ensured 'farmer' contains the name.
        farmerId: 'farmer-uid-1',
        farmer: 'Rajesh Kumar',
        productName: 'Fresh Carrots',
        quantity: 5,
        totalPrice: 150,
        orderDate: new Date('2023-10-27T11:30:00Z').toISOString(),
        status: OrderStatus.SHIPPED,
        trackingHistory: [
            { status: OrderStatus.PLACED, date: new Date('2023-10-27T11:30:00Z').toISOString(), location: 'Farmhouse'},
            { status: OrderStatus.PROCESSING, date: new Date('2023-10-27T13:00:00Z').toISOString(), location: 'Packing Station'},
            { status: OrderStatus.SHIPPED, date: new Date('2023-10-28T08:00:00Z').toISOString(), location: 'In Transit'},
        ],
        paymentMethod: 'paypal',
        paymentStatus: 'Paid',
    },
];


export const EXPERTS: Expert[] = [
    {
        id: 'expert1',
        name: 'Dr. Anjali Desai',
        expertise: ['Soil Health', 'Organic Farming'],
        bio: 'With over 20 years of experience in agronomy, Dr. Desai specializes in sustainable farming practices and soil enhancement techniques.',
        imageUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1974&auto=format&fit=crop',
    },
    {
        id: 'expert2',
        name: 'Vikram Singh',
        expertise: ['Pest Control', 'Crop Rotation'],
        bio: 'Vikram is an integrated pest management (IPM) specialist who helps farmers reduce reliance on chemical pesticides through natural and strategic methods.',
        imageUrl: 'https://images.unsplash.com/photo-1610056903337-79753e4093c7?q=80&w=1974&auto=format&fit=crop',
    },
    {
        id: 'expert3',
        name: 'Meera Reddy',
        expertise: ['Irrigation Systems', 'Water Management'],
        bio: 'An agricultural engineer, Meera designs and implements efficient irrigation systems to help farms conserve water and improve crop yields.',
        imageUrl: 'https://images.unsplash.com/photo-1542596594-649ed6e6b342?q=80&w=1974&auto=format&fit=crop',
    },
];

export const SCHEMES: Scheme[] = [
    {
        id: 'scheme1',
        title: 'PM-KISAN Scheme',
        description: 'A government scheme that provides income support of ₹6,000 per year to all landholding farmer families.',
        link: '#',
    },
    {
        id: 'scheme2',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'Provides comprehensive insurance coverage against crop failure, helping to stabilize the income of farmers.',
        link: '#',
    },
    {
        id: 'scheme3',
        title: 'Kisan Credit Card (KCC)',
        description: 'A scheme to provide farmers with timely access to credit for their agricultural needs at a lower interest rate.',
        link: '#',
    }
];
