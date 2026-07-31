/*******************************************************************************
 *
 *  @file mode-debug-player.js A file to test player controls
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
 * Class debug player.
 *
 * @see TankGame.Mode
 */
TankGame.ModeList.DebugPlayer = class extends TankGame.Mode {
    /**
     * Constructor for the Debug player mode.
     */
    constructor() {
        super();
        console.debug("Start the Debug Player Mode");
    };

    /**
     * Startup actions that require access to the game engine
     */
    startup() {
        this.createTerrain();
        this.createPlayers();
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
     * create players and attach the tanks to them
     */
    createPlayers() {
        let p1 = new TankGame.Player("Player 1");
        let p2 = new TankGame.Player("Player 2");
        let p3 = new TankGame.Player("Player 3");

        this.gameEngine.addPlayer(p1);
        this.gameEngine.addPlayer(p2);
        this.gameEngine.addPlayer(p3);

        const tankWidth = width * 0.035;
        const tank1Pos = createVector(0.3*width, height / 2);
        const tank2Pos = createVector(0.6*width, height / 2);
        const tank3Pos = createVector(0.9*width, height / 2);

        let tank1 = new TankGame.Tank(tankWidth, tank1Pos);
        let tank2 = new TankGame.Tank(tankWidth, tank2Pos);
        let tank3 = new TankGame.Tank(tankWidth, tank3Pos);

        p1.attachTank(tank1);
        p2.attachTank(tank2);
        p3.attachTank(tank3);
        this.gameEngine.addTank(tank1);
        this.gameEngine.addTank(tank2);
        this.gameEngine.addTank(tank3);
    }

    /**
     * Return the game engine to a fresh state
     */
    resetGameEngine() {
        // The game engine data is not usually reset as switching between modes
        // can be used to run different operations on the same data. for example
        // keeping all of the players in the game engine allows for a new mode
        // where you can purchase new weapons for the player armoury.
        this.gameEngine.reset();
        this.gameEngine.setMode(new TankGame.ModeList.DebugPlayer());

    }


    /**
     * Update the projectile debug mode - adds new projectile if there are none
     * currently in the screen
     *
     * @param {number} dt - The time between the current frame and the previous frame.
     */
    update(dt) {
        if(keyIsPressed) {
            const currentTime = this.gameEngine.currentFrameData.timeSinceStartSeconds;
            if(this.lastKeyPressTime != undefined &&
                currentTime - this.lastKeyPressTime < 0.35) {
                return false;
            }

            if(key == "p") {
                this.gameEngine.nextPlayer();
            } else if(key == "r") {
                this.resetGameEngine();
            }

            this.lastKeyPressTime = currentTime;
        }

        if(this.gameEngine.tanks.length <= 1) {
            this.resetGameEngine();
        }
    };

    /**
     * exits immediately
     */
    draw() {
        background(126, 204, 239);
    };
};