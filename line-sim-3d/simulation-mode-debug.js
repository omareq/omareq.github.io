/*******************************************************************************
 *
 *  @file simulation-mode-debug.js Implementation of debug mode
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 23-August-2024
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
 * Class Simulation.Mode.Debug is a simulation mode that allows for all other
 * debug simulation modes to be displayed
 *
 * @see Simulation.Mode.ModeType
 */
Simulation.Mode.Debug = class extends Simulation.Mode.ModeType {
    static staticName = "Debug";

    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();
        this.name = "Debug";
        this.uiDivID = "simulation-mode-debug";
        this.setupUI();

        this.activeMode = new Simulation.Mode.DebugStaticTile();
        this.addNewUIElements();
    }

    /**
     * Adds the UI elements that control the static tile mode simulation
     * mode.  This code currently has an inefficiency that deletes DOM elements
     * for the inputs if they already exist.  It would be preferable if a handle
     * could be saved and reused for these elements.
     */
    addNewUIElements() {
        // TODO: save handles when switching simulation mode
        if(document.getElementById("sm-debug-selector").children.length) {
            document.getElementById("sm-debug-selector").children[0].remove();
        }

        this.modeSelect = createSelect();
        this.modeSelect.parent("sm-debug-selector");

        this.modeSelect.option(Simulation.Mode.Empty.staticName);

        for(let i = 0; i < Simulation.Mode.ModeList.length; i++) {
            const name = Simulation.Mode.ModeList[i].staticName;
            if(!name.startsWith("Debug")) {
                continue;
            }
            if(name == "Debug") {
                continue;
            }
            this.modeSelect.option(Simulation.Mode.ModeList[i].staticName);
        }
        this.modeSelect.selected(this.activeMode.name);
    }

    /**
     * Sets the active debug mode.
     *
     * @param newMode {Simulation.Mode.ModeType} - The new simulation mode
     */
    setActiveMode(newMode) {
        // TODO: add param type check
        this.activeMode.hideUI();
        this.activeMode = newMode;
        Simulation.pauseFlagUnset();
    }

    /**
     * Sets the active mode by name. If invalid the mode is changed to the empty
     * mode.
     *
     * @param modeName {string} - The name of the new mode
     */
    setModeByName(modeName) {
        for(let i = 0; i < Simulation.Mode.ModeList.length; i++) {
            // TODO: figure out how to do this without for loop
            if(Simulation.Mode.ModeList[i].staticName == modeName) {
                this.setActiveMode(new Simulation.Mode.ModeList[i]());
                return;
            }
        }

        console.warn("Can't set Simulation Debug mode to: ", modeName);
        this.setActiveMode(new Simulation.Mode.Empty());
    }

    /**
     * Checks if this.UIPanel is defined and hides the panel if it is.  This is
     * done by setting the visibility to "hidden" and the display style to
     * "none".
     */
    hideUI() {
        super.hideUI();
        this.activeMode.hideUI();
    }


    /**
     * Polls the moving tile mode specific UI elements
     */
    UIPoll() {
        const modeName = this.modeSelect.selected();

        if(this.activeMode.name != modeName) {
            console.log("Simulation Mode Debug uiPoll: debug mode selector has changed to new debug mode: ",
                    modeName);
            this.setModeByName(modeName);
        }

        this.activeMode.UIPoll();
    }

    /**
     * Resets the currently active debug mode.
     */
    reset() {
        this.setModeByName(this.activeMode.name);
    }

    /**
     * Update function that updates the state of the simulation
     */
    update() {
        this.activeMode.update();
    }
};

Simulation.Mode.ModeList.push(Simulation.Mode.Debug);
