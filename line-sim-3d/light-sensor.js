/*******************************************************************************
 *
 *  @file ui.js A file with the light sensor class
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

Robot.AnalogLightSensor = class {
    constructor(sensorRadius, position, bufferLength=1) {
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

    setupBuffer() {
        for(let i = 0; i < this.bufferLen; i++) {
            this.buffer.push(0);
        }
    }

    setPos(position) {
        this.pos = position;
    }

    setRadius(sensorRadius) {
        this.sensorRadius = sensorRadius;
        this.circleArea = PI * this.sensorRadius**2;
    }

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

    calcSegmentVal(h) {
        // Dark segment area
        // A = 0.5 * R^2 * (a - sin a)
        // where a = segment angle
        // cos a/2 = h/r
        // a / 2 = arcos(h/r)
        const a = 2 * acos(h / this.sensorRadius);
        const segmentArea = 0.5 * this.sensorRadius**2 * (a - sin(a));

        const sensorVal = (this.circleArea - segmentArea) / this.circleArea;
        return sensorVal;
    }

    readRaw(tile) {
        // sensor is outside of the tile return white
        if(this.isOutsideofTile(tile)) {
            return this.white;
        }

        this.posInTileFrame = this.pos.copy().sub(tile.pos);
        const linePoint = this.findClosestLinePoint(tile);

        push();
        let c = color(0, 187, 35);
        fill(c);
        stroke(c);
        line(linePoint.x + tile.pos.x, linePoint.y + tile.pos.y,
            this.pos.x, this.pos.y);
        ellipse(linePoint.x + tile.pos.x, linePoint.y + tile.pos.y, 5,5);
        pop();

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

    read(tile) {
        const rawVal = this.readRaw(tile);

        this.buffer[this.bufferIndex] = rawVal;
        this.bufferIndex ++;
        this.bufferIndex %= this.bufferLen;

        const avg = this.buffer.reduce((prev, current) => {
            return prev + current / this.bufferLen;
        });

        return avg;
    }
};

Robot.DigitalLightSensor = class extends Robot.AnalogLightSensor {
    constructor(sensorRadius, position, bufferLength=1,
        threshUp=0.65, threshDown=0.35) {
        super(sensorRadius, position, bufferLength);
        this.setThresholdUp(threshUp);
        this.setThresholdDown(threshDown);
        this.value = this.white;
    }

    swapThresholds() {
        const temp = this.thresholdDown;
        this.thresholdDown = this.thresholdUp;
        this.thresholdUp = temp;
    }

    setThresholdUp(threshUp) {
        this.thresholdUp = constrain(threshUp, this.black, this.white);
        if(this.thresholdUp > this.thresholdDown) {
            this.swapThresholds();
        }
    }

    setThresholdDown(threshDown) {
        this.thresholdDown = constrain(threshDown, this.black, this.white);
        if(this.thresholdUp > this.thresholdDown) {
            this.swapThresholds();
        }
    }

    digitalRead(tile) {
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
