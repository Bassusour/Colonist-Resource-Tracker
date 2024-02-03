class Player {
    constructor(name) {
      this.lumber = 0;
      this.brick = 0;
      this.wool = 0;
      this.grain = 0;
      this.ore = 0;
      this.stolenFromPlayer = 0;    // can be <= 0
      this.stolenByPlayer = 0;      // can be >= 0
      this.name = name;
    }
}