/*******************************************************************************
 *
 *  @file simulation-mode-static-tile.js Implementation of static tile mode.
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
 * Class Simulation.Mode.DebugStaticTile is a simulation mode that has a single
 * tile in the centre of the canvas.  This was used as a test for different
 * sized light sensors to ensure that they give sensible readings in different
 * conditions.
 *
 * @see Simulation.Mode.ModeType
 * @see World.Tile
 * @see World.Tile.proxy
 * @see Robot.AnalogLightSensor
 */
Simulation.Mode.DebugStaticTile = class extends Simulation.Mode.ModeType {
    static staticName = "DebugStaticTile";

    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();
        this.name = "DebugStaticTile";
        this.uiDivID = "simulation-mode-static-tile";
        this.setupUI();

        if (width < height) {
            World.setGridSize(0.75 * width);
        } else {
            World.setGridSize(0.75 * height);
        }

        this.sensorRadius = 0.5;
        this.sensor = new Robot.AnalogLightSensor(
            this.sensorRadius * World.lineThickness,
            createVector(0,0));

        this.tileX = width /2 - World.gridSize / 2;
        this.tileY = height / 2 - World.gridSize / 2;
        this.tile = World.Tiles.verticalLine.copy();
        this.tile.setPos(createVector(this.tileX, this.tileY));

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
        if(document.getElementById("sm-st-sensor-radius-slider").children.length) {
            document.getElementById("sm-st-sensor-radius-slider").children[0].remove();
            document.getElementById("sm-st-sensor-radius-val").children[0].remove();

            document.getElementById("sm-st-tile-selector").children[0].remove();
        }

        // sensor radius
        this.sensorRadiusSlider = createSlider(0.1, 4, this.sensorRadius, 0.1);
        this.sensorRadiusSlider.parent("sm-st-sensor-radius-slider");

        this.sensorRadiusDisplay = createP();
        this.sensorRadiusDisplay.parent("sm-st-sensor-radius-val");
        this.sensorRadiusDisplay.elt.innerText = "Radius / Line Thickness: " + str(this.sensorRadius);

        this.addTileSelector();
    }

    /**
     * Add the tile selector UI element.  This automatically selects all of the
     * Tile proxies and uses them to populate the selector options.  Therefore,
     * if a new tile is added this will automagically be included in the options
     */
    addTileSelector() {
        const keys = Object.keys(World.Tiles.proxySubject);
        this.tileSelect = createSelect();
        this.tileSelect.parent("sm-st-tile-selector");

        for(let i = 0; i < keys.length; i++) {
            this.tileSelect.option(keys[i]);
        }
        this.tileSelect.selected("verticalLine");
        this.currentTileName = this.tileSelect.selected();
    }

    /**
     * Polls the moving tile mode specific UI elements
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

        if(this.currentTileName != this.tileSelect.selected()) {
            console.log("Simulation Mode Static Tile Check uiPoll: tile selector has changed to new tile: ",
                this.tileSelect.selected())
            this.tile = World.Tiles.proxySubject[this.tileSelect.selected()].copy();
            this.currentTileName = this.tileSelect.selected();
            this.tile.setPos(createVector(this.tileX, this.tileY));
        }
    }

    /**
     * Update function that updates the state of the simulation
     */
    update() {
        this.tile.draw();
        push();
        let i = 0;
        this.tile.getLines().forEach((line) => {
            if(i%3 == 0) {
                stroke(255, 0, 0);
                fill(255, 0, 0);
            } else if(i%3 == 1) {
                stroke(0, 255, 0);
                fill(0, 255, 0);
            } else if(i%3 == 2) {
                stroke(0, 0, 255);
                fill(0, 0, 255);
            }
            i++;

            if(line.linePoints != undefined) {
                line.linePoints.forEach((point) => {
                    ellipse(
                        point.x + this.tile.pos.x,
                        point.y + this.tile.pos.y,
                        0.1 * World.lineThickness,
                        0.1 * World.lineThickness);
                });
            }
        });
        pop();


        this.sensor.setPos(createVector(mouseX, mouseY));

        const brightness = this.sensor.read(this.tile);

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

Simulation.Mode.ModeList.push(Simulation.Mode.DebugStaticTile);
