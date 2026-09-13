'use strict';

class Player {
  constructor(username) {
      this.Lumber = 0;
      this.Brick = 0;
      this.Wool = 0;
      this.Grain = 0;
      this.Ore = 0;
      this.unknownResource = 0;
      this.username = username;
  }

  updateResource(resource, amount) {
      console.log("updating resource: " + resource + " by " + amount + " for " + this.username)
      if (this[resource] < 0) {
          console.log("Negative resource: " + resource + " for " + this.username)
      }
      
      this[resource] += amount;
  }

  buildBuilding(building) {
    console.log("building: " + building + " for " + this.username)
    switch (building) {
        case "Settlement":
            this.updateResource("Lumber", -1);
            this.updateResource("Brick", -1);
            this.updateResource("Wool", -1);
            this.updateResource("Grain", -1);
            break;
        case "City":
            this.updateResource("Grain", -2);
            this.updateResource("Ore", -3);
            break;
        case "Road":
            this.updateResource("Lumber", -1);
            this.updateResource("Brick", -1);
            break;
        default:
            console.log("building not recognized: " + building);
    }
  }

  buyDevelopmentCard() {
    console.log("buying development card for " + this.username)
    this.updateResource("Ore", -1);
    this.updateResource("Wool", -1);
    this.updateResource("Grain", -1);
  }

  /*stealFromPlayer(stolenFromPlayer, resource) {
      stolenFromPlayer.updateResource(resource, -1);
      this.updateResource(resource, 1);
  }

  stealUnknownResourceFromPlayer(playerStolenFrom) {
    this.stolenByPlayer += 1;
    playerStolenFrom.stolenFromPlayer += 1;

    playerStolenFrom.resetIfRobbedOfAllResources();
    }

  resetIfRobbedOfAllResources() {
    if (this.stolenFromPlayer == this.sumOfResources()) {
      console.log("player " + this.username + " has been robbed of all their resources :(");
      this.stolenFromPlayer = 0;
      this.stolenByPlayer = 0;
      this.brick = 0;
      this.lumber = 0;
      this.wool = 0;
      this.grain = 0;
      this.ore = 0;
    }
  }

    sumOfResources() {
        return this.brick + this.lumber + this.wool + this.grain + this.ore + this.stolenByPlayer;
  }*/
}
globalThis.Player = Player;