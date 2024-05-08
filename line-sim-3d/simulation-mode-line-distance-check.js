/*******************************************************************************
 *
 *  @file simulation-mode-line-distance-check.js Test the line inter point
 *  distance functionality
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 08-May-2024
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
 * Class Simulation.Mode.DebugLineDistanceCheck is a simulation mode that checks how
 * well an analog light sensor can read the simulated line.  This is mostly to
 * see how far apart the line points need to be to produce a realistic effect.
 *
 * @see Simulation.Mode.ModeType
 * @see Robot.AnalogLightSensor
 * @see World.Line
 */
Simulation.Mode.DebugLineDistanceCheck = class extends Simulation.Mode.ModeType {
    static staticName = "DebugLineDistanceCheck";
    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();
        this.name = "DebugLineDistanceCheck";
        this.uiDivID = "simulation-mode-line-distance-check";
        this.setupUI();

        if (width < height) {
            World.setGridSize(0.75 * width);
        } else {
            World.setGridSize(0.75 * height);
        }

        this.sensorRadius = 0.3;
        this.sensor = new Robot.AnalogLightSensor(this.sensorRadius,
            createVector(0,0));

        this.addNewUIElements();
        this.tileX = width /2 - World.gridSize / 2;
        this.tileY = height / 2 - World.gridSize / 2;
        this.tile = World.Tiles.verticalLine.copy();
        this.tile.setPos(createVector(this.tileX, this.tileY));

        this.sensorX = width/2 + World.lineThickness/2;
        this.sensorY = this.tileY;
    }

    /**
     * Adds the UI elements that control the line distance check simulation
     * mode.  This code currently has an inefficiency that deletes DOM elements
     * for the inputs if they already exist.  It would be preferable if a handle
     * could be saved and reused for these elements.
     */
    addNewUIElements() {
        // TODO: save handles when switching simulation mode
        if(document.getElementById("sm-ldc-sensor-radius-slider").children.length) {
            document.getElementById("sm-ldc-sensor-radius-slider").children[0].remove();
            document.getElementById("sm-ldc-sensor-radius-val").children[0].remove();
        }

        // sensor radius
        this.sensorRadiusSlider = createSlider(0.01, 1, this.sensorRadius, 0.05);
        this.sensorRadiusSlider.parent("sm-ldc-sensor-radius-slider");

        this.sensorRadiusDisplay = createP();
        this.sensorRadiusDisplay.parent("sm-ldc-sensor-radius-val");
        this.sensorRadiusDisplay.elt.innerText = "Radius / Line Thickness: " + str(this.sensorRadius);

    }

    /**
     * Polls the line distance check mode specific UI elements
     */
    UIPoll() {

        let sliderVal = this.sensorRadiusSlider.value();
        if(sliderVal != this.sensorRadius) {
            console.debug("Simulation Mode Line Distance Check uiPoll: sensor radius Slider value has changed to: ",
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

        this.tile.draw();

        this.sensorY++;
        if(this.sensorY > (this.tileY + World.gridSize)) {
            this.sensorY = this.tileY;
        }

        this.sensor.setPos(createVector(this.sensorX, this.sensorY));

        const draw = true;
        const brightness = this.sensor.read(this.tile, draw);

        console.log(
            ", x, ", this.sensorX,
            ", y, ", this.sensorY,
            ", sensor val, ", brightness
            );

        const colorVal = floor(brightness * 255);
        push();
        fill(colorVal);
        strokeWeight(1);
        stroke(127, 0, 30);
        const ellipseSize = 2 * this.sensorRadius * World.lineThickness;
        ellipse(this.sensorX, this.sensorY, ellipseSize, ellipseSize);
        pop();
    }
};

Simulation.Mode.ModeList.push(Simulation.Mode.DebugLineDistanceCheck);
