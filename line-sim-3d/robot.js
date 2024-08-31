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

/**
 * A class that stores a snapshot of all the robots parameters at a given time.
 * This includes the position, bearing, velocity, rotation rate, and last read
 * sensor values.
 *
 * @see Robot.Robot
 * @see Robot.Algorithm.LineFollow
 * @see Robot.MovementCommands
 */
Robot.RobotTelemetryData = class {
    /**
     * Constructor for the telemetry data.
     *
     * @param robot {Robot.Robot} - The robot to save the data for.
     */
    constructor(robot) {
        this.pos = robot.pos.copy();
        this.bearing = robot.bearing;
        this.vel = robot.bearing;
        this.rotationRate = robot.rotationRate;

        this.sensorVals = robot.getLastSensorVals();
    }
};

/**
 * A class that stores effector commands for the robot.  This includes linear
 * velocity in the forward direction and rotation rate.
 *
 * @see Robot.Robot
 * @see Robot.Algorithm.LineFollow
 * @see Robot.RobotTelemetryData
 */
Robot.MovementCommands = class {
    /**
     * The constructor for the command object.
     *
     * @param vel {number} - The forward velocity of the robot
     * @param rotationRate {number} - The rotation rate of the robot
     */
    constructor(vel, rotationRate) {
        this.vel = vel;
        this.rotationRate = rotationRate;
    }
};

/**
 * A robot class to encapsulate all of the properties of a line following robot
 *
 * @see Robot.Algorithm.LineFollow
 * @see Robot.RobotTelemetryData
 * @see Robot.MovementCommands
 * @see Robot.AnalogLightSensor
 * @see Robot.DigitalLightSensor
 * @see Robot.LightSensorArray
 */
Robot.Robot = class{
    /**
     * The constructor for the robot class.
     *
     * @param pos {p5.Vector} - Start position of the robot in pixels
     * @param bearing {number} - Start bearing of the robot in radians
     * @param size {number} - The size of the robot in pixels
     * @param sensorArray {Robot.LightSensorArray} - An array of light sensors
     * @param sensorArrayPos {p5.Vector} - A vector with the relative position
     *  of the light sensor array with respect to the robot centre
     * @param algorithm {Robot.Algorithm.LineFollow} - The line following
     *   algorithm that the robot uses.
     */
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

    /**
     * A function to return the last sensor values.
     *
     * @returns {Array<number>} - An array of sensor values
     */
    getLastSensorVals() {
        return this.sensorArray.getLastSensorVals();
    }

    /**
     * Reads all of the sensor values in the given room.
     *
     * @param room {World.Room} - The room to be probed with the sensors
     *
     * @return {Array<number>} - An array of sensor values
     */
    sensorsRead(room) {
        return this.sensorArray.read(room);
    }

    /**
     * Sets the forward velocity of the robot.  Returns early if the requested
     * velocity is greater than the robots maximum velocity.
     *
     * @param newVel {number} - The new velocity
     */
    setForwardVel(newVel) {
        if(abs(newVel) > this.maxVel) {
            this.vel = this.maxVel;
            return;
        }
        this.vel = newVel;
    }

    /**
     * Sets the rotation rate of the robot.  Returns early if the requested
     * rotation rate is greater than the robots maximum rotation rate.
     *
     * @param newRotationRate {number} - The new rotation rate
     */
    setRotationRate(newRotationRate) {
        if(abs(newRotationRate) > this.maxRotationRate) {
            this.rotationRate = this.maxRotationRate;
            return;
        }
        this.rotationRate = newRotationRate;
    }

    /**
     * Robot update function.  This sends a telemetry data object to the line
     * follow algorithm and then updates the movement according the algorithms
     * requested movement commands.
     */
    update() {
        const data = new Robot.RobotTelemetryData(this);
        const movementCommands = this.algorithm.follow(data);
        this.setForwardVel(movementCommands.vel);
        this.setRotationRate(movementCommands.rotationRate);

        this.bearing += this.rotationRate * Simulation.dtSeconds;
        if(this.bearing > TWO_PI) {
            this.bearing -= TWO_PI;
        }

        if(this.bearing < 0) {
            this.bearing += TWO_PI;
        }
        let vel = createVector(0, this.vel).mult(Simulation.dtSeconds);
        vel = vel.rotate(this.bearing);
        this.pos.add(vel);
    }

    /**
     * Draws the robot and the light sensor array.
     */
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
