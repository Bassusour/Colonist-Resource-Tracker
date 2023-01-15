const USERNAME = "AAAAAA#8817";

var players = [];
class Player {
    constructor(name) {
      this.lumber = 0;
      this.brick = 0;
      this.wool = 0;
      this.grain = 0;
      this.ore = 0;
      this.stolenFromPlayer = 0;    // <= 0
      this.stolenByPlayer = 0;      // >= 0
      this.name = name;
    }
}

function waitTillGameIsLoaded() {
    var logDiv = document.getElementById('game-log-text');
    if(!logDiv) {
        window.setTimeout(waitTillGameIsLoaded,500);
        return;
    }
    var config = {childList: true};
    const observer = new MutationObserver(callback);
    observer.observe(logDiv,config);

    var btnDiv = document.getElementById('help_buttons_section');
    var menuDiv = document.createElement('div');
    menuDiv.innerHTML = 'Nothing has happened yet. ';
    var btn = document.createElement('button');

    document.body.appendChild( menuDiv );
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
    btn.style.background = "url('/dist/images/icon_settings.svg?v149')"
    btn.style.backgroundSize = 'cover';
    btn.onclick = function(){displayMenu();};
}

function updateText() {
    const menu = document.getElementById('resourceTrackerMenu');
    var text = "";
    for (var p of players) {
        text += p.name + ": " + 
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

function updateResource(player, resource, amount) {
    console.log(resource);
    console.log(player);
    var player;

    for(let p of players){
        if(p.name === player){
            player = p;
            break;
        }
    }

    switch (resource) {
        case "lumber":
            // If you use more resources than available
            if(amount + player.lumber < 0 && player.stolenFromPlayer == 0) {
                // counter decreases with the difference amount
                player.stolenByPlayer += amount + player.lumber;
                player.lumber = 0;
                break;
            }
            player.lumber += amount;
            break;
        case "brick":
            if(amount + player.brick < 0 && player.stolenFromPlayer == 0) {
                player.stolenByPlayer += amount + player.brick;
                player.brick = 0;
                break;
            }
            player.brick += amount;
            break;
        case "wool":
            if(amount + player.wool < 0 && player.stolenFromPlayer == 0) {
                player.stolenByPlayer += amount + player.wool;
                player.wool = 0;
                break;
            }
            player.wool += amount;
            break;
        case "grain":
            if(amount + player.grain < 0 && player.stolenFromPlayer == 0) {
                player.stolenByPlayer += amount + player.grain;
                player.grain = 0;
                break;
            }
            player.grain += amount;
            break;
        case "ore":
            if(amount + player.ore < 0 && player.stolenFromPlayer == 0) {
                player.stolenByPlayer += amount + player.ore;
                player.ore = 0;
                break;
            }
            player.ore += amount;
            break;
        case "stolenFromPlayer":
            player.stolenFromPlayer += amount;
            break;
        case "stolenByPlayer":
            player.stolenByPlayer += amount;
            break;
    }
}

function createPlayerIfTheyDontExist(name) {
    for(let p of players){
        if(p.name === name){
            return;
        }
    }
    players.push(new Player(name))
}

const callback = async (mutation, observer) => {
    if (mutation[0].type === 'childList' && mutation[0].addedNodes[0].childNodes[0].nodeName != "HR") {

        //Ignore the initial messages
        /*if(mutation[0].target.childNodes.length < 5){
            return;
        }*/

        console.log(mutation);

        // for(const data of mutation[0].addedNodes[0].childNodes) {
        // Simple text log that is irrelevant. 
        if(mutation[0].addedNodes[0].childNodes.length == 1){
            return;
        }
        var text = String(mutation[0].addedNodes[0].childNodes[1].data);
        var player = text.split(' ')[0];
        var action = text.split(' ')[1];
        
        console.log(text);
        console.log(action);

        if(player == "You" || player == "you"){
            player = USERNAME
        }

        if(player === "Bot" || player === "Game" || player == "undefined"){
            return;
        }

        createPlayerIfTheyDontExist(player);

        switch (action) {
            case "got:":
            case "received":
                for(let i = 2; i < mutation[0].addedNodes[0].childNodes.length; i++){
                    // stop if no longer a resource NECESSARY?
                    /*if(mutation[0].addedNodes[0].childNodes[i].nodeType != 1){
                        break;
                    }*/
                    resource = mutation[0].addedNodes[0].childNodes[i].alt;
                    updateResource(player, resource, 1);
                }
                break;
            case "traded:":
                var lengthOfChildnodes = mutation[0].addedNodes[0].childNodes.length;
                var player2 = String(mutation[0].addedNodes[0].childNodes[lengthOfChildnodes - 1].data).split(':')[1].slice(1);
                console.log(player2);
                var flag = false;
                for(let i = 2; i < mutation[0].addedNodes[0].childNodes.length; i++){
                    // flag to differentiate between who receives the resources
                    if(mutation[0].addedNodes[0].childNodes[i].nodeType != 1){
                        flag = true;
                        continue;
                    }
                    resource = mutation[0].addedNodes[0].childNodes[i].alt;
                    if(!flag){
                        updateResource(player, resource, -1);
                        updateResource(player2, resource, 1);
                    } else {
                        updateResource(player, resource, 1);
                        updateResource(player2, resource, -1);
                    }
                }
                break;
            case "built":
                var building = mutation[0].addedNodes[0].childNodes[2].alt;
                switch (building) {
                    case "road":
                        updateResource(player, "lumber", -1);
                        updateResource(player, "brick", -1);
                        break;
                    case "settlement":
                        updateResource(player, "lumber", -1);
                        updateResource(player, "brick", -1);
                        updateResource(player, "wool", -1);
                        updateResource(player, "grain", -1);
                        break;
                    case "city":
                        updateResource(player, "grain", -2);
                        updateResource(player, "ore", -3);
                        break;
                }
                break;
            case "bought":
                updateResource(player, "wool", -1);
                updateResource(player, "grain", -1);
                updateResource(player, "ore", -1);
                break;
            case "stole:":
            case "stole":
                var resource = mutation[0].addedNodes[0].childNodes[2].alt;
                console.log(resource);
                
                // steal one hidden resource
                if(resource === "card") {
                    var fromPlayer = String(mutation[0].addedNodes[0].childNodes[3].data).split(':')[1].slice(1);
                    updateResource(player, "stolenByPlayer", 1);
                    updateResource(fromPlayer, "stolenFromPlayer", -1);
                    console.log(fromPlayer);
                } else if(text.includes('Monopoly')) {
                    const amount = String(mutation[0].addedNodes[0].childNodes[1].data).split(':')[0].slice(-1);
                    updateResource(player, resource, amount);

                    for(let p of players){
                        switch (resource) {
                            case "lumber":
                                p.lumber = 0;
                                break;
                            case "brick":
                                p.brick = 0;
                                break;
                            case "wool":
                                p.wool = 0;
                                break;
                            case "grain":
                                p.grain = 0;
                                break;
                            case "ore":
                                p.ore = 0;
                                break;
                        }
                    }
                } else {
                    // other players (" from: Culley")
                    // ourself (" from you")
                    var fromPlayer = String(mutation[0].addedNodes[0].childNodes[3].data).split(' ')[2];

                    if(fromPlayer == "You" || fromPlayer == "you"){
                        fromPlayer = USERNAME;
                    }
                    updateResource(player, resource, 1);
                    updateResource(fromPlayer, resource, -1);
                }
                break;
            case "discarded:":
                for(let i = 2; i < mutation[0].addedNodes[0].childNodes.length; i++){
                    resource = mutation[0].addedNodes[0].childNodes[i].alt;
                    updateResource(player, resource, -1);
                }
                break;
            case "gave":
                var iWhenStopped;
                for(let i = 2; i < mutation[0].addedNodes[0].childNodes.length; i++){
                    // Seperate 'gave' and 'took'
                    if(mutation[0].addedNodes[0].childNodes[i].nodeType != 1){
                        iWhenStopped = i;
                        break;
                    }
                    resource = mutation[0].addedNodes[0].childNodes[i].alt;
                    updateResource(player, resource, -1);
                }
                for(let i = iWhenStopped+1; i < mutation[0].addedNodes[0].childNodes.length; i++){
                    resource = mutation[0].addedNodes[0].childNodes[i].alt;
                    updateResource(player, resource, 1);
                }
                break;
            case "took":
                // year of plenty
                var resource1 = mutation[0].addedNodes[0].childNodes[2].alt;
                var resource2 = mutation[0].addedNodes[0].childNodes[4].alt;
                updateResource(player, resource1, 1);
                updateResource(player, resource2, 1);
        }
        
        updateText();
    }
  };

  waitTillGameIsLoaded();