import { createListing, fetchListings } from '/src/js/api/profiles/api.js';
import { displayListings, handleCreateListingSpinner } from '/src/js/api/profiles/ui.js';
import { handleBidSubmission } from '/src/js/api/profiles/bid.js';
import { updateNavigation } from '/src/js/api/auth/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();

    fetchListings()
        .then(listings => {
            displayListings(listings);
            attachBidFormEventListeners(listings); // Pass listings to the function
        })
        .catch(error => {
            console.error('Error fetching listings:', error);
            displayErrorMessage('Error fetching listings. Please try again later.');
        });

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

function attachBidFormEventListeners(listings) {
    listings.forEach(listing => {
        const form = document.getElementById(`bid-form-${listing.id}`);
        if (form) {
            form.removeEventListener('submit', handleBidSubmission); // Remove existing listener to avoid duplicates
            form.addEventListener('submit', event => handleBidSubmission(event, listing.id));
        }
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

                // Validate form inputs
                if (!isValidListingInput(title, description, tags, media, endsAt)) {
                    return;
                }

                const listingData = { title, description, tags, media, endsAt };

                handleCreateListingSpinner(true); // Show spinner before creating listing

                // Call createListing function with the listing data
                const response = await createListing(listingData);
                console.log('Listing created:', response);

                // Fetch and display listings again to include the new listing
                fetchListings()
                    .then(listings => {
                        displayListings(listings);
                        attachBidFormEventListeners(listings); // Update event listeners
                    })
                    .catch(error => console.error('Error fetching listings:', error));
            } catch (error) {
                console.error('Error creating listing:', error);
                displayErrorMessage('An error occurred while creating the listing. Please try again.');
            } finally {
                handleCreateListingSpinner(false); // Hide spinner after creating listing or if an error occurs
            }
        });
    } else {
        console.error('Create listing form not found');
    }
}

function isValidListingInput(title, description, tags, media, endsAt) {
    clearErrorMessage();

    if (!title || !description || !endsAt) {
        displayErrorMessage('Please fill in all required fields.');
        return false;
    }

    if (tags.length === 0) {
        displayErrorMessage('Please enter at least one tag.');
        return false;
    }

    if (media.length === 0) {
        displayErrorMessage('Please enter at least one media URL.');
        return false;
    }

    return true;
}

function clearErrorMessage() {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = '';
    errorMessageDiv.style.display = 'none';
}

function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}
