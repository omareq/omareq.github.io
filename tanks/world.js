/*******************************************************************************
 *
 *  @file World.js A file with the classes for the World elements
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 12-February-2025
 *  @link https://omareq.github.io/tanks/
 *  @link https://omareq.github.io/tanks/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2025 Omar Essilfie-Quaye
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
 * TankGame namespace object
 */
var TankGame = TankGame || {};

TankGame.World = {};

TankGame.World.Terrain = class {
    constructor(width, minHeight, maxHeight, noiseDetail=1) {
        this.width = width;
        this.groundHeight = [];
        const heightRange = maxHeight - minHeight;
        for(let i = 0; i < width; i++) {
            let nextGroundHeight = heightRange * noise(i * noiseDetail) + minHeight;
            this.groundHeight.push(nextGroundHeight);
        }

        this.color = color(155, 155, 155);
        this.stepSize = 10;
    };

    removeCircle(xPos, radius) {
        if(xPos < 0 || xPos > width) {
            let err = "Can't remove circle that is out of bounds: ";
            err += " xPos - " + xPos;
            throw(err);
        }
//TODO: Checks that inputs are valid numbers
        const index = floor(xPos);
        const r = floor(radius);
        const yPos = this.groundHeight[index];

        for(let i = index - r; i < index + r; i++) {
            // (x - a) ^2 + (y - b) ^2 = r^2
            // (y - b)^2 = r^2 - (x - a)^2
            // y = \sqrt(r^2 - (x - a)^2) + b

            const newY = sqrt(r**2 - (i - xPos)**2) + yPos;

            if(this.groundHeight[i] < newY) {
                this.groundHeight[i] = newY;
            }
        }

        return;
    };

    drawTriangleStrip() {
        beginShape(TRIANGLE_STRIP);
        vertex(0, height);
        for(let i = 0; i < this.groundHeight.length; i+= this.stepSize) {
            vertex(i, this.groundHeight[i]);
            vertex(i + this.stepSize / 2, height);
        }
        vertex(this.width, this.groundHeight[this.groundHeight.length - 1]);
        vertex(this.width, height);

        endShape();
    };

    drawRect() {
        for(let i = 0; i < this.groundHeight.length; i+= this.stepSize) {
//TODO: Try dynamically assigning width of rectangle based on terrain gradient
            rect(i, this.groundHeight[i], this.stepSize, height - this.groundHeight[i]);
        }
    };

    draw() {
        stroke(this.color);
        fill(this.color);
        const drawRetro = true;

        if(drawRetro) {
            this.drawRect();
        } else {
            this.drawTriangleStrip();
        }
    };
};

// wind