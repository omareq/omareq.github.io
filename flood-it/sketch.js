/*******************************************************************************
 *
 *	@file sketch.js A Simple strategy game where you have to flood the whole
 *  board with one colour
 *
 *	@author Omar Essilfie-Quaye <omareq08@gmail.com>
 *	@version 1.0
 *	@date 30-September-2019
 *
*******************************************************************************/

let gridSize = 16;

let numColours = 5;

let grid = undefined;

let resetButton = undefined;


function reset() {
    grid = new Grid(gridSize, numColours);
}

/**
 *   p5.js setup function, creates canvas.
 */
function setup() {
	let cnvSize;
	if(windowWidth > windowHeight) {
		cnvSize = 0.7 * windowHeight;
	} else {
		cnvSize = 0.7 * windowWidth;
	}
	let cnv = createCanvas(cnvSize, cnvSize);
	cnv.parent('sketch');

    resetButton = createButton("Reset", "value");
    resetButton.parent("reset-button");
    resetButton.mousePressed(reset);

    reset();
}

/**
 *   p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(225);
    const xPos = 0;
    const yPos = 0;

    grid.draw(xPos, yPos, height);
}

