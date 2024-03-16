/*******************************************************************************
 *
 *	@file sketch.js A simulation to model a line following robot
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 15-March-2024
 *	@link https://omareq.github.io/line-sim-3d/
 *	@link https://omareq.github.io/line-sim-3d/docs/
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

let tile0, tile1, tile2, tile3;
let sensor;
let sensorRadius = 8;

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
	let cnv = createCanvas(cnvSize, 0.7 * cnvSize);
	cnv.parent('sketch');

	UI.setup();
	World.TileSetup();

	tile0 = World.Tiles.blankLine;
	tile1 = World.Tiles.verticalLine;
	tile2 = World.Tiles.horizontalLine;
	tile3 = World.Tiles.cross;

	sensor = new Robot.AnalogLightSensor(sensorRadius, createVector(0,0));
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(127);
	// UI.poll();
	Simulation.update();

	image(tile3.tileImage, 0, 0, World.gridSize, World.girdSize);

	sensor.setPos(createVector(mouseX, mouseY));
	sensor.setRadius(sensorRadius);
	const brightness = sensor.read(tile3);
	if(brightness < 1) {
		console.log(brightness);
	}
	const colorVal = floor(brightness * 255);

	push();
	fill(colorVal);
	strokeWeight(1);
	stroke(127, 0, 30);
	ellipse(mouseX, mouseY, 2 * sensorRadius, 2 * sensorRadius);
	pop();
}
