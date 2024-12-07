import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage"
import 'firebase/storage'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const firebaseConfig = {
    apiKey: "AIzaSyD-pTTODRFywIdMRVERI4bDfGShjeqLRPk",
    authDomain: "swiftsort-bygoz.firebaseapp.com",
    projectId: "swiftsort-bygoz",
    storageBucket: "swiftsort-bygoz.firebasestorage.app",
    messagingSenderId: "160891618674",
    appId: "1:160891618674:web:041fac1231f4653c6109eb",
    measurementId: "G-20KWL7D5KX"
  };

  const app = initializeApp(firebaseConfig)
  const firestore = getFirestore(app)
  const auth = getAuth(app)
  const storage = getStorage(app);

  return {
    provide: {
      firestore,
      auth,
      storage,
    }
  }
})