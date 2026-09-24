'use strict';

class Player {
    constructor(username) {
        this.Lumber = 0;
        this.Brick = 0;
        this.Wool = 0;
        this.Grain = 0;
        this.Ore = 0;
        this.UnknownExtraResource = 0;
        this.UnknownLostResource = 0; // Negative value indicates amount
        this.Username = username;
    }

    capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    updateResource(resource, amount) {
        amount = parseInt(amount)
        resource = this.capitalizeFirstLetter(resource)
        console.log("updating resource: " + resource + " by " + amount + " for " + this.Username)
        const oldAmount = this[resource]
        var newAmount = this[resource] + amount

        if (newAmount < 0 && this.UnknownExtraResource + newAmount >= 0) {
            console.log("Compensating negative value with UnknownExtraResource");
            this.UnknownExtraResource += newAmount;
            newAmount = 0;
        } else if (newAmount < 0) {
            console.error("UNEXPECTED NEGATIVE RESOURCE", {
                player: this.Username,
                resource,
                amount,
                oldAmount,
                newAmount,
                UnknownExtraResource: this.UnknownExtraResource
            });
        }

        this[resource] = newAmount;

        if (this.getNumberOfCards() == 0 && this.UnknownLostResource < 0) {
            console.log("Resetting resources due to UnknownLostResource representing all of them");
            this.Lumber = 0;
            this.Brick = 0;
            this.Wool = 0;
            this.Grain = 0;
            this.Ore = 0;
            this.UnknownExtraResource = 0;
            this.UnknownLostResource = 0;
        }
    }

    buildBuilding(building) {
        console.log("building: " + building + " for " + this.Username)
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
        console.log("buying development card for " + this.Username)
        this.updateResource("Ore", -1);
        this.updateResource("Wool", -1);
        this.updateResource("Grain", -1);
    }

    stealUnknownResourceFromPlayer(playerStolenFrom) {
        this.UnknownExtraResource += 1;
        playerStolenFrom.UnknownLostResource -= 1;
    }

    getNumberOfCards() {
        return this.Lumber + this.Brick + this.Wool + this.Grain + this.Ore + this.UnknownExtraResource + this.UnknownLostResource;
    }

    updateUnknownLostResourceThroughMonopoly(resource) {
        resource = this.capitalizeFirstLetter(resource);
        this.UnknownLostResource += this[resource];
        this[resource] = 0;
    }
}
globalThis.Player = Player;