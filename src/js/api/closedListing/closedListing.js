import { createListing, fetchListings } from '/src/js/api/profiles/api.js';
import { displayListings, handleCreateListingSpinner } from '/src/js/api/profiles/ui.js';
import { handleBidSubmission } from '/src/js/api/profiles/bid.js';
import { updateNavigation } from '/src/js/api/auth/navigation.js';
import { displayErrorMessage, isValidListingInput, clearErrorMessage } from '/src/js/api/auth/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    initializePage();
});

function initializePage() {
    fetchListings()
        .then(listings => {
            displayListings(listings);
            attachEventListeners();
        })
        .catch(error => {
            displayErrorMessage('Error fetching listings. Please try again later.', 'closed-listing-error-message');
        });
    setupCreateListingForm();
}

function attachEventListeners() {
    const listingsContainer = document.getElementById('listings-section');
    if (listingsContainer) {
        listingsContainer.addEventListener('submit', event => {
            if (event.target.matches('.bid-form')) {
                event.preventDefault();
                const listingId = event.target.dataset.listingId;
                handleBidSubmission(event, listingId)
                    .catch(error => {
                        displayErrorMessage(`Failed to submit bid: ${error.message || 'Unknown error'}`);
                    });
            }
        });
    }
}

function setupCreateListingForm() {
    const form = document.getElementById('create-listing-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            handleFormSubmission(form);
        });
    }
}

async function handleFormSubmission(form) {
    clearAllErrorMessages();

    const formData = extractFormData(form);
    let isFormValid = true;

    if (!formData.title.trim()) {
        displayErrorMessage('Title is required', 'title-error-message');
        isFormValid = false;
    } else {
        clearErrorMessage('title-error-message');
    }
    if (!formData.description.trim()) {
        displayErrorMessage('Description is required', 'description-error-message');
        isFormValid = false;
    } else {
        clearErrorMessage('description-error-message');
    }
    if (formData.tags.length === 0 || formData.tags.some(tag => !tag.trim())) {
        displayErrorMessage('At least one valid tag is required', 'tags-error-message');
        isFormValid = false;
    } else {
        clearErrorMessage('tags-error-message');
    }
    if (formData.media.length === 0 || formData.media.some(url => !url.trim())) {
        displayErrorMessage('At least one valid media URL is required', 'media-error-message');
        isFormValid = false;
    } else {
        clearErrorMessage('media-error-message');
    }
    if (!formData.endsAt) {
        displayErrorMessage('End date is required', 'end-date-error-message');
        isFormValid = false;
    } else {
        clearErrorMessage('end-date-error-message');
    }
    if (!isFormValid) {
        return;
    }

    handleCreateListingSpinner(true);
    try {
        const response = await createListing(formData);
        refreshListings();
        displaySuccessMessage('Listing created successfully!', 'create-listing-success-message');
    } catch (error) {
        displayErrorMessage('An error occurred while creating the listing. Please try again.', 'closed-listing-error-message');
    } finally {
        handleCreateListingSpinner(false);
    }
}

function displaySuccessMessage(message, messageId) {
    const successMessageDiv = document.getElementById(messageId);
    if (successMessageDiv) {
        successMessageDiv.textContent = message;
        successMessageDiv.style.display = 'block';
        setTimeout(() => {
            successMessageDiv.style.display = 'none';
        }, 5000);
    }
}

function clearAllErrorMessages() {
    clearErrorMessage('title-error-message');
    clearErrorMessage('description-error-message');
    clearErrorMessage('tags-error-message');
    clearErrorMessage('media-error-message');
    clearErrorMessage('end-date-error-message');
    clearErrorMessage('closed-listing-error-message');
}

function extractFormData(form) {
    return {
        title: form['listing-title'].value,
        description: form['listing-description'].value,
        tags: form['listing-tags'].value.split(',').map(tag => tag.trim()),
        media: form['listing-media'].value.split(',').map(url => url.trim()),
        endsAt: form['listing-end-date'].value
    };
}

async function refreshListings() {
    clearErrorMessage('closed-listing-error-message');
    try {
        const listings = await fetchListings();
        displayListings(listings);
        attachEventListeners();
    } catch (error) {
        displayErrorMessage('Error refreshing listings. Please try again later.', 'closed-listing-error-message');
    }
}