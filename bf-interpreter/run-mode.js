/*******************************************************************************
 *
 *	@file run-mode.js Defines framework to run the bf interpreter
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

RunMode.setup = function() {
	if(RunMode.activeMode == undefined) {
		RunMode.setActiveMode(new RunMode.Mode.Empty());
	}

	RunMode.globalUiSetup();
	RunMode.lastProgram = undefined;
	RunMode.lastInput = undefined;

	RunMode.sourceCodeAreaHandle = document.getElementById("source-code-text");
	RunMode.inputTextAreaHandle = document.getElementById("input-text");
	RunMode.outputHandle = document.getElementById("output-text");


	let minifyButton = createButton("Minify", "value");
	minifyButton.parent("minify-button");
	minifyButton.mousePressed(RunMode.minify);
	background(255);
};

RunMode.update = function() {
	if(RunMode.activeMode == undefined) {
		RunMode.setActiveMode(new RunMode.Mode.Empty());
	}

	RunMode.globalUiPoll();
	RunMode.activeMode.update();
};

RunMode.setActiveMode = function(newMode) {
	if(!(newMode instanceof RunMode.ModeType)) {
		const err = "New Run Mode must be of type RunMode.ModeType";
		RunMode.activeMode = new RunMode.Mode.Empty();
		throw new Error(err);
	}

	if(RunMode.activeMode != undefined
		&& RunMode.activeMode.name != newMode.name) {

		RunMode.activeMode.hideUI();
	}
	RunMode.activeMode = newMode;
}

RunMode.globalUiSetup = function() {
	//UI
	// TODO: refactor UI code
	RunMode.exampleCodeSelector = createSelect();
	RunMode.exampleCodeSelector.parent("example-code-selector");
	for(let i =0; i < bfExampleFiles.length; i++) {
		const currentExampleFile = bfExampleFiles[i].split("/")[2].split(".")[0];
		RunMode.exampleCodeSelector.option(currentExampleFile);
	}
	RunMode.selectedExample = "hello";
	RunMode.exampleCodeSelector.selected(RunMode.selectedExample);
}

RunMode.globalUiPoll = function() {
	RunMode.activeMode.uiPoll();

	if(RunMode.exampleCodeSelector.selected() != RunMode.selectedExample) {
		RunMode.selectedExample = RunMode.exampleCodeSelector.selected();
		console.log(`Change example code to: ${RunMode.selectedExample}`);

		fetch(`./examples/${RunMode.selectedExample}.bf`)
		.then(response => response.text())
		.then(textString => {
			//sourceCodeAreaHandle.textContent = textString;
			RunMode.syntaxHighlightSourceCode(textString.replace(/\n+/g, '\n'));
		})
		.catch(error => {
			console.error('Error fetching the file:', error);
		});
	}
}


/**
 * Read the string in the source code text area and return it
 *
 * @returns {String} - The raw program string
 */
RunMode.getRawProgramTxt = function() {
	if(RunMode.sourceCodeAreaHandle == undefined) {
		RunMode.sourceCodeAreaHandle = document.getElementById("source-code-text");
	}
	return RunMode.sourceCodeAreaHandle.textContent;
}



RunMode.output = function(outputBuffer) {
	RunMode.outputHandle.textContent = outputBuffer;
}

/**
 * Read the string in the input text area and return it
 *
 * @returns {String} - The raw input string
 */
RunMode.getInputString = function() {
	if(RunMode.inputTextAreaHandle == undefined) {
		RunMode.inputTextAreaHandle = document.getElementById("input-text");
	}
	return RunMode.inputTextAreaHandle.textContent;
}


/**
 * Convert a string to ASCII char codes
 *
 * @returns {Array<Number>} - The array of ASCII char codes
 */
RunMode.getCharCodes = function(inputString) {
    let charCodeArr = new Array(inputString.length);
    for (let i = 0; i < inputString.length; i++) {
        charCodeArr[i] = inputString.charCodeAt(i);
    }
    return charCodeArr;
}

RunMode.syntaxHighlightSourceCode = function(rawProgram) {
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
	RunMode.sourceCodeAreaHandle.innerHTML = domHtmlText;
}


/**
 * Minify the code in the source code input area
 */
RunMode.minify = function() {
	const rawProgram = RunMode.getRawProgramTxt();
	const programTxt = preProcess(rawProgram);
	RunMode.syntaxHighlightSourceCode(programTxt);
}

RunMode.ModeType = class {
	constructor() {
		if(this.constructor == RunMode.ModeType) {
			let err = "Abstract class RunMode.ModeType can't be instantiated";
			throw new Error(err);
		}
		this.name = "AbstractModeType";
	}

	update() {
		throw new Error("Method 'update()' must be implemented");
	}

	uiPoll() {

	}

	showUI() {

	}

	hideUI() {

	}
};

RunMode.Mode.Empty = class extends RunMode.ModeType {
	constructor() {
		super();
		this.name = "Empty";
	}
	
	update() {}

};
