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
globalThis.Player = Player;