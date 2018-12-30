/*******************************************************************************
*   @file sketch.js
*   @brief Recreation of Towers of Hanoi puzzle
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 29-Dec-2018
*
*******************************************************************************/

let tower1;
let tower2;
let tower3;
let towerSelected = 0;
let topPlate;

/**
*	Function that determines if a mouse has been pressed or not
*/
function mousePressed() {
	let towerPressed = 0;

	if(tower1.pressed()) {
		towerPressed = 1;
		if(towerSelected == 0) {
			topPlate = tower1.peek();
			towerSelected = 1;
			return;
		} 
	}
	if(tower2.pressed()) {
		towerPressed = 2;
		if(towerSelected == 0) {
			topPlate = tower2.peek();
			towerSelected = 2;
			return;
		} 
	}
	if(tower3.pressed()) {
		towerPressed = 3;
		if(towerSelected == 0) {
			topPlate = tower3.peek();
			towerSelected = 3;
			return;
		} 
	}

	if(towerPressed == 0) {
		towerSelected = 0;
		topPlate = 0;
		return;
	} else {
		if(towerSelected == 1) {
			if(towerPressed == 2 && tower2.push(topPlate)) {
				tower1.pop();
			} else if(towerPressed == 3 && tower3.push(topPlate)) {
				tower1.pop();
			}
		} else if(towerSelected == 2) {
			if(towerPressed == 1 && tower1.push(topPlate)) {
				tower2.pop();
			} else if(towerPressed == 3 && tower3.push(topPlate)) {
				tower2.pop();
			}
		} else if(towerSelected == 3) {
			if(towerPressed == 1 && tower1.push(topPlate)) {
				tower3.pop();
			} else if(towerPressed == 2 && tower2.push(topPlate)) {
				tower3.pop();
			}
		}
		tower1.isPressed = false;
		tower2.isPressed = false;
		tower3.isPressed = false;
		towerSelected = 0;
		topPlate = 0;
	}
	
}

/**
*	p5.js setup function, used to create a canvas and instantiate the tower
*	objects
*/
function setup() {
	let canvas = createCanvas(0.8*windowWidth, 0.8 * windowHeight);
	canvas.parent('sketch');

	let yPos = 0.75 * height;
	let towerW = 0.25 * width;
	let towerH = 0.5 * height;
	let stackSize = 5;

	let r = "#ff0000";
	let g = "#00ff00";
	let b = "#0000ff";

	tower1 = new Tower(5, 0.20 * width, yPos, towerW, towerH, r, true );
	tower2 = new Tower(5, 0.50 * width, yPos, towerW, towerH, g, false);
	tower3 = new Tower(5, 0.80 * width, yPos, towerW, towerH, b, false);
}

/**
*	p5.js draw function, used to draw all towers
*/
function draw() {
	background(255);
	tower1.draw();
	tower2.draw();
	tower3.draw();
}