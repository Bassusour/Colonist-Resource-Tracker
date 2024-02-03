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

  buildBuilding(building) {
      switch (building) {
          case "settlement":
              this.lumber -= 1;
              this.brick -= 1;
              this.wool -= 1;
              this.grain -= 1;
              break;
          case "city":
              this.grain -= 2;
              this.ore -= 3;
              break;
          case "road":
              this.lumber -= 1;
              this.brick -= 1;
              break;
          default:
              console.log("building not recognized: " + building);
      }

      if (this.lumber < 0 || this.brick < 0 || this.wool < 0 || this.grain < 0 || this.ore < 0) {
          // TODO
      }
  }

  buyDevelopmentCard() {
      this.lumber -= 1;
      this.wool -= 1;
      this.grain -= 1;
  }

  stealFromPlayer(player, resource) {
      player.updateResource(resource, -1);
      this.updateResource(resource, 1);
  }
}
globalThis.Player = Player;