const USERNAME = "Viva5523";

var players = [];
class Player {
    constructor(username) {
        this.lumber = 0;
        this.brick = 0;
        this.wool = 0;
        this.grain = 0;
        this.ore = 0;
        this.stolenFromPlayer = 0;    // <= 0
        this.stolenByPlayer = 0;      // >= 0
        this.username = username;
    }

    updateResource(resource, amount) {
        console.log("updating resource: " + resource + " by " + amount + " for " + this.username)
        this[resource] += amount;
        if (this[resource] < 0) {
            // TODO
        }
      }
}

function gameLogTextExists() {
    return !!document.getElementById('game-log-text');
  }

if (gameLogTextExists()) {
    startScript();
  } else {
    // Wait for the game to start
    const observer = new MutationObserver(function(mutationsList, observer) {
      if (gameLogTextExists()) {
        startScript();
        observer.disconnect();
      }
    });
  
    // Start observing changes to the DOM
    observer.observe(document.body, { childList: true, subtree: true });
  }

function startScript() {
    console.log("tracking started");
    var logDiv = document.getElementById('game-log-text');
    var config = {childList: true};
    const observer = new MutationObserver(logObserver);
    observer.observe(logDiv,config);

    setupMenu();
}

function setupMenu() {
    var btnDiv = document.getElementById('help_buttons_section');
    // Can be delayed, so wait until it is loaded
    if(!btnDiv) {
        window.setTimeout(setupMenu,500);
        return;
    }
    var menuDiv = document.createElement('div');
    menuDiv.innerHTML = 'Nothing has happened yet. ';
    var btn = document.createElement('button');

    document.body.appendChild(menuDiv);
    btnDiv.appendChild(btn);

    menuDiv.style.zIndex = 100;
    menuDiv.id = 'resourceTrackerMenu';
    menuDiv.style.position = 'absolute';
    menuDiv.style.top = '25%';
    menuDiv.style.left = '10%';
    menuDiv.style.backgroundImage = 'linear-gradient(to bottom,#fcfaf5,#e2d7c4)';
    menuDiv.style.padding = '10px';
    menuDiv.style.color = 'black';
    menuDiv.style.zIndex = 100;
    menuDiv.style.display = 'none';

    btn.type = 'button';
    btn.style.position = 'absolute';
    btn.style.width = '51.876px';
    btn.style.height = '51.876px';
    btn.style.left = '9%';
    btn.style.background = "url('/dist/images/icon_settings.svg?v149')";
    btn.style.backgroundSize = 'cover';
    btn.onclick = function () { displayMenu(); };
}

function updateText() {
    const menu = document.getElementById('resourceTrackerMenu');
    var text = "";
    for (var p of players) {
        text += p.username + ": " + 
                p.lumber + " <img src=\"/dist/images/card_lumber.svg?v149\" width=\"14.25px\" height=\"20px\"> , " + 
                p.brick  + " <img src=\"/dist/images/card_brick.svg?v149\" width=\"14.25px\" height=\"20px\">,  " +
                p.wool + " <img src=\"/dist/images/card_wool.svg?v149\" width=\"14.25px\" height=\"20px\">, " + 
                p.grain + " <img src=\"/dist/images/card_grain.svg?v149\" width=\"14.25px\" height=\"20px\">,  " +
                p.ore + " <img src=\"/dist/images/card_ore.svg?v149\" width=\"14.25px\" height=\"20px\">";
        if(p.stolenFromPlayer != 0){
            text += ", stolenFrom: " + p.stolenFromPlayer + " <img src=\"/dist/images/card_rescardback.svg?v149\" width=\"14.25px\" height=\"20px\"> ";
        }
        if(p.stolenByPlayer != 0){
            text += ", stolenBy: " + p.stolenByPlayer + " <img src=\"/dist/images/card_rescardback.svg?v149\" width=\"14.25px\" height=\"20px\"> ";
        }
        text += " <br />";
    }
    menu.innerHTML = text;
}

function displayMenu() {
    const menu = document.getElementById('resourceTrackerMenu');
    if(menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

function createPlayerIfTheyDontExist(username) {
    for(let player of players){
        if(player.username === username){
            return;
        }
    }
    console.log("creating player: " + username);
    players.push(new Player(username))
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
        
        updateText();
    }
  };

//   waitTillGameIsLoaded();

