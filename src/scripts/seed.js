import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApkL4r9-BkRlukXmoellvo31UQuXjnr0k",
  authDomain: "quickservice-eab5b.firebaseapp.com",
  projectId: "quickservice-eab5b",
  storageBucket: "quickservice-eab5b.firebasestorage.app",
  messagingSenderId: "367141296838",
  appId: "1:367141296838:web:a7375fd8534d40a993d5c7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CATEGORIES = [
  { id: 'hairdresser', name: 'Hairdresser' },
  { id: 'electrician', name: 'Electrician' },
  { id: 'plumber', name: 'Plumber' },
  { id: 'mechanic', name: 'Mechanic' },
  { id: 'cleaner', name: 'Cleaner' },
  { id: 'graphic-designer', name: 'Graphic Designer' },
  { id: 'video-editor', name: 'Video Editor' },
  { id: 'farmer', name: 'Farmer' },
  { id: 'traiteur', name: 'Traiteur (Caterer)' },
  { id: 'tailor', name: 'Tailor' },
  { id: 'photographer', name: 'Photographer' },
  { id: 'barber', name: 'Barber' }, // Replaced Web Developer with Barber
];

const prices = [2000, 3500, 5000, 8000, 12000, 15000, 25000, 50000];

const seedDatabase = async () => {
  const providersCollection = collection(db, 'providers');

  console.log("Fetching existing providers to delete...");
  const snapshot = await getDocs(providersCollection);
  
  let deleteCount = 0;
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, 'providers', document.id));
    deleteCount++;
  }
  console.log(`Deleted ${deleteCount} existing providers.`);

  console.log("Starting to seed database...");

  for (const cat of CATEGORIES) {
    // Generate 3 providers per category
    for (let i = 1; i <= 3; i++) {
      const randomPrice = prices[Math.floor(Math.random() * prices.length)];
      
      const providerData = {
        userId: `seed_${cat.id}_${i}`,
        name: `${cat.name} Provider ${i}`,
        email: `provider${i}@${cat.id}.com`,
        phone: `+237 600 000 00${i}`,
        whatsapp: `+237 600 000 00${i}`,
        category: cat.id,
        description: `This is a premium demo profile for ${cat.name} Provider ${i}. Highly skilled and trusted by many in Douala.`,
        pricing: {
          type: i % 2 === 0 ? 'fixed' : 'negotiable',
          amount: i % 2 === 0 ? randomPrice : null,
          unit: i % 2 === 0 ? 'per session' : null,
          currency: 'XAF'
        },
        location: {
          city: 'Douala',
          quarter: i === 1 ? 'Akwa' : i === 2 ? 'Bonapriso' : 'Deido'
        },
        rating: 4 + (i * 0.3),
        reviewCount: i * 25,
        verified: i % 2 === 0,
        createdAt: new Date(Date.now() - (i * 10000000)).toISOString() // slightly varied timestamps
      };

      try {
        await addDoc(providersCollection, providerData);
        console.log(`Added: ${providerData.name} - ${providerData.pricing.amount || 'Negotiable'} XAF`);
      } catch (e) {
        console.error(`Error adding ${providerData.name}: `, e);
      }
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
};

seedDatabase();
