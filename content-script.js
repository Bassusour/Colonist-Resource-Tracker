'use strict';

function usernameAvaliable() {
    return !!document.getElementById('game-log-text');
  }

if (usernameAvaliable()) {
    globalThis.startScript();
  } else {
    // Wait for the game to start
    const observer = new MutationObserver(function(mutationsList, observer) {
      if (usernameAvaliable()) {
        globalThis.startScript();
        observer.disconnect();
      }
    });
  
    // Start observing changes to the DOM
    observer.observe(document.body, { childList: true, subtree: true });
  }