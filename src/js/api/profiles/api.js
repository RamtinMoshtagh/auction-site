export { createListing, addBidToListing, fetchListings, deleteListing };

async function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        throw new Error('User data not available');
    }
}

async function createListing(listingData) {
    const user = await getUser();
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
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Failed to create listing');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function addBidToListing(listingId, bidAmount) {
    const user = await getUser();
    try {
        const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${listingId}/bids`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ amount: Number(bidAmount) })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Failed to add bid');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

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
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function deleteListing(id) {
    const user = await getUser();
    try {
        const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete listing: ${response.status}`);
        }
    } catch (error) {
        throw error;
    }
}
