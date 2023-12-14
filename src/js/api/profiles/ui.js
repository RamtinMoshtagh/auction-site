export { displayListings, handleCreateListingSpinner };


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

        // Create a section for the most recent bid and the total number of bids
        let bidsHtml = '<ul class="list-group list-group-flush">';
        if (listing.bids && listing.bids.length > 0) {
            // Find the most recent bid
            const mostRecentBid = listing.bids.reduce((latest, current) => 
                new Date(latest.created) > new Date(current.created) ? latest : current
            );
            bidsHtml += `<li class="list-group-item">Most Recent Bid: ${mostRecentBid.amount} by ${mostRecentBid.bidderName} on ${new Date(mostRecentBid.created).toLocaleString()}</li>`;
            bidsHtml += `<li class="list-group-item">Total Bids: ${listing.bids.length}</li>`;
        } else {
            bidsHtml += '<li class="list-group-item">No bids yet</li>';
        }
        bidsHtml += '</ul>';
        const sellerInfoHtml = listing.seller ? `
            <div class="seller-info">
                <img src="${listing.seller.avatar}" alt="${listing.seller.name}" class="seller-avatar">
                <span class="seller-name">${listing.seller.name}</span>
            </div>
        ` : '';

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
                ${sellerInfoHtml}
                <h5 class="card-title">${listing.title}</h5>
                <p class="card-text">${listing.description}</p>
                <p class="card-text"><small class="text-muted">Ends at: ${new Date(listing.endsAt).toLocaleString()}</small></p>
                ${bidButtonAndModalHTML}
            </div>
            ${bidsHtml}
        `;

        col.appendChild(card);
        row.appendChild(col);
    });

    listingsContainer.appendChild(row);

    listings.forEach((listing) => {
        const confirmDeleteButton = document.getElementById(`confirmDelete${listing.id}`);
        if (confirmDeleteButton) {
            confirmDeleteButton.addEventListener('click', () => {
                handleDeleteListing(listing.id);
            });
        }
    });
}

function handleCreateListingSpinner(show) {
    const spinnerContainer = document.getElementById('spinner-container');
    if (spinnerContainer) {
        spinnerContainer.style.display = show ? 'block' : 'none';
    }
}
