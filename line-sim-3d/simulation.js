/*******************************************************************************
 *
 *  @file simulation.js A file with the simulation manager objects
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 16-March-2024
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

Simulation.Mode = Simulation.Mode || {};

Simulation.frameData = class {
    constructor() {
        this.frameTime = Date.now();

        this.dt = this.frameTime - Simulation.lastFrameTime;
        this.dtMillis = this.dt;
        this.dtSeconds = 0.001 * this.dt;
        this.fps = 1 / this.dtSeconds;

        this.frame = Simulation.frame;
        this.timeSinceStart = this.frameTime - Simulation.firstFrameTime;
        this.timeSinceStartSeconds = 0.001 * this.timeSinceStart;
    }
};

Simulation.setup = function() {
    Simulation.firstFrameTime = Date.now();
    Simulation.lastFrameTime = Date.now();

    Simulation.frameDataHistory = [];
    Simulation.currentFrameData = null;
    Simulation.frame = 0;

    if(Simulation.Mode.setup == undefined) {
        Simulation.Mode.setup = () => {return;};
    }

    if(Simulation.Mode.update == undefined) {
        Simulation.Mode.update = () => {return;};
    }

    Simulation.Mode.setup();
}

Simulation.update = function() {
    Simulation.currentFrameData = new Simulation.frameData();
    Simulation.frameDataHistory.push(Simulation.currentFrameData);

    Simulation.frame++;
    Simulation.lastFrameTime = Simulation.currentFrameData.frameTime;

    Simulation.Mode.update();
};

Simulation.Mode.set = function(newMode) {
    Simulation.Mode.setup = newMode.setup;
    Simulation.Mode.update = newMode.update;
}

Simulation.Mode.movingTile = {};

Simulation.Mode.movingTile.setup = function() {
    Simulation.Mode.movingTile.tile = World.Tiles.cross.copy();

    const sr = 8
    Simulation.Mode.movingTile.sensorRadius = sr;
    let s = new Robot.DigitalLightSensor(8, createVector(0,0));
    Simulation.Mode.movingTile.sensor = s;

    Simulation.Mode.movingTile.tileX = 0;
    Simulation.Mode.movingTile.tileXInc = 1;
}

Simulation.Mode.movingTile.update = function() {
    let tile = Simulation.Mode.movingTile.tile;
    let sensor = Simulation.Mode.movingTile.sensor;
    let tileX = Simulation.Mode.movingTile.tileX;
    let tileXInc = Simulation.Mode.movingTile.tileXInc;

    if(tileX < 0 || tileX + World.gridSize > width) {
        Simulation.Mode.movingTile.tileXInc *= -1;
    }
    Simulation.Mode.movingTile.tileX += Simulation.Mode.movingTile.tileXInc;

    let tileY = height / 2 - World.gridSize / 2;
    tile.setPos(createVector(Simulation.Mode.movingTile.tileX, tileY));
    tile.draw();

    sensor.setPos(createVector(mouseX, mouseY));
    sensor.setRadius(Simulation.Mode.movingTile.sensorRadius);

    const brightness = sensor.digitalRead(tile);

    if(brightness < 1) {
        console.log(brightness);
    }
    const colorVal = floor(brightness * 255);

    push();
    fill(colorVal);
    strokeWeight(1);
    stroke(127, 0, 30);
    const ellipseSize = 2 * Simulation.Mode.movingTile.sensorRadius;
    ellipse(mouseX, mouseY, ellipseSize, ellipseSize);
    pop();

}