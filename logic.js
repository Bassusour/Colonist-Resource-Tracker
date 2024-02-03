'use strict';

const USERNAME = "Viva5523";

var players = [];

function startScript() {
    console.log("tracking started");
    var logDiv = document.getElementById('game-log-text');
    var config = {childList: true};
    const observer = new MutationObserver(logObserver);
    observer.observe(logDiv,config);

    globalThis.setupMenu();
}
globalThis.startScript = startScript;

function createPlayerIfTheyDontExist(username) {
    for(let player of players){
        if(player.username === username){
            return;
        }
    }
    console.log("creating player: " + username);
    players.push(new globalThis.Player(username))
}

function findPlayerByUsername(username) {
    return players.find(player => player.username === username);
  }

const logObserver = async (mutation, observer) => {
    if (mutation[0].type === 'childList') {
        console.log(mutation);
        const innerText = String(mutation[0].addedNodes[0].innerText) // "Viva5523 received starting resources "
        const innerHTML = String(mutation[0].addedNodes[0].innerHTML) // long ass string

        // Starting messages of the game. Ignore
        if(innerText.includes("Learn how to play in the rulebook") || innerText == ""){
            return;
        }

        var username = innerText.split(' ')[0];
        var action = innerText.substring(innerText.indexOf(" ") + 1);

        if(username == "You" || username == "you"){
            username = USERNAME
        }

        createPlayerIfTheyDontExist(username);
        const player = findPlayerByUsername(username)

        switch (action) {
            // Initial placement of settlements/roads at the start of game. Ignore these
            case "placed a ":
                return;
            case "received starting resources ":
                // Regular expression to match the `alt` attribute values of the <img> elements for resources
                const regex = /<img[^>]*?alt="(?!User|bot)(.*?)"[^>]*?>/g;
                
                const resources = [];
                let match;
                while ((match = regex.exec(innerHTML)) !== null) {
                    console.log(match);
                    resources.push(match[1]);
                }
                
                for (let resource of resources) {
                    console.log(resource);
                    player.updateResource(resource, 1);
                }
                break;
        }
        
        globalThis.updateText();
    }
  };

//   waitTillGameIsLoaded();

