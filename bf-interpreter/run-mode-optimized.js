/*******************************************************************************
 *
 *	@file run-mode-optimised.js Optimised bf interpreter operatin mode
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 18-June-2026
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

RunMode.modesList.push("Optimised");
RunMode.Mode.Optimised = class extends RunMode.ModeType {
	constructor() {
		super();
		this.name = "Optimised";
		this.uiDiv = "run-mode-optimised";
	}

	addUiElements() {
		if(document.getElementById("run-mode-optimised-run-button").children.length) {
			document.getElementById("run-mode-optimised-run-button").children[0].remove();
			document.getElementById("run-mode-optimised-cpu-arch-selector").children[0].remove();
			document.getElementById("run-mode-optimised-mem-cells-selector").children[0].remove();
		}
		this.runButton = createButton("Run", "value");
		this.runButton.parent("run-mode-optimised-run-button");
		this.runButton.mousePressed(this.run);

		// cpu arch selector
		this.cpuArchSelector = createSelect();
		this.cpuArchSelector.parent("run-mode-optimised-cpu-arch-selector");
		this.cpuArchSelector.option("8 Bit");
		this.cpuArchSelector.option("16 Bit");
		this.cpuArchSelector.option("32 Bit");
		this.cpuArchSelector.selected("8 Bit");

		// cpu mem cells selector
		this.cpuMemSelector = createSelect();
		this.cpuMemSelector.parent("run-mode-optimised-mem-cells-selector");
		this.cpuMemSelector.option("1 k");
		this.cpuMemSelector.option("2 k");
		this.cpuMemSelector.option("4 k");
		this.cpuMemSelector.option("8 k");
		this.cpuMemSelector.option("16 k");
		this.cpuMemSelector.option("32 k");
		this.cpuMemSelector.option("64 k");
		this.cpuMemSelector.option("128 k");
		this.cpuMemSelector.option("256 k");
		this.cpuMemSelector.option("512 k");
		this.cpuMemSelector.option("1024 k");
		this.cpuMemSelector.selected("32 k");
	}

	update() {}

	run() {
		const startTime = performance.now();
		const rawProgram = RunMode.getRawProgramTxt();
		const programTxt = preProcess(rawProgram);
		const input = RunMode.getInputString();

		const asciiCodes = RunMode.getCharCodes(input);

		const optimisationFlag = true;
		const program = new BFProgram(parse(programTxt), optimisationFlag);
		const arch = int(RunMode.activeMode.cpuArchSelector.selected().split(" ")[0]);
		const mem = 1000*int(RunMode.activeMode.cpuMemSelector.selected().split(" ")[0]);
		const profileMode = ProfileMode.LOOPS;

		let cpu = new BFCpu(arch, program, mem, asciiCodes, RunMode.output, profileMode);
		
		const cpuStartTime = performance.now();
		cpu.execute();
		const endTime = performance.now();
		console.log(cpu.profileData);

		RunMode.lastProgram = programTxt;
		RunMode.lastInput = input;

		console.log(cpu);

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
