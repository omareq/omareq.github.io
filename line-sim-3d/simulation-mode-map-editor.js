/*******************************************************************************
 *
 *  @file simulation-mode-map-editor.js Implementation of map editor.
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
 * @see Simulation.Mode.DebugStaticTile
 * @see World.Tile
 * @see World.Tile.proxy
 */
Simulation.Mode.MapEditor = class extends Simulation.Mode.ModeType {
    static staticName = "MapEditor";

    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();
        this.name = "MapEditor";
        this.uiDivID = "simulation-mode-map-editor";
        this.setupUI();

        this.numTilesX = 5;
        this.numTilesY = 5;
        this.resetRoom();


        this.addNewUIElements();
    }

    /**
     * Adds the UI elements that control the map editor mode simulation
     * mode.  This code currently has an inefficiency that deletes DOM elements
     * for the inputs if they already exist.  It would be preferable if a handle
     * could be saved and reused for these elements.
     */
    addNewUIElements() {
        // TODO: save handles when switching simulation mode
        if(document.getElementById("sm-me-tile-selector").children.length) {
            document.getElementById("sm-me-room-x-slider").children[0].remove();
            document.getElementById("sm-me-room-x-val").children[0].remove();

            document.getElementById("sm-me-room-y-slider").children[0].remove();
            document.getElementById("sm-me-room-y-val").children[0].remove();

            document.getElementById("sm-me-tile-selector").children[0].remove();
        }

        // room x
        this.roomXSlider = createSlider(1, 20, this.numTilesX, 1);
        this.roomXSlider.parent("sm-me-room-x-slider");

        this.roomXDisplay = createP();
        this.roomXDisplay.parent("sm-me-room-x-val");
        this.roomXDisplay.elt.innerText = "Room Size X: " + str(this.numTilesX);

        // room y
        this.roomYSlider = createSlider(1, 20, this.numTilesY, 1);
        this.roomYSlider.parent("sm-me-room-y-slider");

        this.roomYDisplay = createP();
        this.roomYDisplay.parent("sm-me-room-y-val");
        this.roomYDisplay.elt.innerText = "Room Size Y: " + str(this.numTilesY);

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
        this.tileSelect.parent("sm-me-tile-selector");

        for(let i = 0; i < keys.length; i++) {
            this.tileSelect.option(keys[i]);
        }
        this.tileSelect.selected("blankLine");
        this.currentTileName = this.tileSelect.selected();
    }

    resetRoom() {

        const tilesRatio = this.numTilesX / this.numTilesY;
        const pixelsRatio = width / height;

        let gridSize = -1;
        if(tilesRatio > pixelsRatio) {
            gridSize = width / this.numTilesX;
        } else {
            gridSize = height / this.numTilesY;
        }

        World.setGridSize(gridSize);

        const xOffsetRoom = 0.5 * (width - (this.numTilesX * gridSize));
        const roomPos = createVector(xOffsetRoom, 0);
        this.room = new World.Room(this.numTilesX, this.numTilesY, roomPos);

        this.resetSensor();

    }

    resetSensor() {
        this.sensorRadius = 0.5;
        this.sensor = new Robot.AnalogLightSensor(
            this.sensorRadius * World.lineThickness,
            createVector(0,0));
    }

    /**
     * Polls the moving tile mode specific UI elements
     */
    UIPoll() {

        let sliderVal = this.roomXSlider.value();
        if(sliderVal != this.numTilesX) {
            console.debug("Simulation Mode Map Editor Check uiPoll: sensor room x slider value has changed to: ",
                sliderVal);
            this.numTilesX = sliderVal;
            this.roomXDisplay.elt.innerText = "Room Size X: " + str(this.numTilesX);
            this.resetRoom();
        }

        sliderVal = this.roomYSlider.value();
        if(sliderVal != this.numTilesY) {
            console.debug("Simulation Mode Map Editor Check uiPoll: sensor room y slider value has changed to: ",
                sliderVal);
            this.numTilesY = sliderVal;
            this.roomYDisplay.elt.innerText = "Room Size X: " + str(this.numTilesY);
            this.resetRoom();
        }

        if(this.currentTileName != this.tileSelect.selected()) {
            console.log("Simulation Mode Map Editor Check uiPoll: tile selector has changed to new tile: ",
                this.tileSelect.selected());
            this.tile = World.Tiles.proxySubject[this.tileSelect.selected()].copy();
            this.currentTileName = this.tileSelect.selected();
            this.tile.setPos(createVector(this.tileX, this.tileY));
        }
    }

    /**
     * Update function that updates the state of the simulation
     */
    update() {
        background(225);
        this.room.draw();



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

Simulation.Mode.ModeList.push(Simulation.Mode.MapEditor);
