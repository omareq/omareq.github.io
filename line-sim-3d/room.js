/*******************************************************************************
 *
 *  @file room.js A file with the room class
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
 * World Namespace Object
 */
var World = World || {};

/**
 * Class that implements a room of tiles.
 *
 * @see World.Tile
 * @see World.Tile.proxy
 */
World.Room = class {
    /**
     * Constructor for the room class.
     *
     * @param cols {number} - Positive integer showing how many tiles there
     * are in the x direction
     * @param rows {number} - Positive integer showing how many tiles there
     * are in the y direction
     * @param globalPos {p5.Vector} - The global position of the room
     */
    constructor(cols=4, rows=4, globalPos=createVector(0,0)) {
// TODO: Figure out why two negative numbers break the constructor checks
// TODO: Figure out why a string breaks the constructor checks
        if(!(isFinite(cols) && Number.isInteger(cols) && cols > 0)) {
            const err = "cols needs to be a positive integer";
            throw Error(err);
        }

        if(!(isFinite(rows) && Number.isInteger(rows) && rows > 0)) {
            const err = "rows needs to be a positive integer";
            throw Error(err);
        }

        if(!(globalPos instanceof p5.Vector)) {
            const err = "globalPos needs to a p5.Vector";
            throw Error(err);
        }

        console.debug("Room cols, rows: ", cols, rows);

        this.xNumTiles = cols;
        this.yNumTiles = rows;

        this.xWidth = World.gridSize * this.xNumTiles;
        this.yHeight = World.gridSize * this.yNumTiles;

        this.pos = globalPos;

        this.createEmptyRoom();

        // this.fillRoomWithSnakePattern();
        //this.generatePG();
    }

    /**
     * creates a 2d grid of World.Tile.blankLine.
     */
    createEmptyRoom() {
        this.grid = [];
        const blankTile = World.Tiles.blankLine.copy();
        for(let x = 0; x < this.xNumTiles; x++) {
            let emptyCol= [];
            for(let y = 0; y < this.yNumTiles; y++) {
                let currentTile = blankTile.copy();
                const currentPos = this.getPosOfGrid(x, y);
                currentTile.setPos(currentPos);
                emptyCol.push(currentTile);
            }
            this.grid.push(emptyCol);
        }
        this.img = undefined;
    }

    /**
     * Fills the room with horizontal lines and then adds 90 degree corners to
     * create the back and forth pattern.
     */
    fillRoomWithSnakePattern() {
        this.setAllTiles(World.Tiles.horizontalLine.copy());

        // just stop at horizontal lines if there is one row
        if(this.yNumTiles == 1) {
            return;
        }

        // just stop at vertical lines if there is one column
        if(this.xNumTiles == 1) {
            this.setAllTiles(World.Tiles.verticalLine.copy());
            return;
        }

        // right side down
        let x = this.xNumTiles - 1;
        for(let y = 0; y < this.yNumTiles; y+=2) {
            let currentTile = World.Tiles.cornerDownLeft.copy();
            const currentPos = this.getPosOfGrid(x, y);
            currentTile.setPos(currentPos);
            this.grid[x][y] = currentTile;
        }

        // right side up
        for(let y = 1; y < this.yNumTiles; y+=2) {
            let currentTile = World.Tiles.cornerUpLeft.copy();
            const currentPos = this.getPosOfGrid(x, y);
            currentTile.setPos(currentPos);
            this.grid[x][y] = currentTile;
        }

        x = 0;
        // left side down
        for(let y = 1; y < this.yNumTiles - 1; y+=2) {
            let currentTile = World.Tiles.cornerDownRight.copy();
            const currentPos = this.getPosOfGrid(x, y);
            currentTile.setPos(currentPos);
            this.grid[x][y] = currentTile;
        }

        // left side up
        for(let y = 2; y < this.yNumTiles; y+=2) {
            let currentTile = World.Tiles.cornerUpRight.copy();
            const currentPos = this.getPosOfGrid(x, y);
            currentTile.setPos(currentPos);
            this.grid[x][y] = currentTile;
        }
        this.img=undefined;
    }

    /**
     * Fills the room with horizontal lines and then adds 90 degree corners to
     * create the back and forth pattern that is connected in a loop.
     */
    fillRoomWithLoopPattern() {
        this.setAllTiles(World.Tiles.horizontalLine.copy());

        // just stop at horizontal lines if there is one row
        if(this.yNumTiles == 1) {
            return;
        }

        // just stop at vertical lines if there is one column
        if(this.xNumTiles == 1) {
            this.setAllTiles(World.Tiles.verticalLine.copy());
            return;
        }

        // right side down
        let x = this.xNumTiles - 1;
        for(let y = 0; y < this.yNumTiles; y+=2) {
            let currentTile = World.Tiles.cornerDownLeft.copy();
            const currentPos = this.getPosOfGrid(x, y);
            currentTile.setPos(currentPos);
            this.grid[x][y] = currentTile;
        }

        // right side up
        for(let y = 1; y < this.yNumTiles; y+=2) {
            let currentTile = World.Tiles.cornerUpLeft.copy();
            const currentPos = this.getPosOfGrid(x, y);
            currentTile.setPos(currentPos);
            this.grid[x][y] = currentTile;
        }

        x = 1;
        // left side down
        for(let y = 1; y < this.yNumTiles - 1; y+=2) {
            let currentTile = World.Tiles.cornerDownRight.copy();
            const currentPos = this.getPosOfGrid(x, y);
            currentTile.setPos(currentPos);
            this.grid[x][y] = currentTile;
        }

        // left side up
        for(let y = 2; y < this.yNumTiles; y+=2) {
            let currentTile = World.Tiles.cornerUpRight.copy();
            const currentPos = this.getPosOfGrid(x, y);
            currentTile.setPos(currentPos);
            this.grid[x][y] = currentTile;
        }


        // vertical return to start tile
        x = 0;
        for(let y = 1; y < this.yNumTiles - 1; y++) {
            let currentTile = World.Tiles.verticalLine.copy();
            const currentPos = this.getPosOfGrid(x, y);
            currentTile.setPos(currentPos);
            this.grid[x][y] = currentTile;
        }

        // just stop at vertical loop if there is two column
        x = 1;
        if(this.xNumTiles == 2) {
            for(let y = 1; y < this.yNumTiles - 1; y++) {
                let currentTile = World.Tiles.verticalLine.copy();
                const currentPos = this.getPosOfGrid(x, y);
                currentTile.setPos(currentPos);
                this.grid[x][y] = currentTile;
            }
            //bottom right of loop
            let bottomRightTile = World.Tiles.cornerUpLeft.copy();
            let bottomRightPos = this.getPosOfGrid(0, this.yNumTiles-1);
            bottomRightTile.setPos(bottomRightPos);
            this.grid[1][this.yNumTiles-1] = bottomRightTile;
        }

        // odd number of rows extend loop down one to complete at the end
        if(this.yNumTiles%2 == 1) {
            console.log("Odd num rows");
            //one above bottom right of loop
            let aboveBottomRightTile = World.Tiles.verticalLine.copy();
            let aboveBottomRightPos = this.getPosOfGrid(this.xNumTiles-1, this.yNumTiles-2);
            aboveBottomRightTile.setPos(aboveBottomRightPos);
            this.grid[this.xNumTiles-1][this.yNumTiles-2] = aboveBottomRightTile;

            let adjacentBottomLeftTile = World.Tiles.horizontalLine.copy();
            let adjacentBottomLeftPos = this.getPosOfGrid(1, this.yNumTiles-1);
            adjacentBottomLeftTile.setPos(adjacentBottomLeftPos);
            this.grid[1][this.yNumTiles-1] = adjacentBottomLeftTile;

            for(let x = 1; x < this.xNumTiles - 1; x++) {
                let currentTile = World.Tiles.blankLine.copy();
                let currentPos = this.getPosOfGrid(x, this.yNumTiles-2);
                currentTile.setPos(currentPos);
                this.grid[x][this.yNumTiles-2] = currentTile;
            }
        }

        // top left tile
        let topLeftTile = World.Tiles.cornerDownRight.copy();
        let topLeftPos = this.getPosOfGrid(0,0);
        topLeftTile.setPos(topLeftPos);
        this.grid[0][0] = topLeftTile;

        // bottom left tile
        let bottomLeftTile = World.Tiles.cornerUpRight.copy();
        let bottomLeftPos = this.getPosOfGrid(0, this.yNumTiles-1);
        bottomLeftTile.setPos(bottomLeftPos);
        this.grid[0][this.yNumTiles-1] = bottomLeftTile;

        //bottom right tile
        let bottomRightTile = World.Tiles.cornerUpLeft.copy();
        let bottomRightPos = this.getPosOfGrid(0, this.yNumTiles-1);
        bottomRightTile.setPos(bottomRightPos);
        this.grid[this.xNumTiles-1][this.yNumTiles-1] = bottomRightTile;

        // console.log(this.grid);

        this.img=undefined;
    }

    /**
     * create a portable graphics image of all the tiles in the room.
     *
     * @param showGrid {boolean} - Flag to show or hide the tile grid pattern.
     */
    generatePG(showGrid=true) {
        this.showGrid = showGrid;
        if(!typeof this.showGrid == "boolean") {
            let err = "showGrid must be a boolean.";
            err += "  showGrid is being set to true";
            console.warn(err);
            this.showGrid = true;
        }

        this.img = createGraphics(this.xWidth, this.yHeight);

        if(this.img.pixelDensity() != 1) {
            console.debug("Original Pixel Density: ", this.img.pixelDensity());
            this.img.pixelDensity(1);
            console.debug("New Pixel Density: ", this.img.pixelDensity());
        }

        // set background as red in case there are any errors;
        this.img.background(255, 0,0);

        this.img.stroke(215);
        const gridStrokeWeight = max(World.lineThickness / 6, 2);
        this.img.strokeWeight(gridStrokeWeight);
        this.img.noFill();
        for(let x = 0; x < this.xNumTiles; x++) {
            for(let y = 0; y < this.yNumTiles; y++) {
                const tileImg = this.grid[x][y].getPG();
                const xPos = x * World.gridSize;
                const yPos = y * World.gridSize;
                this.img.image(tileImg, xPos, yPos,
                    World.gridSize + 1, World.gridSize + 1);
                if(this.showGrid) {
                    this.img.rect(xPos, yPos,
                        World.gridSize - 1, World.gridSize - 1);
                }
            }
        }
    }

    /**
     * Set all of the tiles in the room to be the same type.  This will ensure
     * that the position of all the tiles are in the correct position.
     *
     * @param tile {World.Tile} - The type of tile to fill the room with.
     *
     * @throws {Error} - tile needs to be an instance of World.Tile
     */
    setAllTiles(tile) {
        if(!(tile instanceof World.Tile || tile instanceof World.Tile.Proxy)) {
            const err = "tile needs to be an instance of World.Tile";
            throw new Error(err);
        }

        for(let x = 0; x < this.xNumTiles; x++) {
            for(let y = 0; y < this.yNumTiles; y++) {
                let currentTile = tile.copy();
                const currentPos = this.getPosOfGrid(x, y);
                currentTile.setPos(currentPos);
                this.grid[x][y] = currentTile;
            }
        }
        this.img = undefined;

        //this.generatePG();
    }

    /**
     * Returns a copy of the tile grid
     *
     * @returns {Array<Array<World.Tile>>} - a 2d array of tiles.
     */
    getAllTiles() {
        let gridCopy = [];
        for(let x = 0; x < this.xNumTiles; x++) {
            let col = [];
            for(let y = 0; y < this.yNumTiles; y++) {
                col.push(this.grid[x][y].copy());
            }
            gridCopy.push(col);
        }
        return gridCopy;
    }

    /**
     * Calculates the position of a tile at the given indexes.
     *
     * @param x {number} - X Index
     * @param y {number} - Y Index
     *
     * @returns {p5.Vector} - global position of the tile in the grid
     */
    getPosOfGrid(x, y) {
        const xPos = x * World.gridSize;
        const yPos = y * World.gridSize;
        const currentPos = createVector(xPos, yPos).add(this.pos);
        return currentPos;
    }

    /**
     * sets the tiles in the grid to a new pattern
     *
     * @param tilePattern {Array<Array<World.Tile>>} - a 2d array of tiles.
     */
    setTiles(tilePattern) {
        for(let x = 0; x < this.xNumTiles; x++) {
            for(let y = 0; y < this.yNumTiles; y++) {
                let tile = tilePattern[x][y].copy();
                if(!(tile instanceof World.Tile || tile instanceof World.Tile.Proxy)) {
                    const err = "tile needs to be an instance of World.Tile";
                    throw new Error(err);
                }

                let currentTile = tile.copy();
                const currentPos = this.getPosOfGrid(x, y);
                currentTile.setPos(currentPos);
                this.grid[x][y] = currentTile;
            }
        }
        //this.generatePG();
        this.img=undefined;
    }

    /**
     * Calculates which tile is at a given global position
     *
     * @param pos {p5.Vector} - The global position
     *
     * @returns {World.Tile} - The tile at the given position
     *
     * @throws {Error} - pos needs to be an instance of p5.Vector
     */
    getTileAtPos(pos) {
        if(!(pos instanceof p5.Vector)) {
            const err = "pos needs to be an instance of p5.Vector";
            throw new Error(err);
        }

        let localPos = pos.copy().sub(this.pos);
        const xIndex = floor(localPos.x / World.gridSize);
        const yIndex = floor(localPos.y / World.gridSize);


        if(xIndex < 0 || xIndex > this.xNumTiles - 1) {
            return undefined;
        }

        if(yIndex < 0 || yIndex > this.yNumTiles - 1) {
            return undefined;
        }
        console.debug("Room Grid Index: x, y: ", xIndex, yIndex);

        return this.grid[xIndex][yIndex];
    }


    /**
     * sets the tiles in the grid to a new pattern
     *
     * @param tilePattern {Array<Array<World.Tile>>} - a 2d array of tiles.
     */
    setTileAtPos(pos, tile) {
        if(!(pos instanceof p5.Vector)) {
            const err = "pos needs to be an instance of p5.Vector";
            throw new Error(err);
        }

        if(!(tile instanceof World.Tile || tile instanceof World.Tile.Proxy)) {
            const err = "tile needs to be an instance of World.Tile";
            throw new Error(err);
        }

        if(tile.getName() == this.getTileAtPos(pos).getName()) {
            console.log("The tile at this position is already a: ",
                tile.getName());
            return;
        }

        const localPos = pos.copy().sub(this.pos);
        const xIndex = floor(localPos.x / World.gridSize);
        const yIndex = floor(localPos.y / World.gridSize);

        if(xIndex < 0 || xIndex > this.xNumTiles - 1) {
            return undefined;
        }

        if(yIndex < 0 || yIndex > this.yNumTiles - 1) {
            return undefined;
        }

        let newTile = tile.copy();
        const gridAllignedGridPos = this.getPosOfGrid(xIndex, yIndex);
        newTile.setPos(gridAllignedGridPos);
        this.grid[xIndex][yIndex] = newTile;
        this.img = undefined;
    }

    /**
     * Draws the room at the global position set in the constructor.
     */
    draw() {
        if(this.img == undefined) {
            this.generatePG();
        }
        image(this.img, this.pos.x, this.pos.y, this.xWidth, this.yHeight);
    }

    /**
     * Sets the global position of the room.
     *
     * @param pos {p5.Vector} - The position of the room
     *
     * @throws {Error} - "pos needs to be an instance of p5.Vector"
     */
    setGlobalPos(pos) {
        if(!(pos instanceof p5.Vector)) {
            const err = "pos needs to be an instance of p5.Vector";
            throw err;
        }

        this.pos = pos.copy();

        for(let x = 0; x < this.xNumTiles; x++) {
            for(let y = 0; y < this.yNumTiles; y++) {
                const currentPos = this.getPosOfGrid(x, y);
                this.grid[x][y].setPos(currentPos);
            }
        }
    }

    /**
     * Serializes the parameters of the room as a JSON object.
     *
     * @param name {string} - The name to give the room.  If undefined the date
     * and time in ISO8901 format used as the room name.
     *
     *
     * @returns {String} - JSON String with tab delimited spaces
     */
    getJSON(name) {
        let nameInJSON = name;
        if(name==undefined) {
            const dateStr = new Date().toISOString();
            nameInJSON = "Room-" + dateStr;
        }

        let reducedGrid = [];

        for(let x = 0; x < this.xNumTiles; x++) {
            let col = [];
            for(let y = 0; y < this.yNumTiles; y++) {
                col.push(this.grid[x][y].getName());
            }
            reducedGrid.push(col);
        }


        let reducedRoom = {
            name:nameInJSON,
            xNumTiles: this.xNumTiles,
            yNumTiles: this.yNumTiles,
            showGrid: this.showGrid,
            grid: reducedGrid

        };

        return JSON.stringify(reducedRoom, null, "\t");
    }

    setFromJSON(reducedRoom) {
        if(!World.Room.validateJSON(reducedRoom).valid) {
            return;
        }

        this.xNumTiles = reducedRoom.xNumTiles;
        this.yNumTiles = reducedRoom.yNumTiles;

        this.xWidth = World.gridSize * this.xNumTiles;
        this.yHeight = World.gridSize * this.yNumTiles;

        this.pos = createVector(0, 0);

        this.name = reducedRoom.name;
        this.showGrid = reducedRoom.showGrid;

        this.createEmptyRoom();

        let reducedGrid = reducedRoom.grid;

        for(let x = 0; x < this.xNumTiles; x++) {
            for(let y = 0; y < this.yNumTiles; y++) {
                let currentTile = World.Tiles[reducedGrid[x][y]].copy();
                const currentPos = this.getPosOfGrid(x, y);
                currentTile.setPos(currentPos);
                this.grid[x][y] = currentTile;
            }
        }
        this.img = undefined;
    }
};

/**
 *
 * Validates a JSON string as a valid room
 *
 * @param jsonData {string} - JSON room data
 *
 * @returns {Object} - With valid bool and and error string message members
 */
World.Room.validateJSON = function(jsonData) {
    // TOOD: Edit to return array of errors so that all errors can be reported
    // TODO: Refactor to return specific valid data object with error class
    if(typeof(jsonData.name) != "string") {
        return {valid: false, error: "jsonData.name is not a string"};
    }

    if(typeof(jsonData.xNumTiles) != "number") {
        return {valid: false, error: "jsonData.xNumTiles is not a number"};
    }

    if(!Number.isInteger(jsonData.xNumTiles) || jsonData.xNumTiles < 1) {
        return {valid: false, error: "jsonData.xNumTiles is not a positive integer"};
    }

    if(typeof(jsonData.yNumTiles) != "number") {
        return {valid: false, error: "jsonData.yNumTiles is not a number"};
    }

    if(!Number.isInteger(jsonData.yNumTiles) || jsonData.yNumTiles < 1) {
        return {valid: false, error: "jsonData.yNumTiles is not a positive integer"};
    }

    if(typeof(jsonData.showGrid) != "boolean") {
        return {valid: false, error: "jsonData.showGrid is not a boolean"};
    }

    if(typeof(jsonData.grid) == undefined) {
        return {valid: false, error: "jsonData.grid does not exist"};
    }

    // check size of grid in x and y
    if(jsonData.grid.length != jsonData.xNumTiles) {
        return {valid: false, error: "jsonData.grid x size does not match jsonData.xNumTiles"};
    }

    for(let x = 0; x < jsonData.xNumTiles; x++) {
        if(jsonData.grid[x].length != jsonData.yNumTiles) {
            return {valid: false, error: "jsonData.grid y size does not match jsonData.yNumTiles"};
        }
    }

    // check validity of tiles in grid
     for(let x = 0; x < jsonData.xNumTiles; x++) {
        for(let y = 0; y < jsonData.yNumTiles; y++) {
            const jsonName = jsonData.grid[x][y];
            if(World.Tiles[jsonName] === undefined) {
                const msg = "jsonData.grid["+x+"]["+y+"] does not contain a valid Tile type: " + jsonName;
                return {valid: false, error: msg};
            }
        }
    }


    return {valid: true, error: undefined};
};

