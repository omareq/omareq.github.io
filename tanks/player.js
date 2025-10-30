/*******************************************************************************
 *
 *  @file player.js A file with the player class
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 19-October-2025
 *  @link https://omareq.github.io/tanks/
 *  @link https://omareq.github.io/tanks/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2025 Omar Essilfie-Quaye
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *****************************************************************************/
"use strict";

var TankGame = TankGame || {};

/**
 * Class Player that represents the player
 */
TankGame.Player = class {
    /**
     * Constructor for the player object
     */
    constructor(playerName, aiMode=false) {
        this.weapons = [
            {type: "SmallMissile", number: 100},
            {type: "LargeMissile", number: 10}
        ];
        this.weaponIndex = 0;
        this.name = playerName;
        this.score = 0;
        this.money = 0;
        this.weaponSwitchTime = 0;
        this.weaponSwitchDelay = 0.25;
        this.aiMode = aiMode;
        this.ai = undefined; // setup some kind of AI interface
    };

    /**
     * Checks if the current player is AI
     *
     * @returns {Boolean} If the current player is AI
     */
    isAI() {
        return this.aiMode;
    }

    /**
     * Attach the player to the game engine and keep a handle for the
     * game engine.
     *
     * @param {TankGame.GameEngine} gameEngine - The game engine.
     *
     * @throws {Error} param gameEngine should be instance of TankGame.GameEngine
     */
    attachTo(gameEngine) {
        if(!(gameEngine instanceof TankGame.GameEngine)) {
            let err = "gameEngine should be an instance of ";
            err += "TankGame.GameEngine\n";
            throw(err);
        }
        this.gameEngine = gameEngine;
    };

    /**
     * Add a tank handle to the player
     *
     * @param {TankGame.Tank} tank - The tank.
     *
     * @throws {Error} param tank should be instance of TankGame.Tank
     */
    attachTank(tank) {
        if(!(tank instanceof TankGame.Tank)) {
            let err = "tank should be an instance of ";
            err += "TankGame.Tank\n";
            throw(err);
        }
        this.tank = tank;
    }

    /**
     * Remove the tank handle from the player to allow the garbage collector to
     * work
     */
    dettachTank() {
        this.tank = undefined;
    }

    /**
     * Return how many of a particular weapons the player has in their inventory
     *
     * @param {String} weaponType - The type of weapon
     *
     * @returns {Number} The number of the given weapon type the play has
     *
     * @throws {Error} Invalid Weapon type
     */
    getWeaponCount(weaponType) {
        if(!Object.keys(TankGame.ProjectileParamList).includes(weaponType)) {
            let err = "Invalid weapon type: " + weaponType;
            err += " is not in TankGame.ProjectileParamList";
            throw(err);
        }

        for(let i = 0;i<this.weapons.length; i++) {
            if(this.weapons[i].type == weaponType) {
                return this.weapons[i].number;
            }
        }
        return 0;
    }

    /**
     * Adds the weapon to the weapons list if it within the players budget.
     *
     * @param {String} newWeapon - The weapon to add to the player
     *
     * @param {Number} cost - The cost of the weapon
     *
     * @throws {Error} Invalid weapon type
     */
    addWeapon(newWeapon, cost) {
        if(!Object.keys(TankGame.ProjectileParamList).includes(newWeapon)) {
            let err = "Invalid weapon type: " + newWeapon;
            err += " is not in TankGame.ProjectileParamList";
            throw(err);
        }

        if(cost > this.money) {
            return;
        }

        for(let i = 0;i<this.weapons.length; i++) {
            if(this.weapons[i].type == newWeapon) {
                this.weapons[i].number++;
                this.money -= cost;
                return;
            }
        }

        let msg = "Weapon Type is not in weapons list.";
        msg += "  Adding new type:" + newWeapon;
        console.debug(msg);

        this.weapons.push({
            type: newWeapon, number: 1
        });

        this.money -= cost;
    }

    /**
     * Get the next type of weapon
     *
     * @returns {TankGame.ProjectileParam} - The next weapon type
     */
    peekNextWeapon() {
        if(this.weapons[this.weaponIndex].number <= 0) {
// TODO: figure out what to do when out of a weapon type
            return TankGame.ProjectileParamList["SmallMissile"];
        }

        let weaponType = this.weapons[this.weaponIndex].type;
        return TankGame.ProjectileParamList[weaponType];
    }

    /**
     * Decrease current weapon count
     */
    shootNextWeapon() {
        this.weapons[this.weaponIndex].number--;

        if(this.weapons[this.weaponIndex].number <= 0) {
            for(let i = 0; i < this.weapons.length; i++) {
                this.weaponIndex++;
                if(this.weaponIndex >= this.weapons.length) {
                    this.weaponIndex = 0;
                }

                if(this.weapons[this.weaponIndex].number > 0) {
                    return;
                }
            }

            this.weapons[0].number = 100;
            this.weaponIndex = 0;
        }
        return;
    }

    increaseScore(scoreInc) {
        this.score += scoreInc;
        this.money += scoreInc;
    }

    decreaseScore(scoreDec) {
        this.score -= scoreDec;
    }

    /**
     * Move the weapon selection to the next weapon type in the armoury
     * This method contains a debouncing feature to prevent multiple keypresses
     * changing weapons too quickly.
     */
    moveToNextWeaponType() {
// TODO: figure out what to do when out of a weapon type
        const currentTime = this.gameEngine.currentFrameData.timeSinceStartSeconds;
        if(this.weaponSwitchTime != undefined &&
            currentTime - this.weaponSwitchTime < this.weaponSwitchDelay) {
            return;
        }

        for(let i = 0; i < this.weapons.length; i++) {
            this.weaponIndex++;
            if(this.weaponIndex >= this.weapons.length) {
                this.weaponIndex = 0;
            }

            if(this.weapons[this.weaponIndex].number > 0) {
                break;
            }
        }
        this.weaponSwitchTime = currentTime;
        console.debug("Current Weapon: ", this.weapons[this.weaponIndex]);
    }

    /**
     * Move the weapon selection to the previous weapon type in the armoury
     * This method contains a debouncing feature to prevent multiple keypresses
     * changing weapons too quickly.
     */
    moveToPrevWeaponType() {
// TODO: figure out what to do when out of a weapon type
        const currentTime = this.gameEngine.currentFrameData.timeSinceStartSeconds;
        if(this.weaponSwitchTime != undefined &&
            currentTime - this.weaponSwitchTime < this.weaponSwitchDelay) {
            return;
        }

        for(let i = 0; i < this.weapons.length; i++) {
            this.weaponIndex--;
            if(this.weaponIndex < 0) {
                this.weaponIndex = this.weapons.length - 1;
            }

            if(this.weapons[this.weaponIndex].number > 0) {
                break;
            }
        }
        this.weaponSwitchTime = currentTime;
        console.debug("Current Weapon: ", this.weapons[this.weaponIndex]);
    }

    /**
     * Draw the player information in a bar at the top of the screen
     */
    draw() {
        const barHeight = 0.05 * height;
        fill(125);
        rect(0,0, width, barHeight);

        fill(0);
        const r = 0.3 * this.tank.width;
        ellipse(this.tank.pos.x, this.tank.pos.y - 1.5*this.tank.height, r, r);

        const nameWidth = textWidth(this.name);
        const padding = 10;
        textAlign(LEFT, CENTER);
        textSize(0.85 * barHeight);
        text(this.name, padding, 0.5 * barHeight);

        let nextX = nameWidth + 2 * padding;
        let wpnStr = this.weapons[this.weaponIndex].type;
        wpnStr += ":" + this.weapons[this.weaponIndex].number;
        text(wpnStr, nextX, 0.5 * barHeight);

        nextX += textWidth(wpnStr) + 2 * padding;
        const powerStr = "Power:" + this.tank.firingSpeed;
        text(powerStr, nextX, 0.5 * barHeight);

        nextX += textWidth(powerStr) + 2 * padding;
        const angleStr = "Angle:" + this.tank.gunAngle;
        text(angleStr, nextX, 0.5 * barHeight);

    }
};