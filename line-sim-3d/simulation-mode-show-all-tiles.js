/*******************************************************************************
 *
 *  @file simulation-mode-show-all-tiles.js Shows all tiles
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 31-March-2024
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
 * @see Simulation.Mode.Type
 */
Simulation.Mode.DebugShowAllTiles = class extends Simulation.Mode.ModeType {
    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();
        const totalNumTiles = Object.keys(World.Tiles).length;
        let factors = [];

        let i = 0;
        while(factors.length <= 4) {
            factors = this.findFactors(totalNumTiles + i);
            i++;
        }
        i--;

        console.log("Factors", factors);

        const factor1 = factors[floor(factors.length / 2)];
        const factor2 = (totalNumTiles + i) / factor1;
        console.log("Factor 1, 2: ", factor1, factor2);

        const numTilesX = max(factor1, factor2);
        const numTilesY = min(factor1, factor2);

        const tilesRatio = numTilesX / numTilesY;
        const pixelsRatio = width / height;

        let gridSize = -1;
        if(tilesRatio > pixelsRatio) {
            gridSize = width / numTilesX;
        } else {
            gridSize = height / numTilesY;
        }

        World.setGridSize(gridSize);
        this.sensorRadius = 0.5 * World.lineThickness + 1;
        this.sensor = new Robot.AnalogLightSensor(this.sensorRadius,
            createVector(0,0));


        let grid = this.createEmpty(numTilesX, numTilesY);
        console.log(grid);
        grid = this.fillGridWithAllTiles(grid, numTilesX, numTilesY);
        console.log(grid);

        this.room = new World.Room(numTilesX, numTilesY, createVector(0, 0));
        this.room.setTiles(grid);

    }

    /**
     * Find the factors of a number
     *
     * @param num {number} - The number
     *
     * @returns {Array<numbers>} - An array of the factors
     */
    findFactors(num) {
        let factors = [];
        for (let i = 1; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                factors.push(i);
                if (i !== num / i) {
                    factors.push(num / i);
                }
            }
        }
        return factors.sort((a, b) => a - b);
    }

    /**
     * creates a grid of blankTiles
     *
     * @param cols {number} - number of tiles in the x direction
     * @param rows {number} - number of tiles in the y direction
     *
     * @returns {Array<Array<World.Tile>>} - The grid of blank tiles
     */
    createEmpty(cols, rows) {
//TODO: replace with a call to static room method
        let grid = [];
        const blankTile = World.Tiles.blankLine.copy();
        for(let x = 0; x < cols; x++) {
            let emptyCol= [];
            for(let y = 0; y < rows; y++) {
                emptyCol.push(blankTile.copy());
            }
            grid.push(emptyCol);
        }
        return grid;
    }

    /**
     * fills the empty grid with all of the tiles in the World.Tiles array.
     *
     * @param grid {Array<Array<World.Tile>>} - The grid to add all the tiles to
     * @param cols {number} - number of tiles in the x direction
     * @param rows {number} - number of tiles in the y direction
     * @param horizontalFill {boolean} - flag to decide if the tiles are filled
     * in the x or the y direction first
     *
     * @returns {Array<Array<World.Tile>>} - A grid with the new tile values
     */
    fillGridWithAllTiles(grid, cols, rows, horizontalFill=true) {
        const keys = Object.keys(World.Tiles);
        let newGrid = grid;

        for(let i = 0; i < keys.length; i++) {
            const key = keys[i];

            let xIndex = i % cols;
            let yIndex = floor(i / cols);
            if(!horizontalFill) {
                xIndex = floor(i / rows);
                yIndex = i % rows;
            }
            newGrid[xIndex][yIndex] = World.Tiles[key].copy();
            console.debug(key);
        }

        return newGrid;
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
        const ellipseSize = 2 * this.sensorRadius;
        ellipse(mouseX, mouseY, ellipseSize, ellipseSize);
        pop();
    }
};