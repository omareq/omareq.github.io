/*******************************************************************************
*   @file sketch.js
*   @brief Matrix rain code but with hearts
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 29-Mar-2017
*
*******************************************************************************/

let rain = [];
let cols = 18;

/**
*	p5.js setup function, used to create a canvas and instantiate the hearts in
*	the rain array
*/
function setup() {
	let somex = 650;
	let somey = 450;
	let canvas = createCanvas(somex, somey);
	canvas.parent('sketch');

	let colWidth = width/cols;
	for(let i = 0; i < cols; i++) {
		let colLength = floor(random(2, 10));
		let colSpeed  = random(0.8, 10);
		rain.push(new Rain(i,
		  colWidth,
		  colLength,
		  colSpeed));
	}
}

/**
*	p5.js draw function, used to draw all hearts
*/
function draw() {
	background(0);
	for(let i = rain.length - 1; i >= 0; i--) {
		rain[i].draw();
	}
}