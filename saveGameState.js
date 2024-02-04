// Function to save the game state
function saveGameState() {
    // Here you can save the state of the game to your preferred storage mechanism (e.g., localStorage, sessionStorage, server database, etc.)
    // For example, if you're using localStorage:
    const gameState = {
        players: globalThis.players
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Check if the user is leaving a match in progress
function checkMatchInProgress() {
    const currentURL = window.location.href;
    if (currentURL.includes('https://colonist.io/#')) {
        // Match is in progress
        saveGameState();
    }
}

// Attach event listener to the beforeunload event
window.addEventListener('beforeunload', checkMatchInProgress);