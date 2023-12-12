import { createListing, addBidToListing, fetchListings, displayListings } from '/src/js/api/profiles/listing.js';
import { handleBidSubmission, fetchListingById } from '/src/js/api/profiles/bid.js';
import { updateNavigation } from '/src/js/api/auth/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();

    fetchListings().then(listings => {
        displayListings(listings);
        attachBidFormEventListeners();
    }).catch(error => console.error('Error fetching listings:', error));

    setupCreateListingForm();

    // Setup logout link
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }
});

function attachBidFormEventListeners() {
    document.querySelectorAll('.bid-form').forEach(form => {
        form.addEventListener('submit', event => handleBidSubmission(event, form.dataset.listingId));
    });
}

function setupCreateListingForm() {
    const form = document.getElementById('create-listing-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                const title = document.getElementById('listing-title').value;
                const description = document.getElementById('listing-description').value;
                const tags = document.getElementById('listing-tags').value.split(',').map(tag => tag.trim());
                const media = document.getElementById('listing-media').value.split(',').map(url => url.trim());
                const endsAt = document.getElementById('listing-end-date').value;

                const listingData = { title, description, tags, media, endsAt };

                const response = await createListing(listingData);
                console.log('Listing created:', response);
                fetchListings().then(listings => {
                    displayListings(listings);
                    attachBidFormEventListeners();
                }).catch(error => console.error('Error fetching listings:', error));
            } catch (error) {
                console.error('Error creating listing:', error);
            }
        });
    } else {
        console.error('Create listing form not found');
    }
}
