// Constants for API endpoints
const BASE_API_URL = 'https://api.noroff.dev/api/v1/auction';
const LISTINGS_ENDPOINT = `${BASE_API_URL}/listings?_bids=true&_seller=true&_active=true`;

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

function initializePage() {
    fetchAndDisplayListings();
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('searchButton').addEventListener('click', handleSearch);
}

async function fetchAndDisplayListings(tag = '') {
    try {
        const listings = await fetchOpenListings(tag);
        displayOpenListings(listings);
    } catch (error) {
        console.error('Error fetching open listings:', error);
        displayErrorMessage('Error fetching listings. Please try again later.');
    }
}

async function fetchOpenListings(tag = '') {
    clearErrorMessage();
    const url = buildListingUrl(tag);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching listings:', error);
        displayErrorMessage('An error occurred while fetching listings.');
        return [];
    }
}

function buildListingUrl(tag) {
    let url = LISTINGS_ENDPOINT;
    if (tag) {
        url += `&_tag=${encodeURIComponent(tag)}`;
    }
    return url;
}

function displayOpenListings(listings) {
    const listingsContainer = document.getElementById('listings-section');
    if (!listings.length) {
        listingsContainer.innerHTML = '<p>No listings found.</p>';
        return;
    }

    const row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-md-3 g-4';

    listings.forEach((listing, index) => {
        row.innerHTML += createListingHtml(listing, index);
    });

    listingsContainer.appendChild(row);
}

function createListingHtml(listing, index) {
    const carouselId = `carouselExample${index}`;

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

        carouselHtml = `
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
        `;
    }

    const bidsInfo = listing.bids && listing.bids.length > 0 ? 
        `Most Recent Bid: ${listing.bids[0].amount}` : 
        'No bids yet';

    const sellerInfo = listing.seller ? 
        `<div class="card-footer"><small class="text-body-secondary">${listing.seller.name}</small></div>` : 
        '';

    return `
        <div class="col">
            <div class="card h-100">
                ${carouselHtml}
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text">${listing.description}</p>
                    <p class="card-text"><small class="text-muted">Bid ends at: ${new Date(listing.endsAt).toLocaleString()}</small></p>
                    <p class="card-text">${bidsInfo}</p>
                </div>
                ${sellerInfo}
            </div>
        </div>
    `;
}

function isValidTag(tag) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(tag);
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const tag = searchInput.value.trim();

    if (!isValidSearchInput(tag)) {
        return;
    }

    fetchAndDisplayListings(tag);
}

function isValidSearchInput(tag) {
    clearErrorMessage();

    if (!tag) {
        displayErrorMessage('Please enter a tag to search.');
        return false;
    }

    if (!isValidTag(tag)) {
        displayErrorMessage('Please enter a valid tag. Tags should only contain letters and numbers.');
        return false;
    }

    return true;
}

function clearErrorMessage() {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.style.display = 'none';
}

function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

