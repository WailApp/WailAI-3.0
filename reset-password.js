// استيراد الوحدات المطلوبة من Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

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

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// الحصول على مرجع لخدمة المصادقة
const auth = getAuth(app);

// التعامل مع إعادة تعيين كلمة المرور
document.getElementById('reset-password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('reset-email').value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            // رسالة إعادة تعيين كلمة المرور أُرسلت بنجاح، الانتقال إلى صفحة أخرى
            document.getElementById('message').innerText = 'Done'; // استبدل بـ URL الصفحة التي تريد الانتقال إليها
        })
        .catch(error => {
            // معالجة الأخطاء وعرض رسالة الخطأ
            document.getElementById('message').innerText = 'خطأ: ' + error.message;
        });
});
