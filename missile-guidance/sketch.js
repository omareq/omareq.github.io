/*******************************************************************************
*
*	@file sketch.js A program looking into the various methods of missile
*	targeting.
*
*	@author Omar Essilfie-Quaye <omareq08@gmail.com>
*	@version 1.0
*	@date 27-August-2019
*
*******************************************************************************/

/**
*	Enumeration of the different algorithm types
*
*	@enum {String}
*/
const algorithm = Object.freeze({
	PURSUIT: 	"Pursuit",
	PN: 		"Proportional Navigation",
	TPN: 		"True Proportional Navigation",
	APN: 		"Augmented Proportional Navigation",
	MOTION: 	"Motion Camouflage"
});

/**
*	Algorithm selection handler
*
*	@type{p5.Element}
*/
let selectAlgorithm;

/**
*	Variable that stores the current missile pursuit algorithm
*
*	@type{Enum<String>
*/
let currentAlgorithm = algorithm.PURSUIT;

/**
*	Enumeration of the different target evasion methods
*
*	@enum {String}
*/
const evasionMethod = Object.freeze({
	STATIC: 	"Static",
	CONST_VEL: 	"Constant Velocity",
	CURVE_AWAY: "Curve Away",
	CURVE_IN: 	"Curve In",
	RAND: 		"Random"
});

/**
*	EvasionMethod selection handler
*
*	@type{p5.Element}
*/
let selectEvasionMethod;

/**
*	Variable that stores the target evasion method
*
*	@type{Enum<String>}
*/
let currentEvasionMehod = evasionMethod.STATIC;

/**
*	Target position vector
*
*	@type{p5.Vector}
*/
let target;

/**
*	Target velocity vector
*
*	@type{p5.Vector}
*/
let targetVel;

/**
*	Target velocity magnitude
*
*	@type{Float}
*/
let targetSpeed = 0.95;

/**
*	Size of the target
*
*	@type{Float}
*/
let targetRadius;

/**
*	Seed for the Perlin noise used for the random evasion method.  This value
*	persists between frames such that the end motion of the target is not
*	unnaturally sporadic.
*
*	@type{Float}
*
*	@see randEvadeVel
*/
let noiseSeed;

/**
*	Handler for reset button
*
*	@type{p5.element}
*/
let resetButton;

/**
*	Launched missile
*
*	@type{Missile}
*/
let missile;

/**
*	Flag denoting if missile has hit target and explode animation is under way
*
*	@type{Boolean}
*/
let explode;

/**
*	How many frames the explode animation will run for
*
*	@type{Integer}
*/
let explodeTime;

/**
*	Simulation time, mainly used to calculate missile thrust curve
*
*	@type{Integer}
*/
let time;

/**
 * Callback function for algorithm event selector.  Changes the value of
 * currentAlgorithm and resets the simulation
 *
 * @see reset
 */
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


/**
 * Callback function for evasion method event selector.  Changes the value of
 * currentEvasionMethod and resets the simulation.
 *
 * @see reset
 */
function evasionMethodSelectEvent() {
	const selectVal = selectEvasionMethod.value();
	if(selectVal != currentEvasionMehod) {
		currentEvasionMehod = selectVal;
		console.log("New target evasion method: " + currentEvasionMehod);
	} else {
		return;
	}

	reset();
}

/**
 * Creates a random evade velocity for the target based on Perlin noise using
 * the provided seed value.  This new velocity replaces the previous value.
 *
 * @param      {Float}  seed    The seed
 * @see        targetVel
 */
function randEvadeVel(seed) {
	let randVelX = noise(noiseSeed);
	let randVelY = -noise(noiseSeed + 100);
	targetVel = createVector(randVelX, randVelY);
	targetVel.setMag(targetSpeed);
}

/**
 * Checks if a given position vector is within the bounds of the canvas.
 *
 * @param      {p5.Vector}  vector  The position vector
 * @return     {Boolean}  returns true when the vector is external to the
 * bounds of the canvas
 */
function offScreen(vector) {
	return vector.x < 0 || vector. x > width
		|| vector.y < 0 || vector.y > height;
}

/**
 * Reset the simulation.  Creates new missile and randomises target location
 * and initial target velocity.  Flags are reset and time is set to zero.
 */
function reset() {
	console.log("Reset");
	const pos = createVector(width / 2, height - 20);
	const vel = createVector(0, -1, 0);
	const burnTime = 150;
	const selfDestructTime = 400;
	const gain = 0.05;
	missile = new Missile(pos, vel, burnTime, selfDestructTime, gain);

	const xBuffer = 0.125 * width;
	const yBuffer = 0.25 * height;
	const xRand = random(xBuffer, width - xBuffer);
	const yRand = random(yBuffer, height - yBuffer);

	if(currentEvasionMehod == evasionMethod.STATIC) {
		target = createVector(xRand, yRand);
		targetVel = createVector(0, 0);
		console.log("New targetvector: ", target);
	} else if(currentEvasionMehod == evasionMethod.CONST_VEL) {
		target = createVector(xRand, yRand);
		targetVel = p5.Vector.random2D();
		targetVel.setMag(targetSpeed);
	} else if(currentEvasionMehod == evasionMethod.CURVE_AWAY) {
		target = createVector(xRand, yRand);
		targetVel = p5.Vector.random2D();
		targetVel.setMag(targetSpeed);
	} else if(currentEvasionMehod == evasionMethod.CURVE_IN) {
		target = createVector(xRand, yRand);
		targetVel = p5.Vector.random2D();
		targetVel.setMag(targetSpeed);
	} else if(currentEvasionMehod == evasionMethod.RAND) {
		target = createVector(xRand, yRand);
		noiseSeed = random(100);
		randEvadeVel();
	}

	if(target.x > 0.5 * width && targetVel.x > 0) {
		targetVel.x *= -1;
	}
	if(target.x < 0.5 * width && targetVel.x < 0) {
		targetVel.x *= -1;
	}

	if(target.y > 0.5 * height && targetVel.y > 0) {
		targetVel.y *= -1;
	}
	if(target.y < 0.5 *height && targetVel < 0) {
		targetVel.y *= -1;
	}

	targetRadius = 0.025 * width;
	explode = false;
	explodeTime = 30;
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
*   p5.js draw function, is run every frame to create the desired animation.
*	Invokes missile drawing method.
*
*	@see Missile
*/
function draw() {

	background(255);
	if(!explode) {
		if(currentEvasionMehod == evasionMethod.STATIC) {
		} else if(currentEvasionMehod == evasionMethod.CONST_VEL) {
			target.add(targetVel);
		} else if(currentEvasionMehod == evasionMethod.CURVE_AWAY) {
			let missileVec = target.copy().sub(missile.pos.copy());
			let desiredVec = missileVec.rotate(QUARTER_PI);
			stroke(255, 0, 0);
			line(target.x, target.y,
				target.x + desiredVec.x, target.y + desiredVec.y);

			let angle1 = targetVel.heading();
			let angle2 = desiredVec.heading();
			let angle = angle1 - angle2;

			let targetGain = 0.02;
			let steer = targetGain * angle;
			targetVel.rotate(steer);
			targetVel = desiredVec.setMag(targetSpeed);
			target.add(targetVel);
		} else if(currentEvasionMehod == evasionMethod.CURVE_IN) {
			let missileVec = target.copy().sub(missile.pos.copy());
			let desiredVec = missileVec.rotate(HALF_PI + QUARTER_PI);
			stroke(255, 0, 0);
			line(target.x, target.y,
				target.x + desiredVec.x, target.y + desiredVec.y);

			let angle1 = targetVel.heading();
			let angle2 = desiredVec.heading();
			let angle = angle1 - angle2;

			let targetGain = 0.02;
			let steer = targetGain * angle;
			targetVel.rotate(steer);
			targetVel = desiredVec.setMag(targetSpeed);
			target.add(targetVel);
		} else if(currentEvasionMehod == evasionMethod.RAND) {
			noiseSeed += 0.1;
			randEvadeVel();
			target.add(targetVel);
		}
		stroke(0);
		ellipse(target.x, target.y, targetRadius, targetRadius);
		line(0, target.y, width, target.y);
		line(target.x, 0, target.x, height);
		missile.steerTo(target, currentAlgorithm);
		missile.update(time);
		missile.draw(time);

		if(offScreen(target) || offScreen(missile.pos)) {
			reset();
		}

		let distance = dist(target.x, target.y,missile.pos.x, missile.pos.y);
		if(distance < targetRadius) {
			console.log("Target Neutralised");
			explode = true;
			time = 0;
			//reset();
		} else if(time > missile.selfDestructTime) {
			console.log("Missile Self Destruct: Target Escaped");
			explode = true;
			time = 0;
		}
	} else {
		stroke(0);
		ellipse(target.x, target.y, targetRadius, targetRadius);
		line(0, target.y, width, target.y);
		line(target.x, 0, target.x, height);

		const r = time / explodeTime * 2 * targetRadius;
		stroke(255, 0, 0);
		ellipse(missile.pos.x, missile.pos.y, r, r);
		if(time > explodeTime) {
			explode = false;
			reset();
		}
	}
	time++;
}

