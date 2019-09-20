/*******************************************************************************
*
*	@file sketch.js
*	@brief A quick sketch showing different methods of generating a convexhull
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 27-July-2019
*
*******************************************************************************/

let resetButton;

/**
*	Variable that store how far away from the side edges new points can spawn
*
*	@type {Integer}
*/
let xBuffer;

/**
*	Variable that store how far away from the top and bottom edges new points
*	can spawn
*
*	@type {Integer}
*/
let yBuffer;

/**
*	Enumeration of the different algorithm types
*
*	@enum {String}
*/
const algorithms = Object.freeze({
	MONOTONE: "Monotone Chain",
	JARVIS: "Jarvis March",
	DIVIDE: "Divide & Conquer",
	GRAHAM: "Graham Scan"
});

/**
*	Variable that stores the current algorithm tha is being executed
*
*	@type {Enum<String>}
*/
let algorithm = algorithms.JARVIS;

/**
*	Pointer for the number of points slider in the DOM
*
*	@type {p5.Element}
*/
let pointsSlider;

/**
*	Number of points to be bound by the generated convex hull
*
*	@type {Integer}
*/
let numPoints = 45;

/**
*	Pointer for the paragraph which shows the number of points in the DOM
*
*	@type {p5.Element}
*/
let pointsDisplay;

/**
*	Size of the points drawn on the canvas
*
*	@type {Integer}
*/
let pointRadius = 10;

/**
*	Pointer to select field that selects the executing algorithm
*
*	@type {p5.Element}
*/
let selectAlgorithm;


/**
*	Pointer to select field that selects the method that is used to split the
*	points when divide and conquer is running
*
*	@type {p5.Element}
*/
let selectSplitMethod;

/**
*	Pointer to select field that selects the direction that the Jarvis march
*	algorithm finds theconvex hull
*
*	@type {p5.Element}
*/
let selectAngularDirection;

/**
*	Reset all algorithm variables to initial values
*/
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
	lower = [];
	upper = [];

	divideStep = divideSteps.SPLIT;
	jarvisStep = jarvisSteps.LEFT;
	monotoneStep = monotoneSteps.SORT;
	grahamStep = grahamSteps.SORT;

	points = [];
	for(let i = 0; i < numPoints; ++i) {
		const x = random(xBuffer, width - xBuffer);
		const y = random(yBuffer, height - yBuffer);
		const newPoint = createVector(x, y);
		points.push(newPoint);
	}
}

/**
*	Changes the algorithm depending on what the value of the selectAlgorithm
*	element is
*/
function algorithmSelectEvent() {
	let selectVal = selectAlgorithm.value();
	if(selectVal != algorithm) {
		algorithm = selectVal;
	}

	if(algorithm == algorithms.DIVIDE) {
		selectSplitMethod.show();
	} else {
		selectSplitMethod.hide();
	}

	if(algorithm == algorithms.JARVIS) {
		selectAngularDirection.show();
	} else {
		selectAngularDirection.hide();
	}

	if(algorithm == algorithms.MONOTONE) {
		// show monotone chain options
	} else {
		// hide monotone chain options
	}

	if(algorithm == algorithms.GRAHAM) {
		// show graham scan options
	} else {
		// hide graham scan options
	}

	reset();
}

/**
*	Changes the method for splitting the points in divide and conquer depending
*	on the value of the selectSplitMethod element
*/
function splitSelectEvent() {
	selectVal = selectSplitMethod.value();
	if(selectVal != splitMethod) {
		splitMethod = selectVal;
		reset();
	}
}

/**
*	Changes the direction the jarvis march algorithm selects new points for the
*	convex hull depending on the value of the selectAngularDirection element
*/
function angularSelectEvent() {
	selectVal = selectAngularDirection.value();
	if(selectVal != angularDirection) {
		angularDirection = selectVal;
		reset();
	}
}

/**
*	Draws a convex hull with a given colour
*
*	@param hullArray {Array<p5.Vector>} Array of points that amke up the
*		verticies of the hull.
*
*	@param colour {Integer} Value of the hue of the given hull from 0 to 100
*/
function drawHull(hullArray, colour) {
	push();
	colorMode(HSB, 100);
	fill(colour, 100, 100, 50);
	beginShape();
	for (let i = hullArray.length - 1; i >= 0; i--) {
		push();
		stroke(colour, 100,100);
		strokeWeight(0.3 * pointRadius);
		ellipse(hullArray[i].x, hullArray[i].y, pointRadius, pointRadius);
		vertex(hullArray[i].x, hullArray[i].y);
		pop();
	}
	endShape(CLOSE);
	colorMode(RGB);
	pop();
}

/**
*	Draws the edges of a convex hull with a given colour
*
*	@param hullArray {Array<p5.Vector>} Array of points that amke up the
*		verticies of the hull.
*
*	@param colour {Integer} Value of the hue of the given hull from 0 to 100
*/
function drawEdges(hullArray, colour) {
	push();
	colorMode(HSB, 100);
	stroke(colour, 100, 100, 50);
	strokeWeight(0.3 * pointRadius);
	noFill();
	beginShape();
	for (let i = hullArray.length - 1; i >= 0; i--) {
		ellipse(hullArray[i].x, hullArray[i].y, pointRadius, pointRadius);
		vertex(hullArray[i].x, hullArray[i].y);
	}
	endShape();
	colorMode(RGB);
	pop();
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
	cnv.parent("sketch");

	pointsSlider = createSlider(12, 100, numPoints, 1);
	pointsSlider.parent("num-points");

	pointsDisplay = createP(numPoints);
	pointsDisplay.parent("points-val");

	selectAlgorithm = createSelect();
	selectAlgorithm.parent("algorithm");
	selectAlgorithm.option(algorithms.JARVIS);
	selectAlgorithm.option(algorithms.DIVIDE);
	selectAlgorithm.option(algorithms.MONOTONE);
	selectAlgorithm.option(algorithms.GRAHAM);
	selectAlgorithm.changed(algorithmSelectEvent);

	selectAngularDirection = createSelect();
	selectAngularDirection.parent("algorithm-options");
	selectAngularDirection.option(direction.CLOCKWISE);
	selectAngularDirection.option(direction.ANTICLOCKWISE);
	selectAngularDirection.changed(angularSelectEvent);
	selectAngularDirection.hide();

	selectSplitMethod = createSelect();
	selectSplitMethod.parent("algorithm-options");
	selectSplitMethod.option(splitMethods.HORIZONTAL);
	selectSplitMethod.option(splitMethods.VERTICAL);
	selectSplitMethod.option(splitMethods.RADIAL);
	selectSplitMethod.changed(splitSelectEvent);
	selectSplitMethod.hide();
//TODO (omar: omareq08@gmail.com): ANGULAR split method for dnc notworking
	// selectSplitMethod.option(splitMethods.ANGULAR);

	resetButton = createButton("Reset", "value");
	resetButton.parent("reset-button");
	resetButton.mousePressed(reset);

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
	text(algorithm, 0, 0);

	let sliderVal = pointsSlider.value();
	if(sliderVal != numPoints) {
		numPoints = sliderVal;
		pointsDisplay.elt.innerText = "Number of Points: " + str(numPoints);
		reset();
	}

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

		case algorithms.GRAHAM:
		grahamScan();
		break;

		default:
		background(255);
		break;
	}
}
