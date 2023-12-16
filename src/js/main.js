import { handleLogin, handleRegister, logout } from '/src/js/api/auth/index.js';
import { updateNavigation } from '/src/js/api/auth/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    setupForms();
    updateNavigation();
});

function setupForms() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    const showRegisterLink = document.getElementById('show-register');
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('register-section').style.display = 'block';
        });
    }
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }
}
