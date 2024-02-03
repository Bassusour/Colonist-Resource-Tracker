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
globalThis.setupMenu = setupMenu;

function updateText(players) {
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
    // Can be delayed, so wait until it is loaded
    if(!menu) {
        window.setTimeout(updateText,500);
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