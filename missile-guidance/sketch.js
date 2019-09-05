/*******************************************************************************
*
*	@file sketch.js
*	@brief A program looking into the various methods of missile targeting.
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 27-August-2019
*
*******************************************************************************/

const algorithm = Object.freeze({
	PURSUIT: 	"Pursuit",
	PN: 		"Proportional Navigation",
	TPN: 		"True Proportional Navigation",
	APN: 		"Augmented Proportional Navigation",
	MOTION: 	"Motion Camoflage"
});

let selectAlgorithm;

let currentAlgorithm = algorithm.PURSUIT;

const evasionMethod = Object.freeze({
	STATIC: 	"Static",
	CONST_VEL: 	"Consant Velocity",
	CURVE_AWAY: "Curve Away",
	CURVE_IN: 	"Curve In",
	RAND: 		"Random"
});

let selectEvasionMethod;

let currentEvasionMehod = evasionMethod.STATIC;

let target;

let targetVel;

let xBuffer = 20;

let yBuffer = 20;

let resetButton;

let missile;

let time;

function algorithmSelectEvent() {
	const selectVal = selectAlgorithm.value();
	if(selectVal != currentAlgorithm) {
		currentAlgorithm = selectVal;
		console.log("Selected new algorithm: " + currentAlgorithm);
	} else {
		return;
	}

	reset();
}

function evasionMethodSelectEvent() {
	const selectVal = selectEvasionMethod.value();
	if(selectVal != currentEvasionMehod) {
		currentEvasionMehod = selectVal;
		console.log("Selected new target evasion method: " + currentEvasionMehod);
	} else {
		return;
	}

	reset();

	if(currentEvasionMehod == evasionMethod.CONST_VEL) {
		target = createVector(0.5 * width,0.5 * height);
	}
}

function offScreen(vector) {
	return vector.x < 0 || vector. x > width || vector.y < 0 || vector.y > height;
}

function reset() {
	console.log("Reset");
	const pos = createVector(width / 2, height - 20);
	const vel = createVector(0, -1, 0);
	const burnTime = 150;
	const gain = 0.05;
	missile = new Missile(pos, vel, burnTime, gain);

	if(currentEvasionMehod == evasionMethod.STATIC) {
		const xRand = random(xBuffer, width - xBuffer);
		const yRand = random(yBuffer, height - yBuffer);
		target = createVector(xRand, yRand);
		console.log("New targetvector: ", target);
	} else if(currentEvasionMehod == evasionMethod.CONST_VEL) {
		const xRand = random(xBuffer, 0.5 * width);
		const yRand = random(0.5 * height, height - yBuffer);
		target = createVector(xRand, yRand);
		let randVelX = random(0, 1);
		let randVelY = random(-1, 0);
		targetVel = createVector(randVelX, randVelY);
	}
	
	time = 0;
}

/**
*   p5.js setup function, creates canvas.
*/
function setup() {
	let cnvSize;
	if(windowWidth > windowHeight) {
		cnvSize = windowHeight;
	} else {
		cnvSize = windowWidth;
	}

	let cnv = createCanvas(cnvSize, .7 * cnvSize);
	cnv.parent('sketch');

	selectAlgorithm = createSelect();
	selectAlgorithm.parent("algorithm");
	selectAlgorithm.option(algorithm.PURSUIT);
	selectAlgorithm.option(algorithm.PN);
	selectAlgorithm.option(algorithm.TPN);
	selectAlgorithm.option(algorithm.APN);
	selectAlgorithm.option(algorithm.MOTION);
	selectAlgorithm.changed(algorithmSelectEvent);

	selectEvasionMethod = createSelect();
	selectEvasionMethod.parent("evasion-method");
	selectEvasionMethod.option(evasionMethod.STATIC);
	selectEvasionMethod.option(evasionMethod.CONST_VEL);
	selectEvasionMethod.option(evasionMethod.CURVE_AWAY);
	selectEvasionMethod.option(evasionMethod.CURVE_IN);
	selectEvasionMethod.option(evasionMethod.RAND);
	selectEvasionMethod.changed(evasionMethodSelectEvent);

	resetButton = createButton("Reset", "value");
	resetButton.parent("reset-button");
	resetButton.mousePressed(reset);

	reset();
}

/**
*   p5.js draw function, is run every frame to create the desired animation
*/
function draw() {
	background(255);
	if(currentEvasionMehod == evasionMethod.CONST_VEL) {
		target.add(targetVel);
	} else if(currentEvasionMehod == evasionMethod.STATIC) {

	}
	stroke(0);
	ellipse(target.x, target.y, 10, 10);
	line(0, target.y, width, target.y);
	line(target.x, 0, target.x, height);
	missile.steerTo(target);
	missile.update(time);
	missile.draw(time);

	if(offScreen(target) || offScreen(missile.pos)) {
		reset();
	}
	time++;
}

