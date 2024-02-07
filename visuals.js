'use strict';

function setupMenu() {
    var helpButtonsSection = document.getElementById('help_buttons_section');
    // Can be delayed, so wait until it is loaded
    if(!helpButtonsSection) {
        window.setTimeout(setupMenu,500);
        return;
    }
    var menuDiv = document.createElement('div');
    menuDiv.innerHTML = 'Nothing has happened yet.';

    var resourceTrackerDiv = document.createElement('div');
    resourceTrackerDiv.id = 'resourceTrackerMenuButton';
    var helpButtonContentsDiv = document.createElement('div');
    helpButtonContentsDiv.className = 'help-button-contents';
    resourceTrackerDiv.appendChild(helpButtonContentsDiv);

    var btn = document.createElement('button');
    resourceTrackerDiv.appendChild(btn);

    resourceTrackerDiv.appendChild(menuDiv);
    helpButtonsSection.appendChild(resourceTrackerDiv);

    btn.type = 'button';
    btn.style.position = 'relative';
    btn.style.width = '51.876px';
    btn.style.height = '51.876px';
    btn.style.left = '9%';
    btn.style.background = "url('/dist/images/icon_settings.svg?v149')";
    btn.style.backgroundSize = 'cover';
    btn.onclick = function () { displayMenu(); };

    menuDiv.style.zIndex = 100;
    menuDiv.id = 'resourceTrackerMenu';
    menuDiv.style.position = 'block';
    menuDiv.style.position = 'absolute';
    menuDiv.style.padding = '10px';
    menuDiv.style.left = '100%';
    menuDiv.style.whiteSpace = 'nowrap'; 
    menuDiv.style.backgroundImage = 'linear-gradient(to bottom,#fcfaf5,#e2d7c4)';
    menuDiv.style.padding = '10px';
    menuDiv.style.color = 'black';
    menuDiv.style.zIndex = 100;
    menuDiv.style.display = 'none';

    
}
globalThis.setupMenu = setupMenu;

function updateText(players) {
    if(!players) return;
    const menu = document.getElementById('resourceTrackerMenu');

    // The menu is not created instantly, so wait until it is loaded
    if(!menu) {
        console.log("Menu element not created yet");
        return; 
    }
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
globalThis.updateText = updateText;

function displayMenu() {
    const menu = document.getElementById('resourceTrackerMenu');
    if(menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}