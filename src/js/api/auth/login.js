export { handleLogin, onLoginSuccess };
import { updateNavigation, toggleVisibility } from './navigation.js'; 
import { displayErrorMessage } from './utils.js';


document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    setupRegisterToggle();
});

async function handleLogin(event) {
    event.preventDefault();
    const spinner = document.getElementById('login-spinner');
    spinner.classList.remove('hidden-spinner'); // Show spinner

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Email validation
    if (!email.endsWith('@stud.noroff.no')) {
        displayErrorMessage('Please use your Noroff student email (example@stud.noroff.no) to login.', 'login-error-message');
        spinner.classList.add('hidden-spinner'); // Hide spinner
        return; // Stop further execution
    }

    try {
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
            const errorMessage = data.message || 'Login failed. Please try again.';
            displayErrorMessage(errorMessage, 'login-error-message');
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
        displayErrorMessage('An error occurred during login. Please try again.', 'login-error-message');
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





