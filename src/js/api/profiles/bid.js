
export { handleBidSubmission, fetchListingById };

async function handleBidSubmission(event, listingId) {
    event.preventDefault();
    const bidAmountInput = document.getElementById(`bid-amount-${listingId}`);
    const bidAmount = bidAmountInput.value;
    const bidResponseContainer = document.getElementById(`bid-response-${listingId}`);
    const highestBidElement = document.getElementById(`highest-bid-${listingId}`); // Element to display the highest bid

    try {
        const bidResponse = await addBidToListing(listingId, bidAmount);
        console.log('Bid placed:', bidResponse);

        // Fetch the updated listing to get the latest bid details
        const updatedListing = await fetchListingById(listingId);
        const latestBidAmount = updatedListing.bids && updatedListing.bids.length > 0 
            ? Math.max(...updatedListing.bids.map(bid => bid.amount))
            : bidAmount; // Fallback to the current bid amount if no bids array is available

        // Update the UI with the latest bid details
        if (bidResponseContainer) {
            bidResponseContainer.innerHTML = `<p class="text-success">Bid of ${bidAmount} placed successfully!</p>`;
        }
        if (highestBidElement) {
            highestBidElement.textContent = `Highest Bid: ${latestBidAmount}`;
        }
        bidAmountInput.value = ''; // Reset the input field
    } catch (error) {
        console.error('Error placing bid:', error);
        // Display error message
        if (bidResponseContainer) {
            bidResponseContainer.innerHTML = `<p class="text-danger">Error placing bid: ${error.message}</p>`;
        }
    }
}

// Function to fetch a specific listing by ID
async function fetchListingById(listingId) {
    try {
        const response = await fetch(`https://api.noroff.dev/api/v1/auction/listings/${listingId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch listing: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching listing:', error);
        throw error;
    }
}







