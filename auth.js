// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyDsnayNd4R64-AE57TBWQJK3YdPdIhDC2M",
    authDomain: "odakatolyesi.firebaseapp.com",
    projectId: "odakatolyesi",
    storageBucket: "odakatolyesi.firebasestorage.app",
    messagingSenderId: "358067439929",
    appId: "1:358067439929:web:43eeea52f9890ef9ab00e8"
};

// Firebase'i başlat
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();