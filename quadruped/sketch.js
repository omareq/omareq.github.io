/*******************************************************************************
 *
 *	@file sketch.js A quick mock up of a quadruped design to test Inverse
 *  Kinematics
 *
 *	@author Omar Essilfie-Quaye <omareq08@gmail.com>
 *	@version 1.0
 *	@date 21-August-2020
 *
 ******************************************************************************/

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

