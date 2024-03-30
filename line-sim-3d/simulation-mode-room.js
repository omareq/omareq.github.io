/*******************************************************************************
 *
 *  @file simulation-mode-room.js Implementation of the room simulation mode.
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
 * @see Simulation.Mode.Type
 */
Simulation.Mode.DebugRoom = class extends Simulation.Mode.ModeType {
    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();
        this.sensorRadius = 8;
        this.sensor = new Robot.AnalogLightSensor(this.sensorRadius,
            createVector(0,0));

        const numTiles = 4;
        World.setGridSize(height / numTiles);
        const x = numTiles;
        const y = numTiles;
        this.room = new World.Room(x, y, createVector(100, 0));
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
