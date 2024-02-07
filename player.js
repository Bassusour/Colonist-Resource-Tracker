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

  stealFromPlayer(stolenFromPlayer, resource) {
      stolenFromPlayer.updateResource(resource, -1);
      this.updateResource(resource, 1);
  }

  stealUnknownResourceFromPlayer(playerStolenFrom) {
    this.stolenByPlayer += 1;
    playerStolenFrom.stolenFromPlayer += 1;

    if(playerStolenFrom.stolenFromPlayer == playerStolenFrom.sumOfResources()) {
        console.log("player " + playerStolenFrom.username + " has been robbed of all their resources :(")
        playerStolenFrom.stolenFromPlayer = 0;
        playerStolenFrom.stolenByPlayer = 0;
        playerStolenFrom.brick = 0;
        playerStolenFrom.lumber = 0;
        playerStolenFrom.wool = 0;
        playerStolenFrom.grain = 0;
        playerStolenFrom.ore = 0;
      }
    }

    sumOfResources() {
        return this.brick + this.lumber + this.wool + this.grain + this.ore + this.stolenByPlayer;
  }
}
globalThis.Player = Player;