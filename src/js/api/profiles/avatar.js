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
            const errorResponse = await response.json(); // Parse error response
            console.error('API Error Response:', errorResponse); // Log detailed error response
            throw new Error(`Failed to update avatar: ${errorResponse.message || 'Unknown error'}`);
        }

        const updatedProfile = await response.json();
        

        // Update the image source
        document.getElementById('avatar-image').src = updatedProfile.avatar;
        const avatarElement = document.getElementById('user-avatar');
        if (avatarElement) {
            avatarElement.src = avatarUrl;
        } else {
            console.error('Avatar element not found');
        }

        console.log('Avatar updated:', updatedProfile);
        return updatedProfile;
    } catch (error) {
        console.error('Error updating avatar:', error);
        throw error;
    }
   
}



