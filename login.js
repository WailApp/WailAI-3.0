import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

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

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Example Firestore usage: Add a new document to a "devices" collection
            try {
                await addDoc(collection(db, "devices"), {
                    userId: user.uid,
                    timestamp: new Date(),
                    device: navigator.userAgent, // You can add more device info here
                    location: "User's location" // Replace with real location data if available
                });
                console.log("Device info added to Firestore");
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            // Redirect user or show appropriate message
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorElement = document.getElementById('login-error');

            // Log the exact error code to diagnose the issue
            console.log('Error Code:', error.code);
            console.log('Error Message:', error.message);

            if (error.code === 'auth/user-disabled') {
                // Redirect to another page if the account is disabled
                window.location.href = 'account-disabled.html';
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                // Display error message for wrong email or password
                errorElement.innerText = 'Error: Incorrect email or password.';
            } else {
                // Display other errors
                errorElement.innerText = 'Error: ' + error.message;
            }
            errorElement.style.display = 'block';
        });
});
