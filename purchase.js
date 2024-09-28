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
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('user-id').textContent = user.uid;
        document.getElementById('user-email').textContent = user.email;

        db.collection('users').doc(user.uid).get()
            .then(docSnap => {
                if (docSnap.exists) {
                    const userData = docSnap.data();
                    document.getElementById('user-balance').textContent = `${userData.balance.toFixed(2)} B`;

                    const subscriptionEndDate = userData.subscriptionEnd?.toDate(); // تاريخ انتهاء الاشتراك

                    if (subscriptionEndDate) {
                        const currentDate = new Date();
                        
                        if (currentDate < subscriptionEndDate) {
                            document.getElementById('status-message').textContent = `You are already subscribed until ${subscriptionEndDate.toDateString()}. Please wait until ${subscriptionEndDate.toDateString()} to make another purchase.`;
                            disablePurchaseButtons();
                        }
                    }
                } else {
                    document.getElementById('user-balance').textContent = '0 B';
                }
            })
            .catch(error => {
                console.error("Error fetching balance: ", error);
                document.getElementById('status-message').textContent = 'Error fetching balance.';
            });

        function disablePurchaseButtons() {
            document.getElementById('buy-plus-btn').disabled = true;
            document.getElementById('buy-team-btn').disabled = true;
        }

        function handlePurchase(productName, basePrice) {
            const discountCode = document.getElementById('discount-code').value.trim();
            let finalPrice = basePrice;

            if (discountCode) {
                db.collection('discounts').doc(discountCode).get()
                    .then(discountSnap => {
                        if (discountSnap.exists) {
                            const discountData = discountSnap.data();
                            const discountValue = discountData.value || 0;
                            const usedBy = discountData.usedBy || [];

                            if (usedBy.includes(user.uid)) {
                                document.getElementById('status-message').textContent = 'You have already used this discount code.';
                                return;
                            }

                            finalPrice -= discountValue;
                            finalPrice = Math.max(finalPrice, 0);

                            proceedWithPurchase(finalPrice, productName, discountCode, usedBy);
                        } else {
                            document.getElementById('status-message').textContent = 'Invalid discount code.';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching discount code: ', error);
                        document.getElementById('status-message').textContent = 'Error fetching discount code.';
                    });
            } else {
                proceedWithPurchase(finalPrice, productName);
            }
        }

        function proceedWithPurchase(finalPrice, productName, discountCode = null, usedBy = []) {
            db.collection('users').doc(user.uid).get()
                .then(docSnap => {
                    if (docSnap.exists) {
                        const currentBalance = docSnap.data().balance || 0;
                        if (currentBalance >= finalPrice) {
                            const newBalance = currentBalance - finalPrice;
                            if (confirm(`Are you sure you want to purchase ${productName} for ${finalPrice} B?`)) {
                                const updateData = {
                                    balance: newBalance,
                                    subscription: productName,
                                    subscriptionEnd: firebase.firestore.Timestamp.fromDate(new Date(new Date().getTime() + 30*24*60*60*1000)), // 1 month later
                                    lastPurchaseDate: firebase.firestore.Timestamp.now() // تحديث تاريخ آخر شراء
                                };

                                if (discountCode) {
                                    updateData[`usedDiscounts.${discountCode}`] = true;
                                    db.collection('discounts').doc(discountCode).update({
                                        usedBy: firebase.firestore.FieldValue.arrayUnion(user.uid)
                                    });
                                }

                                db.collection('users').doc(user.uid).update(updateData)
                                .then(() => {
                                    document.getElementById('user-balance').textContent = `${newBalance.toFixed(2)} DZD`;
                                    document.getElementById('status-message').textContent = `${productName} purchased successfully!`;
                                    disablePurchaseButtons();
                                })
                                .catch(error => {
                                    console.error('Error updating balance: ', error);
                                    document.getElementById('status-message').textContent = 'Error updating balance.';
                                });
                            }
                        } else {
                            document.getElementById('status-message').textContent = 'Insufficient balance.';
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching current balance: ', error);
                    document.getElementById('status-message').textContent = 'Error fetching current balance.';
                });
        }

        document.getElementById('buy-plus-btn').addEventListener('click', () => {
            handlePurchase('plus', 2000);
        });

        document.getElementById('buy-team-btn').addEventListener('click', () => {
            handlePurchase('team', 5000);
        });
    });
});



