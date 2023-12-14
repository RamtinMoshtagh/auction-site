export {displayErrorMessage, handleError}

function displayErrorMessage(message, errorDivId) {
    const errorDiv = document.getElementById(errorDivId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function handleError(error) {
    console.error('Error:', error);
    // Additional error handling logic here
}

