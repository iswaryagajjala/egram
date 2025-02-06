// auth.js

// Register User
document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User Registered', userCredential.user);
            window.location.href = "user.html";
        })
        .catch((error) => {
            console.error('Error during registration', error);
        });
});

// Login User
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User logged in', userCredential.user);
            window.location.href = "user.html";
        })
        .catch((error) => {
            console.error('Error logging in', error);
        });
});

// Logout User
function logout() {
    auth.signOut()
        .then(() => {
            console.log('User logged out');
            window.location.href = "login.html";
        })
        .catch((error) => {
            console.error('Error logging out', error);
        });
}
