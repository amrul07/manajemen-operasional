import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB9jRchzpJFOWhYL9JUAKmXrzbb29yZRwc",
  authDomain: "pwa-indoretail.firebaseapp.com",
  projectId: "pwa-indoretail",
  storageBucket: "pwa-indoretail.firebasestorage.app",
  messagingSenderId: "323072087622",
  appId: "1:323072087622:web:1fb33a43d74fea7e319c47",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
