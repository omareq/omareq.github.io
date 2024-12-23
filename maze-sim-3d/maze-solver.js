/*******************************************************************************
 *
 *  @file maze-solver.js A function to select the solving algorithm
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

async function checkForVictim(robot) {
    if(robot.hasVictim("north")) {
        await robot.dropRescueKit("north");
    }
    if(robot.hasVictim("east")) {
        await robot.dropRescueKit("east");
    }
    if(robot.hasVictim("south")) {
        await robot.dropRescueKit("south");
    }
    if(robot.hasVictim("west")) {
        await robot.dropRescueKit("west");
    }
}

async function solve(robot) {
    // hybrid_5(robot);

    if(algorithm == algorithms.LEFT_HAND_RULE) {
        await leftHandRule(robot);
    } else if(algorithm == algorithms.RIGHT_HAND_RULE) {
        await rightHandRule(robot);
    } else if(algorithm == algorithms.HYBRID_4) {
        await hybrid4(robot);
    } else if(algorithm == algorithms.HYBRID_5) {
        await Solver.Hybrid5.solve(robot);
    }

    console.info("algorithm: ", algorithm);
    console.info("Robot Stats: ", robot.stats);
}

