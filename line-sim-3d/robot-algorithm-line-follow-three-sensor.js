/*******************************************************************************
 *
 *  @file robot-algorithm-line-follow-three-sensor.js A file with the 3 sensor
 *  line following algorithm
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 31-August-2024
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

Robot.Algorithm.ThreeSensorFollowState = {};


/**
 * Class which defines a concrete robot algorithm.  The algorithm implemented
 * uses three analogue light sensors to follow  a black line using a PD
 * proportional derivate controller.  A finite state machine is used to switch
 * between different behaviours.
 *
 * @see Robot.Algorithm.LineFollow
 * @see Robot.Robot
 * @see Robot.RobotTelemetryData
 * @see Robot.MovementCommands
 *
 * @see Simulation.Mode.OneSensorFollow
 * @see Simulation.Mode.LineFollowTwoSensor
 */
Robot.Algorithm.ThreeSensorFollow = class extends Robot.Algorithm.LineFollow {
    /**
     * The constructor of the Two Sensor Follow algorithm.  This initialises
     * the PD parameters and the velocity.
     *
     * @param forwardVel {number} - The forward velocity of the robot when going
     *   in a straight line
     * @param rotationKp {number} - The proportional term for the PD controller.
     * @param rotationKd (number) - The derivative term for the PD controller.
     */
    constructor(forwardVel, rotationKp, rotationKd) {
        super();
        this.forwardVel = forwardVel;
        this.rotationKp = rotationKp;
        this.rotationKd = rotationKd;
        console.debug("Algorithm forward Vel: ", this.forwardVel);
        console.debug("Algorithm rotationKp: ", this.rotationKp);
        console.debug("Algorithm rotationKd: ", this.rotationKd);
        this.pError = 0;


        const startingState = new Robot.Algorithm.ThreeSensorFollowState.PDLineFollow(
            this.forwardVel, this.rotationKp, this.rotationKd);

        this.StateMachine = new FSM.Manager(startingState);
    };

    /**
     * OVERIVEW
     *
     * @param robotData {Robot.RobotTelemetryData} - Values for all the sensors that
     * the robot can read.  This includes the position, velocity, bearing and
     * light sensors.
     *
     * @returns {Robot.MovementCommands} - The commands for the robot effectors.
     */
    follow(robotData) {
        const robotMovementCommand = this.StateMachine.handle(robotData);

        return robotMovementCommand;
    };
};


Robot.Algorithm.ThreeSensorFollowState.PDLineFollow = class extends FSM.StateInterface {
    constructor(forwardVel, rotationKp, rotationKd) {
        super();
        this.forwardVel = forwardVel;
        this.rotationKp = rotationKp;
        this.rotationKd = rotationKd;
        this.pError = 0;
    }

    enterState() {
        console.log("Entering PDLineFollow state");
    };

    handle(robotData) {
        let forwardVel = this.forwardVel;

        // Simple PD controller

        const error = robotData.sensorVals[2] - robotData.sensorVals[0];
        let rotationRate = this.rotationKp * error + this.rotationKd * (this.pError - error);

        // slow down if at a sharp turn
        const velKp = 0.15 * World.gridSize;
        if(error > 0.35) {
            forwardVel = velKp * (1 - error);
            console.debug("Sharp Turn Initial speed (px/s): ", 1.5 * World.gridSize,
                "slow down speed (px/s): ", forwardVel);
        }

        if(error < 0.05 && robotData.sensorVals[1] > 0.995) {
            forwardVel = 0.4 * World.gridSize;
            const gapCrossState = new Robot.Algorithm.ThreeSensorFollowState.CrossGapSearch(
                forwardVel, this);
            this.manager.setState(gapCrossState);
        }

        this.pError = error;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };

    exitState() {
        console.log("Exiting PDLineFollow State");
    };
};

Robot.Algorithm.ThreeSensorFollowState.CrossGapStraightLine = class extends FSM.StateInterface {
    constructor(forwardVel, lineFollowState, detectionThreshold=0.95) {
        super();
        this.forwardVel = forwardVel;
        this.detectionThreshold = detectionThreshold;
        this.lineFollowState = lineFollowState;
    }

    enterState() {
        console.log("Entering CrossGapStraightLine state");
    };

    handle(robotData) {
        for(let i = 0; i < robotData.sensorVals.length; i++) {
            if(robotData.sensorVals[i] < this.detectionThreshold) {
                this.manager.setState(this.lineFollowState);
                break;
            }
        }

        return new Robot.MovementCommands(this.forwardVel, 0);
    };

    exitState() {
        console.log("Exiting CrossGapStraightLine State");
    };
};



Robot.Algorithm.ThreeSensorFollowState.CrossGapSearch = class extends FSM.StateInterface {
    constructor(forwardVel, lineFollowState, detectionThreshold=0.95) {
        super();
        this.forwardVel = forwardVel;
        this.detectionThreshold = detectionThreshold;
        this.lineFollowState = lineFollowState;

        const Direction = {
          LEFT: 1,
          RIGHT: 2,
          FORWARDS: 3
        };
        this.direction = Object.freeze(Direction);
        this.movementDir = this.direction.FORWARDS;
        this.forwardBearing = undefined;
        this.turnOffset = QUARTER_PI;
        this.rotationRate = radians(120); // 60 degs per second
        this.forwardCount = 0;
        this.forwardCountThresh = 40;
    };

    enterState() {
        console.log("Entering CrossGapSearch state");
    };

    calculateBearigns(forwardBearing) {
        this.forwardBearing = forwardBearing;

        this.leftBearing = this.forwardBearing - this.turnOffset;
        if(this.leftBearing < 0) {
            this.leftBearing += TWO_PI;
        }

        this.rightBearing = this.forwardBearing + this.turnOffset;
        if(this.rightBearing > TWO_PI) {
            this.rightBearing -= TWO_PI;
        }
        console.debug("Left Bearing: ", degrees(this.leftBearing));
        console.debug("Front Bearing: ", degrees(this.forwardBearing));
        console.debug("Right Bearing: ", degrees(this.rightBearing));
    };

    handle(robotData) {
        for(let i = 0; i < robotData.sensorVals.length; i++) {
            if(robotData.sensorVals[i] < this.detectionThreshold) {
                this.manager.setState(this.lineFollowState);
                break;
            }
        }

        if(this.forwardBearing == undefined) {
            this.calculateBearigns(robotData.bearing);
        }

        let forwardVel = this.forwardVel;
        let rotationRate = this.rotationRate;
        switch(this.movementDir) {
            case this.direction.LEFT:
                forwardVel = 0;
                rotationRate *= -1;
                if(abs(robotData.bearing - this.leftBearing) < 0.1) {
                    this.movementDir++;
                }
                break;
            case this.direction.RIGHT:
                forwardVel = 0;
                if(abs(robotData.bearing - this.rightBearing) < 0.1) {
                    this.movementDir++;
                }
                break;
            case this.direction.FORWARDS:
                if(abs(robotData.bearing - this.forwardBearing) > 0.05) {
                    rotationRate *= -0.5;
                    forwardVel = 0;
                    break;
                }

                rotationRate = 0;
                this.forwardCount++;
                if(this.forwardCount > this.forwardCountThresh) {
                    this.movementDir = this.direction.LEFT;
                    this.forwardCount = 0;
                    this.turnOffset *= 1.25;
                    this.calculateBearigns(this.forwardBearing);
                }
                break;
        }

        return new Robot.MovementCommands(forwardVel, rotationRate);
    };

    exitState() {
        console.log("Exiting CrossGapSearch State");
    };
};

