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

/**
 * An abstract class that defines the interface for line following algorithms
 *
 * @see Robot.robot
 * @see Robot.RobotTelemetryData
 * @see Robot.MovementCommands
 * @see Robot.Algorithm.OneSensorFollow
 * @see Robot.Algorithm.TwoSensorFollow
 * @see Robot.Algorithm.CurveLeft
 * @see Robot.Algorithm.CurveRight
 * @see Robot.Algorithm.StraightLine
 * @see Robot.Algorithm.Empty
 */
Robot.Algorithm.LineFollow = class {
    /**
     * constructor for the Robot.Algorithm.LineFollow class
     *
     * @throws {Error} Abstract class Robot.Algorithm.LineFollow  can't be
     *  instantiated
     */
    constructor() {
        let err = "Abstract class Robot.Algorithm.LineFollow can't be instantiated.";
        if(this.constructor == Robot.Algorithm.LineFollow) {
          throw new Error(err);
        }
    }

    /**
     * The virtual function for the line follow method.  This must be overridden
     * by the child class.
     *
     * @param robotData {Robot.RobotTelemetryData} - Values for all the sensors that
     * the robot can read.  This includes the position, velocity, bearing and
     * light sensors.
     *
     * @throws {Error} Method 'Robot.Algorithm.update(robotData)' must be
     * implemented.
     */
    follow(robotData) {
        throw new Error("Method 'Robot.Algorithm.update(robotData)' must be implemented.");
    }
};

/**
 * Class which defines a concrete robot algorithm.  The algorithm implemented
 * is do nothing / NOP.
 *
 * @see Robot.Algorithm.LineFollow
 * @see Robot.robot
 * @see Robot.RobotTelemetryData
 * @see Robot.MovementCommands
 */
Robot.Algorithm.Empty = class extends Robot.Algorithm.LineFollow {
    /**
     * Empty constructor.  No setup is required for this algorithm
     */
    constructor() {super();};

    /**
     * The follow method that overrides the virtual follow method. For the empty
     * algorithm the robot is sent the command to stop moving.
     *
     * @param robotData {Robot.RobotTelemetryData} - Values for all the sensors that
     * the robot can read.  This includes the position, velocity, bearing and
     * light sensors.
     *
     * @returns {Robot.MovementCommands} - The commands for the robot effectors.
     */
    follow(robotData) {
        const forwardVel = 0;
        const rotationRate = 0;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

/**
 * Class which defines a concrete robot algorithm.  The algorithm implemented is
 * a go in straight line algorithm.
 *
 * @see Robot.Algorithm.LineFollow
 * @see Robot.robot
 * @see Robot.RobotTelemetryData
 * @see Robot.MovementCommands
 */
Robot.Algorithm.StraightLine = class extends Robot.Algorithm.LineFollow {
    /**
     * Empty constructor.  No setup is required for this algorithm
     */
    constructor() {super();};

    /**
     * The follow method that overrides the virtual follow method. For this
     * algorithm the forwardVelocity is set to move at 1 tile per second with
     * no rotation.
     *
     * @param robotData {Robot.RobotTelemetryData} - Values for all the sensors that
     * the robot can read.  This includes the position, velocity, bearing and
     * light sensors.
     *
     * @returns {Robot.MovementCommands} - The commands for the robot effectors.
     */
    follow(robotData) {
        const forwardVel = World.gridSize;
        const rotationRate = 0;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

/**
 * Class which defines a concrete robot algorithm.  The algorithm implemented is
 * a go in curve to the right.
 *
 * @see Robot.Algorithm.LineFollow
 * @see Robot.robot
 * @see Robot.RobotTelemetryData
 * @see Robot.MovementCommands
 *
 * @see Simulation.Mode.DebugRobot
 */
Robot.Algorithm.CurveRight = class extends Robot.Algorithm.LineFollow {
     /**
     * Empty constructor.  No setup is required for this algorithm
     */
    constructor() {super();};

    /**
     * The follow method that overrides the virtual follow method. For this
     * algorithm the forwardVelocity is set to move at 0.4 tiles per second with
     * a rotation rate of 0.35 radians per second.
     *
     * @param robotData {Robot.RobotTelemetryData} - Values for all the sensors that
     * the robot can read.  This includes the position, velocity, bearing and
     * light sensors.
     *
     * @returns {Robot.MovementCommands} - The commands for the robot effectors.
     */
    follow(robotData) {
        const forwardVel = 0.4 * World.gridSize;
        const rotationRate = 0.35;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

/**
 * Class which defines a concrete robot algorithm.  The algorithm implemented is
 * a go in curve to the left.
 *
 * @see Robot.Algorithm.LineFollow
 * @see Robot.robot
 * @see Robot.RobotTelemetryData
 * @see Robot.MovementCommands
 */
Robot.Algorithm.CurveLeft = class extends Robot.Algorithm.LineFollow {
    /**
     * Empty constructor.  No setup is required for this algorithm
     */
    constructor() {super();};

    /**
     * The follow method that overrides the virtual follow method. For this
     * algorithm the forwardVelocity is set to move at 0.4 tiles per second with
     * a rotation rate of -0.35 radians per second.
     *
     * @param robotData {Robot.RobotTelemetryData} - Values for all the sensors that
     * the robot can read.  This includes the position, velocity, bearing and
     * light sensors.
     *
     * @returns {Robot.MovementCommands} - The commands for the robot effectors.
     */
    follow(robotData) {
        const forwardVel = 0.4 * World.gridSize;
        const rotationRate = -0.35;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

/**
 * Class which defines a concrete robot algorithm.  The algorithm implemented
 * uses a single analogue light sensor to follow the edge of a line.
 *
 * @see Robot.Algorithm.LineFollow
 * @see Robot.robot
 * @see Robot.RobotTelemetryData
 * @see Robot.MovementCommands
 *
 * @see Simulation.Mode.LineFollowOneSensor
 */
Robot.Algorithm.OneSensorFollow = class extends Robot.Algorithm.LineFollow {
    /**
     * Empty constructor.  No setup is required for this algorithm
     */
    constructor() {super();};

    /**
     * The follow method that overrides the virtual follow method. For this
     * algorithm the forwardVelocity is set to move at 0.3 tiles per second with
     * a rotation rate of -1.2 radians per second.  The rotation switches
     * direction if the light sensor value is less than 0.5., i.e. if it reads
     * black.
     *
     * @param robotData {Robot.RobotTelemetryData} - Values for all the sensors that
     * the robot can read.  This includes the position, velocity, bearing and
     * light sensors.
     *
     * @returns {Robot.MovementCommands} - The commands for the robot effectors.
     */
    follow(robotData) {
        const forwardVel = 0.30 * World.gridSize;
        let rotationRate = -1.2;
        if(robotData.sensorVals[0] < 0.5 ) {
            rotationRate *= -1;
        }
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

/**
 * Class which defines a concrete robot algorithm.  The algorithm implemented
 * uses two analogue light sensors to follow  a black line using a PD
 * proportional derivate controller.
 *
 * @see Robot.Algorithm.LineFollow
 * @see Robot.robot
 * @see Robot.RobotTelemetryData
 * @see Robot.MovementCommands
 *
 * @see Simulation.Mode.LineFollowTwoSensor
 */
Robot.Algorithm.TwoSensorFollow = class extends Robot.Algorithm.LineFollow {
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
        this.crossingGap = false;
        this.crossingParam = 0;
    };

    /**
     * The follow method that overrides the virtual follow method. For this
     * algorithm the difference between the two sensors is used as the error
     * term for the PD controller.  The greater the error the faster the robot
     * turns.  If the error is greater than 0.35 the robot slows down so that
     * it can turn without skipping over the line.
     *
     * @param robotData {Robot.RobotTelemetryData} - Values for all the sensors that
     * the robot can read.  This includes the position, velocity, bearing and
     * light sensors.
     *
     * @returns {Robot.MovementCommands} - The commands for the robot effectors.
     */
    follow(robotData) {
        let forwardVel = this.forwardVel;

        // Simple PD controller

        const error = robotData.sensorVals[1] - robotData.sensorVals[0];
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
        }

        this.pError = error;
        return new Robot.MovementCommands(forwardVel, rotationRate);
    };
};

