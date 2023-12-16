export { getUserProfile};

async function getUserProfile() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.accessToken) {
            throw new Error('User not logged in');
        }

        const response = await fetch(`https://api.noroff.dev/api/v1/auction/profiles/${user.name}`, {
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
