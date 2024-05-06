/*******************************************************************************
 *
 *  @file simulation-mode-two-sensor-line-follow.js Test the robot two sensor
 *  line follow algorithm
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
 * Simulation namespace object
 */
var Simulation = Simulation || {};

/**
 * Simulation Mode nested namespace object
 */
Simulation.Mode = Simulation.Mode || {};


/**
 * Class Simulation.Mode.DebugMovingTile is a simulation mode that has a tile
 * moving back and forth along the canvas to test that the light sensors can
 * correctly read the value in a global coordinate frame.
 *
 * @see Simulation.Mode.Type
 */
Simulation.Mode.LineFollowTwoSensor = class extends Simulation.Mode.ModeType {
    static staticName = "LineFollowTwoSensor";
    /**
     * The constructor that sets up the simulation variables
     */
    constructor() {
        super();
        this.name = "LineFollowTwoSensor";
        this.uiDivID = "simulation-mode-line-follow-two-sensor";
        this.setupUI();

        const numTilesX = 7;
        const numTilesY = 6;

        const tilesRatio = numTilesX / numTilesY;
        const pixelsRatio = width / height;

        let gridSize = -1;
        if(tilesRatio > pixelsRatio) {
            gridSize = width / numTilesX;
        } else {
            gridSize = height / numTilesY;
        }

        World.setGridSize(gridSize);

        this.sensorRadius = 0.5 * World.lineThickness + 1;
        this.sensorSeparation = 0.2;
        this.rotationKp = 12;
        this.rotationKd = 0;
        this.algorithmForwardVel = 1.5 * World.gridSize;
        this.addNewUIElements();

        this.setupRobot();

        this.room = new World.Room(numTilesX, numTilesY, createVector(0, 0));
        this.setRoomToConfig();
    }

    addNewUIElements() {
        // TODO: save handles when switching simulation mode
        if(document.getElementById("sm-lfts-sensor-separation-slider").children.length) {
            document.getElementById("sm-lfts-show-grid").children[0].remove();

            document.getElementById("sm-lfts-sensor-separation-slider").children[0].remove();
            document.getElementById("sm-lfts-sensor-separation-val").children[0].remove();

            document.getElementById("sm-lfts-sensor-radius-slider").children[0].remove();
            document.getElementById("sm-lfts-sensor-radius-val").children[0].remove();

            document.getElementById("sm-lfts-pd-rotation-kp-slider").children[0].remove();
            document.getElementById("sm-lfts-pd-rotation-kp-val").children[0].remove();

            document.getElementById("sm-lfts-pd-rotation-kd-slider").children[0].remove();
            document.getElementById("sm-lfts-pd-rotation-kd-val").children[0].remove();

            document.getElementById("sm-lfts-pd-vel-slider").children[0].remove();
            document.getElementById("sm-lfts-pd-vel-val").children[0].remove();
        }

        // show grid check box
        this.showGridCheckbox = createCheckbox("Draw Grid Lines", true);
        this.showGridCheckbox.parent("sm-lfts-show-grid");

        // sensor separation
        this.sensorSeparationSlider = createSlider(0, 1, this.sensorSeparation, 0.05);
        this.sensorSeparationSlider.parent("sm-lfts-sensor-separation-slider");

        this.sensorSeparationDisplay = createP();
        this.sensorSeparationDisplay.parent("sm-lfts-sensor-separation-val");
        this.sensorSeparationDisplay.elt.innerText = "Separation: " + str(this.sensorSeparation);


        // sensor radius
        this.sensorRadiusSlider = createSlider(1, World.lineThickness + 2, this.sensorRadius, 0.25);
        this.sensorRadiusSlider.parent("sm-lfts-sensor-radius-slider");

        this.sensorRadiusDisplay = createP();
        this.sensorRadiusDisplay.parent("sm-lfts-sensor-radius-val");
        this.sensorRadiusDisplay.elt.innerText = "Radius: " + str(this.sensorRadius);


        // pd rotation kp
        this.rotationKpSlider = createSlider(1, 50, this.rotationKp, 0.25);
        this.rotationKpSlider.parent("sm-lfts-pd-rotation-kp-slider");

        this.rotationKpDisplay = createP();
        this.rotationKpDisplay.parent("sm-lfts-pd-rotation-kp-val");
        this.rotationKpDisplay.elt.innerText = "Kp: " + str(this.rotationKp);

        // pd rotation kd
        this.rotationKdSlider = createSlider(0, 50, this.rotationKd, 0.25);
        this.rotationKdSlider.parent("sm-lfts-pd-rotation-kd-slider");

        this.rotationKdDisplay = createP();
        this.rotationKdDisplay.parent("sm-lfts-pd-rotation-kd-val");
        this.rotationKdDisplay.elt.innerText = "Kd: " + str(this.rotationKd);

        // pd rotation vel
        this.velSlider = createSlider(1, 2 * World.gridSize, this.algorithmForwardVel, 1);
        this.velSlider.parent("sm-lfts-pd-vel-slider");

        this.velDisplay = createP();
        this.velDisplay.parent("sm-lfts-pd-vel-val");
        this.velDisplay.elt.innerText = "Vel: " + str(this.algorithmForwardVel);
    }

    UIPoll() {
        let sliderVal = this.sensorSeparationSlider.value();
        if(sliderVal != this.sensorSeparation) {
            console.debug("Simulation Mode Line follow two sensor uiPoll: sensor separation Slider value has changed to: ",
                sliderVal);
            this.sensorSeparation = sliderVal;
            this.sensorSeparationDisplay.elt.innerText = "Separation: " + str(sliderVal);
            this.setupRobot();
        }

        sliderVal = this.sensorRadiusSlider.value();
        if(sliderVal != this.sensorRadius) {
            console.debug("Simulation Mode Line follow two sensor uiPoll: sensor radius Slider value has changed to: ",
                sliderVal);
            this.sensorRadius = sliderVal;
            this.sensorRadiusDisplay.elt.innerText = "Radius: " + str(sliderVal);
            this.setupRobot();
        }


        sliderVal = this.rotationKpSlider.value();
        if(sliderVal != this.rotationKp) {
            console.debug("Simulation Mode Line follow two sensor uiPoll: rotation Kp Slider value has changed to: ",
                sliderVal);
            this.rotationKp = sliderVal;
            this.rotationKpDisplay.elt.innerText = "Kp: " + str(sliderVal);
            this.setupRobot();
        }

        sliderVal = this.rotationKdSlider.value();
        if(sliderVal != this.rotationKd) {
            console.debug("Simulation Mode Line follow two sensor uiPoll: rotation Kd Slider value has changed to: ",
                sliderVal);
            this.rotationKd = sliderVal;
            this.rotationKdDisplay.elt.innerText = "Kd: " + str(sliderVal);
            this.setupRobot();
        }

        sliderVal = this.velSlider.value();
        if(sliderVal != this.algorithmForwardVel) {
            console.debug("Simulation Mode Line follow two sensor uiPoll: rotation Kd Slider value has changed to: ",
                sliderVal);
            this.algorithmForwardVel = sliderVal;
            this.velDisplay.elt.innerText = "Vel: " + str(sliderVal);
            this.setupRobot();
        }

        if(this.showGridCheckbox.checked() != this.room.showGrid) {
            this.room.generatePG(this.showGridCheckbox.checked());
        }
    }

    setupLightSensorArray(robotSize) {
        let numSensors = 2;
        let globalPos = createVector(0,0);
        let posOffset = map(this.sensorSeparation,
            0, 1,
            this.sensorRadius, 0.5 * robotSize);

        console.debug("this.sensorRadius", this.sensorRadius);
        console.debug("robotSize", robotSize);
        console.debug("lightSensorPosOffset: ", posOffset);

        let sensorPositions = [
            createVector(-posOffset, 0.00),
            createVector(posOffset, 0.00)
            ];
        let radiuses = [
            this.sensorRadius,
            this.sensorRadius
            ];
        let analogOrDigital = [
            Robot.LightSensorType.Analog,
            Robot.LightSensorType.Analog
            ];

        return new Robot.LightSensorArray(numSensors,
            globalPos,
            sensorPositions,
            radiuses,
            analogOrDigital);
    }

    setupRobot() {
        const pos = createVector(0.5 * World.gridSize, 0.55 * World.gridSize);
        const bearing = -0.5 * math.PI;
        const size = 0.5 * World.gridSize;
        const sensorArray = this.setupLightSensorArray(size);
        const sensorArrayPos = createVector(0, 0.5 * size);
        const algorithm = new Robot.Algorithm.TwoSensorFollow(
            this.algorithmForwardVel,
            this.rotationKp,
            this.rotationKd);

        this.robot = new Robot.robot(
            pos,
            bearing,
            size,
            sensorArray,
            sensorArrayPos,
            algorithm
            );
        this.robot.setRotationRate(0.30);
    }

    setRoomToConfig() {
        let grid = this.room.getAllTiles();

        grid[1][0] = World.Tiles.horizontalLine.copy();
        grid[2][0] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[3][0] = World.Tiles.horizontalLine.copy();
        grid[4][0] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[5][0] = World.Tiles.diagonalVDown.copy();
        grid[6][0] = World.Tiles.diagonalDownLeft.copy();

        grid[6][1] = World.Tiles.quarterCircleUpLeft.copy();
        grid[5][1] = World.Tiles.horizontalLine.copy();
        grid[4][1] = World.Tiles.diagonalVDown.copy();
        grid[3][1] = World.Tiles.diagonalVUp.copy();
        grid[2][1] = World.Tiles.diagonalVDown.copy();
        grid[1][1] = World.Tiles.quarterCircleDownRight.copy();

        grid[1][2] = World.Tiles.quarterCircleUpRight.copy();
        grid[2][2] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[3][2] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[4][2] = World.Tiles.horizontalLine.copy();
        grid[5][2] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[6][2] = World.Tiles.quarterCircleDownLeft.copy();

        grid[6][3] = World.Tiles.diagonalUpLeft.copy();
        grid[5][3] = World.Tiles.horizontalLine.copy();
        grid[4][3] = World.Tiles.diagonalVUp.copy();
        grid[3][3] = World.Tiles.diagonalVUp.copy();
        grid[2][3] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[1][3] = World.Tiles.diagonalDownRight.copy();

        grid[1][4] = World.Tiles.diagonalUpRight.copy();
        grid[2][4] = World.Tiles.diagonalVDown.copy();
        grid[3][4] = World.Tiles.diagonalVDown.copy();
        grid[4][4] = World.Tiles.horizontalLine.copy();
        grid[5][4] = World.Tiles.gapQuarterLineHorizontal.copy();
        grid[6][4] = World.Tiles.cornerDownLeft.copy();

        grid[6][5] = World.Tiles.cornerUpLeft.copy();
        grid[5][5] = World.Tiles.diagonalVUp.copy();
        grid[4][5] = World.Tiles.horizontalLine.copy();
        grid[3][5] = World.Tiles.horizontalLine.copy();
        grid[2][5] = World.Tiles.blankLine.copy();
        grid[1][5] = World.Tiles.diagonalVDown.copy();

        grid[0][5] = World.Tiles.cornerUpRight.copy();
        grid[0][4] = World.Tiles.diagonalVRight.copy();
        grid[0][3] = World.Tiles.gapQuarterLineVertical.copy();
        grid[0][2] = World.Tiles.diagonalVLeft.copy();
        grid[0][1] = World.Tiles.diagonalVRight.copy();
        grid[0][0] = World.Tiles.cornerDownRight.copy();

        this.room.setTiles(grid);
    }

     /**
     * Update function that updates the state of the simulation
     */
    update() {
        this.room.draw();

        this.robot.sensorsRead(this.room);
        this.robot.update();
        this.robot.draw();

    }
};

Simulation.Mode.ModeList.push(Simulation.Mode.LineFollowTwoSensor);
