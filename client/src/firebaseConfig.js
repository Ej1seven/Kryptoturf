// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCZKS27nrPGQ0X1tgAW0Uq_mMZLLkKq_fc',
  authDomain: 'kryptoturf-8f9ed.firebaseapp.com',
  projectId: 'kryptoturf-8f9ed',
  storageBucket: 'kryptoturf-8f9ed.appspot.com',
  messagingSenderId: '882462432297',
  appId: '1:882462432297:web:77527c00de8f4233751038',
  measurementId: 'G-YCXLPSYCPY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Firebase storage reference
const storage = getStorage(app);
export default storage;
