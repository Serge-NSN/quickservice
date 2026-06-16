import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApkL4r9-BkRlukXmoellvo31UQuXjnr0k",
  authDomain: "quickservice-eab5b.firebaseapp.com",
  projectId: "quickservice-eab5b",
  storageBucket: "quickservice-eab5b.firebasestorage.app",
  messagingSenderId: "367141296838",
  appId: "1:367141296838:web:a7375fd8534d40a993d5c7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
