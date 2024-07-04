/*******************************************************************************
 *
 *	@file sketch.js A quick simulation to test elasticity
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 02-July-2024
 *	@link https://omareq.github.io/elastic-string/
 *	@link https://omareq.github.io/elastic-string/docs/
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

let testString = undefined;
let lockLast = true;
let lockFirst = true;
let dampening = true;

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

	let positions = [
		createVector(0.5*width, 20),
		createVector(0.5*width+10, 25),
		createVector(0.5*width+20, 30),
		createVector(0.5*width+30, 35),
		createVector(0.5*width+40, 40),
		createVector(0.5*width+50, 45),
		createVector(0.5*width+60, 50),
		createVector(0.5*width+70, 45),
		createVector(0.5*width+80, 40),
		createVector(0.5*width+90, 35),
		createVector(0.5*width+10, 30),
		createVector(0.5*width+110, 25),
		createVector(0.5*width+120, 20),
		createVector(0.5*width+130, 20),
		createVector(0.5*width+140, 20),
		createVector(0.5*width+150, 20)
		];

	let masses = [
		1,
		1,
		1,
		1,
		1,
		40,
		1,
		1,
		1,
		1,
		40,
		1,
		1,
		1,
		1,
		40
		];

	let hookesConstants = [
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5,
		1.5
		];

	testString = new Elastic.String(
		5,
		positions,
		masses,
		hookesConstants,
		// Elastic.Algorithm.Euler);
		Elastic.Algorithm.VelocityVerlet);
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
let numUpdatesPerFrame = 2000;
function draw() {
	background(0);
	for(let i = 0 ; i < numUpdatesPerFrame; i++) {
		testString.update(0.0002);
	}
	testString.draw();

	// once outside of relaxation period begin simulation
	if(frameCount > 200) {
		lockLast = false;
		dampening = false;
		numUpdatesPerFrame = 500;
	}
}

