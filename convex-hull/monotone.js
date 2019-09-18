/*******************************************************************************
*
*	@file monotone.js
*	@brief Monotone Chain algorithm
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 27-July-2019
*
*******************************************************************************/

let lower = [];
let upper = [];

/**
*	Enumeration of the possible state the monotone chain algorithm can be in
*
*	@enum {Integer}
*/
const monotoneSteps = Object.freeze({
	SORT: 0,
	LOWER: 1,
	UPPER: 2,
	FUSE: 3,
	DONE: 4
});

let monotoneStep = monotoneSteps.SORT;

/**
*	Finds the z component of the cross product of three vectors
*
*	@param a {p5.Vector}
*
*	@param b {p5.Vector}
*
*	@param o {p5.Vector}
*
*	@returns {Float}
*/
function crossZ(a, b, o) {
	let va = p5.Vector.sub(a, o);
	let vb = p5.Vector.sub(b, o);
	let c = va.cross(vb);
	return c.z;
}

/**
*	The monotone chain algorithm
*/
function monotoneChain() {
	switch(monotoneStep) {
		case monotoneSteps.SORT:
			points.sort((a, b) => a.x == b.x ? a.y - b.y : a.x - b.x);
			monotoneStep++;
			index = 2;
			lower.push(points[0]);
			lower.push(points[1]);
		break;

		case monotoneSteps.LOWER:
			drawEdges(lower, 30);

	    	while (lower.length >= 2 && crossZ(lower[lower.length - 2], lower[lower.length - 1], points[index]) <= 0) {
	        	lower.pop();
	      	}
	    	lower.push(points[index]);

		    index++;
	      	if(index == points.length) {
		    	monotoneStep++;
		    	index = points.length - 1;
			}
	   	break;

		case monotoneSteps.UPPER:
			drawHull(lower, 30);
			drawEdges(upper, 60);

	      	while (upper.length >= 2 && crossZ(upper[upper.length - 2], upper[upper.length - 1], points[index]) <= 0) {
	        	upper.pop();
	      	}
	    	upper.push(points[index]);

		   	index--;
	      	if(index == -1) {
		    	monotoneStep++;
		    	index = 0;
			}
		break;

		case monotoneSteps.FUSE:
			time++;
			drawHull(lower, 30);
			drawHull(upper, 60);
 			if(time > 2 * frameRate()) {
 				time = 0;
 				monotoneStep++;
 			}
	   	break;

		case monotoneSteps.DONE:
	   	if(time == 0) {
			upper.pop();
   			lower.pop();
   			hull = lower.concat(upper);
		}
		drawHull(hull, 45);
		time++;
		if (time > frameRate() * 4) {
			monotoneStep = monotoneSteps.SORT;
			reset();
		}
	   	break;
	}
}