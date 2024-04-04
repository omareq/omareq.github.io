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



Robot.LightSensorArray = class {

    constructor(numSensors, globalPos, relPositions, radiuses, analogOrDigital) {
        this.numSensors = numSensors;
        this.pos = globalPos;
        this.relPositions = [];
        this.refPosMatrix = [[], []];
        this.posMatrix = [[], []];

        // always use radians
        this.bearing = math.PI;
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

    setRelativePositions(newPositions) {
        if(newPositions.length != this.numSensors) {
            let err = "The length of the new positions array should be: ";
            err += str(this.numSensors);
            throw Error(err);
        }

//TODO: check type

        for(let i = 0; i < this.numSensors; i++) {
            this.relPositions[i] = newPositions[i].copy();
        }

        this.calcRefPosMatrix();

        console.debug("Light sensor array relative positions: ",
            this.relPositions);
    }

    calcRefPosMatrix() {
        this.refPosMatrix = [[], []];
        for(let i = 0; i < this.numSensors; i++) {
            this.refPosMatrix[0][i] = this.relPositions[i].x;
            this.refPosMatrix[1][i] = this.relPositions[i].y;
        }
        this.refPosMatrix = math.matrix(this.refPosMatrix);
    }

    calcPosMatrix() {
        this.posMatrix = [[], []];
        for(let i = 0; i < this.numSensors; i++) {
            this.posMatrix[0][i] = this.pos.x;
            this.posMatrix[1][i] = this.pos.y;
        }
        this.posMatrix = math.matrix(this.posMatrix);
    }

    setBearing(newBearing) {
//TODO: Check type and limits
        this.bearing = newBearing;
        this.rotationMatrix = math.rotationMatrix(this.bearing);

        this.updatePosAndBearing();
    }

    setPos(newPos) {
//TODO: Check type
        this.pos = newPos.copy();
        this.calcPosMatrix();
        this.updatePosAndBearing();
    }

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


// TODO: make light sensor array builder
