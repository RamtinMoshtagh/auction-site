
export { handleBidSubmission, fetchListingById };
import { addBidToListing } from "/src/js/api/profiles/api.js";

// Function to handle bid submission
async function handleBidSubmission(event, listingId) {
    event.preventDefault();
    const bidAmountInput = document.getElementById(`bid-amount-${listingId}`);
    const bidAmount = bidAmountInput.value;
    const bidResponseContainer = document.getElementById(`bid-response-${listingId}`);

    try {
        const bidResponse = await addBidToListing(listingId, bidAmount);
        console.log('Bid placed:', bidResponse);

        // Fetch the updated listing to get the latest bid details
        const updatedListing = await fetchListingById(listingId);
        const latestBidAmount = updatedListing.bids && updatedListing.bids.length > 0 
            ? Math.max(...updatedListing.bids.map(bid => bid.amount))
            : bidAmount;

        // Update the UI with the latest bid details
        bidResponseContainer.innerHTML = `<p class="text-success">Bid of ${latestBidAmount} placed successfully!</p>`;
        bidAmountInput.value = ''; // Reset the input field
    } catch (error) {
        console.error('Error placing bid:', error);
        // Check if the error message is about the bid amount being too low
        if (error.message.includes("Your bid must be higher than the current bid")) {
            alert("Your bid must be higher than the current bid");
        }
        bidResponseContainer.innerHTML = `<p class="text-danger">Error placing bid: ${error.message}</p>`;
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

