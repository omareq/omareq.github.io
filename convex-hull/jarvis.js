/*******************************************************************************
*
*	@file jarvis.js
*	@brief The Jarvis March or Gift Wrapping algorithm
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 27-July-2019
*
*******************************************************************************/

let points = [];

let hull = [];

/**
*	Enumeration of the possible state the jarvis march algorithm can be in
*
*	@enum {Integer}
*/
const jarvisSteps = Object.freeze({
	LEFT: 0,
	CALCULATE: 1,
	DONE: 2
});

let jarvisStep = 0;

let leftPointIndex = 0;;

let currentIndex = -1;

let nextIndex = 1;

let index = 2;

let time = 0;

const leftPointFrameRate = 10;

const calculateFrameRate = 15;

/**
*	Enumeration of the possible directions the algorithm can use when
*	generating the convex hull
*
*	@enum {String}
*/
const direction = Object.freeze({
	CLOCKWISE: "clockwise",
	ANTICLOCKWISE: "anticlockwise"
});

let angularDirection = direction.CLOCKWISE;


/**
*   Jarvis March algorithm function
*/
function jarvisMarch() {
	switch(jarvisStep) {

		// find left most point
		case jarvisSteps.LEFT:
			if(currentIndex != -1) {
				if(points[currentIndex].x < points[leftPointIndex].x) {
					points.sort((a, b) => a.y - b.y);
					leftPointIndex = currentIndex;
					frameRate(leftPointFrameRate);
				}

				// Draw red around the point that is being checked
				push();
				stroke(255, 0, 0);
				strokeWeight(0.3 * pointRadius);
				const currentPoint = points[currentIndex];
				line(0, currentPoint.y, currentPoint.x, currentPoint.y);
				ellipse(currentPoint.x, currentPoint.y, pointRadius, pointRadius);	
				pop();

				// Draw green around the current left most point
				push();
				stroke(0, 255, 0);
				strokeWeight(0.3 * pointRadius);
				const leftPoint = points[leftPointIndex];
				line(0, leftPoint.y, leftPoint.x, leftPoint.y);
				ellipse(leftPoint.x, leftPoint.y, pointRadius, pointRadius);	
				pop();
			} else {
				currentIndex = 0;
				leftPointIndex = currentIndex;
			}

			currentIndex++;
			if(currentIndex == points.length) {
				jarvisStep++;
				points.sort((a, b) => a.x - b.x);
				leftPointIndex = 0;
				currentIndex = leftPointIndex;
				nextIndex = 1;
				index = 2;
				hull.push(points[leftPointIndex].copy());
				frameRate(calculateFrameRate);
			}
		break;

		// calculate which points are in the hull
		case jarvisSteps.CALCULATE:
			drawHull(hull, 65);

			const nextPoint = points[nextIndex];
			const currentPoint = points[currentIndex];
			const checking = points[index];

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

			const clockwiseCheck = angularDirection == direction.CLOCKWISE && cross.z < 0;
			const anticlockwiseCheck = angularDirection == direction.ANTICLOCKWISE && cross.z > 0;

			if ( clockwiseCheck || anticlockwiseCheck) {
				nextIndex = index;
			} 
			index++;

			if (index == points.length) {
			    if (nextIndex == 0) {
			    	jarvisStep = jarvisSteps.DONE;
			    	time = 0;
			    } else {
			        hull.push(points[nextIndex]);
			        currentIndex = nextIndex;
			        index = 0;
			        nextIndex = leftPointIndex;
			    }
			}
		break;

		// Draw Final hull for 5 seconds then restart
		case jarvisSteps.DONE:
			drawHull(hull, 65);
			time++;
			if (time > frameRate() * 4) {
				reset();
			}
		break;

	}
}