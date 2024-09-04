import { initializeApp } from "firebase/app";
import config from "../config";
import { getAuth } from "firebase/auth";

interface InitializeAppATypes {
  authDomain: string;
  apiKey: string;
  databaseURL: string;
  projectId: string;
  messagingSenderId?: string;
  storageBucket?: string;
  appId?: string;
  measurementId?: string;
}

const firebaseConfig: InitializeAppATypes = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  databaseURL: config.FIREBASE_DATABASE_URL,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
  measurementId: config.FIREBASE_MEASUREMENT_ID,
};

let app: any;
let auth: any;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (err) {
  console.error(err);
}

export { app, auth };
