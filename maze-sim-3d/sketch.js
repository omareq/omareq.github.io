/*******************************************************************************
 *
 *	@file sketch.js A simulation of a robot solving a maze
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 19-August-2022
 *	@link https://omareq.github.io/maze-sim-3d/
 *	@link https://omareq.github.io/maze-sim-3d/docs/
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

let gridSize = 35;
let mapSizeX = 7;
let mapSizeY = 5;
// let speedUp = 2; // make this a global variable to control delay times in robot.js

let arena;

let robot;

function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

async function runSimulation() {
    console.log("Opening Maze Solver Thread");
    await delay(1000);
    // let result = await solve(robot);
    console.log("Closing Maze Solver Thread");
    await delay(250);
}


/**
 * p5.js setup function, creates canvas.
 */
function setup() {
	let cnvSize;
	if(windowWidth > windowHeight) {
		cnvSize = windowHeight;
	} else {
		cnvSize = windowWidth;
	}
	let cnv = createCanvas(cnvSize, 0.7 * cnvSize, WEBGL);
	cnv.parent('sketch');

    rectMode(CENTER);
    ellipseMode(CENTER);

    arena = new Room(mapSizeX, mapSizeY, gridSize);
    arena.randomise(6);

    robot = new Robot(createVector(0,0), gridSize);
    robot.setMaze(arena);


    // camera(gridSize * arena.mapX * 0.5, gridSize * arena.mapY * 0.5,
    //    250, gridSize * arena.mapX * 0.5, gridSize * arena.mapY * 0.5,
    //    0, 0, 1, 0);
    // cameraUpdate(robot, gridSize);
    // thread.start_new_thread(runSimulation, ());
    runSimulation();

}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(127);
    const lightX = gridSize * mapSizeX / 2;
    const lightY = gridSize * mapSizeY / 2;
    const lightZ = lightX;
    pointLight(255, 255, 255, lightX, lightY, lightZ);
    ambientLight(100, 100, 100);
    // cameraUpdate(robot, gridSize);
    arena.show();
    robot.show();
    console.log(frameRate());
}

