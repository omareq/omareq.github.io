/*******************************************************************************
 *
 *  @file ui.js A file with the room class
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
 */
World.Room = class {
    /**
     * Constructor for the room class.
     *
     * @param xNumTiles {number} - Positive integer showing how many tiles there
     * are in the x direction
     * @param yNumTIles {number} - Positive integer showing how many tiles there
     * are in the y direction
     * @param globalPos {p5.Vector} - The global position of the room
     */
    constructor(xNumTiles, yNumTiles, globalPos=createVector(0,0)) {
        this.xNumTiles = xNumTiles;
        this.yNumTiles = yNumTiles;

        this.xWidth = World.gridSize * this.xNumTiles;
        this.yHeight = World.gridSize * this.yNumTiles;

        this.pos = globalPos;

        this.createEmptyRoom();

        this.fillRoomWithSnakePattern();
        this.generatePG();
    }

    /**
     * creates a 2d grid of World.Tiles.blankLine.
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
    }

    /**
     * Fills the room with horizontal lines and then adds 90 degree corners to
     * create the back and forth pattern.
     */
    fillRoomWithSnakePattern() {
        this.setAllTiles(World.Tiles.horizontalLine.copy());

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
    }

    /**
     * create a portable graphics image of all the tiles in the room.
     */
    generatePG() {
        this.img = createGraphics(this.xWidth, this.yHeight);
        // set background as red in case there are any errors;
        this.img.background(255, 0,0);
        for(let x = 0; x < this.xNumTiles; x++) {
            for(let y = 0; y < this.yNumTiles; y++) {
                const tileImg = this.grid[x][y].getPG();
// TODO: Figure out why there is a factor of 0.5 needed to make these work
                const xPos = x * 0.5 * World.gridSize;
                const yPos = y * 0.5 * World.gridSize;
                this.img.image(tileImg, xPos, yPos,
                    0.5*World.gridSize, 0.5*World.gridSize);
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
        if(!(tile instanceof World.Tile)) {
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

        this.generatePG();
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
     * @param tilePattern {Array<Array<World.Tiles>>} - a 2d array of tiles.
     */
    setTiles(tilePattern) {

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

        console.debug("Room Grid Index: x, y: ", xIndex, yIndex);

        if(xIndex < 0 || xIndex > this.xNumTiles - 1) {
            return undefined;
        }

        if(yIndex < 0 || yIndex > this.yNumTiles - 1) {
            return undefined;
        }

        return this.grid[xIndex][yIndex];
    }

    /**
     * Draws the room at the global position set in the constructor.
     */
    draw() {
        image(this.img, this.pos.x, this.pos.y, this.xWidth, this.yHeight);
    }
}
