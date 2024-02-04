'use strict';

const checkTargetNode = () => {
    const targetNode = document.getElementById('header_profile_username');
    if (targetNode) {
        console.log("Target node found:", targetNode.textContent.trim());
        globalThis.USERNAME = targetNode.textContent.trim();
        observer.disconnect(); // Stop observing once the target node is found
    }
};

// Create a new MutationObserver instance
const observer = new MutationObserver(checkTargetNode);

// Options for the observer (observe changes to the child list)
const observerOptions = { childList: true };

// Start observing the document body for mutations
observer.observe(document.body, observerOptions);

// Check initially if the target node already exists
checkTargetNode();