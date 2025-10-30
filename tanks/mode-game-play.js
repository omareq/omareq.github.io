/*******************************************************************************
 *
 *  @file mode-game-play.js The game play mode
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 26-October-2025
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
 * Class Game Play
 *
 * @see TankGame.Mode
 */
TankGame.ModeList.GamePlay = class extends TankGame.Mode {
    /**
     * Constructor for the Game Play Mode
     */
    constructor() {
        super();
        console.debug("Start the Game Play Mode");
        this.playerHasShot = false;
        this.gameMode = true;
    };

    /**
     * Startup actions that require access to the game engine
     */
    startup() {
        this.createTerrain();
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
        ground.drawRetro = false;
        this.gameEngine.addTerrain(ground);
    }

    /**
     * Update the projectile debug mode - adds new projectile if there are none
     * currently in the screen
     *
     * @param {number} dt - The time between the current frame and the previous frame.
     */
    update(dt) {
        if(this.gameEngine.projectiles.length > 0) {
            this.playerHasShot = true;
        }

        if(this.playerHasShot && this.gameEngine.projectiles.length == 0) {
            this.gameEngine.nextPlayer();
            this.playerHasShot = false;
        }

        if(this.gameEngine.tanks.length <= 1) {
            // go to weapons buying mode
            this.gameEngine.setMode(new TankGame.ModeList.BuyWeapons());
        }

        if(this.gameEngine.currentPlayer().tank.isDead()) {
            this.gameEngine.nextPlayer();
            this.playerHasShot = false;
        }

    };

    /**
     * draw background and exit immediately
     */
    draw() {
        background(126, 204, 239);
    };
};