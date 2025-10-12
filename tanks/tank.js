/*******************************************************************************
 *
 *  @file tank.js A file with the dynamics of projectiles
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 04-April-2025
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
 * Class Tank that represents the tank object
 */
TankGame.Tank = class {
    /**
     * Constructor for the tank object.  The height is determined by the golden
     * ratio with respect to the width.
     *
     * @param {number} width - the width of the tank
     * @param {p5.Vector} pos - the position of the tank
     * @param {Array<3, Number>} colorVal - the color of the tank
     */
    constructor(width, pos, colorVal=[0,155,10]) {
        this.width = width;
        const goldenRatio = 1.6;
        this.height = this.width / goldenRatio;
        this.pos = pos.copy();
        this.trackRadius = 0.1 * this.width;
        this.color=color(colorVal);
        this.gunAngle = 45;
        this.vel = createVector();
        this.isExploding = false;
        this.finishedExploding = false;
        this.explosionRadius = 0;
        this.maxExplosionRadius = this.width;
        this.moveDistance = this.width / 30;
        this.health = 100;
        this.firingSpeed = 100;
    };

    /**
     * Attach the tank to the game engine and keep a handle for the
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
     * Set the gun angle.  If outside of the range 0 and 180 the gun remains at
     * the same angle.
     *
     * @param {number} newAngle - Angle in degrees between 0 and 180
     */
    setGunAngle(newAngle) {
        if(newAngle < 0 || newAngle > 180) {
            console.warn("Can't make gun angle greater than 180 or less than 0");
            return;
        }

        this.gunAngle = newAngle;
    };

    /**
     * Get the current angle
     *
     * @returns {number} - The current gun angle in degrees between 0 and 180
     */
    getGunAngle() {
        return this.gunAngle;
    };

    /**
     * Increase the gun angle by 1 degree.  Stops at 180
     */
    increaseGunAngle() {
        if(this.gunAngle >= 180) {
            this.gunAngle = 180;
            return;
        }
        this.gunAngle++;
    };

    /**
     * Decrease the gun angle by 1 degree.  Stops at 0.
     */
    decreaseGunAngle() {
        if(this.gunAngle <= 0) {
            this.gunAngle = 0;
            return;
        }
        this.gunAngle--;
    };

    /**
     * Move the tank to the left
     */
    moveLeft() {
        this.pos.x -= this.moveDistance;
    };

    /**
     * Move the tank to the right
     */
    moveRight() {
        this.pos.x += this.moveDistance;
    };

    /**
     * Check if the tank is off screen.  Explodes the tank if it is below the
     * bottom of the screen.
     */
    checkOffScreen() {
        if(this.pos.x < 0) {
            this.pos.x = 0;
            return;
        }

        if(this.pos.x >= this.gameEngine.screenWidth) {
            this.pos.x = this.gameEngine.screenWidth - 1;
            return;
        }

        if(this.pos.y > this.gameEngine.screenHeight) {
            this.health = 0;
            this.explode();
            return;
        }
    };

    /**
     * Explode the tank
     */
    explode() {
        this.isExploding = true;
    };

    /**
     * Increase the firing speed of the gun.  Only goes as high as the health
     * of the tank.
     */
    increaseFiringSpeed() {
        if(this.firingSpeed > this.health) {
            this.firingSpeed = this.health;
            return;
        }

        if(this.firingSpeed == 100) {
            return;
        }

        this.firingSpeed++;
        // console.debug("New Firing Speed: ", this.firingSpeed);
    };

    /**
     * Decrease the firing speed of the gun.  Does not go below zero.
     */
    decreaseFiringSpeed() {
        if(this.firingSpeed > this.health) {
            this.firingSpeed = this.health;
            return;
        }

        if(this.firingSpeed == 0) {
            return;
        }

        this.firingSpeed--;
        // console.debug("New Firing Speed: ", this.firingSpeed);
    };

    /**
     * Shoots the chosen projectile from the tanks gun
     * Contains a debouncing feature to prevent held down keys from shooting
     * multiple projectiles
     *
     * @returns {Boolean} If the projectile was successfully shot
     *
     */
    shootProjectile(projectileParam) {
        const currentTime = this.gameEngine.currentFrameData.timeSinceStartSeconds;
        if(this.lastFiredTime != undefined &&
            currentTime - this.lastFiredTime < 0.75) {
            return false;
        }

        if(this.lastFiredTime == undefined) {
            this.lastFiredTime = currentTime;
        }
// TODO: Add some kind of recoil animation
        const projectile = new TankGame.Projectile(
            this.pos.copy().sub(createVector(0, 0.75 * this.height)),
            this.firingSpeed,
            this.gunAngle,
            projectileParam);
        this.gameEngine.addProjectile(projectile);

        this.lastFiredTime = currentTime;
        return true;
    };

    /**
     * Adds damage to the tank.  Does not allow for damage outside of the range
     * 0 to 100.
     *
     * @param {number} damage - the damage to apply to the tank.
     */
    addDamage(damage) {
        if(damage < 0) {
            console.warn("Damage is less than zero: " + damage);
            return;
        }

        if(damage > 100) {
            console.warn("Damage is greater than one hundred: " + damage);
            return;
        }

        this.health -= floor(damage);
        if(this.health < 0) {
            this.explode();
        }
        console.log("Tank Health: ", this.health);
    };

    /**
     * Checks fi the tank is dead.  Only returns true after the tanks is
     * finished exploding.
     *
     * @returns {Boolean} - if the tank is dead
     */
    isDead() {
        return this.finishedExploding;
    };

    /**
     * Update the tanks position according to the game physics
     *
     * @param {number} dt - The time between the current frame and the last one
     */
    update(dt) {
        this.vel = this.vel.copy().add(this.gameEngine.gravity.copy().div(dt));
        this.pos = this.pos.copy().add(this.vel.copy());

        this.checkOffScreen();
        if(this.health < this.firingSpeed) {
            this.firingSpeed = this.health;
        }
    };

    /**
     * Draw the tracks at the bottom of the tank
     */
    drawTracks() {
        fill(0);
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y - 0.45 * this.height,
            0.9 * this.width, 0.5 * this.height,
            this.trackRadius
        );
    };

    /**
     * Draw the gun on the tank at the correct angle
     */
    drawGun() {
        push();
        fill(0);
        translate(this.pos.x, this.pos.y);
        translate(0, -0.8 * this.height);
        rotate(radians(180 - this.gunAngle));
        rect(-0.5 * this.width, 0, 0.75 * this.width, 0.2 * this.height);
        pop();
    };

    /**
     * Draw the body of the tank in the color saved in this.color.
     */
    drawBody() {
        fill(this.color);
        quad(this.pos.x - 0.5 * this.width, this.pos.y - 0.5 * this.height,
            this.pos.x + 0.5 * this.width, this.pos.y - 0.5 * this.height,
            this.pos.x + 0.3 * this.width, this.pos.y - this.height,
            this.pos.x - 0.3 * this.width, this.pos.y - this.height,
        );
    };

    /**
     * Draw the health bar above the tank
     */
    drawHealthBar() {
        const barMaxWidth = 1.25 * this.width;
        const barHeight = 0.2 * this.height;
        let barw = barMaxWidth * this.health / 100;
        if (barw < 0) {
            barw = 0;
        }
        const barx = this.pos.x;
        const bary = this.pos.y;


        // background
        fill(0);
        rect(barx, bary, barMaxWidth, barHeight);

        // health
        // rectMode()
        fill(255, 0, 0);
        rect(barx - 0.5 * (barMaxWidth - barw), bary, barw, barHeight);
    };

    /**
     * Draw the entire tank calling the track, gun and body draw functions.
     */
    draw() {
        push();
        stroke(0);
        strokeWeight(0.04 * this.height);

        this.drawTracks();
        this.drawGun();
        this.drawBody();
        this.drawHealthBar();

        pop();

        if(this.isExploding) {
            fill(255, 0, 0);
            ellipse(this.pos.x, this.pos.y, this.explosionRadius, this.explosionRadius);
// TODO: update with animation function
            this.explosionRadius+=3;
            if(this.explosionRadius > 3 * this.maxExplosionRadius) {
                this.finishedExploding = true;
                this.isExploding = false;
                this.explosionRadius =0;
            }
        }
    };
};