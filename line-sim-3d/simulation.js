/*******************************************************************************
 *
 *  @file simulation.js A file with the simulation manager objects
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 16-March-2024
 *  @link https://omareq.github.io/line-sim-3d/
 *  @link https://omareq.github.io/line-sim-3d/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2024 Omar Essilfie-Quaye
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
 * Simulation namespace object
 */
var Simulation = Simulation || {};

/**
 * Simulation Mode nested namespace object
 */
Simulation.Mode = Simulation.Mode || {};

/**
 * Class used as a data class to store the current frame statistics.  This
 * includes dt, fps, and time since start.
 */
Simulation.FrameData = class {
    /**
     * constructor for the FrameData class.  The data is automatically populated
     * on creation using timing data from the previous frame that is stored in
     * the Simulation.lastFrameTime and Simulation.firstFrameTime variables.
     */
    constructor() {
        this.frameTime = Date.now();

        this.dt = this.frameTime - Simulation.lastFrameTime;
        if(this.dt > 100) {
            // this is done to remove jumping effects when you switch windows
            // contexts by changing tab or application.
            this.dt = 10;
        } else if (this.dt > 16) {
            // if frameRate is less than 60fps but greater than 10fps
            this.dt = 16;
        }
        this.dtMillis = this.dt;
        this.dtSeconds = 0.001 * this.dt;
        this.fps = 1 / this.dtSeconds;

        this.frame = Simulation.frame;
        this.timeSinceStart = this.frameTime - Simulation.firstFrameTime;
        this.timeSinceStartSeconds = 0.001 * this.timeSinceStart;
    }
};

/**
 * A function to setup the simulation.  This includes the frameData statistics
 * history array and the Simulation mode setup functions.
 */
Simulation.setup = function() {
    Simulation.firstFrameTime = Date.now();
    Simulation.lastFrameTime = Date.now();

    Simulation.frameDataHistory = [];
    Simulation.currentFrameData = null;
    Simulation.frame = 0;

    if(Simulation.Mode.activeMode == undefined) {
        Simulation.Mode.setActive(new Simulation.Mode.Empty());
    }
};

/**
 * A function to update the simulation data statistics and call the simulation
 * mode update function.
 */
Simulation.update = function() {
    Simulation.currentFrameData = new Simulation.FrameData();
    Simulation.frameDataHistory.push(Simulation.currentFrameData);
    Simulation.dt = Simulation.currentFrameData.dt;
    Simulation.dtSeconds = Simulation.currentFrameData.dtSeconds;
    Simulation.fps = Simulation.currentFrameData.fps;

    Simulation.frame++;
    Simulation.lastFrameTime = Simulation.currentFrameData.frameTime;

    Simulation.Mode.activeMode.update();
};

/**
 * Sets the activeSimulation mode to a new value.
 *
 * @param newMode {Simulation.Mode.Type} - New Simulation mode.
 *
 * @throws {Error} "newMode should be an instance of Simulation.Mode.ModeType";
 */
Simulation.Mode.setActive = function(newMode) {
    if(!(newMode instanceof Simulation.Mode.ModeType)) {
        Simulation.Mode.activeMode = new Simulation.Mode.Empty();
        const err = "newMode should be an instance of Simulation.Mode.ModeType";
        throw new Error(err);
    }

    Simulation.Mode.activeMode = newMode;
};

/**
 * Class Simulation.Mode.ModeType used as an abstract class to enforce that
 * Simulation modes have an update function.
 */
Simulation.Mode.ModeType = class {
    /**
     * An abstract class constructor that throws an error if it is instantiated.
     *
     * @throws {Error} Abstract class Simulation.Mode.Type can't be instantiated
     */
    constructor() {
        let err = "Abstract class Simulation.Mode.Type can't be instantiated.";
        if(this.constructor == Simulation.Mode.Type) {
          throw new Error(err);
        }
      }

      /**
       * An abstract method which needs to be overridden.
       *
       * @throws {Error} Method 'update()' must be implemented
       */
    update() {
        throw new Error("Method 'update()' must be implemented.");
    }
};

/**
 * Class empty mode that doesn't do anything.  This is the default mode if no
 * mode has been added to the simulation.
 *
 * @see Simulation.Mode.ModeType
 */
Simulation.Mode.Empty = class extends Simulation.Mode.ModeType {
    /**
     * Calls super() and exits
     */
    constructor() {super();};

    /**
     * exits immediately
     */
    update() {};
};