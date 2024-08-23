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

// Get reference to auth service
const auth = firebase.auth();

// Check user authentication status
auth.onAuthStateChanged(user => {
    if (!user) {
        // User is not signed in, redirect to login page
        window.location.href = 'login.html'; // URL of your login page
    } else {
        // User is signed in, redirect to the main page
        window.location.href = 'index.html'; // URL of your dashboard page
    }
});
