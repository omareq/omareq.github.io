/*******************************************************************************
*   @file sketch.js
*   @brief Quick Electrostatics Simulation
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 22-Aug-2018
*
*******************************************************************************/

/**
*	A variable in the global namespace which stores the electrostatic field.
*
*	@type {Field}
*/
let field;

/**
*	A variable in the gloabl namespace which stores wether or not the next
*	particle added will have a negative charge.
*
*	@type {boolean}
*/
let chargeIsNegative = false;

/**
*	p5.js setup function, used to create a canvas and instantiate the field
*	variable.
*/
function setup() {
	let somex = 700;
	let somey = 700;
	let canvas = createCanvas(somex, somey);
	canvas.parent('sketch');
	background(0);

	field = new Field(width, height);
	noLoop();
}

/**
*	Determines which key is pressed and checks to see if the chargeIsNegative
*	should change.
*	Checks to see if either a single particle or all particles should be
*	removed from the field.
*	Signals a rerendering of the canvas.
*/
function keyPressed() {
	if(keyCode == BACKSPACE) {
		field.popParticle();
	}

	if(key == 'f' || key == 'F') {
		chargeIsNegative = !chargeIsNegative;
		chargeFlipped = true;
	} else if(key == 'n' || key == 'N') {
		if(!chargeIsNegative) {
			chargeIsNegative = true;
		}
	} else if(key == 'p' || key == 'P') {
		if(chargeIsNegative) {
			chargeIsNegative = false;
		}
	} else if(key == 'c' || key == 'C') {
		field.clear();
	}

	redraw();
}

/**
*	Adds a particle at the pointer position.
*	The particle will be either positivie or negative depending on the value of
*	the chargeIsNegative variable.
*	Signals a rerendering of the canvas.
*/
function mousePressed() {
	let radius = 10;
	let pos = createVector(mouseX, mouseY);
	let charge = 2;
	if(chargeIsNegative) {
		charge *= -1;
	}
	let part = new Particle(radius, pos, charge);
	field.addParticle(part);

	redraw();
}

/**
*	p5.js draw function, used to draw the electrostatic field and the charge
*	indicator in the top left corner.
*/
function draw() {
	background(255);
	strokeWeight(1);
	field.draw(50, 1000);

	textSize(50);
	textAlign(LEFT, TOP);
	if(chargeIsNegative) {
		fill(0, 0, 255);
		text("-", 0, 0);
	} else {
		fill(255, 0, 0);
		text("+", 0, 0);
	}

	noStroke();
	textAlign(LEFT, CENTER);
	textSize(13);
	fill(0);
	text("N - (-ve) Charge,\
	 P - (+ve) Charge,\
	 F - Flip Charge Sign,\
	 Backspace - Remove Last,\
	 C - Clear", 50, 25);

}