'use strict';

function saveGameState() {
    const gameState = {
        players: globalThis.players
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Check if the user is leaving a match in progress
function checkMatchInProgress() {
    const currentURL = window.location.href;
    if (currentURL.includes('https://colonist.io/#')) {
        saveGameState();
    }
}

window.addEventListener('beforeunload', checkMatchInProgress);