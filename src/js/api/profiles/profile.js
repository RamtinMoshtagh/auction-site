import { getUserProfile } from '/src/js/api/profiles/user.js';
import { displayUserCredits } from '/src/js/api/profiles/credit.js';
import { updateAvatar } from '/src/js/api/profiles/avatar.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userProfile = await getUserProfile();
        if (userProfile) {
            if (userProfile.avatar) {
                document.getElementById('user-avatar').src = userProfile.avatar;
            }
            document.getElementById('user-name').textContent = userProfile.name;
            displayUserCredits('credits-display');
            fetchUserActiveListings(userProfile.name);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }

    setupUpdateAvatarForm();
});

function setupUpdateAvatarForm() {
    const avatarForm = document.getElementById('update-avatar-form');
    if (avatarForm) {
        avatarForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                const avatarUrl = document.getElementById('avatar-url').value;
                const userProfile = await getUserProfile();
                if (userProfile && userProfile.name) {
                    await updateAvatar(userProfile.name, avatarUrl);
                    console.log('Avatar updated');
                } else {
                    console.error('User profile not found');
                }
            } catch (error) {
                console.error('Error updating avatar:', error);
            }
        });
    } else {
        console.error('Avatar form not found');
    }
}


async function fetchUserActiveListings(username) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`https://api.noroff.dev/api/v1/auction/profiles/${username}/listings?_active=true`, {
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch active listings: ${response.status} ${response.statusText}`);
        }

        const listings = await response.json();
        displayActiveListings(listings);
    } catch (error) {
        console.error('Error fetching user active listings:', error);
    }
}

function displayActiveListings(listings) {
    const listingsContainer = document.getElementById('active-listings-container');
    if (!listingsContainer) {
        console.error('Active listings container not found');
        return;
    }

    listingsContainer.innerHTML = ''; // Clear existing listings
    const row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-md-3 g-4';

    listings.forEach((listing, index) => {
        const col = document.createElement('div');
        col.className = 'col';
        const card = document.createElement('div');
        card.className = 'card h-100';

        const carouselId = `carouselActiveExample${index}`;
        const carouselIndicators = listing.media.map((_, idx) => 
            `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${idx}" ${idx === 0 ? 'class="active"' : ''} aria-label="Slide ${idx + 1}"></button>`
        ).join('');

        const carouselItems = listing.media.map((mediaUrl, idx) => 
            `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
                <img src="${mediaUrl}" class="d-block w-100 card-img-top" alt="Listing image ${idx + 1}" style="height: 200px; object-fit: cover;">
            </div>`
        ).join('');

        card.innerHTML = `
        <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">${carouselIndicators}</div>
            <div class="carousel-inner">${carouselItems}</div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description}</p>
            <p class="card-text"><small class="text-muted">Ends at: ${new Date(listing.endsAt).toLocaleString()}</small></p>
        </div>
        `;

        col.appendChild(card);
        row.appendChild(col);
    });

    listingsContainer.appendChild(row);
}





