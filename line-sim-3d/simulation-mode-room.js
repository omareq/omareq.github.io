/*******************************************************************************
 *
 *  @file simulation-mode-room.js Implementation of the room simulation mode.
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 30-March-2024
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
 * Class Simulation.Mode.DebugRoom is a simulation that tests that the room
 * class is working correctly.  This is mostly to test that the drawing
 * functionality is correct and that a single light sensor can read the lines
 * as they appear on the canvas.
 *
 * @see Simulation.Mode.ModeType
 * @see World.Room
 * @see Robot.AnalogLightSensor
 */
Simulation.Mode.DebugRoom = class extends Simulation.Mode.ModeType {
    static staticName = "DebugRoom";
    /**
     * The constructor that sets up the simulation variables
     *
     * @param numTilesX {number} - Positive integer value for the number of
     *  tiles in the x direction
     * @param numTilesY {number} - Positive integer value for the number of
     *  tiles in the y direction
     */
    constructor(numTilesX=4, numTilesY=4) {
        super();
        this.name = "DebugRoom";
        this.uiDivID = "simulation-mode-room";
        this.setupUI();

        let gridSize = -1;
        if(numTilesX > numTilesY) {
            gridSize = width / numTilesX;
        } else {
            gridSize = height / numTilesY;
        }
        gridSize *= 0.9;

        World.setGridSize(gridSize);
        this.sensorRadius = 0.5;
        this.sensor = new Robot.AnalogLightSensor(
            this.sensorRadius * World.lineThickness,
            createVector(0,0));

        this.room = new World.Room(numTilesX, numTilesY, createVector(0, 0));
        this.room.fillRoomWithSnakePattern();

        this.addNewUIElements();
    }

    /**
     * Adds the UI elements that control the debug room mode simulation
     * mode.  This code currently has an inefficiency that deletes DOM elements
     * for the inputs if they already exist.  It would be preferable if a handle
     * could be saved and reused for these elements.
     */
    addNewUIElements() {
        // TODO: save handles when switching simulation mode
        if(document.getElementById("sm-room-sensor-radius-slider").children.length) {
            document.getElementById("sm-room-sensor-radius-slider").children[0].remove();
            document.getElementById("sm-room-sensor-radius-val").children[0].remove();
        }

        // sensor radius
        this.sensorRadiusSlider = createSlider(0.1, 4, this.sensorRadius, 0.1);
        this.sensorRadiusSlider.parent("sm-room-sensor-radius-slider");

        this.sensorRadiusDisplay = createP();
        this.sensorRadiusDisplay.parent("sm-room-sensor-radius-val");
        this.sensorRadiusDisplay.elt.innerText = "Radius / Line Thickness: " + str(this.sensorRadius);

    }

    /**
     * Polls the simulation mode debug room specific UI elements
     */
    UIPoll() {

        let sliderVal = this.sensorRadiusSlider.value();
        if(sliderVal != this.sensorRadius) {
            console.debug("Simulation Mode Static Tile Check uiPoll: sensor radius Slider value has changed to: ",
                sliderVal);
            this.sensorRadius = sliderVal;
            this.sensorRadiusDisplay.elt.innerText = "Radius / Line Thickness: " + str(sliderVal);
            this.sensor.setRadius(this.sensorRadius * World.lineThickness);
        }

    }

    /**
     * Update function that updates the state of the simulation
     */
    update() {

        const mousePos = createVector(mouseX, mouseY);
        this.sensor.setPos(mousePos);
        this.room.draw();

        let tileUnderSensor = this.room.getTileAtPos(mousePos);

        if(tileUnderSensor == undefined) {
            return;
        }

        const brightness = this.sensor.read(tileUnderSensor);

        if(brightness < 1) {
            console.log("Sensor Val: ", brightness);
        }
        const colorVal = floor(brightness * 255);

        push();
        fill(colorVal);
        strokeWeight(1);
        stroke(127, 0, 30);
        const ellipseSize = 2 * this.sensorRadius * World.lineThickness;
        ellipse(mouseX, mouseY, ellipseSize, ellipseSize);
        pop();
    }
};

Simulation.Mode.ModeList.push(Simulation.Mode.DebugRoom);
