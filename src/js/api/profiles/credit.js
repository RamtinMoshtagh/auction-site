import { getUserProfile } from './user.js';
export { displayUserCredits };

async function displayUserCredits() {
    const creditsDisplay = document.getElementById('credits-display');
    const spinner = document.getElementById('credits-spinner');

    // Show spinner while loading
    spinner.classList.remove('spinner-hidden');
    spinner.classList.add('spinner-visible');

    try {
        const userProfile = await getUserProfile();
        // Hide spinner and show credits
        spinner.classList.remove('spinner-visible');
        spinner.classList.add('spinner-hidden');
        creditsDisplay.textContent = `Credits: ${userProfile.credits}`;
    } catch (error) {
        console.error('Error displaying user credits:', error);
        // Hide spinner and show error message
        spinner.classList.remove('spinner-visible');
        spinner.classList.add('spinner-hidden');
        creditsDisplay.textContent = 'Error loading credits';
    }
}



