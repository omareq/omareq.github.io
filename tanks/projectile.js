/*******************************************************************************
 *
 *  @file projectile.js A file with the dynamics of projectiles
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 12-February-2025
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
 * Struct template to turn a series of keys into a structure.
 */
const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o;} , {})); // eslint-disable-line

/**
 * Structure for projectile parameters.
 */
TankGame.ProjectileParam = Struct(
    "damage",
    "projectileRadius",
    "explosionRadius",
);

/**
 * Dictionary of projectile parameter structs.  Describes the parameters for all
 * the projectile types.
 */
TankGame.ProjectileParamList = {};
TankGame.ProjectileParamList.SmallMissile = TankGame.ProjectileParam(25, 5, 50);
TankGame.ProjectileParamList.MediumMissile = TankGame.ProjectileParam(50, 5, 75);
TankGame.ProjectileParamList.LargeMissile = TankGame.ProjectileParam(75, 5, 150);


/**
 * Class Projectile that represents the weapons projectiles.
 *
 * @see TankGame.Mode.DebudProjectile
 */
TankGame.Projectile = class {
    /**
     * Projectile constructor.
     *
     * @param {p5.Vector} startPos - Starting position of the projectile
     * @param {number}    speed    - The start speed from 0-100
     * @param {number}    bearing  - Bearing to fire the projectile 0-180 in degrees.
     * @param {ProjectilParam} projectileParam - Struct of projectile parameters.
     */
    constructor(startPos, speed, bearing, projectileParam) {
        this.minSpeed = 0.15;

        this.pos = startPos.copy();
        let startVel = createVector(1, 0);
        startVel.rotate(-radians(bearing));
        startVel.setMag(speed * this.minSpeed);
        this.vel = startVel.copy();
        this.projectileParam = projectileParam;
        this.radius = this.projectileParam.projectileRadius;
        this.mass = PI * this.radius**2;
        this.applyDrag = true;
        this.applyWind = true;
        this.gameEngine = undefined;
    };

    /**
     * Attach the projectile to the game engine and keep a handle for the
     * game engine.
     */
    attachTo(gameEngine) {
        if(!(gameEngine instanceof TankGame.GameEngine)) {
            let err = "gameEngine should be an instance of ";
            err += "TankGame.GameEngine\n";
            throw(err);
        }
        this.gameEngine = gameEngine;
    }

    /**
     * Disable the drag calculations on the projectile
     */
    disableDrag() {
        this.applyDrag = false;
    };

    /**
     * Enable the drag calculations on the projectile
     */
    enableDrag() {
        this.applyDrag = true;
    };

    /**
     * Determines if the projectile is off screen or not.  Does not return true
     * if the projectile is above the screen as it might fall back into view.
     *
     * @returns {Boolean} if the projectile is on screen
     */
    isOffScreen() {
        const horizontal = this.pos.x > width || this.pos.x < 0;
        const vertical = this.pos.y > height;
        return horizontal || vertical;
    };

    /**
     * updates the projectiles position.
     *
     * @param {number} dt - The time difference between the the current frame
     * and the previous frame.
     */
    update(dt) {
        if(this.isOffScreen()) {
            return;
        }

        this.vel = this.vel.copy().add(this.gameEngine.gravity.copy().div(dt));
        if(this.applyDrag) {
            this.vel = this.vel.copy().sub(this.vel.mult(0.009));
        }

        if(this.applyWind) {
            this.vel = this.vel.copy().add(this.gameEngine.getCurrentWind());
        }

        this.pos = this.pos.copy().add(this.vel.copy());
    };

    /**
     * Draws the projectile
     */
    draw() {
        push();
        fill(255, 0, 0);
        ellipse(this.pos.x, this.pos.y, 2 * this.radius);
        pop();
    };
};