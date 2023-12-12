export { setupRegisterForm, handleRegister};

import { updateNavigation } from './navigation.js'; 

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

    try {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const avatarElement = document.getElementById('register-avatar');
        const avatar = avatarElement ? avatarElement.value : '';

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
            alert('Registration failed: ' + data.message); // Display error message to user
        }
    } catch (error) {
        console.error('An error occurred during registration:', error);
        alert('An error occurred during registration. Please try again.'); // Display error message to user
    } finally {
        spinner.classList.add('hidden-spinner'); // Hide spinner after process
    }
}
document.addEventListener('DOMContentLoaded', setupRegisterForm);