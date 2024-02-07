'use strict';

function saveGameState() {
    const gameState = {
        url: window.location.href,
        players: globalThis.players
    };
    window.localStorage.setItem('gameState', JSON.stringify(gameState));
    // localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Check if the user is leaving a match in progress
function checkMatchInProgress() {
    const currentURL = window.location.href;
    if (currentURL.includes('https://colonist.io/#')) {
        saveGameState();
    }
}

window.addEventListener('beforeunload', checkMatchInProgress);