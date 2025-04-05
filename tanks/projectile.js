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
 *
 * @type{Object}
 */
const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o;} , {})); // eslint-disable-line

/**
 * Structure for projectile parameters.
 *
 * @type{Struct}
 */
TankGame.ProjectileParam = Struct(
    "damage",
    "projectileRadius",
    "explosionRadius",
    "duplicationFactor",
    "explodeAtApogee"
);

/**
 * Dictionary of projectile parameter structs.  Describes the parameters for all
 * the projectile types.
 *
 * @see TankGame.ProjectileParam
 *
 * @type{Dict<TankGame.ProjectileParam>}
 */
TankGame.ProjectileParamList = {};

/*******************************************************************************
 * MISSILES
 ******************************************************************************/

/**
 * Small missile.  Pure projectile that explodes on impact.
 *
 * @type{TankGame.ProjectileParam}
 */
TankGame.ProjectileParamList.SmallMissile = TankGame.ProjectileParam(25, 2, 15, 0, false);

/**
 * Medium missile.  Pure projectile that explodes on impact.
 *
 * @type{TankGame.ProjectileParam}
 */
TankGame.ProjectileParamList.MediumMissile = TankGame.ProjectileParam(50, 4, 20, 0, false);

/**
 * Large missile.  Pure projectile that explodes on impact.
 *
 * @type{TankGame.ProjectileParam}
 */
TankGame.ProjectileParamList.LargeMissile = TankGame.ProjectileParam(75, 5, 30, 0, false);

/*******************************************************************************
 * GROUND BURST BOMBS
 ******************************************************************************/

/**
 * Small Ground Burst Bomb. Ballistic projectile that splits into 5 small
 * missiles on impact.  These missiles spread out radially.
 *
 * @type{TankGame.ProjectileParam}
 */
TankGame.ProjectileParamList.SmallGroundBurst = TankGame.ProjectileParam(25, 2, 15, 5, false);

/**
 * Medium Ground Burst Bomb. Ballistic projectile that splits into 7 small
 * missiles on impact.  These missiles spread out radially.
 *
 * @type{TankGame.ProjectileParam}
 */
TankGame.ProjectileParamList.MediumGroundBurst = TankGame.ProjectileParam(25, 4, 20, 7, false);

/**
 * Large Ground Burst Bomb. Ballistic projectile that splits into 9 small
 * missiles on impact.  These missiles spread out radially.
 *
 * @type{TankGame.ProjectileParam}
 */
TankGame.ProjectileParamList.LargeGroundBurst = TankGame.ProjectileParam(25, 5, 30, 9, false);

/*******************************************************************************
 * GROUND BURST BOMBS
 ******************************************************************************/

/**
 * Small Air Burst Bomb. Ballistic projectile that splits into 5 small
 * missiles at apogee.  These missiles spread out radially.
 *
 * @type{TankGame.ProjectileParam}
 */
TankGame.ProjectileParamList.SmallAirBurst = TankGame.ProjectileParam(25, 2, 15, 5, true);


/**
 * Medium Air Burst Bomb. Ballistic projectile that splits into 7 small
 * missiles at apogee.  These missiles spread out radially.
 *
 * @type{TankGame.ProjectileParam}
 */
TankGame.ProjectileParamList.MediumAirBurst = TankGame.ProjectileParam(25, 4, 20, 7, true);


/**
 * Large Air Burst Bomb. Ballistic projectile that splits into 9 small
 * missiles at apogee.  These missiles spread out radially.
 *
 * @type{TankGame.ProjectileParam}
 */
TankGame.ProjectileParamList.LargeAirBurst = TankGame.ProjectileParam(25, 5, 30, 9, true);


/**
 * Class Projectile that represents the weapons projectiles.
 *
 * @see TankGame.ModeList.DebugProjectile
 */
TankGame.Projectile = class {
    /**
     * Projectile constructor.
     *
     * @param {p5.Vector} startPos - Starting position of the projectile
     * @param {number}    speed    - The start speed from 0-100
     * @param {number}    bearing  - Bearing to fire the projectile 0-180 in degrees.
     * @param {TankGame.ProjectileParam} projectileParam - Struct of projectile parameters.
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
        this.isExploding = false;
        this.finishedExploding = false;
    };

    /**
     * Attach the projectile to the game engine and keep a handle for the
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
     * Set the exploding flag to true to start the animation and produces any
     * projectiles that are spawned from the explosion.  These new projectiles
     * are directly added to the game engine.
     *
     * @see TankGame.GameEngine
     */
    explode() {
        this.isExploding = true;
        const numProjectiles = this.projectileParam.duplicationFactor;
        if(numProjectiles > 0) {
            for(let i = 0; i < numProjectiles; i++) {
                const startPos = this.pos.copy();
                const speed = 20;
                const bearing = i * 140 / (this.projectileParam.duplicationFactor) + 30;
                const testProjectile = new TankGame.Projectile(
                    startPos,
                    speed,
                    bearing,
                    TankGame.ProjectileParamList["SmallMissile"]);
                this.gameEngine.addProjectile(testProjectile);
            }
        }
    }

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

        if(this.isExploding) {
            if(this.radius > this.projectileParam.explosionRadius) {
                this.finishedExploding = true;
                return;
            }

//TODO: update the explosion animation by time and easing functions
            this.radius+=4;
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

        if(this.projectileParam["explodeAtApogee"] && this.vel.y > 0) {
            this.explode();
        }
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