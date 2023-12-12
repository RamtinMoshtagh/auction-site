export { handleLogin, onLoginSuccess };
import { updateNavigation, toggleVisibility } from './navigation.js'; 

document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    setupRegisterToggle();
});

async function handleLogin(event) {
    event.preventDefault();
    const spinner = document.getElementById('login-spinner');
    spinner.classList.remove('hidden-spinner'); // Show spinner

    try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('https://api.noroff.dev/api/v1/auction/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Login successful', data);
            onLoginSuccess(data);
        } else {
            console.error('Login failed', data);
            // Display the first error message from the errors array
            alert('Login failed: ' + (data.errors[0].message || 'Unknown error'));
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
        alert('An error occurred during login. Please try again.'); // Display error message to user
    } finally {
        spinner.classList.add('hidden-spinner'); // Hide spinner after process
    }
}

function onLoginSuccess(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    updateNavigation();
    window.location.href = 'profile/index.html';
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function setupRegisterToggle() {
    const showRegisterLink = document.getElementById('show-register');
    const loginSection = document.querySelector('.login-section');
    const registerSection = document.getElementById('register-section');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (event) => {
            event.preventDefault();
            toggleVisibility(loginSection, false); // Hide login form
            toggleVisibility(registerSection, true); // Show register form
        });
    }
}




