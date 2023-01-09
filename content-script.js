var players = [];

class Player {
    constructor(name) {
      this.lumber = 0;
      this.brick = 0;
      this.wool = 0;
      this.grain = 0;
      this.ore = 0;
      this.unknown = 0;
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
    var menuDiv = document.createElement( 'div' );
    var img = document.createElement( 'img' );
    img.id = 'imgID';
    img.src = '5.PNG'
    menuDiv.innerHTML = 'Extra stuff <br /> test';
    var btn = document.createElement( 'button' );

    document.body.appendChild( menuDiv );
    menuDiv.appendChild(img);
    btnDiv.appendChild(btn);

    menuDiv.style.zIndex = 100;
    menuDiv.id = 'myDivId';
    menuDiv.style.position = 'absolute';
    menuDiv.style.top = '25%';
    menuDiv.style.left = '12%';
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
    const menu = document.getElementById('myDivId');
    var text = "";
    for (var p of players) {
        text += p.name + ": " + 
                p.lumber + " <img src=\"/dist/images/card_lumber.svg?v149\" width=\"14.25px\" height=\"20px\"> , " + 
                p.brick  + " <img src=\"/dist/images/card_brick.svg?v149\" width=\"14.25px\" height=\"20px\">,  " +
                p.wool + " <img src=\"/dist/images/card_wool.svg?v149\" width=\"14.25px\" height=\"20px\">, " + 
                p.grain + " <img src=\"/dist/images/card_grain.svg?v149\" width=\"14.25px\" height=\"20px\">,  " +
                p.ore + " <img src=\"/dist/images/card_ore.svg?v149\" width=\"14.25px\" height=\"20px\">";
        if(p.unknown > 0){
            text += ", <img src=\"/dist/images/card_rescardback.svg?v149\" width=\"14.25px\" height=\"20px\"> ";
        }
        text += " <br />";
    }
    menu.innerHTML = text;
}

function displayMenu() {
    const menu = document.getElementById('myDivId');
    if(menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

function updateResource(name, resource, amount) {
    console.log(resource);
    console.log(name);
    var player;

    for(let p of players){
        if(p.name === name){
            player = p;
            break;
        }
    }

    switch (resource) {
        case "lumber":
            //check if an unknown card was used 
            if((amount + player.lumber) < 0) {
               player.unknown += (amount + player.lumber);
               player.lumber += amount + (amount + player.lumber)*(-1);
               break;
            }
            player.lumber += amount;
            break;
        case "brick":
            player.brick += amount;
            break;
        case "wool":
            player.wool += amount;
            break;
        case "grain":
            player.grain += amount;
            break;
        case "ore":
            player.ore += amount;
            break;
        case "unknown":
            player.unknown += amount;
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
        var text = String(mutation[0].addedNodes[0].childNodes[1].data);
        var player = text.split(' ')[0];
        var action = text.split(' ')[1];
        
        console.log(text);
        console.log(action);

        createPlayerIfTheyDontExist(player);

        /*const mobilenet = require('@tensorflow-models/mobilenet');
                    const img = document.getElementById('imgID');
                    const model = await mobilenet.load();
                    const predictions = await model.classify(img);
                    console.log(predictions);*/

        if(player === "Bot" || player === "Game"){
            return;
        }

        switch (action) {
            case "got:":
            case "received":
                for(let i = 2; i < mutation[0].addedNodes[0].childNodes.length; i++){
                    // stop if no longer a resource
                    if(mutation[0].addedNodes[0].childNodes[i].nodeType != 1){
                        break;
                    }
                    resource = mutation[0].addedNodes[0].childNodes[i].alt;
                    updateResource(player, resource, 1);
                }
                break;
            case "traded:":
                var player2 = String(mutation[0].addedNodes[0].childNodes[5].data).split(' ')[2]; 
                console.log(player2);
                var flag = false;
                for(let i = 2; i < mutation[0].addedNodes[0].childNodes.length; i++){
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
            case "stole":
                var resource = mutation[0].addedNodes[0].childNodes[2].alt;
                // steal one hidden resource
                if(resource === "card") {
                    updateResource(player, "unknown", 1);
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
                    /*const mobilenet = require('@tensorflow-models/mobilenet');
                    const img = document.getElementById('imgID');
                    const model = await mobilenet.load();
                    const predictions = await model.classify(img);
                    console.log(predictions);*/
                    // there can be unknown resources stolen

                }
                break;
            case "discarded:":
                break;
        }
        
        updateText();

        /*for(let i = 1; i < mutation[0].addedNodes[0].childNodes.length; i++) {
          for(const data of mutation[0].addedNodes[0].childNodes) {
            var currVal = mutation[0].addedNodes[0].childNodes[i];

            if(data.nodeName === "HR"){ // horizontal line (also has nodetype == 3)
                continue;
            } else if(data.nodeType == 3) { // text
                console.log(data.data);
            } else if(data.nodeType == 1) { // img
                console.log(data.alt);
            }
        }*/
        
    }
  };

  waitTillGameIsLoaded();

// linear-gradient(to bottom,#fcfaf5,#e2d7c4);
// "include_globs" :   ["*#*"],
// npm install @tensorflow/tfjs