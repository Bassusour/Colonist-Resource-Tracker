'use strict';

var players = [];
var seenLogIndexes = new Set();
var lastUsedDevelopmentCard;

function startScript() {
    console.log("tracking started");
    loadGameState();
    var logDiv = document.getElementsByClassName("virtualScroller-lSkdkGJi")[0];
    var config = {childList: true};
    const observer = new MutationObserver(logObserver);
    observer.observe(logDiv,config);

    globalThis.setupMenu();
}
globalThis.startScript = startScript;

function createPlayerIfTheyDontExist(username) {
    const usernamesToExclude = ["No", "Friendly", "Happy", "Bot", "", "Game"];
    if(usernamesToExclude.includes(username)) return

    for(let player of players){
        if(player.Username === username){
            return;
        }
    }
    console.log("creating player: " + username);
    players.push(new globalThis.Player(username))
}

function findPlayerByUsername(username) {
    return players.find(player => player.Username === username);
}

function getResourcesFromHTML(innerHTML) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(innerHTML, "text/html");
    const imgs = doc.querySelectorAll('img.lobbyChatTextIcon');

    const resources = Array.from(imgs).map(img => img.alt);
    return resources;
}

function useMonopoly(player, resource, amount) {
    player.updateResource(resource, amount)
    const playerDivs = document.querySelectorAll(".informationWrapper-qC5Wi3J7");

    for (const playerDiv of playerDivs) {
        var username = playerDiv.querySelector(".username-M7Jbo6j0")?.innerText;
        if(!username) {
            // Own username appears differently
            username = globalThis.USERNAME;
        }
        const countText = playerDiv.querySelector(".count-Dh6MtdiN")?.innerText;
        const cardCount = Number(countText);

        // Ignore player using the monopoly card
        if(username == player.Username) {
            continue;
        }
        const stolenFromPlayer = findPlayerByUsername(username);
        const diff = stolenFromPlayer.getNumberOfCards() - cardCount;

        console.log(username + " has " + countText + " cards with a diff of " + diff)

        stolenFromPlayer.updateResource(resource, -diff);
        stolenFromPlayer.updateUnknownLostResourceThroughMonopoly(resource);
    }
}

const logObserver = (mutations, observer) => {
    // console.log(mutations)
    for (const mutation of mutations) {
        if (mutation.type !== "childList") continue;

        // Always only a single added node
        const node = mutation.addedNodes[0]
        if(!node) {
            continue;
        }
        const index = node.dataset.index;
        if (seenLogIndexes.has(index) || node.innerText == undefined || node.innerText == "" || !node.innerText) {
            continue;
        }

        seenLogIndexes.add(index);

        var username = node.innerText.split(' ')[0];
        const action = node.innerText.split(' ')[1];

        if(username == "You" || username == "you"){
            // May not be initialized properly
            username = globalThis.USERNAME
        }
        createPlayerIfTheyDontExist(username);

        const ignoreActions = ['has', 'wants', 'rolled', 'moved', 'placed', 'Paused', 'Resumed']
        if(ignoreActions.includes(action)) {
            continue;
        }

        console.log("New log:", index, node.innerText);

        const player = findPlayerByUsername(username)
        if(player == undefined) {
            console.log(username + " is undefined for some reason!")
        }

        switch(action) {
            case "received":
            case "got":
            {
                if (["Longest Road", "Largest Army"].some(str => node.innerText.includes(str))) {
                    console.log("Ignoring action")
                    continue
                }
                const resources = getResourcesFromHTML(node.innerHTML)
                for (let resource of resources) {
                    player.updateResource(resource, 1);
                }
                break;
            }
            case "gave":
            {
                if(node.innerText.split(' ')[2] == "bank") {
                    const tradedResources = getResourcesFromHTML(node.innerHTML.split("gave")[1].split("took")[0]);
                    const receivedResources = getResourcesFromHTML(node.innerHTML.split("took")[1]);
                    
                    for (let resource of tradedResources) {
                        player.updateResource(resource, -1);
                    }  

                    for (let resource of receivedResources) {
                        player.updateResource(resource, 1);
                    } 
                    break;
                }

                const tradingPartner = findPlayerByUsername(node.innerText.split(" ").slice(-1)[0]);
                const tradedResources = getResourcesFromHTML(node.innerHTML.split("gave")[1].split("got")[0]);
                const receivedResources = getResourcesFromHTML(node.innerHTML.split("got")[1]);

                for (let resource of tradedResources) {
                    player.updateResource(resource, -1);
                    tradingPartner.updateResource(resource, 1)
                }

                for (let resource of receivedResources) {
                    player.updateResource(resource, 1);
                    tradingPartner.updateResource(resource, -1)
                }
                break;
            }
            case "built":
                const building = node.innerText.split(" ")[3]
                player.buildBuilding(building);
                break;
            case "stole":
            {
                if(lastUsedDevelopmentCard == "Monopoly") {
                    const resource = getResourcesFromHTML(node.innerHTML);
                    const amount = node.innerText.split(" ")[2];

                    useMonopoly(player, resource, amount);
                    break;
                }

                const resource = getResourcesFromHTML(node.innerHTML)
                var victimUsername = node.innerText.split(" ").slice(-1)[0]
                if(victimUsername.toUpperCase() == "you".toUpperCase()) {
                    victimUsername = globalThis.USERNAME;
                }
                const victimPlayer = findPlayerByUsername(victimUsername)

                if(resource == "Resource Card"){
                    player.stealUnknownResourceFromPlayer(victimPlayer)
                } else {
                    player.updateResource(resource, 1);
                    victimPlayer.updateResource(resource, -1);
                }
                break;
            }
            case "discarded":
            {
                const resources = getResourcesFromHTML(node.innerHTML)
                for (let resource of resources) {
                    player.updateResource(resource, -1);
                }
                break;
            }
            case "bought":
                player.buyDevelopmentCard()
                break;
            case "used":
                const cardType = node.innerText.split(" ")[2]
                
                if(cardType == "Monopoly") {
                    lastUsedDevelopmentCard = "Monopoly"
                } else if(cardType == "Knight") {
                    lastUsedDevelopmentCard = "Knight"
                } else if(cardType == "Year")
                    lastUsedDevelopmentCard = "Year of Plenty"
                break;
            case "took": // Year of plenty
                const resources = getResourcesFromHTML(node.innerHTML)
                for (let resource of resources) {
                    player.updateResource(resource, 1);
                }
                break;
            case "won":
                observer.disconnect();
                localStorage.removeItem('gameState_' + window.location.href);
                return;
            default:
                console.log("Unknown action: " + action);
        }
        globalThis.updateText(players);
        saveGameState(players, seenLogIndexes)
    }
};