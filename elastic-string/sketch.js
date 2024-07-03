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
		createVector(0.25*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.50*width, 20),
		createVector(0.75*width, 20)
		];

	// let velocities = [
	// 	createVector(0, 0),
	// 	createVector(0, 0),
	// 	createVector(0, 0),
	// 	createVector(0, 0),
	// 	createVector(0, 0)
	// 	];

	let masses = [
		4,
		4,
		4,
		4,
		4,
		4,
		4,
		4,
		4,
		4,
		4,
		4,
		4,
		4
		];

	let hookesConstants = [
		9.5,
		9.5,
		9.5,
		9.5,
		9.5,
		9.5,
		9.5,
		9.5,
		9.5,
		9.5,
		9.5,
		9.5,
		9.5
		];

	testString = new Elastic.String(
		40,
		positions,
		masses,
		hookesConstants);
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(0);
	for(let i = 0 ; i < 100; i++) {
		testString.update(0.0005);
	}
	testString.draw();
}

