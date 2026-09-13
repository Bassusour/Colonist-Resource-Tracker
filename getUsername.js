'use strict';

const getUsername = () => {
    const usernameNode = document.getElementsByClassName('web-header-username')[0];
    if (usernameNode) {
        globalThis.USERNAME = usernameNode.innerHTML;
        observer.disconnect(); 
    }
};

const observer = new MutationObserver(getUsername);
const observerOptions = { childList: true };
observer.observe(document.body, observerOptions);

getUsername();