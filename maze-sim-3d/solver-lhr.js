/*******************************************************************************
 *
 *  @file solver-lhr.js A left hand rule maze solver
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

async function leftHandRule(robot) {
    startX = robot.getX();
    startY = robot.getY();
    finished = false;

    while(!finished) {
        await checkForVictim(robot);

        if(!robot.hasWallLeft()) {
            await robot.turnLeft();
        } else if (!robot.hasWallFront()) {
            await delay(1);
        } else if (!robot.hasWallRight()) {
            await robot.turnRight();
        } else if (!robot.hasWallBack()) {
            await robot.turnLeft();
            await robot.turnLeft();
        } else {
            console.log("God Damn The Robot is Boxed in");
            finished = true;
            break;
        }

        await robot.moveForward();

        if((robot.getX() == startX) && (robot.getY() == startY)) {
            console.log("Back to start position");
            console.log("StartX: ", startX, " EndX: ", robot.getX());
            console.log("StartY: ", startY, " EndY: ", robot.getY());

            finished = true;
        }
    }
}