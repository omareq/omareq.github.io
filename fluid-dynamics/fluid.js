/*******************************************************************************
 *
 *  @file fluid.js File containing a fluid class that simulates fluid dynamics
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 17-December-2022
 *  @link https://omareq.github.io/fluid-dynamics/
 *  @link https://omareq.github.io/fluid-dynamics/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2022 Omar Essilfie-Quaye
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
 * @class      Fluid () This class describes a fluid.
 */
class Fluid {
    /**
     * Constructs a new instance of a Fluid
     *
     * @param      {number}  numX       The number of horizontal cells in the
     * @param      {number}  numY       The number of vertical cells in the
     * @param      {number}  density    The density of the fluid
     */
    constructor(numX, numY, density) {
        this.density = density;
        this.numX = numX;
        this.numY = numY;
        this.numCells = this.numX * this.numY;
        this.velX = [];
        this.velY = [];
        this.newVelX = [];
        this.newVelY = [];
        this.pressure = [];
        this.boundary =[]; // 1 if no wall and 0 if there is a wall

        const startXVal = 10;
        const startYVal = 0;

        for (let col = 0; col < numX; col++) {
            this.velX[col] = new Array(this.numX).fill(startXVal);
            this.velY[col] = new Array(this.numY).fill(col/100);
            this.newVelX[col] = new Array(this.numX).fill(startXVal);
            this.newVelY[col] = new Array(this.numY).fill(startYVal);
            this.pressure[col] = new Array(this.numY).fill(0);
            this.boundary[col] = new Array(this.numY).fill(1);
        }

        this.showFieldLines = false;
        this.showStreamLines = true;
        this.showPressure = false;
        this.showSmoke = false;
        this.showBoundary = false;
    }

    /**
     * Applies the force of gravity to the fluid
     *
     * @param      {number}  dt       The simulation time step
     * @param      {number}  gravity  The acceleration due to gravity
     */
    applyGravity(dt, gravity) {
        for(let col = 0; col < this.numX; col++) {
            for(let row = 1; row < this.numY; row++) {
                if(this.boundary[col][row] != 0 && this.boundary[col][row - 1]) {
                    this.velY += gravity * dt;
                }
            }
        }
    }

    update(dt) {
        this.applyGravity(dt, 9.81);
    }

    /**
     * Draws the brick on the canvas
     *
     * @param   {number}    Space   The space between the drawn field lines
     * @param   {number}    Scale   The scale factor to change the length of
     *                              the field lines
     */
    draw(space, scale) {
        push();
        stroke(0);
        fill(0);
        if(this.showFieldLines) {
            for(let col = 0; col < this.numX; col+=space) {
                for(let row = 0; row < this.numY; row+=space) {
                    const length = sqrt(sq(this.velX[col][row]) +
                        sq(this.velY[col][row]));

                    const theta = atan2(this.velY[col][row],
                        this.velX[col][row]);

                    const x = scale * length * cos(theta);
                    const y = scale * length * sin(theta);

                    line(col, row, col + x, row + y);
                    ellipse(col, row, space * 0.05, space * 0.05);

                }
            }


        } else if(this.showStreamLines) {
            const numSegments = 15;
            push();
            noFill();

            // initialised outside of the loop to save on multiple
            // reinitialisations within a critical loop
            let x = 0;
            let y = 0;
            let velX = 0;
            let velY = 0;
            let length = 0;

            for(let col = 0; col < this.numX; col+=space) {
                for(let row = 0; row < this.numY; row+=space) {
                    x = col;
                    y = row;

                    beginShape();
                    for(let i = 0; i < numSegments; i++) {
                        velX = floor(this.velX[x][y]);
                        velY = floor(this.velY[x][y]);
                        length = sqrt(sq(velX) + sq(velY));
                        x += velX;
                        y += velY;

                        if(x >= width - 1 || x < 0) {
                            break;
                        }

                        if(y >= height - 1 || y < 0) {
                            break;
                        }

                        vertex(x, y);
                    }
                    endShape();
                }
            }
            pop();
        }

        if(this.showPressure) {

        }

        stroke(155);
        fill(155);

        // replace this with drawing contours as this will be faster to render
        if(this.showBoundary) {
            for(let col = 0; col < this.numX; col++) {
                for(let row = 0; row < this.numY; row++) {
                    if(this.boundary[col][row] == 0) {
                        rect(col, row, 1, 1);
                    }
                }
            }
        }
        pop();
    }
}
