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
}

function reset() {
	console.log("Reset");
	const pos = createVector(width / 2, height - 20);
	const vel = createVector(0, -1, 0);
	const burnTime = 150;
	const gain = 0.05;
	missile = new Missile(pos, vel, burnTime, gain);
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
	const target = createVector(0.5 * time, 0.25 * height + 0.2 * time, 0);
	ellipse(target.x, target.y, 10, 10);
	missile.steerTo(target);
	missile.update(time);
	missile.draw(time);
	time++;
}

