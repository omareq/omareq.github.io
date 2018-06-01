/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     29-Mar-2017
*   Program:  Love Potion Code
*
*******************************************************************************/
let rain = [];
let cols = 18;

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

function draw() {
	background(0);
	for(let i = rain.length - 1; i >= 0; i--) {
		rain[i].draw();
	}
}