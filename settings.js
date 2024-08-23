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

const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'login.html'; // Redirect to login if not logged in
            return;
        }

        // Display user information
        document.getElementById('user-id').textContent = user.uid;
        document.getElementById('user-email').textContent = user.email;

        // Change Password
        document.getElementById('change-password-btn').addEventListener('click', () => {
            const newPassword = prompt('Enter your new password:');
            if (newPassword) {
                user.updatePassword(newPassword)
                    .then(() => {
                        document.getElementById('status-message').textContent = 'Password updated successfully!';
                    })
                    .catch(error => {
                        document.getElementById('status-message').textContent = 'Error: ' + error.message;
                    });
            }
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            auth.signOut()
                .then(() => {
                    window.location.href = 'login.html';
                })
                .catch(error => {
                    document.getElementById('status-message').textContent = 'Logout error: ' + error.message;
                });
        });

        // Delete Account
        document.getElementById('delete-account-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                user.delete()
                    .then(() => {
                        window.location.href = 'login.html'; // Redirect to login page
                    })
                    .catch(error => {
                        document.getElementById('status-message').textContent = 'Error: ' + error.message;
                    });
            }
        });
    });
});
