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
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'login.html'; // Redirect to login if not logged in
            return;
        }

        // Display user information
        document.getElementById('user-id').textContent = user.uid;
        document.getElementById('user-email').textContent = user.email;

        // Fetch and display user balance
        db.collection('users').doc(user.uid).get()
            .then(docSnap => {
                if (docSnap.exists) {
                    document.getElementById('user-balance').textContent = `${docSnap.data().balance.toFixed(2)} B`;
                } else {
                    document.getElementById('user-balance').textContent = '0 B';
                }
            })
            .catch(error => {
                console.error("Error fetching balance: ", error);
                document.getElementById('status-message').textContent = 'Error fetching balance.';
            });

        // Add Funds
        document.getElementById('add-funds-btn').addEventListener('click', () => {
            const amount = parseFloat(prompt('Enter the amount to add:'));
            if (!isNaN(amount) && amount > 0) {
                db.collection('users').doc(user.uid).get()
                    .then(docSnap => {
                        if (docSnap.exists) {
                            const currentBalance = docSnap.data().balance || 0;
                            const newBalance = currentBalance + amount;
                            db.collection('users').doc(user.uid).update({ balance: newBalance })
                                .then(() => {
                                    document.getElementById('user-balance').textContent = `B${newBalance.toFixed(2)}`;
                                    document.getElementById('status-message').textContent = 'Funds added successfully!';
                                })
                                .catch(error => {
                                    console.error('Error updating balance: ', error);
                                    document.getElementById('status-message').textContent = 'Error updating balance.';
                                });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching current balance: ', error);
                        document.getElementById('status-message').textContent = 'Error fetching current balance.';
                    });
            } else {
                alert('Invalid amount entered.');
            }
        });
    });
});
