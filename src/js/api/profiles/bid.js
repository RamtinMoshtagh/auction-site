export { handleBidSubmission, fetchListingById };
import { addBidToListing } from "/src/js/api/profiles/api.js";

async function handleBidSubmission(event, listingId) {
    event.preventDefault();
    const bidAmountInput = document.getElementById(`bid-amount-${listingId}`);
    const bidResponseContainer = document.getElementById(`bid-response-${listingId}`);

    if (!bidAmountInput || !bidResponseContainer) {
        return;
    }

    const bidAmount = parseFloat(bidAmountInput.value);
    
    try {
        const listing = await fetchListingById(listingId);
        if (!listing) {
            throw new Error('Listing not found');
        }

        const highestBid = Array.isArray(listing.bids) && listing.bids.length > 0 
                           ? parseFloat(listing.bids[0].amount) 
                           : 0;
        
        if (bidAmount <= highestBid) {
            bidResponseContainer.innerHTML = `<p class="text-danger">Your bid must be higher than the current highest bid (${highestBid}).</p>`;
            return;
        }

        await addBidToListing(listingId, bidAmount);
        const updatedListing = await fetchListingById(listingId);
        const bidCount = updatedListing._count.bids;
        bidResponseContainer.innerHTML = `<p class="text-success">Bid placed successfully! Total bids: ${bidCount}</p>`;
        bidAmountInput.value = '';
    } catch (error) {
        bidResponseContainer.innerHTML = `<p class="text-danger">Your bid must be higher than the current highest bid: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.bid-form');
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            const listingId = form.getAttribute('id').replace('bid-form-', '');
            handleBidSubmission(event, listingId);
        });
    });
});

async function fetchListingById(listingId) {
    try {
        const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${listingId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch listing: ${response.status}`);
        }
        const listingData = await response.json();
        return listingData;
    } catch (error) {
        throw error;
    }
}
