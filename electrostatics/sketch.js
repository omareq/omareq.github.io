/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     21-Aug-2018
*   Program:  Electrostatics Code
*
*******************************************************************************/

let field;
let chargeIsNegative = false;

function setup() {
	let somex = 700;
	let somey = 700;
	let canvas = createCanvas(somex, somey);
	canvas.parent('sketch');
	background(0);

	field = new Field(width, height);
	noLoop();
}

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

function draw() {
	background(255);
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
}