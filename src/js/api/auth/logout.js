export { logout };
import { updateNavigation } from './navigation.js'; 

function logout() {
    try {
        localStorage.removeItem('user');
        updateNavigation();
        console.log("Redirecting to index.html");
        window.location.href = '/index.html';
    } catch (error) {
        console.error('An error occurred during logout:', error);
        alert('An error occurred during logout. Please try again.');
    }
}


