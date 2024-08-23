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
firebase.initializeApp(firebaseConfig);

// الحصول على مرجع لخدمة المصادقة
const auth = firebase.auth();

// التحقق من حالة التحقق من البريد الإلكتروني
document.getElementById('check-email-verification').addEventListener('click', function() {
    const user = auth.currentUser;
    if (user) {
        user.reload().then(() => {
            if (user.emailVerified) {
                document.getElementById('verification-status').innerText = 'Your email is verified!';
                document.getElementById('proceed').style.display = 'block'; // عرض زر متابعة
            } else {
                document.getElementById('verification-status').innerText = 'Your email is not verified yet.';
                document.getElementById('proceed').style.display = 'none'; // إخفاء زر متابعة
            }
        }).catch(error => {
            document.getElementById('verification-status').innerText = 'Error: ' + error.message;
        });
    } else {
        document.getElementById('verification-status').innerText = 'No user is logged in.';
        document.getElementById('proceed').style.display = 'none'; // إخفاء زر متابعة
    }
});

// حذف الحساب مع نافذة تأكيد
document.getElementById('delete-account').addEventListener('click', function() {
    const user = auth.currentUser;
    if (user) {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            user.delete().then(() => {
                document.getElementById('verification-status').innerText = 'Account deleted successfully.';
                // يمكن توجيه المستخدم إلى صفحة تسجيل الدخول أو أي صفحة أخرى بعد حذف الحساب
                window.location.href = 'login.html';
            }).catch(error => {
                document.getElementById('verification-status').innerText = 'Error: ' + error.message;
            });
        } else {
            document.getElementById('verification-status').innerText = 'Account deletion canceled.';
        }
    } else {
        document.getElementById('verification-status').innerText = 'No user is logged in.';
    }
});

// وظيفة متابعة
document.getElementById('proceed').addEventListener('click', function() {
    // يمكن توجيه المستخدم إلى صفحة أخرى بعد التحقق من البريد الإلكتروني
    window.location.href = 'home.html'; // قم بتغيير "home.html" إلى الصفحة التي تريد توجيه المستخدم إليها
});
