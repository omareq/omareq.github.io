/*******************************************************************************
 *
 *  @file mode-debug-projectile.js A file to test projectile motion
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
 * Class debug projectile.
 *
 * @see TankGame.Mode
 */
TankGame.ModeList.DebugProjectile = class extends TankGame.Mode {
    /**
     * Constructor for the Debug projectile mode.
     */
    constructor() {
        super();
        console.debug("Start the Debug Projectile Mode");
        this.startSpeed = 100;
        this.keys = Object.keys(TankGame.ProjectileParamList);
        this.keysIndex = 0;
    };

    /**
     * Startup actions that require access to the game engine
     */
    startup() {
        this.gameEngine.reset();
        const ground = new TankGame.World.Terrain(
            this.gameEngine.screenWidth,
            0.85 * this.gameEngine.screenHeight,
            this.gameEngine.screenHeight,
            0.009);

        this.gameEngine.addTerrain(ground);
    }

    /**
     * Update the projectile debug mode - adds new projectile if there are none
     * currently in the screen
     *
     * @param {number} dt - The time between the current frame and the previous frame.
     */
    update(dt) {
        if(this.gameEngine.projectiles.length==0) {
            let startHeight = this.gameEngine.terrain.groundHeight[0];
            if(startHeight > this.gameEngine.screenHeight) {
                startHeight = this.gameEngine.screenHeight;
            }
            const startPos = createVector(2, startHeight);
            const speed = this.startSpeed;
            this.startSpeed -= 10;
            if(this.startSpeed <= 10) {
                this.startSpeed = 100;
                this.keysIndex++;
                if(this.keysIndex > this.keys.length - 1) {
                    this.keysIndex = 0;
                }
            }
            const bearing = 45;
            const key = this.keys[this.keysIndex];
            const testProjectile = new TankGame.Projectile(
                startPos,
                speed,
                bearing,
                TankGame.ProjectileParamList[key]);
            console.debug("Add ", key, " to the projectiles list.");

            this.gameEngine.addProjectile(testProjectile);
        }
    };

    /**
     * exits immediately
     */
    draw() {
    };
};