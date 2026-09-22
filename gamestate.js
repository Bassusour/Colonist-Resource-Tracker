'use strict';

function saveGameState(players, seenLogIndexes) {
    const gameState = {
        url: window.location.href,
        players: players,
        seenLogIndexes: Array.from(seenLogIndexes)
    };
    localStorage.setItem('gameState_' + window.location.href, JSON.stringify(gameState));
}

function loadGameState() {
    const gameStateJSON = localStorage.getItem('gameState_' + window.location.href);
    if (gameStateJSON) {
        console.log("Game state found")
        const gameState = JSON.parse(gameStateJSON);
        if(gameState.players) {
            players = gameState.players.map(savedPlayer => {
                const player = new Player(savedPlayer.Username);
                Object.assign(player, savedPlayer);
                return player;
            });
            console.log("players: " + JSON.stringify(players))
            console.log('Game state players loaded');
        }

        if(gameState.seenLogIndexes) {
            seenLogIndexes = new Set(gameState.seenLogIndexes);
            console.log("seenLogIndexes:", seenLogIndexes)
            console.log('Game state log indexes loaded');
        }
        
        globalThis.updateText(players);
    } else {
        console.log("No gamestate found");
    }
}