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

let lastProgram = undefined;
let lastInput = undefined;
let sourceCodeAreaHandle = undefined;
let inputTextAreaHandle = undefined;
let outputHandle = undefined;
let exampleCodeSelector = undefined;
let selectedExample = undefined;

/**
 * Read the string in the source code text area and return it
 *
 * @returns {String} - The raw program string
 */
function getRawProgramTxt() {
	if(sourceCodeAreaHandle == undefined) {
		sourceCodeAreaHandle = document.getElementById("source-code-text");
	}
	return sourceCodeAreaHandle.textContent;
}

/**
 * Read the string in the input text area and return it
 *
 * @returns {String} - The raw input string
 */
function getInputString() {
	if(inputTextAreaHandle == undefined) {
		inputTextAreaHandle = document.getElementById("input-text");
	}
	return inputTextAreaHandle.textContent;
}

/**
 * Convert a string to ASCII char codes
 *
 * @returns {Array<Number>} - The array of ASCII char codes
 */
function getCharCodes(inputString) {
    let charCodeArr = new Array(inputString.length);
    for (let i = 0; i < inputString.length; i++) {
        charCodeArr[i] = inputString.charCodeAt(i);
    }
    return charCodeArr;
}

function output(outputBuffer) {
	outputHandle.textContent = outputBuffer;
}

/**
 * Run the current BF program that is in the input text area
 */
function run() {
	const startTime = performance.now();
	const rawProgram = getRawProgramTxt();
	const programTxt = preProcess(rawProgram);
	const input = getInputString();

	if(lastProgram != undefined && programTxt.join("") == lastProgram.join("") &&
		lastInput != undefined && input == lastInput) {
		console.log("Same program and input not running again.");
		return;
	}

	const asciiCodes = getCharCodes(input);

	const program = new BFProgram(parse(programTxt));
	let cpu = new BFCpu(8, program, 30000, asciiCodes, output);
	const cpuStartTime = performance.now();
	cpu.execute();
	const endTime = performance.now();

	lastProgram = programTxt;
	lastInput = input;

	const preProcessingTime = cpuStartTime - startTime;
	const cpuExecutionTime = endTime - cpuStartTime;
	const totalProcessingTime = endTime - startTime;

	const preProcessingPercent = 100 * preProcessingTime / totalProcessingTime;
	const cpuExecutionPercent = 100 * cpuExecutionTime / totalProcessingTime;
	console.log(`Pre Processing Time: ${preProcessingTime} milliseconds ${preProcessingPercent}%`);
	console.log(`Cpu Execution Time: ${cpuExecutionTime} milliseconds ${cpuExecutionPercent}%`);
	console.log(`Total Processing Time: ${totalProcessingTime} milliseconds`);
}

/**
 * Minify the code in the source code input area
 */
function minify() {
	const rawProgram = getRawProgramTxt();
	const programTxt = preProcess(rawProgram);
	syntaxHighlightSourceCode(programTxt);
}

/**
 * Function to apply the syntax highlighting
 */
function syntaxHighlightSourceCode(rawProgram) {
	let domHtmlText = "";
	for(let i = 0; i < rawProgram.length; i++) {
		const char = rawProgram[i];
		if(char == "+") {
			domHtmlText += "<span class=\"plus\">+</span>";
		} else if(char == "-") {
			domHtmlText += "<span class=\"minus\">-</span>";
		} else if(char == ">") {
			domHtmlText += "<span class=\"gt\">&gt;</span>";
		} else if(char == "<") {
			domHtmlText += "<span class=\"lt\">&lt;</span>";
		} else if(char == "[") {
			domHtmlText += "<span class=\"lbrack\">[</span>";
		} else if(char == "]") {
			domHtmlText += "<span class=\"rbrack\">]</span>";
		} else if(char == ".") {
			domHtmlText += "<span class=\"dot\">.</span>";
		} else if(char == ",") {
			domHtmlText += "<span class=\"comma\">,</span>";
		} else if(char == "\n") {
			domHtmlText += "<br>\n</br>";
		} else {
			domHtmlText += char;
		}
	}
	sourceCodeAreaHandle.innerHTML = domHtmlText;
}

function uiSetup(){

	//UI
	// TODO: refactor UI code
	exampleCodeSelector = createSelect();
	exampleCodeSelector.parent("example-code-selector");
	for(let i =0; i < bfExampleFiles.length; i++) {
		const currentExampleFile = bfExampleFiles[i].split("/")[2].split(".")[0];
		exampleCodeSelector.option(currentExampleFile);
	}
	selectedExample = "hello";
	exampleCodeSelector.selected(selectedExample);
}

function uiUpdate() {
	if(exampleCodeSelector.selected() != selectedExample) {
		selectedExample = exampleCodeSelector.selected();
		console.log(`Change example code to: ${selectedExample}`);

		fetch(`./examples/${selectedExample}.bf`)
		.then(response => response.text())
		.then(textString => {
			//sourceCodeAreaHandle.textContent = textString;
			syntaxHighlightSourceCode(textString.replace(/\n+/g, '\n'));
		})
		.catch(error => {
			console.error('Error fetching the file:', error);
		});
	}
}

/**
 * p5.js setup function, creates canvas.
 */
function setup() {
	let cnvSize;
	let cnv = createCanvas(1,1);
	cnv.parent('sketch');

	sourceCodeAreaHandle = document.getElementById("source-code-text");
	inputTextAreaHandle = document.getElementById("input-text");
	outputHandle = document.getElementById("output-text");

	let runButton = createButton("Run", "value");
	runButton.parent("run-button");
	runButton.mousePressed(run);

	let minifyButton = createButton("Minify", "value");
	minifyButton.parent("minify-button");
	minifyButton.mousePressed(minify);
	background(255);

	uiSetup();
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	uiUpdate();
}

