'use strict';

const getUsername = () => {
    const usernameNode = document.getElementById('header_profile_username');
    if (usernameNode) {
        console.log("Username found:", usernameNode.textContent.trim());
        globalThis.USERNAME = usernameNode.textContent.trim();
        observer.disconnect(); 
    }
};

const observer = new MutationObserver(getUsername);
const observerOptions = { childList: true };
observer.observe(document.body, observerOptions);

getUsername();