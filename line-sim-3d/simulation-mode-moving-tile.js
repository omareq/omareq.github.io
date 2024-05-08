/*******************************************************************************
 *
 *  @file simulation-mode-moving-tile.js Implementation of moving tile mode.
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
 * Class Simulation.Mode.DebugMovingTile is a simulation mode that has a tile
 * moving back and forth along the canvas to test that the light sensors can
 * correctly read the value in a global coordinate frame.
 *
 * @see Simulation.Mode.ModeType
 * @see World.Tile
 */
Simulation.Mode.DebugMovingTile = class extends Simulation.Mode.ModeType {
    static staticName = "DebugMovingTile";

    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();
        this.name = "DebugMovingTile";
        this.uiDivID = "simulation-mode-moving-tile";
        this.setupUI();

        World.setGridSize(width / 5);
        this.tile = World.Tiles.cross.copy();
        this.sensorRadius = 0.5;
        this.sensor = new Robot.DigitalLightSensor(
            this.sensorRadius * World.lineThickness,
            createVector(0,0));

        this.tileX = 0;
        this.tileXInc = 1;
        this.tileY = height / 2 - World.gridSize / 2;
        this.tileYInc = 0;

        this.addNewUIElements();
    }

    /**
     * Adds the UI elements that control the moving mode simulation
     * mode.  This code currently has an inefficiency that deletes DOM elements
     * for the inputs if they already exist.  It would be preferable if a handle
     * could be saved and reused for these elements.
     */
    addNewUIElements() {
        // TODO: save handles when switching simulation mode
        if(document.getElementById("sm-mt-sensor-radius-slider").children.length) {
            document.getElementById("sm-mt-sensor-radius-slider").children[0].remove();
            document.getElementById("sm-mt-sensor-radius-val").children[0].remove();

            document.getElementById("sm-mt-tile-x-speed-slider").children[0].remove();
            document.getElementById("sm-mt-tile-x-speed-val").children[0].remove();

            document.getElementById("sm-mt-tile-y-speed-slider").children[0].remove();
            document.getElementById("sm-mt-tile-y-speed-val").children[0].remove();
        }

        // sensor radius
        this.sensorRadiusSlider = createSlider(0.05, 1, this.sensorRadius, 0.05);
        this.sensorRadiusSlider.parent("sm-mt-sensor-radius-slider");

        this.sensorRadiusDisplay = createP();
        this.sensorRadiusDisplay.parent("sm-mt-sensor-radius-val");
        this.sensorRadiusDisplay.elt.innerText = "Radius / Line Thickness: " + str(this.sensorRadius);

        // tile x speed
        this.tileXSpeedSlider = createSlider(0, 5, this.tileXInc, 0.25);
        this.tileXSpeedSlider.parent("sm-mt-tile-x-speed-slider");

        this.tileXSpeedDisplay = createP();
        this.tileXSpeedDisplay.parent("sm-mt-tile-x-speed-val");
        this.tileXSpeedDisplay.elt.innerText = "X Speed (px): " + str(this.tileXInc);

        // tile y speed
        this.tileYSpeedSlider = createSlider(0, 5, this.tileYInc, 0.25);
        this.tileYSpeedSlider.parent("sm-mt-tile-y-speed-slider");

        this.tileYSpeedDisplay = createP();
        this.tileYSpeedDisplay.parent("sm-mt-tile-y-speed-val");
        this.tileYSpeedDisplay.elt.innerText = "Y Speed (px): " + str(this.tileYInc);

    }

    /**
     * Polls the moving tile mode specific UI elements
     */
    UIPoll() {

        let sliderVal = this.sensorRadiusSlider.value();
        if(sliderVal != this.sensorRadius) {
            console.debug("Simulation Mode Moving Tile Check uiPoll: sensor radius Slider value has changed to: ",
                sliderVal);
            this.sensorRadius = sliderVal;
            this.sensorRadiusDisplay.elt.innerText = "Radius / Line Thickness: " + str(sliderVal);
            this.sensor.setRadius(this.sensorRadius * World.lineThickness);
        }

        sliderVal = this.tileXSpeedSlider.value();
        if(abs(sliderVal) != abs(this.tileXInc)) {
            console.debug("Simulation Mode Moving Tile Check uiPoll: tile x speed Slider value has changed to: ",
                sliderVal);

            this.tileXInc = sliderVal;
            if(this.tileXInc != 0) {
                this.tileXInc *= this.tileXInc / abs(this.tileXInc);
            }

            this.tileXSpeedDisplay.elt.innerText = "X Speed (px): " + str(sliderVal);
        }

        sliderVal = this.tileYSpeedSlider.value();
        if(abs(sliderVal) != abs(this.tileYInc)) {
            console.debug("Simulation Mode Moving Tile Check uiPoll: tile y speed Slider value has changed to: ",
                sliderVal);
            this.tileYInc = sliderVal;
            if(this.tileYInc != 0) {
                this.tileYInc *= this.tileYInc / abs(this.tileYInc);
            }
            this.tileYSpeedDisplay.elt.innerText = "Y Speed (px): " + str(sliderVal);
        }

    }

    /**
     * Update function that updates the state of the simulation
     */
    update() {
        if(this.tileX < 0) {
            this.tileXInc = abs(this.tileXInc);
        } else if(this.tileX + World.gridSize > width) {
            this.tileXInc = - abs(this.tileXInc);
        }
        this.tileX += this.tileXInc;


        if(this.tileY < 0) {
            this.tileYInc = abs(this.tileYInc);
        } else if(this.tileY + World.gridSize > height) {
            this.tileYInc = - abs(this.tileYInc);
        }
        this.tileY += this.tileYInc;

        this.tile.setPos(createVector(this.tileX, this.tileY));
        this.tile.draw();

        this.sensor.setPos(createVector(mouseX, mouseY));

        const brightness = this.sensor.read(this.tile);

        if(brightness < 1) {
            console.log(brightness);
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

Simulation.Mode.ModeList.push(Simulation.Mode.DebugMovingTile);
