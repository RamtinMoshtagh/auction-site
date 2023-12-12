document.addEventListener('DOMContentLoaded', () => {
    fetchOpenListings().then(listings => {
        displayOpenListings(listings);
    }).catch(error => console.error('Error fetching open listings:', error));
});

async function fetchOpenListings() {
    try {
        const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings`);
        if (!response.ok) {
            throw new Error(`Failed to fetch open listings: ${response.status}`);
        }
        const listings = await response.json();
        return listings;
    } catch (error) {
        console.error('Error fetching open listings:', error);
        return [];
    }
}

function displayOpenListings(listings) {
    const listingsContainer = document.getElementById('listings-section');
    listingsContainer.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row row-cols-1 row-cols-md-3 g-4';
    listingsContainer.appendChild(row);

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

        // Display the current highest bid
        const highestBid = listing.bids && listing.bids.length > 0 
            ? Math.max(...listing.bids.map(bid => bid.amount))
            : 'No bids yet';

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
                <p class="card-text">Highest Bid: ${highestBid}</p>
                <p class="card-text"><small class="text-muted">Bid ends at: ${new Date(listing.endsAt).toLocaleString()}</small></p>
            </div>
        `;

        col.appendChild(card);
        row.appendChild(col);
    });
}
