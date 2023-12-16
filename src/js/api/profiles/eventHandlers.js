export { handleDeleteListing };
import { deleteListing } from "/src/js/api/profiles/api.js";

function handleDeleteListing(id) {
    deleteListing(id).then(() => {
        fetchUserActiveListings(currentUserProfile.name);
    });
}