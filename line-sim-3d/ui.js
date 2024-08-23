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
    UI.controlPanel.style.display = "inline";
};

/**
 * UI control panel hide function makes the control panel hidden
 */
UI.controlPanelHide = function() {
    UI.controlPanel.style.visibility = "hidden";
    UI.controlPanel.style.display = "none";
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
    UI.modeSelect.option("Debug");
    for(let i = 0; i < UI.modeSelectorLength; i++) {
        const name = Simulation.Mode.ModeList[i].staticName;
        if(name.startsWith("Debug")) {
            continue;
        }
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

UI.loadRoomFromJSON = async function() {
    Simulation.pauseFlagSet();
    const [fileHandle] = await UI.getFile();
    g_fileHandle = fileHandle; // For Debugging

    // add query permissions
    const filePermissions = await fileHandle.queryPermission({mode: "read"});
    if(!filePermissions === "granted") {
        alert("File Read Permissions Are Denied");
        return;
    }

    //  get data
    const fileData = await fileHandle.getFile();
    const fileText = await fileData.text();
    let fileJSON;

    try {
        fileJSON = await JSON.parse(fileText);
    } catch (e) {
        alert("The input file " + fileHandle.name + " is not a valid json file");
        return;
    }

    console.log(fileJSON);

    const roomCheck = World.Room.validateJSON(fileJSON);
    if(!roomCheck.valid) {
        alert("Input file is invalid: " + roomCheck.error);
        return;
    }

    const tilesRatio = fileJSON.xNumTiles / fileJSON.yNumTiles;
    const pixelsRatio = width / height;

    let gridSize = -1;
    if(tilesRatio > pixelsRatio) {
        gridSize = width / fileJSON.xNumTiles;
    } else {
        gridSize = height / fileJSON.yNumTiles;
    }

    World.setGridSize(gridSize);

    const xOffsetRoom = 0.5 * (width - (fileJSON.xNumTiles * World.gridSize));
    const roomPos = createVector(xOffsetRoom, 0);
    let newRoom = new World.Room(fileJSON.xNumTiles, fileJSON.yNumTiles);
    newRoom.setFromJSON(fileJSON);
    newRoom.setGlobalPos(roomPos);
    Simulation.Mode.activeMode.room = newRoom;

    Simulation.pauseFlagUnset();
    return;
};

var g_fileHandle;// = fileHandle; // For Debugging

UI.getFile = async function() {
    const pickerOpts = {
      types: [
      {
          description: "JSON File",
          accept: {
            "application/json": [".json"],
        },
    },
    ],
      excludeAcceptAllOption: true,
      multiple: false,
  };

    const fileHandle = await window.showOpenFilePicker(pickerOpts);
    console.log("fileHandle: " + fileHandle);
    return fileHandle;
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
    UI.logUIPollStartAndStop = false;
};

/**
 * Poll UI elements that require periodic checks
 */
UI.poll = function() {
    if(UI.logUIPollStartAndStop) {
        console.debug("UI.poll: Start");
    }
    UI.updateSimulationModeSelector();
    Simulation.Mode.activeMode.UIPoll();
    if(UI.logUIPollStartAndStop) {
        console.debug("UI.poll: End");
    }
};