/*******************************************************************************
 *
 *  @file robot.js A file with the robot class
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
 * Robot Namespace Object
 */
var Robot = Robot || {};

Robot.RobotTelemetryData = class {
    constructor(robot) {
        this.pos = robot.pos.copy();
        this.bearing = robot.bearing;
        this.vel = robot.bearing;
        this.rotationRate = robot.rotationRate;

        this.sensorVals = robot.getLastSensorVals();
    }
};

Robot.MovementCommands = class {
    constructor(vel, rotationRate) {
        this.vel = vel;
        this.rotationRate = rotationRate;
    }
};

Robot.robot = class{

    constructor(pos, bearing, size, sensorArray, sensorArrayPos, algorithm) {
        this.pos = pos.copy();
        this.bearing = bearing;
        this.size = size;
        this.sensorArray = sensorArray;//.copy();
        this.sensorArrayPos = sensorArrayPos.copy();
        this.algorithm = algorithm;

        this.vel = 0.5 * World.gridSize; // Pixels per second
        this.rotationRate = 0; // Radians per second

        this.maxVel = 2 * World.gridSize;
        this.maxRotationRate = 1.5 * math.Pi;
    }

    getLastSensorVals() {
        return this.sensorArray.getLastSensorVals();
    }

    sensorsRead(room) {
        return this.sensorArray.read(room);
    }

    setForwardVel(newVel) {
        if(abs(newVel) > this.maxVel) {
            this.vel = this.maxVel;
            return;
        }
        this.vel = newVel;
    }

    setRotationRate(newRotationRate) {
        if(abs(newRotationRate) > this.maxRotationRate) {
            this.rotationRate = this.maxRotationRate;
            return;
        }
        this.rotationRate = newRotationRate;
    }

    update() {
        const data = new Robot.RobotTelemetryData(this);
        const movementCommands = this.algorithm.follow(data);
        this.setForwardVel(movementCommands.vel);
        this.setRotationRate(movementCommands.rotationRate);

        this.bearing += this.rotationRate * Simulation.dtSeconds;
        let vel = createVector(0, this.vel).mult(Simulation.dtSeconds);
        vel = vel.rotate(this.bearing);
        this.pos.add(vel);
    }


    draw() {
        push();
        rectMode(CENTER);
        fill(127);
        translate(this.pos.x, this.pos.y);
        rotate(this.bearing);

        // robot rectangle
        rect(0,0, this.size, this.size, 0.15 * this.size);

        // forward pointing line
        stroke(0);
        strokeWeight(0.05 * this.size);
        line(0,0, 0, 0.5 * this.size);
        pop();

        this.sensorArray.setBearing(this.bearing);
        let rotatedSensorPos = this.sensorArrayPos.copy().rotate(this.bearing);
        this.sensorArray.setPos(this.pos.copy().add(rotatedSensorPos));
        this.sensorArray.draw();
    }
};

// TODO: make robot builder/factory
