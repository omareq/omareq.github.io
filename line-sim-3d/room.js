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


World.Room = class {
    constructor(xNumTiles, yNumTiles, globalPos=createVector(0,0)) {
        this.xNumTiles = xNumTiles;
        this.yNumTiles = yNumTiles;

        this.xWidth = World.gridSize * this.xNumTiles;
        this.yHeight = World.gridSize * this.yNumTiles;

        this.pos = globalPos;

        this.createEmptyRoom();

        this.generatePG();
    }

    createEmptyRoom() {
        this.grid = [];
        const blankTile = World.Tiles.cross.copy();
        for(let x = 0; x < this.xNumTiles; x++) {
            let emptyCol= [];
            for(let y = 0; y < this.yNumTiles; y++) {
                let currentTile = blankTile.copy();
                const xPos = x * World.gridSize;
                const yPos = y * World.gridSize;
                const currentPos = createVector(xPos, yPos).add(this.pos);
                currentTile.setPos(currentPos);
                emptyCol.push(currentTile);
            }
            this.grid.push(emptyCol);
        }
    }

    fillRoomWithSnakeTiles() {

    }

    generatePG() {
        this.img = createGraphics(this.xWidth, this.yHeight);
        // set background as red in case there are any errors;
        this.img.background(255, 0,0);
        for(let x = 0; x < this.xNumTiles; x++) {
            for(let y = 0; y < this.yNumTiles; y++) {
                console.log("x,y: ", x, y);
                const tileImg = this.grid[x][y].getPG();
// TODO: Figure out why there is a factor of 0.5 needed to make these work
                const xPos = x * 0.5 * World.gridSize;
                const yPos = y * 0.5 * World.gridSize;
                this.img.image(tileImg, xPos, yPos, 0.5*World.gridSize, 0.5*World.gridSize);
            }
        }
    }

    setTiles(tilePattern) {

    }

    getTileAtPos(globalPos) {

    }

    draw() {
        image(this.img, 0, 0, this.xWidth, this.yHeight);
    }
}
