export { handleDeleteListing };

function handleDeleteListing(id) {
    deleteListing(id).then(() => {
        console.log('Listing deleted:', id);
        fetchUserActiveListings(currentUserProfile.name);
    }).catch(error => {
        console.error('Error deleting listing:', error);
    });
}