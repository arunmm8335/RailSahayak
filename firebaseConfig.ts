import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

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

if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
    } catch (error) {
        console.error("Firebase Initialization Error:", error);
    }
} else {
    console.warn("⚠️ Firebase is not configured. Falling back to Demo Mode (Mock Auth).");
    console.warn("To enable real authentication, update firebaseConfig.ts with your actual API keys.");
}

// Export auth (can be null if not configured)
export { auth };