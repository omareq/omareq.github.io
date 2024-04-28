/*******************************************************************************
 *
 *  @file light-sensor.js A file with the light sensor class
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

Robot.LightSensorType = {};
Robot.LightSensorType.Analog = 0;
Robot.LightSensorType.Digital = 1;

/**
 * Class containing the analog light sensor features. A digital light sensor
 * has also been implemented.
 *
 * @see Robot.DigitalLightSensor
 */
Robot.AnalogLightSensor = class {
    /**
     * Constructor function for AnalogLightSensor
     *
     * @param sensorRadius {number} - The value of the sensor detection circle
     *      radius.
     * @param position {p5.Vector}  - The current position of the sensor in the
     *      global coordinate frame.
     * @param bufferLength {number} - An integer showing the length of the
     *      internal circular buffer that stores the previous sensor values.
     */
    constructor(sensorRadius, position, bufferLength=1) {
// TODO: check input params
        this.setRadius(sensorRadius);
        this.pos = position;
        this.bufferLen = bufferLength;
        if(this.bufferLen < 1) {
            this.bufferLen = 1;
        }
        this.buffer = [];
        this.bufferIndex = 0;

        this.setupBuffer();
        this.white = 1;
        this.black = 0;
    }

    /**
     * A function to set up the internal circular buffer.
     */
    setupBuffer() {
        for(let i = 0; i < this.bufferLen; i++) {
            this.buffer.push(this.white);
        }
    }

    /**
     * A function to change the current light sensor position in the global
     * coordinate frame.
     *
     * @param position {p5.Vector} - The new position value.
     */
    setPos(position) {
        this.pos = position;
    }

    /**
     * A function to set the sensor radius of the light sensor
     *
     * @param sensorRadius {number} - The new sensor radius.
     */
    setRadius(sensorRadius) {
        this.sensorRadius = sensorRadius;
        this.circleArea = PI * this.sensorRadius**2;
    }

    /**
     * A function to return the last reading that the sensor made.  This is done
     * by returning the last value in the buffer.
     *
     * @returns {number} - between 0 (black) and 1 (white)
     */
    getLastRead() {
        return this.buffer[this.bufferLen - 1];
    }

    getLastClosestLinePoint() {
        if(this.closestLinePoint == undefined) {
            return createVector(-1, -1);
        }
        return this.closestLinePoint;
    }

    /**
     * A function to check if the sensor is within the boundaries of a tile.
     *
     * @param tile {World.Tile} - The tile to check against
     *
     * @returns {boolean} - true if outside the tile false if inside the tile.
     */
    isOutsideofTile(tile) {
        if(this.pos.x < tile.pos.x || this.pos.y < tile.pos.y) {
            return true;
        }

        if(this.pos.x > tile.pos.x + World.gridSize) {
            return true;
        }

        if(this.pos.y > tile.pos.y + World.gridSize) {
            return true;
        }

        return false;
    }

    /**
     * Looks at all the lines on a tile and finds the closest point to the
     * current global position of the light sensor.  This takes into account the
     * global position of the tile.  This only returns one closest point for all
     * the lines and does not account for regions where lines crossover.
     *
     * @param tile {World.Tile} - The tile to check against
     *
     * @returns {p5.Vector} - The vector location of the closest point.
     */
    findClosestLinePoint(tile) {
        let linesClosestPos = [];
        let linesShortestDist = [];
        tile.lines.forEach((line) => {
            let shortestDistance = 2 * World.gridSize;
            let bestPos = createVector(0, 0);

            line.linePoints.forEach((point) => {
                const dist = this.posInTileFrame.dist(point);
                if(dist < shortestDistance) {
                    shortestDistance = dist;
                    bestPos = point.copy();
                }
            });
            linesClosestPos.push(bestPos);
            linesShortestDist.push(shortestDistance);
        });

        const index = linesShortestDist.indexOf(Math.min(...linesShortestDist));
        return linesClosestPos[index].copy();
    }

    /**
     * Calculates the area of a segment given the height of the segment.<br>
     * Area = 0.5 * r^2 * (a - sin(a)); where a is the segment angle.<br>
     * a = 2 * arcos(h / r)<br>
     *
     * @param h {number} - Height of the segment
     *
     * @returns {number} - Area of the segment
     */
    calcSegmentVal(h) {
        const a = 2 * acos(h / this.sensorRadius);
        const segmentArea = 0.5 * this.sensorRadius**2 * (a - sin(a));

        const sensorVal = (this.circleArea - segmentArea) / this.circleArea;
        return sensorVal;
    }

    /**
     * Calculates a raw sensor value based on how close the sensor is to the
     * closest line point.  Reading raw values will not add values to the
     * sensor buffer.
     *
     * @param tile {World.Tile} - The tile to read
     *
     * @returns {number} - Number between 0 and 1.  0 is black and 1 is white.
     */
    readRaw(tile, drawFlag=true) {
        if(tile == undefined) {
            this.closestLinePoint = createVector(-1,-1);
            return this.white;
        }

        // sensor is outside of the tile return white
        if(this.isOutsideofTile(tile)) {
            this.closestLinePoint = createVector(-1,-1);
            return this.white;
        }

        if(tile.lines[0].linePoints.length == 0) {
            this.closestLinePoint = createVector(-1,-1);
            return this.white;
        }

        this.posInTileFrame = this.pos.copy().sub(tile.pos);
        const linePoint = this.findClosestLinePoint(tile);
        this.closestLinePoint = linePoint.copy().add(tile.pos);

        if(drawFlag) {
            push();
            let c = color(0, 187, 35);
            fill(c);
            stroke(c);
            line(linePoint.x + tile.pos.x, linePoint.y + tile.pos.y,
                this.pos.x, this.pos.y);
            ellipse(linePoint.x + tile.pos.x, linePoint.y + tile.pos.y, 5,5);
            pop();
        }

        const dist = this.posInTileFrame.dist(linePoint);

        // sensor is outside of the line return white
        if(dist >= (this.sensorRadius + 0.5 * World.lineThickness)) {
            return this.white;
        }

        // sensor is fully inside the line
        if((dist + this.sensorRadius) <= (0.5 * World.lineThickness)) {
            return this.black;
        }

        // sensor circle is overlapping the line but the centre is external to
        // the line
        if(this.sensorRadius < World.lineThickness) {
            if ((0.5 * World.lineThickness) < dist) {
                if (dist < (0.5 * World.lineThickness + this.sensorRadius)) {
                    console.debug("Small - One Segment In");
                    const h = dist - 0.5 * World.lineThickness;
                    return this.calcSegmentVal(h);
                }
            }
        }

        if(this.sensorRadius >= World.lineThickness) {
            if((this.sensorRadius - 0.5 * World.lineThickness) < dist) {
                if(dist < (0.5 * World.lineThickness + this.sensorRadius)) {
                    console.debug("Big - One Segment In");
                    const h = this.sensorRadius - World.lineThickness;
                    return this.calcSegmentVal(h);
                }
            }
        }

        // sensor has one segment out of the line
        if((2 * this.sensorRadius) < World.lineThickness) {
            if(dist < 0.5 * World.lineThickness) {
                console.debug("Small - One Segment Out");
                const h = 0.5 * World.lineThickness - dist;
                return this.white - this.calcSegmentVal(h);
            }
        }

        if(World.lineThickness <= (2 * this.sensorRadius)) {
            if((this.sensorRadius - 0.5 * World.lineThickness) < dist) {
                if(dist < 0.5 * World.lineThickness) {
                    console.debug("Medium - One Segment Out");
                    const h = 0.5 * World.lineThickness - dist;
                    return this.white - this.calcSegmentVal(h);
                }
            }
        }


        // sensor has two segments out of the line
        if(World.lineThickness < (2 * this.sensorRadius)) {
            if((this.sensorRadius - 0.5 * World.lineThickness) > dist) {
                if(dist < 0.5 * World.lineThickness) {
                    console.debug("Big - Two Segments Out - In Centre");
                    const h1 = 0.5 * World.lineThickness - dist;
                    const h2 = World.lineThickness - h1;
                    const segmentVal1 = this.white - this.calcSegmentVal(h1);
                    const segmentVal2 = this.white - this.calcSegmentVal(h2);
                    return segmentVal1 + segmentVal2;
                }
            }
        }

        if(World.lineThickness < (2 * this.sensorRadius)) {
            if((this.sensorRadius - 0.5 * World.lineThickness) > dist) {
                if(dist > 0.5 * World.lineThickness) {
                    console.debug("Big - Two Segments Out - Off Centre");
                    const h1 = dist - 0.5 * World.lineThickness;
                    const h2 = h1 + World.lineThickness;
                    const segmentVal1 = this.calcSegmentVal(h1);
                    const segmentVal2 = this.white - this.calcSegmentVal(h2);
                    return segmentVal1 + segmentVal2;
                }
            }
        }
        return this.white;
    }

    /**
     * Calculates the an averaged sensor reading over the raw sensor readings
     * stored within the circular buffer.  This function will call
     * Robot.AnalogLightSensor.readRaw(tile) internally and update the buffer
     * automatically.
     *
     * @param tile {World.Tile} - The tile to read.
     *
     * @returns {number} - Number between 0 and 1.  0 is black and 1 is white.
     *
     * @see Robot.AnalogLightSensor.readRaw
     */
    read(tile, drawFlag=true) {
        const rawVal = this.readRaw(tile, drawFlag);

        this.buffer[this.bufferIndex] = rawVal;
        this.bufferIndex ++;
        this.bufferIndex %= this.bufferLen;

        const avg = this.buffer.reduce((prev, current) => {
            return prev + current / this.bufferLen;
        });

        return avg;
    }
};


/**
 * Class containing the digital light sensor features.  This extends the
 * implementation of the analog light sensor by adding thresholds to indicate
 * if the sensor is fully white or fully black.
 *
 * @see Robot.AnalogLightSensor
 */
Robot.DigitalLightSensor = class extends Robot.AnalogLightSensor {

    /**
     * Constructor function for DigitalLightSensor
     *
     * @param sensorRadius {number} - The value of the sensor detection circle
     *      radius.
     * @param position {p5.Vector}  - The current position of the sensor in the
     *      global coordinate frame.
     * @param bufferLength {number} - An integer showing the length of the
     *      internal circular buffer that stores the previous sensor values.
     * @param threshUp {number} - The upper threshold required to return white
     * @param threshDown {number} - The low threshold required to return black
     */
    constructor(sensorRadius, position, bufferLength=1,
        threshUp=0.65, threshDown=0.35) {
        super(sensorRadius, position, bufferLength);
        this.setThresholdUp(threshUp);
        this.setThresholdDown(threshDown);
        this.value = this.white;
    }

    /**
     * A function to swap the thresholds if threshDown is larger than threshUp;
     */
    swapThresholds() {
        const temp = this.thresholdDown;
        this.thresholdDown = this.thresholdUp;
        this.thresholdUp = temp;
    }

    /**
     * A function to set the up threshold.  This will constrain the value to
     * between 0 and 1.  If the threshold is lower than the down threshold then
     * they will be switched.
     *
     * @param threshUp {number} - New threshold.
     */
    setThresholdUp(threshUp) {
        this.thresholdUp = constrain(threshUp, this.black, this.white);
        if(this.thresholdUp > this.thresholdDown) {
            this.swapThresholds();
        }
    }

    /**
     * A function to set the down threshold.  This will constrain the value to
     * between 0 and 1.  If the threshold is higher than the up threshold then
     * they will be switched.
     *
     * @param threshDown {number} - New threshold.
     */
    setThresholdDown(threshDown) {
        this.thresholdDown = constrain(threshDown, this.black, this.white);
        if(this.thresholdUp > this.thresholdDown) {
            this.swapThresholds();
        }
    }

    /**
     * A function to read the value of the light sensor.  It will use the read
     * function from the AnalogLightSensor and compare the value to the
     * thresholds.
     *
     * @param tile {World.Tile} - The tile to read
     *
     * @returns {number} - 0 (black) or 1 (white).
     *
     * @see Robot.AnalogLightSensor.read
     */
    read(tile) {
        const analogValue = super.read(tile);
        if(this.value == this.white && analogValue < this.thresholdDown) {
            this.value = this.black;
        }

        if(this.value == this.black && analogValue > this.thresholdUp) {
            this.value = this.white;
        }

        return this.value;
    }
};
