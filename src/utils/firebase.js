import { initializeApp } from 'firebase/app'
import { getDatabase, ref, get, set, child } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export async function getData() {
  const snapshot = await get(ref(db))
  if (!snapshot.exists()) {
    // Initialize with default structure
    const defaultData = {
      pins: { bhavya: '2209', aastha: '0512' },
      bhavya: [],
      aastha: [],
      purchased: { bhavya: [], aastha: [] },
    }
    await set(ref(db), defaultData)
    return defaultData
  }
  const data = snapshot.val()
  // Firebase drops empty arrays, so ensure they exist
  return {
    pins: data.pins || {},
    bhavya: data.bhavya || [],
    aastha: data.aastha || [],
    purchased: {
      bhavya: data.purchased?.bhavya || [],
      aastha: data.purchased?.aastha || [],
    },
  }
}

export async function saveData(data) {
  await set(ref(db), data)
}
