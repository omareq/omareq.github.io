/*******************************************************************************
 *
 *  @file ui.js A file with all the the ui handlers
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 27-December-2023
 *  @link https://omareq.github.io/maze-sim-3d/
 *  @link https://omareq.github.io/maze-sim-3d/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2022 Omar Essilfie-Quaye
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
let controlPanel;

/**
* Enumeration of the different algorithm types
*
* @enum {String}
*/
const algorithms = Object.freeze({
  LEFT_HAND_RULE: "Left Hand Rule",
  RIGHT_HAND_RULE: "Right Hand Rule",
  HYBRID_4: "Hybrid 4",
  HYBRID_5: "Hybrid 5"
});

/**
*   Pointer to select field that selects the executing algorithm
*
*   @type {p5.Element}
*/
let selectAlgorithm;

/**
*   Variable that stores the current algorithm tha is being executed
*
*   @type {Enum<String>}
*/
let algorithm = algorithms.HYBRID_5;

let mapXsizeSlider;
let mapXSizeDisplay;
let mapYSizeSlider;
let mapYSizeDisplay;
let maxMapSize = 25;
let mapSeedInput;
let mapSeedDisplay;
let mapRandomSeed;

let cameraZoomSlider;
let cameraZoomDisplay;
let cameraPrevButton;
let cameraNextButton;
let cameraPosDisplay;

let resetButton;
let endSimulationFlag = false;
let confirmEndOfSimulationFlag = true;

function algorithmSelectorSetup() {
    selectAlgorithm = createSelect();
    selectAlgorithm.parent("algorithm-selector");
    selectAlgorithm.option(algorithms.LEFT_HAND_RULE);
    selectAlgorithm.option(algorithms.RIGHT_HAND_RULE);
    selectAlgorithm.option(algorithms.HYBRID_4);
    selectAlgorithm.option(algorithms.HYBRID_5);
    selectAlgorithm.selected(algorithm);
    selectAlgorithm.changed(algorithmSelectEvent);
}

/**
*   Changes the algorithm depending on what the value of the selectAlgorithm
*   element is
*/
function algorithmSelectEvent() {
    let selectVal = selectAlgorithm.value();
    if(selectVal != algorithm) {
        algorithm = selectVal;
    }

    if(algorithm == algorithms.LEFT_HAND_RULE) {
        // show left hand rule options
    } else {
        // hide left hand rule options
    }

    if(algorithm == algorithms.RIGHT_HAND_RULE) {
        // show right hand rule options
    } else {
        // hide right hand rule options
    }

    if(algorithm == algorithms.HYBRID_4) {
        // show monotone chain options
    } else {
        // hide monotone chain options
    }

    if(algorithm == algorithms.HYBRID_5) {
        // show monotone chain options
    } else {
        // hide monotone chain options
    }

    reset();
}

function uiCreateButton(label, parentDiv, callback) {
    let button = document.createElement('button');
    button.innerText = label;

    button.addEventListener('click', () => {
        callback();
    });

    document.getElementById(parentDiv).appendChild(button);
    return button;
}

function controlPanelSetup() {
    controlPanel = document.getElementById("control-panel");
    controlPanelShow();
}

function controlPanelShow() {
    controlPanel.style.visibility = "visible";
}

function controlPanelHide() {
    controlPanel.style.visibility = "hidden";
}

function cameraControlsSetup() {
    const viewPosKey = searchCamPositions(viewPos);
    cameraPosDisplay = createP(viewPosKey);
    cameraPosDisplay.parent("camera-view-display");
    cameraPosDisplay.elt.innerText = "View: " + str(viewPosKey);

    uiCreateButton("Prev View", "camera-prev-button", cameraPreviousView);
    uiCreateButton("Next View", "camera-next-button", cameraNextView);

    cameraZoomSlider = createSlider(1, 10, zoom, 1);
    cameraZoomSlider.parent("camera-zoom-slider");

    cameraZoomDisplay = createP(zoom);
    cameraZoomDisplay.parent("camera-zoom-val");
    cameraZoomDisplay.elt.innerText = "Zoom: " + str(zoom);

    speedUpSlider = createSlider(1, 10, speedUp, 1);
    speedUpSlider.parent("speedup-slider");

    speedUpDisplay = createP(speedUp);
    speedUpDisplay.parent("speedup-val");
    speedUpDisplay.elt.innerText = "Speed Up: x" + str(speedUp);
}

function resetButtonSetup() {
    uiCreateButton("Reset", "reset-button", reset);
}

async function reset() {
    endSimulationFlag = true;

    mapRandomSeed = mapSeedInput.value();

    if(mapRandomSeed == '') {
        mapRandomSeed = undefined;
        mapSeedDisplay.elt.innerText = "Random Seed: ";
    }

    if(mapRandomSeed != undefined) {
        console.debug("RESET: use random seed: ", mapRandomSeed);
        randomSeed(mapRandomSeed);
        mapSeedDisplay.elt.innerText = "Random Seed: " + str(mapRandomSeed);
    }

    arena = new Room(mapSizeX, mapSizeY, gridSize);
    arena.randomise(6);

    robot = new Robot(createVector(0,0), gridSize);
    robot.setMaze(arena);

    camera(gridSize * arena.mapX * 0.5, gridSize * arena.mapY * 0.5,
       250, gridSize * arena.mapX * 0.5, gridSize * arena.mapY * 0.5,
       0, 0, 1, 0);
    cameraUpdate(robot, gridSize);

    while(!confirmEndOfSimulationFlag) {
        await delay(10);
    }
    endSimulationFlag = false;
    confirmEndOfSimulationFlag = false;
    runSimulation();
}

function mapSizeSliderSetup() {
    mapXSizeSlider = createSlider(1, maxMapSize, mapSizeX, 1);
    mapXSizeSlider.parent("map-x-slider");

    mapXSizeDisplay = createP(mapSizeX);
    mapXSizeDisplay.parent("map-x-val");
    mapXSizeDisplay.elt.innerText = "Map Size X: " + str(mapSizeX);

    mapYSizeSlider = createSlider(1, maxMapSize, mapSizeY, 1);
    mapYSizeSlider.parent("map-y-slider");

    mapYSizeDisplay = createP(mapSizeY);
    mapYSizeDisplay.parent("map-y-val");
    mapYSizeDisplay.elt.innerText = "Map Size Y: " + str(mapSizeY);
}

function mapSeedInputSetup() {
    mapSeedInput = createInput("Random Seed", "Number");
    mapSeedInput.parent("map-seed-input");

    let a = document.getElementById("map-seed-input");
    let b = a.getElementsByTagName("input")[0];
    b.style.width = "6.5em";

    mapSeedDisplay = createP(mapRandomSeed);
    mapSeedDisplay.parent("map-seed-val");
    mapSeedDisplay.elt.innerText = "Random Seed: " + str(mapRandomSeed);
}

function uiSetup() {
    algorithmSelectorSetup();
    controlPanelSetup();
    cameraControlsSetup();
    mapSizeSliderSetup();
    mapSeedInputSetup();
    resetButtonSetup();
}

function uiPoll() {
    let sliderVal = mapXSizeSlider.value();
    if(sliderVal != mapSizeX) {
        console.debug("uiPoll: map Size X Slider value has changed to: ",
            sliderVal);
        mapSizeX = sliderVal;
        mapXSizeDisplay.elt.innerText = "Map Size X: " + str(mapSizeX);
        reset();
    }

    sliderVal = mapYSizeSlider.value();
    if(sliderVal != mapSizeY) {
        console.debug("uiPoll: map Size Y Slider value has changed to: ",
            sliderVal);
        mapSizeY = sliderVal;
        mapYSizeDisplay.elt.innerText = "Map Size Y: " + str(mapSizeY);
        reset();
    }

    sliderVal = cameraZoomSlider.value();
    if(sliderVal != zoom) {
        console.debug("uiPoll: camera Zoom Slider value has changed to: ",
            sliderVal);
        zoom = sliderVal;
        cameraZoomDisplay.elt.innerText = "Zoom: " + str(zoom);
    }

    sliderVal = speedUpSlider.value();
    if(sliderVal != speedUp) {
        console.debug("uiPoll: speed up Slider value has changed to: ",
            sliderVal);
        speedUp = sliderVal;
        speedUpDisplay.elt.innerText = "Speed Up: x" + str(speedUp);
    }
}