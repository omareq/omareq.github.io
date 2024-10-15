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

/**
 * Initialise the simulation mode selector
 */
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

/**
 * Update the simulation mode selector. If this is called and there is a new
 * Simulation ModeType in the modeList then the new mode is added to the
 * selector
 */
UI.updateSimulationModeSelector = function() {
    if(UI.modeSelectorLength != Simulation.Mode.ModeList.length) {
        UI.initSimulationModeSelector();
    }

    if(Simulation.Mode.activeMode.name != UI.modeSelect.selected()) {
        console.debug("Changing Mode: ", UI.modeSelect.selected());
        Simulation.Mode.setModeByName(UI.modeSelect.selected());
    }
};

/**
 * Initialise the camera mode selector
 */
UI.initCameraModeSelector = function() {
    const keys = Object.keys(Simulation.CameraControl.Modes);
    UI.cameraModeSelectLength = keys.length;
    UI.cameraModeSelect = createSelect();
    UI.cameraModeSelect.parent("camera-mode-selector");

    for(let i = 0; i < keys.length; i++) {
        UI.cameraModeSelect.option(keys[i]);
    }
    UI.cameraModeSelect.selected("Default2D");
};

/**
 * Update the camera mode selector.
 */
UI.updateCameraModeSelector = function() {
    if(Simulation.activeCameraMode.name != UI.cameraModeSelect.selected()) {
        console.debug("Changing Camera Mode: ", UI.cameraModeSelect.selected());
        Simulation.activeCameraMode = new Simulation.CameraControl.Modes[UI.cameraModeSelect.selected()]();
    }
};

/**
 * Create a UI button in the control panel
 *
 * @param label {String} - The label displayed on the buttond
 * @param parentDIv {string} - The id of the parent div
 * @param callback {function} - The callback function for when the button is pressed
 */
UI.createButton = function(label, parentDiv, callback) {
    let button = document.createElement('button');
    button.innerText = label;

    button.addEventListener('click', () => {
        callback();
    });

    document.getElementById(parentDiv).appendChild(button);
    return button;
};


/**
 * Initialise the pause button
 */
UI.initPauseButton = function() {
    UI.testButton = UI.createButton("Pause", "pause-button", Simulation.pauseFlagToggle);
};

/**
 * Initialise the reset button
 */
UI.initResetButton = function() {
    UI.testButton = UI.createButton("Reset", "reset-button", Simulation.reset);
};

/**
 * Load a room from a JSON file into the current simulation mode room member
 * variable
 *
 * @returns {boolean} Success value
 */
UI.loadRoomFromJSON = async function() {
    Simulation.pauseFlagSet();
    const [fileHandle] = await UI.getFile();

    if(fileHandle == undefined) {
        Simulation.pauseFlagUnset();
        return false;
    }

    // add query permissions
    const filePermissions = await fileHandle.queryPermission({mode: "read"});
    if(!filePermissions === "granted") {
        alert("File Read Permissions Are Denied");
        return false;
    }

    //  get data
    const fileData = await fileHandle.getFile();
    const fileText = await fileData.text();
    let fileJSON;

    try {
        fileJSON = await JSON.parse(fileText);
    } catch (e) {
        alert("The input file " + fileHandle.name + " is not a valid json file");
        return false;
    }

    console.log(fileJSON);

    const roomCheck = World.Room.validateJSON(fileJSON);
    if(!roomCheck.valid) {
        alert("Input file is invalid: " + roomCheck.error);
        return false;
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
    return true;
};

/**
 * Uses the file system to get a file handle for a json file.
 *
 * @returns {FileSystemFileHandle} A Promise whose fulfilment handler receives
 * an Array of FileSystemFileHandle objects. Undefined array elements if error
 * occurs
 */
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

    try {
        const fileHandle = await window.showOpenFilePicker(pickerOpts);
        console.log("fileHandle: " + fileHandle);
        return fileHandle;
    } catch (error) {
        console.warn("FileIO Error: ", error);
        return [undefined];
    }
};


/**
 * UI setup all UI elements
 */
UI.setup = function() {
    // TODO: Fix buttons
    // Buttons don't work with p5.js1.9.2
    // https://github.com/processing/p5.js/issues/3163
    // https://github.com/processing/p5.js/issues/3141
    //
    // Need 1.9.2 for WEBGL Plane and Textures to work correctly
    // Might need to implement buttons manually without p5.js
    console.debug("UI.setup: Start");
    UI.canvasLoadingTextHide();
    UI.controlPanelSetup();
    UI.initSimulationModeSelector();
    UI.initCameraModeSelector();
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
    UI.updateCameraModeSelector();
    Simulation.Mode.activeMode.UIPoll();
    if(UI.logUIPollStartAndStop) {
        console.debug("UI.poll: End");
    }
};