export { createListing, addBidToListing, fetchListings, displayListings };

// Function to create a new listing
async function createListing(listingData) {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch('https://api.noroff.dev/api/v1/auction/listings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify(listingData)
    });

    if (!response.ok) {
        throw new Error('Failed to create listing');
    }

    const newListing = await response.json();
    return newListing;
}

// Function to add a bid to a listing
async function addBidToListing(listingId, bidAmount) {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${listingId}/bids`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({ amount: bidAmount })
    });

    if (!response.ok) {
        throw new Error('Failed to add bid');
    }

    return await response.json();
}

// Function to fetch listings
async function fetchListings() {
    const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings`);
    if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.status}`);
    }
    const listings = await response.json();
    return listings;
}

// Function to display listings on the page
function displayListings(listings) {
    const listingsContainer = document.getElementById('listings-section');
    if (!listingsContainer) {
        console.error('Listings container not found');
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

        // Create a carousel for the media gallery
        const carouselId = `carouselExample${index}`;
        const carouselIndicators = listing.media.map((_, idx) => 
            `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${idx}" ${idx === 0 ? 'class="active"' : ''} aria-label="Slide ${idx + 1}"></button>`
        ).join('');

        const carouselItems = listing.media.map((mediaUrl, idx) => 
            `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
                <img src="${mediaUrl}" class="d-block w-100 card-img-top" alt="Listing image ${idx + 1}" style="height: 200px; object-fit: cover;">
            </div>`
        ).join('');

        // Place Bid Button and Modal HTML
        const bidButtonAndModalHTML = `
            <button type="button" class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#bidModal${listing.id}">
                Place Bid
            </button>
            <div class="modal fade" id="bidModal${listing.id}" tabindex="-1" aria-labelledby="modalLabel${listing.id}" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalLabel${listing.id}">${listing.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>${listing.description}</p>
                            <form id="bid-form-${listing.id}" onsubmit="handleBidSubmission(event, '${listing.id}')">
                                <input type="number" class="form-control" id="bid-amount-${listing.id}" placeholder="Your bid amount" required>
                                <button type="submit" class="btn btn-success mt-2">Submit Bid</button>
                            </form>
                            <div id="bid-response-${listing.id}" class="mt-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Use _count to display the number of bids
        const bidCount = listing._count && listing._count.bids ? listing._count.bids : 0;
        const bidInfo = bidCount > 0 ? `${bidCount} bids` : 'No bids yet';

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
                <p class="card-text">${bidInfo}</p>
                <p class="card-text"><small class="text-muted">Bid ends at: ${new Date(listing.endsAt).toLocaleString()}</small></p>
                ${bidButtonAndModalHTML}
            </div>
        `;

        col.appendChild(card);
        row.appendChild(col);
    });

    listingsContainer.appendChild(row);
}




