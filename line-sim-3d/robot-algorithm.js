/*******************************************************************************
 *
 *  @file robot-algorithm.js A file with the robot class
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 04-April-2024
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

Robot.Algorithm = Robot.Algorithm || {};


Robot.Algorithm.LineFollow = class {
    constructor() {
        let err = "Abstract class Robot.Algorithm.LineFollow can't be instantiated.";
        if(this.constructor == Robot.Algorithm.LineFollow) {
          throw new Error(err);
        }
    }

    follow(robotData) {
        throw new Error("Method 'Robot.Algorithm.update(robotData)' must be implemented.");
    }
};

Robot.Algorithm.Empty = class extends Robot.Algorithm.LineFollow {
    constructor() {super();};
    follow(robotData) {
        const forwardVel = 0;
        const rotationRate = 0;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

Robot.Algorithm.StraightLine = class extends Robot.Algorithm.LineFollow {
    constructor() {super();};
    follow(robotData) {
        const forwardVel = World.gridSize;
        const rotationRate = 0;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

Robot.Algorithm.CurveRight = class extends Robot.Algorithm.LineFollow {
    constructor() {super();};
    follow(robotData) {
        const forwardVel = 0.4 * World.gridSize;
        const rotationRate = 0.35;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

Robot.Algorithm.CurveLeft = class extends Robot.Algorithm.LineFollow {
    constructor() {super();};
    follow(robotData) {
        const forwardVel = 0.4 * World.gridSize;
        const rotationRate = -0.35;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

Robot.Algorithm.OneSensorFollow = class extends Robot.Algorithm.LineFollow {
    constructor() {super();};
    follow(robotData) {
        const forwardVel = 0.30 * World.gridSize;
        let rotationRate = -1.2;
        if(robotData.sensorVals[0] < 0.5 ) {
            rotationRate *= -1;
        }
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

Robot.Algorithm.TwoSensorFollow = class extends Robot.Algorithm.LineFollow {
    constructor(forwardVel, rotationKp, rotationKd) {
        super();
        this.forwardVel = forwardVel;
        this.rotationKp = rotationKp;
        this.rotationKd = rotationKd;
        console.debug("Algorithm forward Vel: ", this.forwardVel);
        console.debug("Algorithm rotationKp: ", this.rotationKp);
        console.debug("Algorithm rotationKd: ", this.rotationKd);
        this.pError = 0;
        this.crossingGap = false;
        this.crossingParam = 0;
    };

    follow(robotData) {
        let forwardVel = this.forwardVel;

        // Simple PD controller

        const error = robotData.sensorVals[1] - robotData.sensorVals[0];
        // const rotationKp = 12;
        // const rotationKd = 0;
        let rotationRate = this.rotationKp * error + this.rotationKd * (this.pError - error);

        // slow down if at a sharp turn
        const velKp = 0.15 * World.gridSize;
        if(error > 0.35) {
            forwardVel = velKp * (1 - error);
            console.log("Initial speed (px/s): ", 1.5 * World.gridSize,
                "slow down speed (px/s): ", forwardVel);
        }

        if(error == 0) {
            console.log("Crossing Gap");
            forwardVel = 0.4 * World.gridSize;
        //     if(this.crossingGap) {
        //         rotationRate = 0.75 * math.sin(this.crossingParam) - 0.05;
        //         this.crossingParam += 0.15;
        //     }
        //     this.crossingGap = true;
        // } else {
        //     this.crossingGap = false;
        }

        this.pError = error;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

