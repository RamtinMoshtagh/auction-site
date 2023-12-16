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
    spinner.classList.remove('hidden-spinner');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email.endsWith('@stud.noroff.no')) {
        displayErrorMessage('Please use your Noroff student email (example@stud.noroff.no) to login.', 'login-error-message');
        spinner.classList.add('hidden-spinner');
        return;
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
            onLoginSuccess(data);
        } else {
            const errorMessage = data.message || 'Login failed. Please try again.';
            displayErrorMessage(errorMessage, 'login-error-message');
        }
    } catch (error) {

        displayErrorMessage('An error occurred during login. Please try again.', 'login-error-message');
    } finally {
        spinner.classList.add('hidden-spinner');
    }
}

function onLoginSuccess(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    updateNavigation();
    window.location.href = 'profilePage/index.html';
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } return;
}

function setupRegisterToggle() {
    const showRegisterLink = document.getElementById('show-register');
    const loginSection = document.querySelector('.login-section');
    const registerSection = document.getElementById('register-section');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (event) => {
            event.preventDefault();
            toggleVisibility(loginSection, false);
            toggleVisibility(registerSection, true);
        });
    }
}





