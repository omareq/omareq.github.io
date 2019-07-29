/*******************************************************************************
*
*	@file sketch.js
*	@brief
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 27-July-2019
*
*******************************************************************************/

let xBuffer;

let yBuffer;

const algorithms = Object.freeze({
	MONOTONE: " Monotne Chain ",
	JARVIS: " Jarvis March ",
	DIVIDE: " Divide & Conquer "
});

let algorithm = algorithms.JARVIS;

let numPoints = 45;

let pointRadius = 10;

let radioAlgorithm;

let radioSplitMethod;

function reset() {
	hull = [];
	jarvisStep = 0;
	leftPointIndex = 0;;
	currentIndex = -1;
	nextIndex = 1;
	index = 2;
	time = 0;

	internalHulls = [[], [], []];
	finalHull = [];
	finalPoints = [];
	divideStep = divideSteps.SPLIT;
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
	cnvSize *= 0.9;
	let cnv = createCanvas(cnvSize, .7 * cnvSize);
	cnv.parent("sketch");

	radioAlgorithm = createRadio();
	radioAlgorithm.parent("control-panel");
	radioAlgorithm.option(algorithms.JARVIS);
	radioAlgorithm.option(algorithms.DIVIDE);

	radioSplitMethod = createRadio();
	radioSplitMethod.parent("control-panel");
	radioSplitMethod.option(splitMethods.HORIZONTAL);
	radioSplitMethod.option(splitMethods.VERTICAL);
	radioSplitMethod.option(splitMethods.RADIAL);

	xBuffer = 0.05 * width;
	yBuffer = 0.05 * height;

	for(let i = 0; i < numPoints; ++i) {
		const x = random(xBuffer, width - xBuffer);
		const y = random(yBuffer, height - yBuffer);
		const newPoint = createVector(x, y);
		points.push(newPoint);
	}
}

/**
*   p5.js draw function, is run every frame to create the desired animation
*/
function draw() {
	background(0);
	fill(255);
	textSize(height * 0.03);
	textAlign(LEFT, TOP);
	noStroke();

	let radioVal = radioAlgorithm.value();
	if(radioVal != algorithm && radioVal != "") {
		algorithm = radioVal;
		reset();
	}

	if(algorithm != algorithms.DIVIDE) {
		radioSplitMethod.hide();
	} else {
		radioSplitMethod.show();
	}

	radioVal = radioSplitMethod.value();
	if(radioVal != splitMethod && radioVal != "") {
		splitMethod = radioVal;
		reset();
	}



	text(algorithm, 0, 0);

	for (var i = points.length - 1; i >= 0; i--) {
		ellipse(points[i].x, points[i].y, pointRadius, pointRadius);
	}

	switch(algorithm) {
		case algorithms.JARVIS:
		jarvisMarch();
		break;

		case algorithms.MONOTONE:
		monotoneChain();
		break;

		case algorithms.DIVIDE:
		divideAndConquer();
		break;

		default:
		background(255);
		break;
	}	

}

