// إعدادات Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAzg4PmFoXnS95TXk8FlG9C4bSxhfer86E",
    authDomain: "wailai-a.firebaseapp.com",
    projectId: "wailai-a",
    storageBucket: "wailai-a.appspot.com",
    messagingSenderId: "857204915249",
    appId: "1:857204915249:web:0141c2e2e68ed96769e910",
    measurementId: "G-VRR62LMMMK"
};

// تهيئة Firebase فقط إذا لم يكن مهيأ مسبقًا
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// الحصول على مرجع لخدمة المصادقة
const auth = firebase.auth();
