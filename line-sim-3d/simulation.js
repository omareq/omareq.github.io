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
 * Simulation pause flag
 */
Simulation.pause = false;

/**
 * Sets the pause flag and stops simulation updates.  UI poll events are not
 * affected.
 */
Simulation.pauseFlagSet = function() {
    Simulation.pause = true;
};

/**
 * Un-sets the pause flag and starts simulation updates.  UI poll events are not
 * affected.
 */
Simulation.pauseFlagUnset = function() {
    Simulation.pause = false;
};

/**
 * Toggles the pause flag. This starts or stops simulation updates.
 */
Simulation.pauseFlagToggle = function() {
    Simulation.pause = !Simulation.pause;
};

/**
 * Class used as a data class to store the current frame statistics.  This
 * includes dt, fps, and time since start.
 */
Simulation.FrameData = class {
    /**
     * constructor for the FrameData class.  The data is automatically populated
     * on creation using timing data from the previous frame that is stored in
     * the Simulation.lastFrameTime and Simulation.firstFrameTime variables.
     *
     * If dt is greater than 100ms (for example when switching windows context,
     * or by changing tabs) then dt is set to 10ms.  Additionally if dt is
     * greater than 16ms it is reduced to 16ms to maintain a constant sensor
     * refresh rate.  If the refresh rate drops below 50Hz then the robot moves
     * too quickly over the line and misses it. Due to these time manipulations
     * the time since start is different to the sum of all dts.  Time since
     * start is always the true difference between the start time and the
     * current frame time.
     */
    constructor() {
        this.frameTime = Date.now();

        this.dt = this.frameTime - Simulation.lastFrameTime;
        if(this.dt > 100 || Simulation.speedUp != 1) {
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

    Simulation.speedUp = 1;

    if(Simulation.Mode.activeMode == undefined) {
        Simulation.Mode.setActive(new Simulation.Mode.Empty());
    }

    Simulation.activeCameraMode = new Simulation.CameraControl.Modes.Default2D();
};

/**
 * A function to update the simulation data statistics and call the simulation
 * mode update function.
 */
Simulation.update = function() {
    if(Simulation.pause) {
        return;
    }
    Simulation.currentFrameData = new Simulation.FrameData();
    Simulation.frameDataHistory.push(Simulation.currentFrameData);
    Simulation.dt = Simulation.currentFrameData.dt;
    Simulation.dtSeconds = Simulation.currentFrameData.dtSeconds;
    Simulation.fps = Simulation.currentFrameData.fps;

    Simulation.frame++;
    Simulation.lastFrameTime = Simulation.currentFrameData.frameTime;

    background(127);
    push();
    translate(-width/2, -height/2);
    for(let i = 0; i < Simulation.speedUp; i++) {
// TODO: separate simulation update and draw so that render logic isn't repeated
        Simulation.Mode.activeMode.update();
    }
    pop();

    Simulation.activeCameraMode.update();
};

/**
 * Sets the activeSimulation mode to a new value.  This checks to see if the UI
 * panel for the current mode needs to be hidden and also unsets the pause flag.
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

    // no point hiding the UI if the new mode is the current mode
    if(Simulation.Mode.activeMode != undefined &&
        Simulation.Mode.activeMode.name != newMode.name) {
        Simulation.Mode.activeMode.hideUI();
    }

    Simulation.Mode.activeMode = newMode;
    Simulation.pauseFlagUnset();
};

/**
 * Searches through the list of Simulation.Mode.ModeList and sets the active
 * mode to the one selected by name by passing it to Simulation.Mode.setActive()
 *
 * This function will use console.warn to alert the user to an incorrect mode
 * name being selected.  The decision to not throw has been made as this is an
 * error that can be recovered from gracefully by changing the mode to empty.
 *
 * @param modeName {String} - The name of the mode to select.  For example
 * "LineFollowOneSensor"
 */
Simulation.Mode.setModeByName = function(modeName) {
    for(let i = 0; i < Simulation.Mode.ModeList.length; i++) {
// TODO: figure out how to do this without for loop
        if(Simulation.Mode.ModeList[i].staticName == modeName) {
            Simulation.Mode.setActive(new Simulation.Mode.ModeList[i]());
            return;
        }
    }
    console.warn("Can't set Simulation mode to: ", modeName);
    Simulation.Mode.setActive(new Simulation.Mode.Empty());
};

/**
 * The reset function sets the mode to a new instance of the current mode.
 */
Simulation.reset = function() {
    if(Simulation.Mode.activeMode.name == "Debug") {
        Simulation.Mode.activeMode.reset();
        return;
    }
    Simulation.Mode.setModeByName(Simulation.Mode.activeMode.name);
};

/**
 * Class Simulation.Mode.ModeType used as an abstract class to enforce that
 * Simulation modes have an update function.
 *
 * @see Simulation.Mode.Empty
 * @see Simulation.Mode.LineFollowOneSensor
 * @see Simulation.Mode.LineFollowTwoSensor
 * @see Simulation.Mode.DebugStaticTile
 * @see Simulation.Mode.DebugMovingTile
 * @see Simulation.Mode.DebugRoom
 * @see Simulation.Mode.DebugShowAllTiles
 * @see Simulation.Mode.DebugLightSensorArray
 * @see Simulation.Mode.DebugRobot
 * @see Simulation.Mode.DebugLineDistanceCheck
 */
Simulation.Mode.ModeType = class {
    static isModeType = true;
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

    /**
     * This function gets a document element by ID as defined in the variable
     * this.uiDivID created by the child class.  If this is not defined then
     * the setup function does nothing.
     *
     * The document element is saved in this.UIPanel and this.showUI() is
     * called.
     */
    setupUI() {
        if(this.uiDivID == undefined) {
            return;
        }
        console.debug("setup sim mode UI");
        this.UIPanel = document.getElementById(this.uiDivID);
        this.showUI();
    }

    /**
     * Checks if this.UIPanel is defined and shows the panel if it is.  This is
     * done by setting the visibility to "visible" and the display style to
     * "inline".
     */
    showUI() {
        if(this.UIPanel == undefined) {
            return;
        }
        console.debug("Show sim mode UI");
        this.UIPanel.style.visibility = "visible";
        this.UIPanel.style.display = "inline";
    }

    /**
     * Checks if this.UIPanel is defined and hides the panel if it is.  This is
     * done by setting the visibility to "hidden" and the display style to
     * "none".
     */
    hideUI() {
        if(this.UIPanel == undefined) {
            return;
        }
        console.debug("Hide sim mode UI");
        this.UIPanel.style.visibility = "hidden";
        this.UIPanel.style.display = "none";
    }

    /**
     * UI Poll function that should be overridden by child classes that define
     * UI functionality. It is not enforced that this function should be
     * overridden so that a child class can choose not to implement this
     * feature.
     *
     * This function is called in UI.poll() and is still called when the
     * simulation is paused.
     */
    UIPoll() {};
};

/**
 * Class empty mode that doesn't do anything.  This is the default mode if no
 * mode has been added to the simulation.
 *
 * @see Simulation.Mode.ModeType
 */
Simulation.Mode.Empty = class extends Simulation.Mode.ModeType {
    static staticName = "Empty";

    /**
     * Calls super() and exits
     */
    constructor() {
        super();
        this.name = "Empty";
    };

    /**
     * exits immediately
     */
    update() {};

    /**
     * exits immediately
     */
    hideUI() {};
};

Simulation.Mode.ModeList = [];

Simulation.Mode.ModeList.push(Simulation.Mode.Empty);
