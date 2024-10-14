/*******************************************************************************
 *
 *  @file camera.js A file with all the the camera control
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 14-October-2024
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
 * UI Namespace Object
 */
var Simulation = Simulation || {};

Simulation.CameraControl = {};

Simulation.CameraControl.Modes = {};

Simulation.activeCameraMode = undefined;

Simulation.CameraControl.CameraMode = class {
    constructor() {
        let err = "Abstract class Simulation.CameraControl.CameraMode can't be instantiated.";
        if(this.constructor == Simulation.CameraControl.CameraMode) {
          throw new Error(err);
        }

        this.cam = createCamera();
        setCamera(this.cam);
    }

    update() {
        let err = "Abstract class Simulation.CameraControl.CameraMode can't be instantiated.";
        if(this.constructor == Simulation.CameraControl.CameraMode) {
          throw new Error(err);
        }
    }
};

Simulation.CameraControl.Modes.Default2D = class extends Simulation.CameraControl.CameraMode {
    constructor() {
        super();
    }

    update() {}
};

Simulation.CameraControl.Modes.Orbit3D = class extends Simulation.CameraControl.CameraMode {
    constructor() {
        super();
    }

    update() {
        orbitControl();
    }
};