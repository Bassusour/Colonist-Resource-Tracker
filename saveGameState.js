'use strict';

function saveGameState(players, seenLogIndexes) {
    const gameState = {
        url: window.location.href,
        players: players,
        seenLogIndexes: Array.from(seenLogIndexes)
    };
    localStorage.setItem('gameState_' + window.location.href, JSON.stringify(gameState));
}