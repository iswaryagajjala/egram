// app.js

// Initialize Firebase authentication and Firestore database
const auth = firebase.auth();
const db = firebase.firestore();

// Handle user authentication state change
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is logged in: ", user);
        if (user.role === 'admin') {
            // Redirect to admin dashboard if user is an admin
            window.location.href = 'admin.html';
        } else {
            // Redirect to user dashboard if the user is a normal user
            window.location.href = 'user.html';
        }
    } else {
        console.log("No user is logged in");
    }
});

// Register new user
document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User registered: ", user);

            // Save user data in Firestore (You can add additional data like role)
            db.collection('users').doc(user.uid).set({
                email: user.email,
                role: 'user', // By default, a new user is assigned a 'user' role
            }).then(() => {
                window.location.href = 'user.html'; // Redirect to user dashboard
            }).catch((error) => {
                console.error("Error saving user data:", error);
            });
        })
        .catch((error) => {
            console.error("Error during registration: ", error.message);
        });
});

// Login user
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in: ", user);

            // Check user role (admin or user) and redirect accordingly
            db.collection('users').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const role = doc.data().role;
                    if (role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'user.html';
                    }
                }
            });
        })
        .catch((error) => {
            console.error("Error during login: ", error.message);
        });
});

// Logout user
function logout() {
    auth.signOut()
        .then(() => {
            console.log('User logged out');
            window.location.href = 'login.html'; // Redirect to login page
        })
        .catch((error) => {
            console.error("Error during logout: ", error.message);
        });
}

// Function to apply for a service
function applyForService(serviceId) {
    const user = auth.currentUser;

    if (user) {
        db.collection('applications').add({
            userId: user.uid,
            serviceId: serviceId,
            status: 'Pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            alert("Service application submitted successfully!");
        })
        .catch((error) => {
            console.error("Error applying for service: ", error);
        });
    } else {
        alert("You need to be logged in to apply for services.");
    }
}

// Fetch services from Firestore (for displaying them to users)
function fetchServices() {
    db.collection('services').get()
        .then((querySnapshot) => {
            const serviceList = document.getElementById('service-list');
            querySnapshot.forEach((doc) => {
                const service = doc.data();
                const listItem = document.createElement('li');
                listItem.textContent = `${service.name}: ${service.description}`;
                const applyButton = document.createElement('button');
                applyButton.textContent = 'Apply';
                applyButton.onclick = () => applyForService(doc.id);
                listItem.appendChild(applyButton);
                serviceList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error("Error fetching services: ", error);
        });
}

// Display application status
function displayApplicationStatus() {
    const user = auth.currentUser;

    if (user) {
        db.collection('applications').where('userId', '==', user.uid).get()
            .then((querySnapshot) => {
                const statusList = document.getElementById('status-list');
                querySnapshot.forEach((doc) => {
                    const application = doc.data();
                    const listItem = document.createElement('li');
                    listItem.textContent = `Service ID: ${application.serviceId} - Status: ${application.status}`;
                    statusList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error("Error fetching application status: ", error);
            });
    } else {
        alert("You need to be logged in to view your application status.");
    }
}

// Admin view - list applications and update status
function adminViewApplications() {
    db.collection('applications').get()
        .then((querySnapshot) => {
            const applicationsList = document.getElementById('applications-list');
            querySnapshot.forEach((doc) => {
                const application = doc.data();
                const listItem = document.createElement('li');
                listItem.textContent = `User ID: ${application.userId}, Service ID: ${application.serviceId}, Status: ${application.status}`;
                
                // Admin can update the application status
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update Status';
                updateButton.onclick = () => updateApplicationStatus(doc.id);
                listItem.appendChild(updateButton);
                
                applicationsList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error("Error fetching applications: ", error);
        });
}

// Admin update application status
function updateApplicationStatus(applicationId) {
    const newStatus = prompt("Enter new status (e.g., Approved, Rejected):");
    if (newStatus) {
        db.collection('applications').doc(applicationId).update({
            status: newStatus
        })
        .then(() => {
            alert("Application status updated successfully");
        })
        .catch((error) => {
            console.error("Error updating status: ", error);
        });
    }
}
