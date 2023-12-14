export { createListing, addBidToListing, fetchListings, deleteListing };

// Function to create a new listing
async function createListing(listingData) {
    handleCreateListingSpinner(true); // Show spinner

    const user = JSON.parse(localStorage.getItem('user'));
    try {
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
    } catch (error) {
        console.error('Error creating listing:', error);
        throw error; // Rethrow the error for further handling
    } finally {
        handleCreateListingSpinner(false); // Hide spinner
    }
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
        body: JSON.stringify({ amount: Number(bidAmount) }) // Ensure bidAmount is a number
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        console.error('API Error Response:', errorResponse);
        throw new Error(`Failed to add bid: ${errorResponse.message || 'Unknown error'}`);
    }

    return await response.json();
}

// Function to fetch active listings with bids
async function fetchListings(tag = '') {
    try {
        let url = `https://api.noroff.dev/api/v1/auction/listings?_bids=true&_seller=true&_active=true`;
        if (tag) {
            url += `&_tag=${encodeURIComponent(tag)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.status}`);
        }
        const listings = await response.json();
        return listings;
    } catch (error) {
        console.error('Error fetching listings:', error);
        return []; // Return an empty array in case of error
    }
}

async function deleteListing(id) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        await fetch(`https://api.noroff.dev/api/v1/auction/listings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        });

        // Remove the listing from the display
        document.getElementById(`listing-${id}`).remove();
    } catch (error) {
        console.error('Error deleting listing:', error);
    }
}

