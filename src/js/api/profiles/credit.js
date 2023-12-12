import { getUserProfile } from './user.js';
export { displayUserCredits };

async function displayUserCredits(elementId) {
    try {
        const userProfile = await getUserProfile();
        document.getElementById(elementId).textContent = `Credits: ${userProfile.credits}`;
    } catch (error) {
        console.error('Error displaying user credits:', error);
        document.getElementById(elementId).textContent = 'Error loading credits';
    }
}
