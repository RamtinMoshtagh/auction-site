export {displayErrorMessage, clearErrorMessage, isValidListingInput, handleError}

function displayErrorMessage(message, errorDivId = 'error-message') {
    const errorDiv = document.getElementById(errorDivId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('error-message-active');
    } else {
    }
}

function clearErrorMessage(errorDivId = 'error-message') {
    const errorDiv = document.getElementById(errorDivId);
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.remove('error-message-active');
    }
}

function isValidListingInput(formData) {
    let isValid = true;

    if (!formData.title) {
        displayErrorMessage('Please enter a title.', 'closed-listing-error-message');
        isValid = false;
    }
    if (!formData.description) {
        displayErrorMessage('Please enter a description.', 'closed-listing-error-message');
        isValid = false;
    }
    if (!formData.tags || formData.tags.length === 0) {
        displayErrorMessage('Please enter at least one tag.', 'closed-listing-error-message');
        isValid = false;
    }
    if (!formData.media || formData.media.length === 0) {
        displayErrorMessage('Please enter at least one media URL.', 'closed-listing-error-message');
        isValid = false;
    }
    if (!formData.endsAt) {
        displayErrorMessage('Please specify the end date.', 'closed-listing-error-message');
        isValid = false;
    }
    return isValid;
}

function handleError(error, errorDivId = 'error-message') {
    displayErrorMessage(error.toString(), errorDivId);
}