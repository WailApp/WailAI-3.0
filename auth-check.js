// Check if Firebase has been initialized already
if (!firebase.apps.length) {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAzg4PmFoXnS95TXk8FlG9C4bSxhfer86E",
        authDomain: "wailai-a.firebaseapp.com",
        projectId: "wailai-a",
        storageBucket: "wailai-a.appspot.com",
        messagingSenderId: "857204915249",
        appId: "1:857204915249:web:0141c2e2e68ed96769e910",
        measurementId: "G-VRR62LMMMK"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

// Check if auth is already defined
if (typeof window.auth === 'undefined') {
    window.auth = firebase.auth();
}

// Firestore reference
const db = firebase.firestore();

// التحقق من حالة المستخدم
window.auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User is signed in:', user.email);

// حدد الزر الذي سيتم الضغط عليه
const sendMessageButton = document.querySelector("#send-message-button");

// وظيفة للتحقق من حالة الاشتراك وإرسال الرسالة
const checkSubscriptionAndSendMessage = () => {
    const messageCountKey = `messageCount_${auth.currentUser.uid}`;
    let messageCount = parseInt(localStorage.getItem(messageCountKey)) || 0;

    const userDocRef = db.collection('users').doc(auth.currentUser.uid);
    userDocRef.get()
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                const subscription = userData?.subscription;
                const subscriptionEnd = userData?.subscriptionEnd ? userData.subscriptionEnd.toDate() : null;

                const now = new Date();

                if ((subscription === 'plus' || subscription === 'team') && (subscriptionEnd === null || subscriptionEnd > now)) {
                    console.log(`User has a valid ${subscription} subscription.`);
                    // يمكن للمستخدم إرسال رسائل دون قيود
                    handleOutgoingChat();
                } else {
                    console.log('User does not have a valid subscription or the subscription has expired.');
                    if (messageCount >= 20) {
                        // لا تقم بإرسال الرسالة
                    } else {
                        // زيادة العداد وحفظه ثم إرسال الرسالة
                        messageCount++;
                        localStorage.setItem(messageCountKey, messageCount);
                        handleOutgoingChat();
                    }
                }
            } else {
                console.log('No such document!');
                // معالجة المستخدمين الذين ليس لديهم مستند في قاعدة البيانات (يمكنك تنفيذ إجراءات إضافية هنا)
            }
        })
        .catch(error => {
            console.error('Error getting document:', error);
            // معالجة الخطأ (يمكنك تنفيذ إجراءات إضافية هنا)
        });
};

// وظيفة لعرض رسالة الخطأ في واجهة المستخدم
const displayErrorMessage = (message) => {
    const errorMessageDiv = document.createElement("div");
    errorMessageDiv.classList.add("error-message");
    errorMessageDiv.innerText = message;

    document.body.appendChild(errorMessageDiv);
    
    setTimeout(() => {
        errorMessageDiv.remove();
    }, 5000); // يختفي بعد 5 ثوانٍ
};

// ربط الحدث بالزر
if (sendMessageButton) {
    sendMessageButton.addEventListener("click", checkSubscriptionAndSendMessage);
}



    } else {
        console.log('No user is signed in.');
        window.location.href = 'login.html'; // الانتقال إلى صفحة تسجيل الدخول
    }
});

