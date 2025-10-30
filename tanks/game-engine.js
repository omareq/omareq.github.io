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
        this.reset();
        this.setMode(startingMode);
    };

    /**
     * reset game engine data
     */
    reset() {
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
        this.wind = createVector(-0.02, 0);
        this.isPaused = false;
        this.tanks = [];
        this.players = [];
        this.activePlayerIndex = 0;
        this.playerData = [];
        this.scoresChanged = true;
    }

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
     *
     * @throws {Error} param newProjectile should be instance of TankGame.Projectile
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
                if(this.projectiles[i].isOffScreen()) {
                    this.projectiles.splice(i, 1);
                    console.debug("Remove out of bounds projectile from list");
                    continue;
                }

                if(this.projectiles[i].finishedExploding) {
                    const pos = this.projectiles[i].pos.copy();
                    const radius = this.projectiles[i].projectileParam.explosionRadius;
                    this.terrain.addCrater(pos, radius);

                    for(let j = 0; j < this.tanks.length; j++) {
                        this.projectileHitsTank(this.projectiles[i], this.tanks[j]);
                    }

                    this.projectiles.splice(i, 1);
                    console.debug("Remove exploded projectile from list");
                    continue;
                }

                if(this.projectiles[i].isExploding) {
                    // update terrain
                    continue;
                }

                if(this.projectileHitsTerrain(this.projectiles[i])) {
                    this.projectiles[i].explode();
                    continue;
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
     * Determines if a projectile hits a tank and applies the correct damage
     * based on how far away the tank is from the center of the explosion.
     *
     * @param {TankGame.Projectile} projectile - The projectile
     * @param {TankGame.Tank} tank - The tank
     */
    projectileHitsTank(projectile, tank) {
// TODOD: Add param type checks
        const distance = dist(projectile.pos.x, projectile.pos.y,
            tank.pos.x, tank.pos.y);
        const explosionRadius = projectile.projectileParam.explosionRadius;
        if(distance < (explosionRadius + tank.width/2)) {
            const nonOverlapDist = distance;
            const maxDamage = projectile.projectileParam.damage;
            const damageStart = map(nonOverlapDist,
                0, explosionRadius + tank.width/2,
                maxDamage, 0);
            const damage = min(damageStart, maxDamage);
            console.debug("Projectile Tanks Dist: " + distance + " max damage: " + maxDamage
                + " Damage: " + damage);
// TODO: Add some asserts damage > 0, damage less than maxDamage, no undefined
            tank.addDamage(damage);

            if(this.players.length > 0) {
                this.scoresChanged = true;
                if(tank == this.currentPlayer().tank) {
                    this.currentPlayer().decreaseScore(round(damage) * 10);
                    return;
                }

                this.currentPlayer().increaseScore(round(damage) * 10);
            }
            return;
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
     *
     * @throws {Error} param terrain should be instance of TankGame.World.Terrain
     */
    addTerrain(terrain) {
        if(!(terrain instanceof TankGame.World.Terrain)) {
            let err = "terrain should be an instance of ";
            err += " TankGame.World.Terrain\n";
            console.warn(err);
            throw(err);
        }

        this.terrain = terrain;
    };

     /**
     * Add new tank to the game engine.
     *
     * @param {TankGame.Tank} terrain - the ground
     *
     * @throws {Error} param newTank should be instance of TankGame.Tank
     */
    addTank(newTank) {
        if(!(newTank instanceof TankGame.Tank)) {
            let err = "newTank should be an instance of TankGame.Tanks\n";
            console.warn(err);
            throw(err);
        }

        newTank.attachTo(this);
        this.tanks.push(newTank);
    };

    /**
     * Update the tanks according to the game physics
     */
    updateTanks() {
        for(let i = this.tanks.length - 1; i >= 0; i--) {
            this.tanks[i].update(this.currentFrameData.dtSeconds);
            const index = floor(this.tanks[i].pos.x);
            const terrainHeight = this.terrain.groundHeight[index] + 2;
            if(terrainHeight < this.tanks[i].pos.y) {
                this.tanks[i].vel = createVector();
                this.tanks[i].pos.y = terrainHeight+2;
            }

            if(this.tanks[i].isDead()) {
                this.tanks.splice(i, 1);
// TODO: Detach from player
                console.debug("Removing dead tank from the game engine");
            }
        }
    };

    /**
     * Draw the tanks
     */
    drawTanks() {
        for(let i = this.tanks.length - 1; i >= 0; i--) {
            this.tanks[i].draw();
        }
    };

    /**
     * Add new player to the game engine
     *
     * @param {TankGame.Player} player - The new player
     *
     * @throws {Error} param player should be instance of TankGame.Player
     */
    addPlayer(player) {
        if(!(player instanceof TankGame.Player)) {
            let err = "player should be an instance of TankGame.Player\n";
            console.warn(err);
            throw(err);
        }
        player.attachTo(this);
        this.players.push(player);
        this.scoresChanged = true;
    }

    /**
     * Moves to the next player with a live tank.
     *
     * @returns {Boolean} success of operation
     */
    nextPlayer() {
        if(this.tanks.length <= 1) {
            return false;
        }

        do {
            this.activePlayerIndex++;
            if(this.activePlayerIndex >= this.players.length) {
                this.activePlayerIndex = 0;
            }
        } while(this.currentPlayer().tank.isDead());

        return true;
    }

    /**
     * Returns a reference to the current active player
     *
     * @returns {TankGame.Player} - The current player
     */
    currentPlayer() {
        return this.players[this.activePlayerIndex];
    }

    drawPlayerScores() {
        if(this.scoresChanged || this.playerData.length == 0) {
            this.playerData = [];
            for(let i = 0; i < this.players.length; i++) {
                this.playerData.push(
                    {
                        name:this.players[i].name,
                        score:this.players[i].score,
                        index: i
                    }
                );
            }
            this.playerData.sort((a, b) => b.score - a.score);
        }

        const offset = 0.09 * height;
        for(let i = 0; i < this.playerData.length; i++) {
            const score = this.playerData[i].name + ":" + this.playerData[i].score;
            fill(this.players[this.playerData[i].index].tank.color);
            noStroke();
            text(score, 10, offset + 1.15 * i * textSize());
        }
    }

    /**
     * Passes the current global wind vector to the calling function.
     *
     * @returns {P5.Vector} - The wind vector
     */
    getCurrentWind() {
        return this.wind.copy();
    }

    /**
     * Pause the game engine updates
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume game engine updates
     */
    unpause() {
        this.isPaused = false;
    }

    /**
     * Handle key press
     */
    handleKeyPress() {
        if(this.players.length > 0 && this.currentPlayer().tank.isDead()) {
            return;
        }
        if(this.players.length <= 0) {
            return;
        }

        let activePlayer = this.currentPlayer();
        if(activePlayer.isAI()) {
            // activePlayer.ai.makeMove();
            return;
        }
        let activeTank = this.currentPlayer().tank;

        if(key == "w") {
            activeTank.increaseGunAngle();
        } else if(key == "s") {
            activeTank.decreaseGunAngle();
        } else if(key == "a") {
            activeTank.moveLeft();
        } else if(key == "d") {
            activeTank.moveRight();
        } else if(key == "o") {
            activeTank.increaseFiringSpeed();
        } else if(key == "l") {
            activeTank.decreaseFiringSpeed();
        } else if(keyCode == ENTER) {
            const shot = activeTank.shootProjectile(activePlayer.peekNextWeapon());
            if(shot) {
                activePlayer.shootNextWeapon();
            }
        } else if(key == "q") {
            activePlayer.moveToNextWeaponType();
        } else if(key == "e") {
            activePlayer.moveToPrevWeaponType();
        }
    }

    /**
     * Updates the game engine and all of the components.  this includes running
     * a rendering operation after all updates are complete.
     */
    update() {
        this.scoresChanged = false;
        if(!this.isPaused) {
            if(keyIsPressed) {
                this.handleKeyPress();
            }
            this.updateFrameData();
            this.updateProjectiles();
            this.updateTanks();
            this.activeMode.update(this.currentFrameData.dtSeconds);
        }

// TODO: cache background drawing as img for faster refresh

        p5.disableFriendlyErrors = true;
        this.activeMode.draw();
        if(this.activeMode.gameMode) {
            if(this.terrain != undefined) {
                this.terrain.draw();
            }
            this.drawProjectiles();
            this.drawTanks();
            if(this.players.length > 0) {
                this.currentPlayer().draw();
                this.drawPlayerScores();
            }
        }
        p5.disableFriendlyErrors = false;
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
        this.activeMode.startup();
    };
};

// Modes

/**
 * Class Mode that represents variable modes that the game engine can run.  If
 * there are any issues the game engine will switch to the default game mode
 * which is the empty mode.
 *
 * @see TankGame.ModeList.DebugEmpty
 */
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

    /**
     * Attach the game engine to the mode.  This allows the mode to pull data
     * such as the frame rate, gravity, screen dimensions etc from the game
     * engine.
     *
     * @param {TankGame.GameEngine} gameEngine - The running game engine
     *
     * @throws {Error} input param gameEngine is not instance of TankGame.GameEngine
     */
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
        background(255, 30, 255);
        throw new Error("Method 'draw()' must be implemented.");
    };

    /**
     * An abstract method called when teh mode is started after it is attached
     * to the game engine
     */
    startup() {

    }


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
        this.gameMode = false;
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
