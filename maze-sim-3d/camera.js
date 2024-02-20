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

const camViewPositions = Object.freeze({
  SOUTH:        0,
  SOUTH_EAST:   1,
  EAST:         2,
  NORTH_EAST:   3,
  NORTH:        4,
  NORTH_WEST:   5,
  WEST:         6,
  SOUTH_WEST:   7,
  TOP:          8,

});

function searchCamPositions(currentPosition) {
    for (let key in camViewPositions) {
        var value = camViewPositions[key];
        if (value === currentPosition) {
            return key;
        }
    }
}

let unitX = 0;
let unitY = 1;
let viewPos = camViewPositions.SOUTH;
let axisX = 0;
let axisY = 1;
let axisZ = 0;
let maxZoom = 10;
let minZoom = 1;
let zoom = 3;
let myCamera;

function cameraPreviousView() {
    viewPos--;
    if(viewPos < 0) {
        viewPos = 8;
    }
    const viewPosKey = searchCamPositions(viewPos);
    cameraPosDisplay.elt.innerText = "View: " + str(viewPosKey);
    console.debug("Camera switch to previous view pos: ", viewPosKey);
    cameraUpdateViewPos(viewPos);
}

function cameraNextView() {
    viewPos++;
    if(viewPos > 8) {
        viewPos = 0;
    }
    const viewPosKey = searchCamPositions(viewPos);
    cameraPosDisplay.elt.innerText = "View: " + str(viewPosKey);
    console.debug("Camera switch to next view pos: ", viewPosKey);
    cameraUpdateViewPos(viewPos);
}


function cameraUpdateViewPos(newViewPos) {
    if(newViewPos == camViewPositions.SOUTH_EAST) {
        unitX = 1;
        unitY = 1;
    } else if (newViewPos == camViewPositions.EAST) {
        unitX = 1;
        unitY = 0;
    } else if (newViewPos == camViewPositions.NORTH_EAST) {
        unitX = 1;
        unitY = -1;
    } else if (newViewPos == camViewPositions.NORTH) {
        unitX = 0;
        unitY = -1;
    } else if (newViewPos == camViewPositions.NORTH_WEST) {
        unitX = -1;
        unitY = -1;
    } else if (newViewPos == camViewPositions.WEST) {
        unitX = -1;
        unitY = 0;
    } else if (newViewPos == camViewPositions.SOUTH_WEST) {
        unitX = -1;
        unitY = 1;
    } else if (newViewPos == camViewPositions.TOP) {
        unitX = 0;
        unitY = 0;
    } else if (newViewPos == camViewPositions.SOUTH) {
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

function cameraUpdate(robot, gridSize) {
    const centreX = robot.pos.x * gridSize;
    const centreY = robot.pos.y * gridSize;
    const centreZ = 0;

    if(keyIsPressed && (key == 'c' || key == 'C')) {
        cameraNextView();
    }

    if(keyIsPressed && (key == 'z' || key == 'Z')) {
        // delay(100)
        zoom = zoom - 0.2;
        if(zoom < 1.5) {
            zoom = 10;
        }
        // let a = document.getElementById("camera-zoom-slider");
        // let b = a.getElementsByTagName("input")[0];
        // b.value = zoom;
        // console.log(zoom);
    }

    const unit = gridSize * zoom;
    const camX = centreX + unit * unitX;
    const camY = centreY + unit * unitY;
    const camZ = centreZ + 1.5 * unit;

    myCamera = camera(camX, camY, camZ, centreX, centreY, centreZ, axisX, axisY, axisZ);
    // pointLight(255,255, 255, camX, camy, camZ);
}
