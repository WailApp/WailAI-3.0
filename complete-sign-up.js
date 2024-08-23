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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get reference to auth service
const auth = firebase.auth();

document.getElementById('complete-sign-up-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const fullName = document.getElementById('full-name').value;
    const profilePictureUrl = document.getElementById('profile-picture-url').value;

    auth.currentUser.updateProfile({
        displayName: fullName,
        photoURL: profilePictureUrl
    })
    .then(() => {
        document.getElementById('message').innerText = 'Sign-up completed successfully!';
        // Redirect to the main page or dashboard
        window.location.href = 'dashboard.html';
    })
    .catch(error => {
        document.getElementById('error-message').innerText = 'Error: ' + error.message;
    });
});
