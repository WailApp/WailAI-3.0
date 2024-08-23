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
        const firestore = firebase.firestore();

        document.getElementById('signup-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            if (password !== confirmPassword) {
                document.getElementById('login-error').innerText = 'Error: Passwords do not match.';
                return;
            }

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    // Save password to Firestore
                    firestore.collection('users').doc(user.uid).set({
                        email: email,
                        password: password
                    })
                    .then(() => {
                        // Password saved successfully, redirect to verification page
                        window.location.href = 'welcome.html';
                    })
                    .catch(error => {
                        console.error("Error writing document: ", error);
                        document.getElementById('login-error').innerText = 'Error: Unable to save password.';
                    });
                })
                .catch(error => {
                    // Custom error messages
                    let errorMessage;
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage = 'This email is already in use.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Invalid email address.';
                            break;
                        case 'auth/operation-not-allowed':
                            errorMessage = 'Email/password accounts are not enabled.';
                            break;
                        case 'auth/weak-password':
                            errorMessage = 'Password is too weak.';
                            break;
                        default:
                            errorMessage = 'An error occurred. Please try again.';
                    }
                    document.getElementById('login-error').innerText = 'Error: ' + errorMessage;
                });
        });