/*******************************************************************************
 *
 *  @file mode-debug-tank.js A file to test tank controls
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

/**
 * Class Debug Tank to test the tank controls.
 *
 * @see TankGame.Mode
 */
TankGame.ModeList.DebugTank = class extends TankGame.Mode {
    /**
     * Constructor for the Debug Tank mode.
     */
    constructor() {
        super();
        console.debug("Start the Debug Tank Mode");
        this.mode = "testFalling";
        this.increaseAngle = true;
        this.lastTankPosY = 0;
        this.driveLeft = true;
    };

    /**
     * Startup actions that require access to the game engine
     */
    startup() {
        this.gameEngine.reset();
        this.createTerrain();
        this.createTanks();
    }

    /**
     * Create the terrain
     */
    createTerrain() {
        const ground = new TankGame.World.Terrain(
            this.gameEngine.screenWidth,
            0.75 * this.gameEngine.screenHeight,
            0.90 * this.gameEngine.screenHeight,
            0.009);

        this.gameEngine.addTerrain(ground);
    }

    /**
     * Create the tanks for testing
     */
    createTanks() {
        const tankWidth = width * 0.035;
        const tankPos = createVector(width / 2, height / 2);
        this.tank = new TankGame.Tank(tankWidth, tankPos);
        this.gameEngine.addTank(this.tank);

    };

    /**
     * Update the projectile debug mode - adds new projectile if there are none
     * currently in the screen
     *
     * @param {number} dt - The time between the current frame and the previous frame.
     */
    update(dt) {
        if(this.mode == "testFalling") {
            if(this.tank.pos.y == this.lastTankPosY) {
                this.mode = "testGunAngle";
                this.lastTankPosY = 0;
            }
            this.lastTankPosY = this.tank.pos.y;
        } else if(this.mode == "testGunAngle") {
            if(this.increaseAngle) {
                this.tank.increaseGunAngle();
                if(this.tank.getGunAngle() == 180) {
                    this.increaseAngle = false;
                }
            } else {
                this.tank.decreaseGunAngle();
                if(this.tank.getGunAngle() == 135) {
                    this.increaseAngle = true;
                    this.mode = "testDriving";
                }
            }
        } else if(this.mode == "testDriving") {
            if(this.driveLeft) {
                this.tank.moveLeft();
                if(this.tank.pos.x < 0) {
                    this.driveLeft = false;
                }
            } else {
                this.tank.moveRight();
                if(this.tank.pos.x > 0.5 * this.gameEngine.screenWidth) {
                    this.mode = "testShooting";
                    this.driveLeft = true;
                }
            }

        } else if(this.mode == "testShooting") {
            if(this.gameEngine.projectiles.length == 0) {
                if(this.tank.getGunAngle() <= 45) {
                    this.mode = "testFalling";
                    this.createTerrain();
                    this.createTanks();
                    return;
                }
                const shot = this.tank.shootProjectile(TankGame.ProjectileParamList.LargeAirBurst);
                if(shot) {
                    this.tank.setGunAngle(this.tank.getGunAngle() - 5);
                }
            }
            if(this.gameEngine.tanks.length == 0 && this.gameEngine.projectiles.length == 0) {
                this.mode = "testFalling";
                this.createTanks();
                this.createTerrain();
            }
        }
    };

    /**
     * exits immediately
     */
    draw() {
        background(126, 204, 239);
    };
};