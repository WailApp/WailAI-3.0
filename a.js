// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check user authentication status
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // User is not signed in, redirect to login page
        window.location.href = 'login.html'; // URL of your login page
    } else {
        // User is signed in, check their subscription status
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const subscription = userData.subscription;
                const subscriptionEnd = userData.subscriptionEnd ? userData.subscriptionEnd.toDate() : null;

                // Check if the subscription is valid
                if (subscription && subscriptionEnd && subscriptionEnd > new Date()) {
                    // User has a valid subscription
                    console.log(`User is subscribed to ${subscription}.`);
                    window.location.href = 'index.html'; // URL of your dashboard page
                } else {
                    // Subscription is expired or not found
                    console.log("User does not have a valid subscription.");
                    window.location.href = 'index.html'; // URL of your subscription page
                }
            } else {
                // User document does not exist
                console.log("User document does not exist.");
                window.location.href = 'index.html'; // URL of your subscription page
            }
        } catch (error) {
            console.error("Error checking subscription status:", error);
            window.location.href = 'index.html'; // URL of your error page
        }
    }
});
