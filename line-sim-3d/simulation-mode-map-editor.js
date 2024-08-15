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

        this.commandStack = [];
        this.commandStackPointer = -1;
        this.batchNum = 0;
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

            document.getElementById("sm-me-undo-button").children[0].remove();
            document.getElementById("sm-me-redo-button").children[0].remove();

            document.getElementById("sm-me-clear-room-button").children[0].remove();
            document.getElementById("sm-me-fill-room-button").children[0].remove();

            document.getElementById("sm-me-save-room-json-button").children[0].remove();
            document.getElementById("sm-me-load-room-json-button").children[0].remove();
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

        this.undoButton = createButton("Undo", "value");
        this.undoButton.parent("sm-me-undo-button");
        this.undoButton.mousePressed(Simulation.Mode.MapEditor.undo);

        this.redoButton = createButton("Redo", "value");
        this.redoButton.parent("sm-me-redo-button");
        this.redoButton.mousePressed(Simulation.Mode.MapEditor.redo);

        this.clearButton = createButton("Clear", "value");
        this.clearButton.parent("sm-me-clear-room-button");
        this.clearButton.mousePressed(Simulation.Mode.MapEditor.clearRoom);

        this.fillButton = createButton("Fill", "value");
        this.fillButton.parent("sm-me-fill-room-button");
        this.fillButton.mousePressed(Simulation.Mode.MapEditor.fillRoom);


        this.saveButton = createButton("Save Room", "value");
        this.saveButton.parent("sm-me-save-room-json-button");
        this.saveButton.mousePressed(Simulation.Mode.MapEditor.saveRoomAsJSON);

        this.loadButton = createButton("Upload Room", "value");
        this.loadButton.parent("sm-me-load-room-json-button");
        this.loadButton.mousePressed(UI.loadRoomFromJSON);
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

        this.tile = World.Tiles[this.tileSelect.selected()].copy();
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

        this.commandStack = [];
        this.commandStackPointer = -1;

    }

    resetSensor() {
        this.sensorRadius = 0.5;
        this.sensor = new Robot.AnalogLightSensor(
            this.sensorRadius * World.lineThickness,
            createVector(0,0));
    }

    pushToCommandStack(command) {
        this.commandStack.push(command);
        if(this.commandStackPointer != this.commandStack.length - 2) {
            const numElementsToDelete = this.commandStack.length - 2
                - this.commandStackPointer;

            this.commandStack.splice(this.commandStackPointer+1,
                numElementsToDelete);
        }
        this.commandStackPointer = this.commandStack.length - 1;
    }

    undo() {
        if(this.commandStackPointer < 0) {
            return;
        }

        if(this.commandStack[this.commandStackPointer].batchNum < 0) {
            this.commandStack[this.commandStackPointer].undo();
            this.commandStackPointer--;
            return;
        }

        this.undoBatch();
    }

    undoBatch() {
        const startBatchNum = this.commandStack[this.commandStackPointer].batchNum;

        while(this.commandStack[this.commandStackPointer].batchNum == startBatchNum) {
            this.commandStack[this.commandStackPointer].undo();
            this.commandStackPointer--;

            if(this.commandStackPointer < 0) {
                return;
            }
        }
    }

    redo() {
        if(this.commandStackPointer + 1 > this.commandStack.length - 1 ) {
            return;
        }
        this.commandStackPointer++;
        if(this.commandStack[this.commandStackPointer].batchNum < 0) {
            this.commandStack[this.commandStackPointer].redo();
            return;
        }

        this.redoBatch();
    }

    redoBatch() {
        const startBatchNum = this.commandStack[this.commandStackPointer].batchNum;

        while(this.commandStack[this.commandStackPointer].batchNum == startBatchNum) {
            this.commandStack[this.commandStackPointer].redo();
            if(this.commandStackPointer + 1 > this.commandStack.length - 1) {
                return;
            }
            this.commandStackPointer++;
        }
        this.commandStackPointer--;

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

            if(this.tile && this.currentTileName) {
                this.tile = World.Tiles[this.currentTileName].copy();
            }
        }

        sliderVal = this.roomYSlider.value();
        if(sliderVal != this.numTilesY) {
            console.debug("Simulation Mode Map Editor Check uiPoll: sensor room y slider value has changed to: ",
                sliderVal);
            this.numTilesY = sliderVal;
            this.roomYDisplay.elt.innerText = "Room Size X: " + str(this.numTilesY);
            this.resetRoom();
            if(this.tile && this.currentTileName) {
                this.tile = World.Tiles[this.currentTileName].copy();
            }
        }

        if(this.currentTileName != this.tileSelect.selected()) {
            console.log("Simulation Mode Map Editor Check uiPoll: tile selector has changed to new tile: ",
                this.tileSelect.selected());
            this.tile = World.Tiles[this.tileSelect.selected()].copy();
            this.currentTileName = this.tileSelect.selected();
        }

        if(mouseIsPressed) {
            if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
                return;
            }

            const mousePos = createVector(mouseX, mouseY);
            this.changeTileAtPos(mousePos, this.tile);
        }
    }

    clearRoom() {
        this.fillRoom(World.Tiles["blankLine"].copy());
    }

    fillRoom(tile) {
        let fillTile = tile;
        if(tile == undefined) {
            fillTile = this.tile.copy();
        }
        const batchNum = this.batchNum++;

        for(let x = 0; x < this.room.xNumTiles; x++) {
            for(let y = 0; y < this.room.yNumTiles; y++) {
                const pos = createVector(x * World.gridSize + this.room.pos.x +1,
                    y * World.gridSize + this.room.pos.y + 1);
                this.changeTileAtPos(pos, fillTile.copy(), batchNum);
            }
        }
    }

    changeTileAtPos(pos, newTile, batchNum) {
        const tileAtPos = this.room.getTileAtPos(pos);

        if(tileAtPos == undefined) {
            return;
        }

        if(tileAtPos.getName() == newTile.getName()) {
            return;
        }

        const command = new Simulation.Mode.MapEditor.EditCommand(
            this.room, pos, tileAtPos, newTile, batchNum);

        this.pushToCommandStack(command);

        this.room.setTileAtPos(pos, newTile);
    }

    saveRoomAsJSON() {
        const roomData = JSON.parse(this.room.getJSON());
        const stripWhitespace = false;
        saveJSON(roomData, roomData.name + ".json", stripWhitespace);
    }

    /**
     * Update function that updates the state of the simulation
     */
    update() {
        background(225);
        this.room.draw();

        const mousePos = createVector(mouseX, mouseY);
        this.sensor.setPos(mousePos);

        const tileUnderSensor = this.room.getTileAtPos(mousePos);
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

Simulation.Mode.ModeList.push(Simulation.Mode.MapEditor);

Simulation.Mode.MapEditor.EditCommand = class {
    constructor(room, mapPos, prevTile, nextTile, batchNum=-1) {
        this.room = room;
        this.mapPos = mapPos.copy();
        this.prevTile = prevTile.copy();
        this.nextTile = nextTile.copy();

        this.batchNum = batchNum;
    }

    undo() {
        this.room.setTileAtPos(this.mapPos, this.prevTile);
    }

    redo() {
        this.room.setTileAtPos(this.mapPos, this.nextTile);
    }
};

Simulation.Mode.MapEditor.undo = function() {
    Simulation.Mode.activeMode.undo();
};

Simulation.Mode.MapEditor.redo = function() {
    Simulation.Mode.activeMode.redo();
};

Simulation.Mode.MapEditor.clearRoom = function() {
    Simulation.Mode.activeMode.clearRoom();
};

Simulation.Mode.MapEditor.fillRoom = function() {
    Simulation.Mode.activeMode.fillRoom();
};

Simulation.Mode.MapEditor.saveRoomAsJSON = function() {
    Simulation.Mode.activeMode.saveRoomAsJSON();
};
