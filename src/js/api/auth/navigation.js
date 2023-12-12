export { updateNavigation, toggleVisibility };

function toggleVisibility(element, isVisible) {
    if (element) {
        element.style.display = isVisible ? 'block' : 'none';
    }
}

function updateNavigation() {
    let user;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Handle the error as needed
    }

    const profileLink = document.getElementById('profile-link');
    const logoutLink = document.getElementById('logout-link');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');

    const isLoggedIn = user != null;

    toggleVisibility(profileLink, isLoggedIn);
    toggleVisibility(logoutLink, isLoggedIn);
    toggleVisibility(loginLink, !isLoggedIn);
    toggleVisibility(registerLink, !isLoggedIn);
}
