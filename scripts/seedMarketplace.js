import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase config copied from project (used to connect to Firestore)
const firebaseConfig = {
  apiKey: "AIzaSyDKja6UuC_LE2pAo2yNCpwKRY0s5SumTiY",
  authDomain: "krishify-2217f.firebaseapp.com",
  projectId: "krishify-2217f",
  storageBucket: "krishify-2217f.firebasestorage.app",
  messagingSenderId: "863302069017",
  appId: "1:863302069017:web:3031f7dff005e78b313388",
  measurementId: "G-Q1GJLPY771"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const farmerUid = process.env.FARMER_UID;
  const farmerName = process.env.FARMER_NAME || 'Local Farmer';
  const city = process.env.CITY || 'Pune';

  if (!farmerUid) {
    console.error('Please set FARMER_UID environment variable to the farmer user uid (Firestore user document key).');
    console.error('Example (PowerShell): $env:FARMER_UID="<uid>"; $env:FARMER_NAME="Farmer Joe"; node ./scripts/seedMarketplace.js');
    process.exit(1);
  }

  const productsToAdd = [
    // Produce (for sale)
    {
      name: 'Fresh Tomatoes',
      price: 40.0,
      imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1400&auto=format&fit=crop',
      stock: 120,
      type: 'sale',
      category: 'produce',
      location: { city },
    },
    {
      name: 'Organic Carrots',
      price: 30.5,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop',
      stock: 80,
      type: 'sale',
      category: 'produce',
      location: { city },
    },
    {
      name: 'Whole Wheat (per kg)',
      price: 25.0,
      imageUrl: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1400&auto=format&fit=crop',
      stock: 200,
      type: 'sale',
      category: 'produce',
      location: { city },
    },
    // Supplies (for sale)
    {
      name: 'Fertilizer - 50kg Bag',
      price: 1200.0,
      imageUrl: 'https://images.unsplash.com/photo-1598032897009-44d7f7c8d2b9?q=80&w=1400&auto=format&fit=crop',
      stock: 60,
      type: 'sale',
      category: 'supplies',
      location: { city },
    },
    // Machinery (rental) - Tractors priced per hour (user asked per hour)
    {
      name: 'Tractor - Model X (Rental per hour)',
      price: 200.0, // price per hour
      imageUrl: 'https://images.unsplash.com/photo-1549921296-3f4e1b8c0b6f?q=80&w=1400&auto=format&fit=crop',
      stock: 3,
      type: 'rental',
      category: 'machinery',
      location: { city },
    },
    {
      name: 'Tractor - Model Y (Rental per hour)',
      price: 250.0, // price per hour
      imageUrl: 'https://images.unsplash.com/photo-1600180758890-6b2b4b2b6a2a?q=80&w=1400&auto=format&fit=crop',
      stock: 2,
      type: 'rental',
      category: 'machinery',
      location: { city },
    }
  ];

  console.log(`Seeding ${productsToAdd.length} products for farmerUid=${farmerUid} in city=${city}...`);
  for (const p of productsToAdd) {
    const doc = {
      ...p,
      farmer: farmerUid,
      farmerName,
      reviews: [],
    };
    const ref = await addDoc(collection(db, 'products'), doc);
    console.log('Added', p.name, '->', ref.id);
  }

  console.log('Seeding complete.');
}

main().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
