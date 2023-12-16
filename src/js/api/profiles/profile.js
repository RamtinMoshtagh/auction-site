import { getUserProfile } from '/src/js/api/profiles/user.js';
import { displayUserCredits } from '/src/js/api/profiles/credit.js';
import { updateAvatar } from '/src/js/api/profiles/avatar.js';
import { handleDeleteListing } from '/src/js/api/profiles/eventHandlers.js';

const UserProfile = {
    currentUserProfile: null,
    async load() {
        try {
            this.currentUserProfile = await getUserProfile();
            if (this.currentUserProfile) {
                this.display(this.currentUserProfile);
                fetchUserActiveListings(this.currentUserProfile.name);
            } else {
                this.showError('User profile not found');
            }
        } catch (error) {
            this.showError(`Error loading user profile: ${error.message}`);
        }
    },

    display(userProfile) {
        if (userProfile.avatar) {
            document.getElementById('user-avatar').src = userProfile.avatar;
        }
        document.getElementById('user-name').textContent = userProfile.name;
        displayUserCredits('credits-display');
    },

    showError(message) {
        displayError(message);
    }
};

function setupUpdateAvatarForm() {
    const avatarForm = document.getElementById('update-avatar-form');
    if (avatarForm) {
        avatarForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const avatarUrl = document.getElementById('avatar-url').value;
            if (!avatarUrl) {
                displayError('Please provide an avatar URL');
                return;
            }
            try {
                await updateAvatar(UserProfile.currentUserProfile.name, avatarUrl);
            } catch (error) {
                displayError('Error updating avatar: ' + error.message);
            }
        });
    } return;
}

async function fetchUserActiveListings(username) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`https://api.noroff.dev/api/v1/auction/profiles/${username}/listings?_seller=true&_active=true`, {
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
        displayError('Error fetching user active listings: ' + error.message);
    }
}

function displayActiveListings(listings) {
    const listingsContainer = document.getElementById('active-listings-container');

    listingsContainer.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-md-3 g-4';

    listings.forEach((listing, index) => {
        const col = createColumn();
        const card = createCard();

        const carouselHtml = createCarousel(listing, index);
        if (carouselHtml) {
            card.innerHTML += carouselHtml;
        }

        const cardBody = createCardBody(listing);
        card.appendChild(cardBody);

        col.appendChild(card);
        row.appendChild(col);

        const deleteModal = createDeleteModal(listing);
        document.body.appendChild(deleteModal);
        attachDeleteListener(listing.id);
    });

    listingsContainer.appendChild(row);
}

function createColumn() {
    const col = document.createElement('div');
    col.className = 'col';
    return col;
}

function createCard() {
    const card = document.createElement('div');
    card.className = 'card h-100';
    return card;
}

function createCarousel(listing, index) {
    const carouselId = `carouselActiveExample${index}`;
    let carouselHtml = '';

    if (listing.media && listing.media.length > 0) {
        const carouselIndicators = listing.media.map((_, idx) => 
            `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${idx}" ${idx === 0 ? 'class="active"' : ''} aria-label="Slide ${idx + 1}"></button>`
        ).join('');

        const carouselItems = listing.media.map((mediaUrl, idx) => 
            `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
                <img src="${mediaUrl}" class="d-block w-100 card-img-top" alt="Listing image ${idx + 1}" style="height: 200px; object-fit: cover;">
            </div>`
        ).join('');

        const carouselControls = `
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        `;

        carouselHtml = `
            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">${carouselIndicators}</div>
                <div class="carousel-inner">${carouselItems}</div>
                ${carouselControls}
            </div>
        `;
    }

    return carouselHtml;
}

function createCardBody(listing) {
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const sellerInfoHtml = listing.seller ? `
        <div class="seller-info">
            <img src="${listing.seller.avatar}" alt="${listing.seller.name}" class="seller-avatar">
            <span class="seller-name">${listing.seller.name}</span>
        </div>
    ` : '';

    cardBody.innerHTML = `
        ${sellerInfoHtml}
        <h5 class="card-title">${listing.title}</h5>
        <p class="card-text">${listing.description}</p>
        <p class="card-text"><small class="text-muted">Ends at: ${new Date(listing.endsAt).toLocaleString()}</small></p>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger mt-2';
    deleteButton.setAttribute('data-bs-toggle', 'modal');
    deleteButton.setAttribute('data-bs-target', `#deleteModal${listing.id}`);
    cardBody.appendChild(deleteButton);

    return cardBody;
}

function createDeleteModal(listing) {
    const deleteModal = document.createElement('div');
    deleteModal.className = 'modal fade';
    deleteModal.id = `deleteModal${listing.id}`;
    deleteModal.setAttribute('tabindex', '-1');
    deleteModal.setAttribute('aria-labelledby', `deleteModalLabel${listing.id}`);
    deleteModal.setAttribute('aria-hidden', 'true');
    deleteModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel${listing.id}">Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this listing?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDelete${listing.id}">Delete</button>
                </div>
            </div>
        </div>
    `;

    return deleteModal;
}

function attachDeleteListener(listingId) {
    const confirmDeleteButton = document.getElementById(`confirmDelete${listingId}`);
    confirmDeleteButton.addEventListener('click', () => {
        handleDeleteListing(listingId);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    UserProfile.load();
    setupUpdateAvatarForm();
});

function displayError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}