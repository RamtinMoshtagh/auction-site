export { logout };
import { updateNavigation } from './navigation.js'; 

function logout() {
    try {
        localStorage.removeItem('user');
        updateNavigation();
        window.location.href = '/index.html';
    } catch (error) {
        alert('An error occurred during logout. Please try again.');
    }
}


