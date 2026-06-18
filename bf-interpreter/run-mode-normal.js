/*******************************************************************************
 *
 *	@file run-mode-normal.js Normal bf interpreter operatin mode 
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 17-June-2026
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

var RunMode = RunMode || {};

RunMode.Mode = RunMode.Mode || {};

RunMode.Mode.Normal = class extends RunMode.ModeType {
	constructor() {
		super();
		this.name = "Normal";

		let runButton = createButton("Run", "value");
		runButton.parent("run-button");
		runButton.mousePressed(this.run);
	}
	
	update() {}

	run() {
		const startTime = performance.now();
		const rawProgram = RunMode.getRawProgramTxt();
		const programTxt = preProcess(rawProgram);
		const input = getInputString();

		if(RunMode.lastProgram != undefined &&
			programTxt.join("") == RunMode.lastProgram.join("") &&
		RunMode.lastInput != undefined && input == RunMode.lastInput) {
		console.log("Same program and input not running again.");
		return;
	}

	const asciiCodes = getCharCodes(input);

	const program = new BFProgram(parse(programTxt));
	let cpu = new BFCpu(8, program, 30000, asciiCodes, output);
	const cpuStartTime = performance.now();
	cpu.execute();
	const endTime = performance.now();

	RunMode.lastProgram = programTxt;
	RunMode.lastInput = input;

	const preProcessingTime = cpuStartTime - startTime;
	const cpuExecutionTime = endTime - cpuStartTime;
	const totalProcessingTime = endTime - startTime;

	const preProcessingPercent = 100 * preProcessingTime / totalProcessingTime;
	const cpuExecutionPercent = 100 * cpuExecutionTime / totalProcessingTime;
	console.log(`Pre Processing Time: ${preProcessingTime} milliseconds ${preProcessingPercent}%`);
	console.log(`Cpu Execution Time: ${cpuExecutionTime} milliseconds ${cpuExecutionPercent}%`);
	console.log(`Total Processing Time: ${totalProcessingTime} milliseconds`);
	}

};
