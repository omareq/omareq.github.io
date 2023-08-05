/*******************************************************************************
 *
 *  @file camera.js A function that updates the viewpoint of the camera
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 19-August-2022
 *  @link https://omareq.github.io/maze-sim-3d/
 *  @link https://omareq.github.io/maze-sim-3d/docs/
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

 // change the method of view switching such that it doesn't need so many if statements
 // perhaps try using an arrray of possible values and then change the itterator such that
 // the correct value is always in use

let unitX = 0;
let unitY = 1;
let viewPos = 0;
let axisX = 0;
let axisY = 1;
let axisZ = 0;
let maxZoom = 10;
let minZoom = 1;
let zoom = 3;

function cameraUpdate(robot, gridSize) {
    const centreX = robot.pos.x * gridSize;
    const centreY = robot.pos.y * gridSize;
    const centreZ = 0;

    if(keyIsPressed && (key == 'c' || key == 'C')) {
        if(viewPos == 0) {
            viewPos = 1;
            unitX = 1;
        } else if (viewPos == 1) {
            viewPos = 2;
            unitY = 0;
        } else if (viewPos == 2) {
            viewPos = 3;
            unitY = -1;
        } else if (viewPos == 3) {
            viewPos = 4;
            unitX = 0;
        } else if (viewPos == 4) {
            viewPos = 5;
            unitX = -1;
        } else if (viewPos == 5) {
            viewPos = 6;
            unitY = 0;
        } else if (viewPos == 6) {
            viewPos = 7;
            unitY = 1;
        } else if (viewPos == 7) {
            viewPos = 8;
            unitX = 0;
            unitY = 0;
        } else if (viewPos == 8) {
            viewPos = 0;
            unitX = 0;
            unitY = 1;
        }

        if(!(viewPos==8)) {
            axisX = unitX;
            axisY = unitY;
            axisZ = 0;
        } else {
            axisX = 0;
            axisY = 1;
            axisZ = 0;
        }
    }

    if(keyIsPressed && (key == 'z' || key == 'Z')) {
        // delay(100)
        zoom = zoom - 0.2;
        if(zoom < 1.5) {
            zoom = 10;
        }
        // console.log(zoom);
    }

    const unit = gridSize * zoom;
    const camX = centreX + unit * unitX;
    const camY = centreY + unit * unitY;
    const camZ = centreZ + 1.5 * unit;

    camera(camX, camY, camZ, centreX, centreY, centreZ, axisX, axisY, axisZ);
    // pointLight(255,255, 255, camX, camy, camZ);
}
