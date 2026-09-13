'use strict';

function gameStarted() {
    return !!document.querySelector('.virtualScroller-lSkdkGJi');
}

if (gameStarted()) {
    globalThis.startScript();
} else {
    // Wait for the game to start
    const observer = new MutationObserver(function(mutationsList, observer) {
        if (gameStarted()) {
          globalThis.startScript();
          observer.disconnect();
        }
    });

  observer.observe(document.body, { childList: true, subtree: true });
}