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
        this.is3d = !this.is2d;
        let err = "Abstract class Simulation.CameraControl.CameraMode can't be instantiated.";
        if(this.constructor == Simulation.CameraControl.CameraMode) {
          throw new Error(err);
        }
    }
};

Simulation.CameraControl.Modes.Default2D = class extends Simulation.CameraControl.CameraMode {
    constructor() {
        super();
        this.name = "Default2D";
        this.is2d = true;
    }

    update() {}
};

Simulation.CameraControl.Modes.Orbit3D = class extends Simulation.CameraControl.CameraMode {
    constructor() {
        super();
        this.name = "Orbit3D";
        this.is2d = false;
    }

    update() {
        orbitControl();
    }
};

Simulation.CameraControl.Modes.FollowRobot3D = class extends Simulation.CameraControl.CameraMode {
    constructor() {
        super();
        this.name = "FollowRobot3D";
        this.is2d = false;
        if(Simulation.Mode.activeMode.robot == undefined) {
            throw("There is no robot for the camera to follow");
        }
    }

    update() {
        if(Simulation.Mode.activeMode.robot == undefined) {
            throw("There is no robot for the camera to follow");
        }
        const robotData = Simulation.Mode.activeMode.robot.getTelemetryData();

        if(robotData.vel < 0.1 * robotData.maxVel) {
            return;
        }

        const lookAheadDist = 7 * robotData.robotSize;
        const camFollowDist = 1 * robotData.robotSize;
        const camHeight = 1 * robotData.robotSize;

        let pos = robotData.pos.copy();
        // translate doesn't work on the cam set position function
        pos.sub(createVector(width/2, height/2, 0));

        let aim = createVector(1, 0, 0);
        aim.setMag(lookAheadDist);
        aim.setHeading(robotData.bearing + HALF_PI);
        aim.add(pos);
        aim.sub(createVector(width/2, height/2));

        let cam = pos.copy().sub(aim.copy().setMag(camFollowDist));
        cam.add(createVector(0,0, camHeight));
        cam.sub(createVector(width/2, height/2));




        this.cam.setPosition(cam.x, cam.y, cam.z);
        this.cam.lookAt(aim.x, aim.y, pos.z);

        push();
        colorMode(RGB);
        translate(width/2, height/2, 4);
        stroke(0);
        fill(255, 0, 0);
        ellipse(cam.x, cam.y, 5, 5);
        fill(0, 255, 0);
        ellipse(aim.x, aim.y, 5, 5);
        line(aim.x, aim.y, cam.x, cam.y);
        pop();

        // this.cam.setPosition(pos.x,
        //     pos.y,
        //     pos.z + 35 * robotData.robotSize);
        // this.cam.lookAt(pos.x, pos.y, pos.z);
        // orbitControl();

    }
};

Simulation.CameraControl.Modes.FollowRobotTop3D = class extends Simulation.CameraControl.CameraMode {
    constructor() {
        super();
        this.name = "FollowRobotTop3D";
        this.is2d = false;
        if(Simulation.Mode.activeMode.robot == undefined) {
            throw("There is no robot for the camera to follow");
        }
    }

    update() {
        if(Simulation.Mode.activeMode.robot == undefined) {
            throw("There is no robot for the camera to follow");
        }
        const robotData = Simulation.Mode.activeMode.robot.getTelemetryData();

        let pos = robotData.pos.copy();
        // translate doesn't work on the cam set position function
        pos.sub(createVector(width/2, height/2, 0));

        this.cam.setPosition(pos.x,
            pos.y,
            pos.z + 15 * robotData.robotSize);
        this.cam.lookAt(pos.x, pos.y, pos.z);
    }
};