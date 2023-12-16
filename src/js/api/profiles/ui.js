export { displayListings, handleCreateListingSpinner };

function displayListings(listings) {
    const listingsContainer = document.getElementById('listings-section');
    if (!listingsContainer) {
        return;
    }

    let rowHtml = '<div class="row row-cols-1 row-cols-md-3 g-4">';
    listings.forEach((listing, index) => {
        try {
            rowHtml += createListingCardHtml(listing, index);
        } catch (error) {
            throw error;
        }
    });
    rowHtml += '</div>';
    listingsContainer.innerHTML = rowHtml;
    listingsContainer.addEventListener('click', event => {
        if (event.target.matches('.delete-button')) {
            const listingId = event.target.dataset.listingId;
            try {
                handleDeleteListing(listingId);
            } catch (error) {
                throw error;
            }
        }
    });
}

function createListingCardHtml(listing, index) {
    const carouselHtml = createCarouselHtml(listing.media, index);
    const modalHtml = createModalHtml(listing);
    const bidsHtml = createBidsHtml(listing.bids);
    const sellerInfoHtml = listing.seller ? createSellerInfoHtml(listing.seller) : '';

    return `
        <div class="col">
            <div class="card h-100">
                ${carouselHtml}
                <div class="card-body">
                    ${sellerInfoHtml}
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text">${listing.description}</p>
                    <p class="card-text"><small class="text-muted">Ends at: ${new Date(listing.endsAt).toLocaleString()}</small></p>
                    ${modalHtml}
                </div>
                ${bidsHtml}
            </div>
        </div>
    `;
}

function createCarouselHtml(media, index) {
    const carouselId = `carouselExample${index}`;
    const carouselIndicators = media.map((_, idx) =>
        `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${idx}" ${idx === 0 ? 'class="active"' : ''} aria-label="Slide ${idx + 1}"></button>`
    ).join('');

    const carouselItems = media.map((mediaUrl, idx) =>
        `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
            <img src="${mediaUrl}" class="d-block w-100 card-img-top" alt="Listing image ${idx + 1}" style="height: 200px; object-fit: cover;">
        </div>`
    ).join('');

    return `
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

function createModalHtml(listing) {
    if (!listing || !listing.id) {
        return '';
    }

    return `
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
                        <form id="bid-form-${listing.id}" class="bid-form" data-listing-id="${listing.id}">
                            <input type="number" class="form-control" id="bid-amount-${listing.id}" placeholder="Your bid amount" required>
                            <button type="submit" class="btn btn-success mt-2">Submit Bid</button>
                        </form>
                        <div id="bid-response-${listing.id}" class="mt-2"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createBidsHtml(bids) {
    let bidsHtml = '<ul class="list-group list-group-flush">';
    if (bids && bids.length > 0) {
        const mostRecentBid = bids.reduce((latest, current) => 
            new Date(latest.created) > new Date(current.created) ? latest : current
        );
        bidsHtml += `<li class="list-group-item">Most Recent Bid: ${mostRecentBid.amount} by ${mostRecentBid.bidderName} on ${new Date(mostRecentBid.created).toLocaleString()}</li>`;
        bidsHtml += `<li class="list-group-item">Total Bids: ${bids.length}</li>`;
    } else {
        bidsHtml += '<li class="list-group-item">No bids yet</li>';
    }
    bidsHtml += '</ul>';
    return bidsHtml;
}

function createSellerInfoHtml(seller) {
    return `
        <div class="seller-info">
            <img src="${seller.avatar}" alt="${seller.name}" class="seller-avatar">
            <span class="seller-name">${seller.name}</span>
        </div>
    `;
}

function handleCreateListingSpinner(show) {
    const spinnerContainer = document.getElementById('spinner-container');
    if (!spinnerContainer) {
        return;
    }

    if (show) {
        spinnerContainer.style.display = 'block';
    } else {
        spinnerContainer.style.display = 'none';
    }
}
