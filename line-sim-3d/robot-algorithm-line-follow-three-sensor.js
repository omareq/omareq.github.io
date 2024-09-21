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

    enterState(robotData) {
        console.log("Entering PDLineFollow state");
    };

    checkForIntersection(robotData) {
        const sensor0 = robotData.sensorVals[0] < 0.25;
        const sensor1 = robotData.sensorVals[1] < 0.15;
        const sensor2 = robotData.sensorVals[2] < 0.25;

        if(sensor0 + sensor1 + sensor2 >= 2) {
            let intersectionState =
                new Robot.Algorithm.ThreeSensorFollowState.LineIntersection(
                    this);

            this.manager.setState(intersectionState);
        }
    }

    handle(robotData) {
        this.checkForIntersection(robotData);
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

    exitState(robotData) {
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

    enterState(robotData) {
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

    exitState(robotData) {
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

    enterState(robotData) {
        console.log("Entering CrossGapSearch state");
        this.calculateBearings(robotData.bearing);
    };

    calculateBearings(forwardBearing) {
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
                    this.calculateBearings(this.forwardBearing);
                }
                break;
        }

        return new Robot.MovementCommands(forwardVel, rotationRate);
    };

    exitState(robotData) {
        console.log("Exiting CrossGapSearch State");

    };
};


Robot.Algorithm.ThreeSensorFollowState.LineIntersection = class extends FSM.StateInterface {
    constructor(lineFollowState, detectionThreshold = 0.5) {
        super();
        this.lineFollowState = lineFollowState;
        this.scanBearings = [];
        this.scanSensorValsRaw = [];
        this.scanSensorVals = [];

        const Mode = {
            MOVE_FORWARDS: 1,
            TURN_TO_START_BEARING: 2,
            SCAN: 3,
            TURN_TO_FINAL_BEARING: 4
        };
        this.mode = Object.freeze(Mode);
        this.currentMode = this.mode.MOVE_FORWARDS;
        this.rotationRate = radians(180); // 60 degs per second
        this.detectionThreshold = detectionThreshold;
        this.forwardCount = 0;
        this.forwardCountThresh = 18;
    };

    calculateBearings(forwardBearing) {
        this.forwardBearing = forwardBearing;
        const turnOffset = 1.1 * HALF_PI;

        this.leftBearing = this.forwardBearing - turnOffset;
        if(this.leftBearing < 0) {
            this.leftBearing += TWO_PI;
        }

        this.rightBearing = this.forwardBearing + turnOffset;
        if(this.rightBearing > TWO_PI) {
            this.rightBearing -= TWO_PI;
        }
        console.debug("Left Bearing: ", degrees(this.leftBearing));
        console.debug("Front Bearing: ", degrees(this.forwardBearing));
        console.debug("Right Bearing: ", degrees(this.rightBearing));

        this.finalBearing = this.forwardBearing;
    };

    decideOnFinalBearing() {
        console.debug(this.scanSensorVals);
        let scanValsSimple = [];
        let bearingSimple = [];

        let lastVal = this.scanSensorVals[0];
        let lineCount = 0;
        if(lastVal) {
            lineCount++;
        }

        scanValsSimple.push(lastVal);
        bearingSimple.push(this.scanBearings[0]);

        for(let i = 1; i < this.scanSensorVals.length; i++) {
            if(this.scanSensorVals[i] != lastVal) {
                lastVal = this.scanSensorVals[i];
                scanValsSimple.push(lastVal);
                bearingSimple.push(this.scanBearings[i]);

                if(lastVal) {
                    lineCount++;
                }
            }
        }

        console.log(scanValsSimple);
        console.log(bearingSimple);
        console.log("Line Count: ", lineCount);

        switch(lineCount) {
            case 1:
                // turn to the only line
                for(let i = 0; i < scanValsSimple.length; i++) {
                    if(scanValsSimple[i]) {
                        this.finalBearing = bearingSimple[i];
                        return;
                    }
                }
            break;

            case 2:
                // turn to the right most line
                // turn to the only line
                for(let i = scanValsSimple.length - 1; i >=0; i--) {
                    if(scanValsSimple[i]) {
                        this.finalBearing = bearingSimple[i];
                        return;
                    }
                }
            break;

            case 3:
                // turn to the middle line
                let secondLine = false;
                for(let i = 0; i < scanValsSimple.length; i++) {
                    if(scanValsSimple[i] && !secondLine) {
                        secondLine = true;
                        continue;
                    }

                    if(scanValsSimple[i] && secondLine) {
                        this.finalBearing = bearingSimple[i];
                        return;
                    }
                }
            break;

            default:
                // erm how did that happen
                // turn back to the start bearing and go forwards
                this.finalBearing = this.forwardBearing;
            break;


        }
    }

    enterState(robotData) {
        console.log("Entering LineIntersection state");
        this.calculateBearings(robotData.bearing);
    };

    handle(robotData) {
        let forwardVel = 0;
        let rotationRate = this.rotationRate;



        switch(this.currentMode) {
            case this.mode.MOVE_FORWARDS:
                rotationRate = 0;
                forwardVel = 50;
                this.forwardCount++;
                if(this.forwardCount > this.forwardCountThresh) {
                    this.currentMode++;
                }

                break;
            case this.mode.TURN_TO_START_BEARING:
                forwardVel = 0;
                rotationRate *= -1;
                if(abs(robotData.bearing - this.leftBearing) < 0.1) {
                    this.currentMode++;
                }
                break;
            case this.mode.SCAN:
                rotationRate*= 0.5;
                this.scanBearings.push(robotData.bearing);
                this.scanSensorValsRaw.push(robotData.sensorVals[1]);
                this.scanSensorVals.push(robotData.sensorVals[1] < this.detectionThreshold);

                if(abs(robotData.bearing - this.rightBearing) < 0.1) {
                    this.decideOnFinalBearing();
                    this.currentMode++;
                }
                break;
            case this.mode.TURN_TO_FINAL_BEARING:
                rotationRate=-1;
                if(abs(robotData.bearing - this.finalBearing) < 0.1) {
                    this.manager.setState(this.lineFollowState);
                }
                break;
        }
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };

    exitState(robotData) {
        console.log("Exiting LineIntersection State");
    };
};

