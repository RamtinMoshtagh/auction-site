export { setupRegisterForm, handleRegister};
import { updateNavigation } from './navigation.js';
import { displayErrorMessage } from './utils.js';

function setupRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const spinner = document.getElementById('register-spinner');
    spinner.classList.remove('hidden-spinner');

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const avatarElement = document.getElementById('register-avatar');
    const avatar = avatarElement ? avatarElement.value : '';

    if (!email.endsWith('@stud.noroff.no')) {
        displayErrorMessage('Please use a Noroff student email (example@stud.noroff.no).', 'register-error-message');
        spinner.classList.add('hidden-spinner');
        return;
    }
    if (password.length < 8) {
        displayErrorMessage('Password must be at least 8 characters long.', 'register-error-message');
        spinner.classList.add('hidden-spinner'); 
        return;
    }
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/auction/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, avatar })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data));
            updateNavigation();
            window.location.href = '/index.html';
        } else {
            const errorMessage = data.message || 'Registration failed. Please try again.';
            displayErrorMessage(errorMessage, 'register-error-message');
        }
    } catch (error) {
        displayErrorMessage('An error occurred during registration. Please try again.', 'register-error-message');
    } finally {
        spinner.classList.add('hidden-spinner');
    }
}

document.addEventListener('DOMContentLoaded', setupRegisterForm);