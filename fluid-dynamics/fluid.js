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
     *                                  fluid
     * @param      {number}  numY       The number of vertical cells in the
     *                                  fluid
     * @param      {number}  density    The density of the fluid
     */
    constructor(numX, numY, density) {
        this.density = density;
        this.numX = numX;
        this.numY = numY;
        this.numCells = this.numX * this.numY;
        this.velX = ;
        this.velY = ;
        this.newVelX = ;
        this.newVelY = ;

        this.showFieldLines = true;
        this.showStreamLines = false;
        this.showPressure = false;
        this.showSmoke = false;
    }

    /**
     * Draws the brick on the canvas
     */
    draw() {

    }
}
