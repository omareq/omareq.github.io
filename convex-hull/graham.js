/*******************************************************************************
*
*	@file graham.js
*	@brief Grahams Scan algorithm
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 27-July-2019
*
*******************************************************************************/

/**
*	Enumeration of the possible state the graham scan algorithm can be in
*
*	@enum {Integer}
*/
const grahamSteps = Object.freeze({
	SORT: 0,
	CALCULATE: 1,
	DONE: 2
});

let grahamStep = grahamSteps.SORT;


/**
*	The graham scan algorithm
*/
function grahamScan() {
	switch(grahamStep) {
		case grahamSteps.SORT:
		points.sort((a, b) => a.y - b.y);
		const lowestPoint = points[0];
		const lpx = lowestPoint.x;
		const lpy = lowestPoint.y;
		points.sort((a, b) => atan2(a.y - lpy, a.x - lpx) - atan2(b.y - lpy, b.x - lpx));

		push();
		fill(255, 0, 0);
		ellipse(lowestPoint.x, lowestPoint.y, pointRadius, pointRadius);

		stroke(255);
		strokeWeight(4);
		line(lowestPoint.x, lowestPoint.y, points[1].x, points[1].y);
		line(lowestPoint.x, lowestPoint.y, points[points.length - 1].x, points[points.length - 1].y);

		index++;
		if(index == points.length) {
			index = 0;
			grahamStep++;
			hull.push(points[0]);
			hull.push(points[1]);
			index = 2;
			return;
		}

		stroke(0, 255, 100);
		strokeWeight(2);
		line(lowestPoint.x, lowestPoint.y, points[index].x, points[index].y);

		pop();
		break;

		case grahamSteps.CALCULATE:
			drawEdges(hull, 55);

	    	while (hull.length >= 2 && crossZ(hull[hull.length - 2], hull[hull.length - 1], points[index]) <= 0) {
	        	hull.pop();
	      	}
	    	hull.push(points[index]);

		    index++;
	      	if(hull[hull.length - 1] == points[points.length - 1]) {
		    	grahamStep++;
		    	index = 0;
		    	console.log("Done");
			}
		break;

		case grahamSteps.DONE:
			drawHull(hull, 55);
			time++;
			if (time > frameRate() * 4) {
				grahamStep = grahamSteps.SORT;
				reset();
			}
		break
	}
	return;
}