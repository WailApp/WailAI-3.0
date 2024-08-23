// Check if Firebase has been initialized already
if (!firebase.apps.length) {
    try {
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
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
}

// User settings
const userSettings = {
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en', 'es', 'fr', 'de', 'it']
};

// Get reference to auth service and Firestore
const auth = firebase.auth();
const firestore = firebase.firestore();

// Get device and browser information
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const browserName = navigator.appName;
    const browserVersion = navigator.appVersion;
    const platform = navigator.platform;
    const language = navigator.language;
    return {
        userAgent,
        browserName,
        browserVersion,
        platform,
        language
    };
}

// Get location information using IPinfo API
function getLocationInfo(callback) {
    fetch('https://ipinfo.io/json?token=cd0380c4a96a2b') // Replace YOUR_TOKEN_HERE with your actual token
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error('Error fetching location info:', error);
            callback(null);
        });
}

// Check if user is logged in
auth.onAuthStateChanged(user => {
    if (user) {
        // User is logged in, update information
        const deviceInfo = getDeviceInfo();
        const timestamp = new Date().toISOString();
        
        // Extract email
        const email = user.email;

        getLocationInfo(locationInfo => {
            // Create or update user data in Firestore
            firestore.collection('users').doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        const subscription = userData?.subscription;
                        const subscriptionEnd = userData?.subscriptionEnd ? userData.subscriptionEnd.toDate() : null;

                        console.log('Existing user data:', userData); // Display existing user data
                        console.log('Subscription end date:', subscriptionEnd); // Display subscription end date

                        const now = new Date();
                        console.log('Current date and time:', now); // Display current date and time

                        // Check subscription status
                        if ((subscription === 'plus' || subscription === 'team') && (subscriptionEnd === null || subscriptionEnd > now)) {
                            console.log(`User has a valid ${subscription} subscription.`);
                        } else {
                            console.log('User does not have a valid subscription or the subscription has expired.');
                        }

                        // Update user information
                        firestore.collection('users').doc(user.uid).set({
                            lastLogin: timestamp,
                            deviceInfo: deviceInfo,
                            locationInfo: locationInfo,
                            email: email
                        }, { merge: true })
                        .then(() => {
                            console.log('User data updated successfully');
                        })
                        .catch(error => {
                            console.error('Error updating user data:', error);
                        });
                    } else {
                        console.log('No such document!');
                    }
                })
                .catch(error => {
                    console.error('Error getting document:', error);
                });
        });
    } else {
        console.log('No user is signed in.');
    }
});
