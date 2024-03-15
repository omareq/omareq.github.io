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

/**
 * Robot Namespace Object
 */
var Robot = Robot || {};

Robot.AnalogLightSensor = class {
    constructor(sensorRadius, position, bufferLength=1) {
        this.sensorRadius = sensorRadius;
        this.circleArea = PI * this.sensorRadius**2;
        this.pos = position;
        this.bufferLen = bufferLength;
        if(this.bufferLen < 1) {
            this.bufferLen = 1;
        }
        this.buffer = [];
        this.bufferIndex = 0;

        this.setupBuffer();
    }

    setupBuffer() {
        for(let i = 0; i < this.bufferLen; i++) {
            this.buffer.push(0);
        }
    }

    setPos(position) {
        this.pos = position;
    }

    findClosestLinePoint(tile) {
        let linesClosestPos = [];
        let linesShortestDist = [];
        tile.lines.forEach((line) => {
            let shortestDistance = 2 * World.gridSize;
            let bestPos = createVector(0, 0);

            line.linePoints.forEach((point) => {
                const dist = this.pos.dist(point);
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

        const circleArea = PI * this.sensorRadius**2;
        const sensorVal = (circleArea - segmentArea) / circleArea;
        return sensorVal;
    }

    readRaw(tile) {

        const linePoint = this.findClosestLinePoint(tile);

        push()
        let c = color(0, 187, 35)
        fill(c);
        stroke(c);
        line(linePoint.x, linePoint.y, this.pos.x, this.pos.y);
        ellipse(linePoint.x, linePoint.y, 5,5);

        pop();
        const dist = this.pos.dist(linePoint);

        // sensor is outside of the line return white
        if(dist > (this.sensorRadius + 0.5 * World.lineThickness)) {
            return 1;
        }

        // sensor is fully inside the line
        if((dist + this.sensorRadius) < (0.5 * World.lineThickness)) {
            return 0;
        }

        // sensor circle is overlapping the line but the centre is external to
        // the line
        if(this.sensorRadius < World.lineThickness) {
            if ((0.5 * World.lineThickness) < dist && dist < (0.5 * World.lineThickness + this.sensorRadius)) {
                const h = dist - 0.5 * World.lineThickness;
                return this.calcSegmentVal(h);
            }
        }

        if(this.sensorRadius > World.lineThickness) {
            if( (this.sensorRadius - dist) < dist && dist < (0.5 * World.lineThickness + this.sensorRadius)) {
                const h = dist - 0.5 * World.lineThickness;
                return this.calcSegmentVal(h);
            }
        }

        // sensor has one segment out of the line
        if(this.sensorRadius < World.lineThickness) {
            const h = 0.5 * World.lineThickness - dist;
            return 1 - this.calcSegmentVal(h);
        }



        // sensor has two segments out of the line



        return 1;
    }

    read(tile) {
        const rawVal = sensorReadRaw(tile);

        this.buffer[bufferIndex] = rawVal;
        this.bufferIndex ++;
        this.bufferIndex %= this.bufferLen;


        const avg = this.buffer.reduce((prev, current) => {
            return prev + current / this.bufferLen;
        });

    }
}
