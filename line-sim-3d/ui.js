/*******************************************************************************
 *
 *  @file ui.js A file with all the the ui handlers
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 15-March-2024
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
 * UI Namespace Object
 */
var UI = UI || {};


/**
 * UI control panel setup function that assigns the handler and makes the
 * control panel visible
 */
UI.controlPanelSetup = function() {
    UI.controlPanel = document.getElementById("control-panel");
    UI.controlPanelShow();
};

/**
 * UI control panel show function makes the control panel visible
 */
UI.controlPanelShow = function() {
    UI.controlPanel.style.visibility = "visible";
};

/**
 * UI control panel hide function makes the control panel hidden
 */
UI.controlPanelHide = function() {
    UI.controlPanel.style.visibility = "hidden";
};

/**
 * UI canvas loading text hide function
 */
UI.canvasLoadingTextHide = function() {
    UI.canvasLoadingText = document.getElementById("canvas-loading-text");
    UI.canvasLoadingText.style.visibility = "hidden";
    UI.canvasLoadingText.style.display = "none";
};

UI.initSimulationModeSelector = function() {
    UI.modeSelectorLength = Simulation.Mode.ModeList.length;
    UI.modeSelect = createSelect();
    UI.modeSelect.parent("simulation-mode-selector");
    for(let i = 0; i < UI.modeSelectorLength; i++) {
        UI.modeSelect.option(Simulation.Mode.ModeList[i].staticName);
    }
    UI.modeSelect.selected(Simulation.Mode.activeMode.name);
};

UI.updateSimulationModeSelector = function() {
    if(UI.modeSelectorLength != Simulation.Mode.ModeList.length) {
        UI.initSimulationModeSelector();
    }

    if(Simulation.Mode.activeMode.name != UI.modeSelect.selected()) {
        console.debug("Changing Mode: ", UI.modeSelect.selected());
        Simulation.Mode.setModeByName(UI.modeSelect.selected());
    }
};

UI.initPauseButton = function() {
    UI.pauseButton = createButton("Pause", "value");
    UI.pauseButton.parent("pause-button");
    UI.pauseButton.mousePressed(Simulation.pauseFlagToggle);
};

UI.initResetButton = function() {
    UI.resetButton = createButton("Reset", "value");
    UI.resetButton.parent("reset-button");
    UI.resetButton.mousePressed(Simulation.reset);
};


/**
 * UI setup all UI elements
 */
UI.setup = function() {
    console.debug("UI.setup: Start");
    UI.canvasLoadingTextHide();
    UI.controlPanelSetup();
    UI.initSimulationModeSelector();
    UI.initPauseButton();
    UI.initResetButton();
    console.debug("UI.setup: End");
};

/**
 * Poll UI elements that require periodic checks
 */
UI.poll = function() {
    console.debug("UI.poll: Start");
    UI.updateSimulationModeSelector();
    Simulation.Mode.activeMode.UIPoll();
    console.debug("UI.poll: End");
};