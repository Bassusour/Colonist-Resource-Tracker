'use strict';

function gameLogTextExists() {
    return !!document.getElementById('game-log-text');
  }

if (gameLogTextExists()) {
    globalThis.startScript();
  } else {
    // Wait for the game to start
    const observer = new MutationObserver(function(mutationsList, observer) {
      if (gameLogTextExists()) {
        globalThis.startScript();
        observer.disconnect();
      }
    });
  
    // Start observing changes to the DOM
    observer.observe(document.body, { childList: true, subtree: true });
  }