'use strict';

class Player {
  constructor(username) {
      this.lumber = 0;
      this.brick = 0;
      this.wool = 0;
      this.grain = 0;
      this.ore = 0;
      this.stolenFromPlayer = 0;
      this.stolenByPlayer = 0;
      this.username = username;
  }

  updateResource(resource, amount) {
      console.log("updating resource: " + resource + " by " + amount + " for " + this.username)
      this[resource] += amount;
      if (this[resource] < 0) {
        console.log("avoiding negative resource: " + resource + " for " + this.username)
        const diff = Math.abs(this[resource]);
        if(this.stolenByPlayer >= diff) {
            this.stolenByPlayer -= diff;
        } else {
            this.stolenByPlayer = 0;
        }
        this[resource] = 0;
      }
  }

  buildBuilding(building) {
    console.log("building: " + building + " for " + this.username)
    switch (building) {
        case "settlement":
            this.updateResource("lumber", -1);
            this.updateResource("brick", -1);
            this.updateResource("wool", -1);
            this.updateResource("grain", -1);
            break;
        case "city":
            this.updateResource("grain", -2);
            this.updateResource("ore", -3);
            break;
        case "road":
            this.updateResource("lumber", -1);
            this.updateResource("brick", -1);
            break;
        default:
            console.log("building not recognized: " + building);
    }
  }

  buyDevelopmentCard() {
    console.log("buying development card for " + this.username)
    this.updateResource("ore", -1);
    this.updateResource("wool", -1);
    this.updateResource("grain", -1);
  }

  stealFromPlayer(player, resource) {
      player.updateResource(resource, -1);
      this.updateResource(resource, 1);
  }
}
globalThis.Player = Player;