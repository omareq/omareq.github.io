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

function getProgram() {
	const textInput = document.getElementById("input-text").textContent;
	const textArr = textInput.split("");
	const program = textArr.filter(operation =>
		operation.includes(["+"]) ||
		operation.includes(["-"]) ||
		operation.includes(["."]) ||
		operation.includes([","]) ||
		operation.includes(["<"]) ||
		operation.includes([">"]) ||
		operation.includes(["["]) ||
		operation.includes(["]"])
	);

	return program;
}

function programGetInput() {

}

function programOutput(char) {
	console.log(char);
	document.getElementById("output-text").textContent+=char;
}

function getJumpEnd(program, jumpStart) {
	// assert(jumpStart >= program.instructions && jumpStart < program.end);
	let i_ptr = jumpStart;

	let bracket_cnt = 1;
	while (bracket_cnt > 0) {
		i_ptr++;

		if(i_ptr >= program.length) {
			return;
		}

		if(program[i_ptr] == '[') {
			bracket_cnt++;
		} else if(program[i_ptr] == ']') {
			bracket_cnt--;
		}
	}
	return i_ptr;
}

function getJumpStart(program, jumpEnd) {
	// assert(jumpEnd >= program.instructions && jumpEnd < program.end);
	let i_ptr = jumpEnd;

	let bracket_cnt = 1;
	while (bracket_cnt > 0) {
		i_ptr--;

		if(i_ptr < 0) {
			return;
		}

		if(program[i_ptr] == ']') {
			bracket_cnt++;
		} else if(program[i_ptr] == '[') {
			bracket_cnt--;
		}
	}
	return i_ptr;
}

function execute(program) {
	const WATCHDOG_CNT = 1000000;
	const WATCHDOG_ENABLE = false;
	const DATA_SIZE = 30000;
	const debug = false;
	document.getElementById("output-text").textContent = "";

	let data = new Array(DATA_SIZE);
	data.fill(0);
	let dataPtr = 0;
	let instructionPtr = 0;

	if(debug) {
		console.log("Program Size: " + program.length + " bytes");
	}

	let execCntr = 0;
	while(instructionPtr < program.length) {
		execCntr++;
		if(WATCHDOG_ENABLE && execCntr > WATCHDOG_CNT) {
			break;
		}
		const instruction = program[instructionPtr];
		if(instruction == '+') {
			data[dataPtr] += 1;
		} else if(instruction == '-') {
			data[dataPtr] -= 1;
		} else if(instruction == '>') {
			dataPtr++;
			if(dataPtr > DATA_SIZE) {
// TODO: implement realloc and if failed then terminate
				console.log("Data Buffer Overflow. Exit Process\n");
				break;
			}
		} else if(instruction == '<') {
			dataPtr--;
			if(dataPtr < 0) {
// TODO: implement shuffle data along, then realloc and if both fail then terminate
				console.log("Data Buffer Underflow. Exit Process\n");
				break;
			}
		} else if(instruction == '.') {
			const val = data[dataPtr];
			if(debug) {
				console.log("Output: (int) %i | (char) %c",
					val, String.fromCharCode(val));
			} else {
				programOutput(String.fromCharCode(val));
			}
		} else if (instruction == ',') {
			const nextChar = programGetInput();
			data[dataPtr] = nextChar;
			if(debug) {
				console.log("Input: (int) %i | (char) %c",
					nextChar, String.fromCharCode(nextChar));
			}
		} else if(instruction == '[') {
			if(data[dataPtr] == 0) {
				instructionPtr = getJumpEnd(program, instructionPtr);
				// console.log("\tjump location %li", i_ptr - program.instructions);
				if(instructionPtr == undefined) {
					console.log("Closing ] not found. Exit Process\n");
					break;
				}
			}
		} else if(instruction == ']') {
			if(data[dataPtr] != 0) {
				instructionPtr = getJumpStart(program, instructionPtr);
				// console.log("\tjump location %li", i_ptr - program.instructions);

				if(instructionPtr == undefined) {
					console.log("Opening [ not found. Exit Process\n");
					break;
				}
			}
		} else if(instruction == 0) {
			console.log("Instruction is 0 Exit Process\n");
			break;
		} else {
			console.log("Invalid Instruction: %c\nExit Process\n", instruction);
			break;
		}
		instructionPtr++;
		if(debug) {
			console.log("Exec Cntr " + execCntr + " I Ptr: " + instructionPtr + " D Ptr: " + dataPtr);
		}
	}
}

function run() {
	const program = getProgram();
	// console.log(program);

	execute(program);
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
	let cnv = createCanvas(cnvSize, 0.7 * cnvSize);
	cnv.parent('sketch');
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(0);
}

