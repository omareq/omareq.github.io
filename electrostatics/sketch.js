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
	//noLoop();
}

function keyPressed() {
	chargeIsNegative = !chargeIsNegative;
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
}

function draw() {
	background(255);
	field.draw(50, 1000);
}