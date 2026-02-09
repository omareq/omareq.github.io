/*******************************************************************************
 *
 *	@file sketch.js A Brain Fuck Interpreter
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 07-February-2026
 *	@link https://omareq.github.io/bf-interpreter/
 *	@link https://omareq.github.io/bf-interpreter/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2026 Omar Essilfie-Quaye
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

let runButton = undefined;
let lastProgram = undefined;
let inputTextAreaHandle = undefined;

/**
 * Read the string in the input text area and return it
 *
 * @returns {String} - The raw program string
 */
function getRawProgramTxt() {
	return inputTextAreaHandle.textContent;
}

/**
 * Run the current BF program that is in the input text area
 */
function run() {
	const rawProgram = getRawProgramTxt();
	const programTxt = preProcess(rawProgram);

	if(lastProgram != undefined && programTxt.join("") == lastProgram.join("")) {
		console.log("Same program not running again.");
		return;
	}

	const program = new BFProgram(parse(programTxt));
	let cpu = new BFCpu(8, program, 30000);
	cpu.execute();
	lastProgram = programTxt;
}

/**
 * p5.js setup function, creates canvas.
 */
function setup() {
	let cnvSize;
	let cnv = createCanvas(1,1);
	cnv.parent('sketch');

	inputTextAreaHandle = document.getElementById("input-text");
	runButton = createButton("Run", "value");
	runButton.parent("run-button");
	runButton.mousePressed(run);
	background(255);
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
}

