import { getUserProfile } from './user.js';
export { displayUserCredits };

async function displayUserCredits() {
    const creditsDisplay = document.getElementById('credits-display');
    const spinner = document.getElementById('credits-spinner');
    spinner.classList.remove('spinner-hidden');
    spinner.classList.add('spinner-visible');

    try {
        const userProfile = await getUserProfile();
        spinner.classList.remove('spinner-visible');
        spinner.classList.add('spinner-hidden');
        creditsDisplay.textContent = `Credits: ${userProfile.credits}`;
    } catch (error) {
        spinner.classList.remove('spinner-visible');
        spinner.classList.add('spinner-hidden');
        creditsDisplay.textContent = 'Error loading credits';
    }
}



