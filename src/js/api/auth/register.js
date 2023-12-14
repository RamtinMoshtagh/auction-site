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
    spinner.classList.remove('hidden-spinner'); // Show spinner

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const avatarElement = document.getElementById('register-avatar');
    const avatar = avatarElement ? avatarElement.value : '';

    // Email validation
    if (!email.endsWith('@stud.noroff.no')) {
        displayErrorMessage('Please use a Noroff student email (example@stud.noroff.no).', 'register-error-message');
        spinner.classList.add('hidden-spinner'); // Hide spinner
        return; // Stop further execution
    }

    // Password length validation
    if (password.length < 8) {
        displayErrorMessage('Password must be at least 8 characters long.', 'register-error-message');
        spinner.classList.add('hidden-spinner'); // Hide spinner
        return; // Stop further execution
    }

    try {
        console.log("Sending registration request with data:", { name, email, password, avatar });

        const response = await fetch('https://api.noroff.dev/api/v1/auction/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, avatar })
        });

        const data = await response.json();
        console.log("Received response:", data);

        if (response.ok) {
            console.log('Registration successful', data);
            localStorage.setItem('user', JSON.stringify(data));
            updateNavigation();
            window.location.href = '/index.html';
        } else {
            console.error('Registration failed with status:', response.status, 'and data:', data);
            const errorMessage = data.message || 'Registration failed. Please try again.';
            displayErrorMessage(errorMessage, 'register-error-message');
        }
    } catch (error) {
        console.error('An error occurred during registration:', error);
        displayErrorMessage('An error occurred during registration. Please try again.', 'register-error-message');
    } finally {
        spinner.classList.add('hidden-spinner'); // Hide spinner after process
    }
}


document.addEventListener('DOMContentLoaded', setupRegisterForm);