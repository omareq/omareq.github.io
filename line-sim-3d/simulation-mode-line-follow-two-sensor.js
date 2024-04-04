/*******************************************************************************
 *
 *  @file simulation-mode-two-sensor-line-follow.js Test the robot two sensor
 *  line follow algorithm
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 04-April-2024
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
Simulation.Mode.LineFollowTwoSensor = class extends Simulation.Mode.ModeType {
    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();

        const numTilesX = 7;
        const numTilesY = 6;

        const tilesRatio = numTilesX / numTilesY;
        const pixelsRatio = width / height;

        let gridSize = -1;
        if(tilesRatio > pixelsRatio) {
            gridSize = width / numTilesX;
        } else {
            gridSize = height / numTilesY;
        }

        World.setGridSize(gridSize);

        this.setupRobot();

        this.room = new World.Room(numTilesX, numTilesY, createVector(0, 0));
        this.setRoomToConfig();
    }

    setupLightSensorArray(sensorRadius) {
        let numSensors = 2;
        let globalPos = createVector(0,0);
        let sensorPositions = [
            createVector(-1.5 * sensorRadius, 0.00),
            createVector(1.5 * sensorRadius, 0.00)
            ];
        let radiuses = [
            sensorRadius,
            sensorRadius
            ];
        let analogOrDigital = [
            Robot.LightSensorType.Analog,
            Robot.LightSensorType.Analog
            ];

        return new Robot.LightSensorArray(numSensors,
            globalPos,
            sensorPositions,
            radiuses,
            analogOrDigital);
    }

    setupRobot() {
        const pos = createVector(0.5 * World.gridSize, 0.55 * World.gridSize);
        const bearing = -0.5 * math.PI;
        const size = 0.5 * World.gridSize;
        const sensorRadius = 0.5 * World.lineThickness + 1;
        const sensorArray = this.setupLightSensorArray(sensorRadius);
        const sensorArrayPos = createVector(0, 0.5 * size);
        const algorithm = new Robot.Algorithm.TwoSensorFollow();

        this.robot = new Robot.robot(
            pos,
            bearing,
            size,
            sensorArray,
            sensorArrayPos,
            algorithm
            );
        this.robot.setRotationRate(0.30);
    }

    setRoomToConfig() {
        let grid = this.room.getAllTiles();

        grid[2][0] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[4][0] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[5][0] = World.Tiles.diagonalVDown.copy();
        grid[6][0] = World.Tiles.diagonalDownLeft.copy();

        grid[6][1] = World.Tiles.quarterCircleUpLeft.copy();
        grid[4][1] = World.Tiles.diagonalVDown.copy();
        grid[3][1] = World.Tiles.diagonalVUp.copy();
        grid[2][1] = World.Tiles.diagonalVDown.copy();
        grid[1][1] = World.Tiles.quarterCircleDownRight.copy();

        grid[1][2] = World.Tiles.quarterCircleUpRight.copy();
        grid[2][2] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[3][2] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[5][2] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[6][2] = World.Tiles.quarterCircleDownLeft.copy();

        grid[6][3] = World.Tiles.diagonalUpLeft.copy();
        grid[4][3] = World.Tiles.diagonalVUp.copy();
        grid[3][3] = World.Tiles.diagonalVUp.copy();
        grid[2][3] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[1][3] = World.Tiles.diagonalDownRight.copy();

        grid[1][4] = World.Tiles.diagonalUpRight.copy();
        grid[2][4] = World.Tiles.diagonalVDown.copy();
        grid[3][4] = World.Tiles.diagonalVDown.copy();
        grid[5][4] = World.Tiles.gapQuarterLineHorizontal.copy();

        grid[5][5] = World.Tiles.diagonalVUp.copy();
        grid[2][5] = World.Tiles.blankLine.copy();
        grid[1][5] = World.Tiles.diagonalVDown.copy();

        grid[0][5] = World.Tiles.cornerUpRight.copy();
        grid[0][4] = World.Tiles.diagonalVRight.copy();
        grid[0][3] = World.Tiles.gapQuarterLineVertical.copy();
        grid[0][2] = World.Tiles.diagonalVLeft.copy();
        grid[0][1] = World.Tiles.diagonalVRight.copy();
        grid[0][0] = World.Tiles.cornerDownRight.copy();

        this.room.setTiles(grid);
    }

     /**
     * Update function that updates the state of the simulation
     */
    update() {
        this.room.draw();

        this.robot.sensorsRead(this.room);
        this.robot.update();
        this.robot.draw();

    }
};