
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-GHw-Lhd0BSTDbKUHHHX_z5IkJMToRKg",
  authDomain: "railsahayak-db848.firebaseapp.com",
  projectId: "railsahayak-db848",
  storageBucket: "railsahayak-db848.firebasestorage.app",
  messagingSenderId: "434108485642",
  appId: "1:434108485642:web:64f2f03dfe4847ea42cff3",
  measurementId: "G-FLXQ62NK8R"
};

// Check if the user has actually configured the keys
export const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyD-YOUR-REAL-API-KEY-HERE";

let app;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        console.log("✅ Firebase initialized successfully");
        console.log("📍 Auth Domain Configured:", firebaseConfig.authDomain);
        if (typeof window !== 'undefined') {
            console.log("🌐 Detected Current Hostname:", window.location.hostname || window.location.host);
            console.log("🔗 Full Href:", window.location.href);
        }
    } catch (error: any) {
        console.error("❌ Firebase Initialization Error:", error);
        console.error("Error code:", error?.code);
        console.error("Error message:", error?.message);
        // Set to null on initialization failure
        auth = null;
        db = null;
    }
} else {
    console.warn("⚠️ Firebase is not configured. Falling back to Demo Mode (Mock Auth).");
    console.warn("To enable real authentication, update firebaseConfig.ts with your actual API keys.");
}

// Export auth and db (can be null if not configured)
export { auth, db };
