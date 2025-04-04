/*******************************************************************************
 *
 *  @file game-engine.js A file with the basic game engine
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
 * TankGame namespace object
 */
var TankGame = TankGame || {};

/**
 * Class GameEngine that represents the tank game engine
 *
 */
TankGame.GameEngine = class {
    /**
     * Creates a new instance of GameEngine
     *
     * @param {TankGame.Mode} startingMode - The game mode that the game engine
     *                                       will run at startup
     *
     * @see TankGame.Mode
     */
    constructor(startingMode) {
        this.setMode(startingMode);
        this.screenWidth = width;
        this.screenHeight = height;

        this.frameNumber = 0;
        this.firstFrameTime = Date.now();
        this.lastFrameTime = this.firstFrameTime;
        this.updateFrameData();
        this.gravity = createVector(0, 0.002);
        this.projectiles = [];
        this.terrain = undefined;

        // Good wind values -0.1 to 0.1
        this.wind = createVector(0.1, 0);
    };

    /**
     * update the current frame data
     */
    updateFrameData() {
        this.frameNumber++;
        if(this.currentFrameData != undefined) {
            this.lastFrameTime = this.currentFrameData.frameTime;
        }
        this.currentFrameData = (new TankGame.FrameData(
            this.frameNumber,
            this.firstFrameTime,
            this.lastFrameTime)
        );
    };

    /**
     * Inserts a projectile into the game engine projectile list
     *
     * @param {TankGame.Projectile} newProjectile - an instance of
     *                                              TankGame.Projectile
     */
    addProjectile(newProjectile) {
        if(!(newProjectile instanceof TankGame.Projectile)) {
            let err = "newProjectile should be an instance of ";
            err += "TankGame.Projectile\n";
            throw(err);
        }

        newProjectile.attachTo(this);
        this.projectiles.push(newProjectile);
    };

    /**
     * Update the position of all the projectiles and delete them if they are
     * off screen or collide with the ground
     */
    updateProjectiles() {
        if(this.projectiles.length > 0) {
            for(let i = this.projectiles.length-1; i >=0; i--) {
                this.projectiles[i].update(this.currentFrameData.dtSeconds);
                if(this.projectiles[i].isOffScreen()
                    || this.projectileHitsTerrain(this.projectiles[i])) {
                    this.projectiles.splice(i, 1);
                    console.debug("Remove projectile from list");
                }
            }
        }
    };

    /**
     * Draws all the projectiles
     */
    drawProjectiles() {
    if(this.projectiles.length > 0) {
        for(let i = this.projectiles.length-1; i >=0; i--) {
            this.projectiles[i].draw();
            }
        }
    };

    /**
     * Calculate if a given projectile hits the ground
     *
     * @param {TankGame.Projectile} projectile - The projectile to test.
     *
     * @returns {Boolean} - If projectile hits the ground
     */
    projectileHitsTerrain(projectile) {
        if(projectile.pos.y >= this.terrain.groundHeight[floor(projectile.pos.x)]) {
            console.debug("Projectile hit terrain");
            return true;
        }
        return false;
    };

    /**
     * Add the terrain to the game engine.
     *
     * @param {TankGame.World.Terrain} terrain - the ground
     */
    addTerrain(terrain) {
        if(!(terrain instanceof TankGame.World.Terrain)) {
            let err = "terrain should be an instance of ";
            err += " TankGame.World.Terrain\n";
            console.warn(err);
            throw(err);
            return;
        }

        this.terrain = terrain;
    };

    /**
     * Passes the current global wind vector to the calling function.
     *
     * @returns {P5.Vector} - The wind vector
     */
    getCurrentWind() {
        return this.wind.copy();
    }

    /**
     * Updates the game engine and all of the components.  this includes running
     * a rendering operation after all updates are complete.
     */
    update() {
        this.updateFrameData();
        this.updateProjectiles();
        this.activeMode.update(this.currentFrameData.dtSeconds);

// TODO: cache background drawing as img for faster refresh
        this.activeMode.draw();
        this.terrain.draw();
        this.drawProjectiles();
    };

    /**
     * Set the mode of the game engine.  Will return early and set the mode to
     * debug empty if the mode is not a valid instance of TankGame.Mode.
     *
     * @param {TankGame.Mode} newMode - the new mode
     */
    setMode(newMode) {
        if(newMode == undefined) {
            this.setMode(new TankGame.ModeList.DebugEmpty());
            return;
        }

        if(this.activeMode != undefined) {
            this.activeMode.shutdown();
        }

        if(!(newMode instanceof TankGame.Mode)) {
            this.activeMode = new TankGame.ModeList.DebugEmpty();
            let err = "newMode should be an instance of TankGame.Mode\n";
            err += "Switching to TankGame.ModeList.DebugEmpty Mode.";
            console.warn(err);
            return;
        }

        this.activeMode = newMode;
        this.activeMode.attachTo(this);
    };
};

// Modes

TankGame.Mode = class {
     /**
     * An abstract class constructor that throws an error if it is instantiated.
     *
     * @throws {Error} Abstract class TankGame.Mode can't be instantiated
     */
    constructor() {
        let err = "Abstract class TankGame.Mode can't be instantiated.";
        if(this.constructor == TankGame.Mode) {
          throw new Error(err);
        }
    };

    attachTo(gameEngine) {
        if(!(gameEngine instanceof TankGame.GameEngine)) {
            let err = "gameEngine should be an instance of ";
            err += "TankGame.GameEngine\n";
            throw(err);
            return;
        }
        this.gameEngine = gameEngine;
    }

     /**
       * An abstract method which needs to be overridden.
       *
       * @throws {Error} Method 'update()' must be implemented
       */
    update(dt) {
        throw new Error("Method 'update()' must be implemented.");
    };

    /**
       * An abstract method which needs to be overridden.
       *
       * @throws {Error} Method 'draw()' must be implemented
       */
    draw() {
        throw new Error("Method 'draw()' must be implemented.");
    };


     /**
       * An abstract method called when the mode is exited.
       */
    shutdown() {

    };
};

TankGame.ModeList = {};

/**
 * Class empty mode that doesn't do anything.
 *
 * @see TankGame.Mode
 */
TankGame.ModeList.DebugEmpty = class extends TankGame.Mode {
    /**
     * Calls super() and exits
     */
    constructor() {
        super();
    };

    /**
     * exits immediately
     */
    update(dt) {};

    /**
     * exits immediately
     */
    draw() {};
};

/**
 * Class used as a data class to store the current frame statistics.  This
 * includes dt, fps, and time since start.
 */
TankGame.FrameData = class {
    /**
     * constructor for the FrameData class.  The data is automatically populated
     * on creation using timing data from the previous frame that is stored in
     * the Simulation.lastFrameTime and Simulation.firstFrameTime variables.
     *
     * If dt is greater than 100ms (for example when switching windows context,
     * or by changing tabs) then dt is set to 10ms. Due to this time manipulation
     * the time since start is different to the sum of all dts.  Time since
     * start is always the true difference between the start time and the
     * current frame time.
     */
    constructor(frameNumber, firstFrameTime, lastFrameTime) {
        this.frameTime = Date.now();

        this.dt = this.frameTime - lastFrameTime;
        if(this.dt > 100) {
            // this is done to remove jumping effects when you switch windows
            // contexts by changing tab or application.
            this.dt = 10;
        }

        this.dtMillis = this.dt;
        this.dtSeconds = 0.001 * this.dt;
        this.fps = 1 / this.dtSeconds;

        this.frame = frameNumber;
        this.timeSinceStart = this.frameTime - firstFrameTime;
        this.timeSinceStartSeconds = 0.001 * this.timeSinceStart;
    };
};
