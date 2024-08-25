/*******************************************************************************
 *
 *  @file light-sensor-array.js A file with the light sensor array class
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 03-April-2024
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
 * Robot light sensor array class.  This stores multiple light sensors and
 * organises the transformations between them as the sensor array moves around.
 */
Robot.LightSensorArray = class {

    /**
     * The constructor of the light sensor array class.  This creates the
     * sensors and stores them internally as a composition.
     *
     * @param numSensors {number} - The number of light sensors
     * @param globalPos {p5.Vector} - The global position of the light sensor array
     * @param relPositions {Array<p5.Vector>} - The relative positions of the
     * sensors in the array.  This ensures that they are transformed in the
     * correct orientation.
     * @param radiuses {Array<number>} - An array of sensor radiuses
     * @param analogOrDigital {Array< Robot.LightSensorType >} - Array of
     * LightSensorType showing if the given sensor is an Analog or digital light
     * sensor.
     */
    constructor(numSensors, globalPos, relPositions, radiuses, analogOrDigital) {
        this.numSensors = numSensors;
        this.pos = globalPos;
        this.relPositions = [];
        this.refPosMatrix = [[], []];
        this.posMatrix = [[], []];

        // always use radians
        this.bearing = 0;
        this.rotationMatrix = math.rotationMatrix(this.bearing);

        this.setRelativePositions(relPositions);
        this.calcPosMatrix();

        this.sensors = [];

        for(let i = 0; i < this.numSensors; i++) {
            if(analogOrDigital[i] == Robot.LightSensorType.Analog) {
                this.sensors[i] = new Robot.AnalogLightSensor(
                    radiuses[i],
                    createVector()
                    );
            } else if (analogOrDigital[i] == Robot.LightSensorType.Digital) {
                this.sensors[i] = new Robot.DigitalLightSensor(
                    radiuses[i],
                    createVector()
                    );
            }
        }


        this.updatePosAndBearing();
    }

    /**
     * Set's new relative positions of the light sensors
     *
     * @param newPositions {Array< p5.Vector >} - new relative positions array
     *
     * @throws {Error} The length of the new positions array should be: numSensors
     * @throws {Error} The position of sensor i is not a p5.Vector
     */
    setRelativePositions(newPositions) {
        if(newPositions.length != this.numSensors) {
            let err = "The length of the new positions array should be: ";
            err += str(this.numSensors);
            throw Error(err);
        }

        for(let i = 0; i < this.numSensors; i++) {
            if(!newPositions[i] instanceof p5.Vector) {
                let err = "The position of sensor ", i, " is not a p5.Vector ";
                throw Error(err);
            }
        }

        for(let i = 0; i < this.numSensors; i++) {
            this.relPositions[i] = newPositions[i].copy();
        }

        this.calcRefPosMatrix();

        console.debug("Light sensor array relative positions: ",
            this.relPositions);
    }

    /**
     * calculate the relative positions as a matrix.  Saves the matrix in
     * this.refPosMatrix
     */
    calcRefPosMatrix() {
        this.refPosMatrix = [[], []];
        for(let i = 0; i < this.numSensors; i++) {
            this.refPosMatrix[0][i] = this.relPositions[i].x;
            this.refPosMatrix[1][i] = this.relPositions[i].y;
        }
        this.refPosMatrix = math.matrix(this.refPosMatrix);
    }

    /**
     * calculate the position matrix from the global position and saves this in
     * this.posMatrix
     */
    calcPosMatrix() {
        this.posMatrix = [[], []];
        for(let i = 0; i < this.numSensors; i++) {
            this.posMatrix[0][i] = this.pos.x;
            this.posMatrix[1][i] = this.pos.y;
        }
        this.posMatrix = math.matrix(this.posMatrix);
    }

    /**
     * Sets the bearing of the light sensor array.  This also updates the
     * rotation matrix.
     *
     * @param newBearing {number} - New bearing in radians
     */
    setBearing(newBearing) {
//TODO: Check type and limits
        this.bearing = newBearing;
        this.rotationMatrix = math.rotationMatrix(this.bearing);

        this.updatePosAndBearing();
    }

    /**
     * Sets the position of the light sensor array.  This recalculates the
     * position matrix.
     *
     * @param newPos {p5.Vector} - New position
     */
    setPos(newPos) {
//TODO: Check type
        this.pos = newPos.copy();
        this.calcPosMatrix();
        this.updatePosAndBearing();
    }

    /**
     * gets the last sensor values from the light sensors
     *
     * @returns {Array< number >} - the last sensor values
     */
    getLastSensorVals() {
        let sensorVals = [];
        for(let i = 0; i < this.numSensors; i++) {
            sensorVals[i] = this.sensors[i].getLastRead();
        }
        return sensorVals;
    }

    /**
     * update the position and bearing of the light sensor array according to
     * the position matrix and the rotation matrix.
     */
    updatePosAndBearing() {
        // rotate relative positions
        const rotated = math.multiply(this.rotationMatrix,
            this.refPosMatrix);

        // apply global position translation
        const translated = math.add(rotated, this.posMatrix);

        for(let i = 0; i < this.numSensors; i++) {
            const x = translated.get([0, i]);
            const y = translated.get([1, i]);

            this.sensors[i].setPos(createVector(x, y));
        }
    }

    /**
     * read the sensor values in the given room
     *
     * @param room {World.Room} - The room to probe with the sensors
     *
     * @returns {Array< number >} - the current sensor values
     */
    read(room) {
        let sensorVals = [];
        const drawFlag = false;
        for(let i = 0; i < this.numSensors; i++) {
            const sensorPos = this.sensors[i].pos.copy();
            const tileUnderSensor = room.getTileAtPos(sensorPos);
            sensorVals[i] = this.sensors[i].read(tileUnderSensor, drawFlag);
        }
        return sensorVals;
    }

    /**
     * Draw the light sensor array.  Colour each sensor independently.
     */
    draw() {
        for(let i = 0; i < this.numSensors; i++) {
            const x = this.sensors[i].pos.x;
            const y = this.sensors[i].pos.y;
            const r = 2 * this.sensors[i].sensorRadius;
            const b = 100 * this.sensors[i].getLastRead();
            const v = this.sensors[i].getLastClosestLinePoint();

            push();
            colorMode(HSB);
            fill(0, 0, b);
            stroke(100 * i / this.numSensors, 100, 100);
            strokeWeight(0.2 * r);

            if(v.x != -1 && v.y != -1) {
                ellipse(v.x, v.y, 0.25 * r, 0.25 * r);
                line(x, y, v.x, v.y);
            }

            ellipse(x, y, r, r);
            pop();
        }
    }
};


// TODO: make light sensor array builder/factory
