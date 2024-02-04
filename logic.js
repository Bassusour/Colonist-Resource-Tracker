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
    const usernamesToExclude = ["No", "Friendly", "Happy", "Bot", ""];
    if(usernamesToExclude.includes(username)) return

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

function getResourcesOrBuildingFromInnerHTML(innerHTML) {
    // Regular expression to match the `alt` attribute values of the <img> elements for resources
    const regex = /<img[^>]*?alt="(?!User|bot)(.*?)"[^>]*?>/g;
    const resources = [];
    let match;
    while ((match = regex.exec(innerHTML)) !== null) {
        resources.push(match[1]);
    }
    return resources;
}

const logObserver = async (mutation, observer) => {
    if (mutation[0].type === 'childList') {
        console.log(mutation);
        const innerText = String(mutation[0].addedNodes[0].innerText) // "Viva5523 received starting resources "
        const innerHTML = String(mutation[0].addedNodes[0].innerHTML) // long ass string

        // Black span in log. Ignore
        if(innerText == ""){
            return;
        }

        var username = innerText.split(' ')[0];
        var action = innerText.substring(innerText.indexOf(" ") + 1);

        if(username == "You" || username == "you"){
            username = USERNAME
        }

        createPlayerIfTheyDontExist(username);
        const player = findPlayerByUsername(username)

        if (action === "received starting resources " || 
            action === "got ") {
            const resources = getResourcesOrBuildingFromInnerHTML(innerHTML);
            
            for (let resource of resources) {
                player.updateResource(resource, 1);
            }
        } else if (action.includes("built a")) {
            const building = getResourcesOrBuildingFromInnerHTML(innerHTML)[0];
            player.buildBuilding(building);
        } else if (action.includes("traded  for  with")) {
            const tradingPartner = findPlayerByUsername(innerText.split(" ").slice(-1)[0]);
            const usedResources = getResourcesOrBuildingFromInnerHTML(innerHTML.split("traded")[1].split("for")[0]);
            const receivedResources = getResourcesOrBuildingFromInnerHTML(innerHTML.split("for")[1]);

            console.log("usedResources2: " + getResourcesOrBuildingFromInnerHTML(innerHTML.split("for")[0]))
            console.log("receivedResources2: " + getResourcesOrBuildingFromInnerHTML(innerHTML.split("for")[1]))

            for(let resource of usedResources){
                player.updateResource(resource, -1);
                tradingPartner.updateResource(resource, 1);
            }
            for(let resource of receivedResources){
                player.updateResource(resource, 1);
                tradingPartner.updateResource(resource, -1);
            }
        } else if (action === "bought "){ // Development card
            player.buyDevelopmentCard();
        } else if (action.includes("stole") && action.includes("from")) { 
            const stolenFromPlayerUsername = innerText.split(" ").slice(-1)[0];
            if(username == USERNAME) { //I stole from a player
                const resource = getResourcesOrBuildingFromInnerHTML(innerHTML)[0];
                const playerStolenFrom = findPlayerByUsername(stolenFromPlayerUsername);
                player.stealFromPlayer(playerStolenFrom, resource);
            } else if(stolenFromPlayerUsername == "You" || stolenFromPlayerUsername == "you") { //I was stolen from
                const resource = getResourcesOrBuildingFromInnerHTML(innerHTML)[0];
                const meAsPlayer = findPlayerByUsername(USERNAME);
                player.stealFromPlayer(meAsPlayer, resource);
            } else {
                player.stolenByPlayer += 1;
                const stolenFromPlayer = findPlayerByUsername(stolenFromPlayerUsername);
                stolenFromPlayer.stolenFromPlayer += 1;
            } 
        } else if(action.includes("stole")) { // Monopoly card
            const resource = getResourcesOrBuildingFromInnerHTML(innerHTML)[0];
            const amount = innerText.split(" ")[2];
            let calculatedAmount = 0;
            for(let p of players){
                if(p.username != username){
                    const amountOfResourceForPlayer = p[resource];
                    calculatedAmount += amountOfResourceForPlayer;
                    player.updateResource(resource, amountOfResourceForPlayer);
                    p.updateResource(resource, -amountOfResourceForPlayer);
                }
            }
            if(calculatedAmount != amount){
                console.log("Error: calculated amount: " + calculatedAmount + " does not match amount: " + amount);
                const diff = amount - calculatedAmount;
                player.updateResource(resource, diff);
                // TODO: Image analysis
            }
        }
        
        else if (action === "discarded ") {
            const resources = getResourcesOrBuildingFromInnerHTML(innerHTML);
            console.log("resources discarded: ", resources);
            for (let resource of resources) {
                player.updateResource(resource, -1);
            }
        } else if(action.includes("gave bank")) {
            const usedResources = getResourcesOrBuildingFromInnerHTML(innerHTML.split("and took")[0]);
            const receivedResources = getResourcesOrBuildingFromInnerHTML(innerHTML.split("and took")[1]);
            for(let resource of usedResources){
                player.updateResource(resource, -1);
            }
            for(let resource of receivedResources){
                player.updateResource(resource, 1);
            }
        } else if(action.includes("won the game!")) {
            console.log("Game over");
            observer.disconnect();
            return;
        }
        
        globalThis.updateText(players);
    }
  };

// TODO list
// - Add road building card support
// - Remember state of game if you leave and come back
// - Get username of user