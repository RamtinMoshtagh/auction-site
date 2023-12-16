export { updateAvatar };
async function updateAvatar(username, avatarUrl) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`https://api.noroff.dev/api/v1/auction/profiles/${user.name}/media`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ avatar: avatarUrl })
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Failed to update avatar: ${errorResponse.message || 'Unknown error'}`);
        }
        const updatedProfile = await response.json();
        const userAvatarElement = document.getElementById('user-avatar');
        if (userAvatarElement) {
            userAvatarElement.src = avatarUrl;
        } return;
    } catch (error) {
        throw error;
    }
}



