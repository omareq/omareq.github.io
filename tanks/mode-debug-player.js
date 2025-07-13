/*******************************************************************************
 *
 *  @file mode-debug-projectile.js A file to test player controls
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 19-April-2025
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
 * Class empty mode that doesn't do anything.
 *
 * @see TankGame.Mode
 */
TankGame.ModeList.DebugPlayer = class extends TankGame.Mode {
    /**
     * Constructor for the Debug projectile mode.
     */
    constructor() {
        super();
        console.debug("Start the Debug Player Mode");
    };

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
     * Update the projectile debug mode - adds new projectile if there are none
     * currently in the screen
     *
     * @param {number} dt - The time between the current frame and the previous frame.
     */
    update(dt) {
        if(this.gameEngine.terrain == undefined) {
            this.createTerrain();
        }
    };

    /**
     * exits immediately
     */
    draw() {
        background(126, 204, 239);
    };
};