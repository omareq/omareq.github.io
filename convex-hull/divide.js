/*******************************************************************************
*
*	@file divide.js
*	@brief Divide and conquer algorithm
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 27-July-2019
*
*******************************************************************************/

let internalHulls = [[], [], []];

let internalPoints = [[], [], []];

let finalHull = [];
let finalPoints = [];

/**
*	Enumeration of the possible state the divide and conquer algorithm can be in
*
*	@enum {Integer}
*/
const divideSteps = Object.freeze({
	SPLIT: 0,
	CALCULATE1: 1,
	CALCULATE2: 2,
	CALCULATE3: 3,
	FUSE: 4,
	DONE: 5
});

let divideStep = divideSteps.SPLIT;

/**
*	Enumeration of the different methods for splitting the points
*
*	@enum {String}
*/
const splitMethods = Object.freeze({
	VERTICAL: " Vertical Split ",
	HORIZONTAL: " Horizontal Split ",
	RADIAL: " Radial Split ",
	ANGULAR: " Angular Split "
});

let splitMethod = splitMethods.HORIZONTAL;

/**
*	Returns an array with arrays of the given size.
*
*	@param array {Array} Array to split
*
*	@param chunkSize {Integer} Size of every group
*/
function chunkArray(inputArray, chunkSize) {
	// ES6 Clone Array
    let array = [...inputArray];
    let results = [];

    while (array.length) {
        results.push(array.splice(0, chunkSize));
    }

    let extra = [];
    if(results[results.length - 1].length != results[results.length - 2].length) {
    	extra = results.pop();
    }

    while(extra.length) {
    	results[results.length - 1].push(extra.pop());
    }

    return results;
}

/**
*	Calculates the internal hull for one of the subsections after division
*
*	@param hullIndex {Integer} Select which hull to calculate from 0 to 2
*/
function calculateHull(hullIndex) {
	frameRate(calculateFrameRate);

	const currentPoint = internalPoints[hullIndex][currentIndex];
	const nextPoint = internalPoints[hullIndex][nextIndex];
	const checking = internalPoints[hullIndex][index];

	push();
	stroke(0, 255, 0);
	line(currentPoint.x, currentPoint.y, checking.x, checking.y);
	strokeWeight(3);
	stroke(255, 0, 0);
	line(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
	pop();
	const a = p5.Vector.sub(nextPoint, currentPoint);
	const b = p5.Vector.sub(checking, currentPoint);
	const cross = a.cross(b);

	if (cross.z < 0) {
		nextIndex = index;
	}
	index++;

	if (index == internalPoints[hullIndex].length) {
	    if (nextIndex == 0) {
	    	divideStep++;
	    	currentIndex = 0;
			nextIndex = 1;
			index = 2;
			if(hullIndex + 1 != internalPoints.length) {
				internalHulls[hullIndex + 1].push(internalPoints[hullIndex + 1][0].copy());
	    	}
	    } else {
	        internalHulls[hullIndex].push(internalPoints[hullIndex][nextIndex]);
	        currentIndex = nextIndex;
	        index = 0;
	        nextIndex = 0;
	    }
	}
}

/**
*	Combines the three internal hulls into the final convex hull for all points
*/
function fuse() {
	if(finalPoints.length == 0) {
		finalPoints = [...internalHulls[0]].concat(internalHulls[1]).concat(internalHulls[2]);

		finalPoints.sort((a, b) => a.x - b.x);
		finalHull.push(finalPoints[0]);
	} else {
		frameRate(calculateFrameRate + 10);

		const currentPoint = finalPoints[currentIndex];
		const nextPoint = finalPoints[nextIndex];
		const checking = finalPoints[index];

		push();
		stroke(0, 255, 0);
		line(currentPoint.x, currentPoint.y, checking.x, checking.y);
		strokeWeight(3);
		stroke(255, 0, 0);
		line(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
		pop();
		const a = p5.Vector.sub(nextPoint, currentPoint);
		const b = p5.Vector.sub(checking, currentPoint);
		const cross = a.cross(b);

		if (cross.z < 0) {
			nextIndex = index;
		}
		index++;

		if (index == finalPoints.length) {
		    if (nextIndex == 0) {
		    	divideStep++;
		    	currentIndex = 0;
				nextIndex = 1;
				index = 2;
				time = 0;
		    } else {
		        finalHull.push(finalPoints[nextIndex]);
		        currentIndex = nextIndex;
		        index = 0;
		        nextIndex = 0;
		    }
		}
	}
}

/**
*	The Divide & Conquer algorithm
*/
function divideAndConquer() {
	switch(divideStep) {
		case divideSteps.SPLIT:
			switch(splitMethod) {
				case splitMethods.VERTICAL: {
					points.sort((a, b) => a.x - b.x);
					internalPoints = chunkArray(points, points.length / 3);
				}
				break;

				case splitMethods.HORIZONTAL: {
					points.sort((a, b) => a.y - b.y);
					internalPoints = chunkArray(points, points.length / 3);
				}
				break;

				case splitMethods.RADIAL: {
					const w2 = width / 2;
					const h2 = height / 2;
					points.sort((a, b) => atan2(a.y - h2, a.x - w2) - atan2(b.y - h2, b.x - w2));
					internalPoints = chunkArray(points, points.length / 3);
				}
				break;

				case splitMethods.ANGULAR: {
					const w2 = width / 2;
					const h2 = height / 2;
					points.sort((a, b) => dist(a.x, a.y, w2, h2) - dist(b.x, b.y, w2, h2));
					internalPoints = chunkArray(points, points.length / 3);
				}
				break;
			}

			currentIndex = 0;
			nextIndex = 1;
			index = 2;
			internalHulls[0].push(internalPoints[0][0].copy());
			divideStep++;
		break;

		case divideSteps.CALCULATE1:
			drawHull(internalHulls[0], 0);
			calculateHull(0);
		break;

		case divideSteps.CALCULATE2:
			drawHull(internalHulls[0], 0);
			drawHull(internalHulls[1], 30);
			calculateHull(1);
		break;

		case divideSteps.CALCULATE3:
			drawHull(internalHulls[0], 0);
			drawHull(internalHulls[1], 30);
			drawHull(internalHulls[2], 60);
			calculateHull(2);
		break;

		case divideSteps.FUSE:
			drawHull(internalHulls[0], 0);
			drawHull(internalHulls[1], 30);
			drawHull(internalHulls[2], 60);

			fuse();
			drawHull(finalHull, 90);
		break;

		case divideSteps.DONE:
			drawHull(finalHull, 90);
			time++;

			if (time > frameRate() * 4) {
				reset();
			}
		break;
	}
}
