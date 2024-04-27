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
 * Class Simulation.Mode.DebugMovingTile is a simulation mode that has a tile
 * moving back and forth along the canvas to test that the light sensors can
 * correctly read the value in a global coordinate frame.
 *
 * @see Simulation.Mode.Type
 */
Simulation.Mode.DebugStaticTile = class extends Simulation.Mode.ModeType {
    static staticName = "DebugStaticTile";

    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();
        this.name = "DebugStaticTile";
        this.sensorRadius = 12;
        this.sensor = new Robot.AnalogLightSensor(this.sensorRadius,
            createVector(0,0));

        const tileX = width /2 - World.gridSize / 2;
        const tileY = height / 2 - World.gridSize / 2;
        this.tile = World.Tiles.verticalLine.copy();
        this.tile.setPos(createVector(tileX, tileY));
    }

    /**
     * Update function that updates the state of the simulation
     */
    update() {
        this.tile.draw();

        this.sensor.setPos(createVector(mouseX, mouseY));
        this.sensor.setRadius(this.sensorRadius);

        const brightness = this.sensor.read(this.tile);

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

Simulation.Mode.ModeList.push(Simulation.Mode.DebugStaticTile);
