/*******************************************************************************
*
*	@file graham.js
*	@brief Graham Scan algorithm
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 08-August-2019
*
*******************************************************************************/

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
*	The graham scan algorithm
*/
function grahamScan(verticies) {
	let hull = [];
	let points = [...verticies];

	points.sort((a, b) => a.y - b.y);
	const lowestPoint = points[0];
	const lpx = lowestPoint.x;
	const lpy = lowestPoint.y;
	points.sort((a, b) => atan2(a.y - lpy, a.x - lpx) - atan2(b.y - lpy, b.x - lpx));

	hull.push(points[0]);
	hull.push(points[1]);
	let index = 2;

	for(;;) {
    	while (hull.length >= 2 && crossZ(hull[hull.length - 2], hull[hull.length - 1], points[index]) <= 0) {
        	hull.pop();
      	}
    	hull.push(points[index]);

	    index++;
      	if(hull[hull.length - 1] == points[points.length - 1]) {
	    	return hull;
		}
	}
}