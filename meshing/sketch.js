/*******************************************************************************
*
*	@file sketch.js
*	@brief	Delaunay triangulation for mesh generation
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 08-August-2019
*
*******************************************************************************/

/**
*	Array storing a list of randomly generated points
*
*	@type {Array<p5.Vector>}
*/
let myPoints = [];

/**
*	Array storing a list of randomly generated points
*
*	@type {Array<p5.Vector>}
*/
let myHull = [];

let mesh;

/**
*	Number of points to be bound by the generated convex hull
*
*	@type {Integer}
*/
let numPoints = 50;

/**
*	Size of the points drawn on the canvas
*
*	@type {Integer}
*/
let pointRadius = 4;

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
*	Draws a set of points on the screen
*
*	@param verticies {Array<p5.Vector>} Array of points
*/
function drawPoints(verticies) {
	push();
	noStroke();
	fill(0, 155);
	let points = [...verticies];
	for (var i = points.length - 1; i >= 0; i--) {
		ellipse(points[i].x, points[i].y, pointRadius, pointRadius);
	}
	pop();
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
	fill(colour, 100, 100, 0);
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

function mousePressed() {
	mesh.addVertex(new Vertex(mouseX, mouseY));
}

function triangleStrip(points) {
	let verticies = [];
	for(let i = 0; i < points.length; i++) {
		verticies.push(new Vertex(points[i].x, points[i].y));
	}

	let faces = [];
	let v1 = new Vertex(verticies[verticies.length - 1].x, verticies[verticies.length - 1].y);
	let v2 = new Vertex(verticies[0].x, verticies[0].y);
	let v3 = new Vertex(verticies[1].x, verticies[1].y);
	const firstFace = new Face( v1, v2, v3);
	v1.addFace(firstFace);
	v2.addFace(firstFace);
	v3.addFace(firstFace);

	faces.push(firstFace);

	for(let i = 1;;i++) {
		let v1, v2, v3;

		if(i % 2) {
			const index = verticies.length - (i + 3) / 2;
			if(index == verticies.length) {
				break;
			}
			v1 = new Vertex(verticies[index].x, verticies[index].y);
			v2 = faces[faces.length - 1].v1
			v3 = faces[faces.length - 1].v3
		} else {
			const index = (i + 2) / 2;
			if(index == verticies.length) {
				break;
			}
			v1 = faces[faces.length - 1].v1
			v2 = faces[faces.length - 1].v3
			v3 = new Vertex(verticies[index].x, verticies[index].y);
		}

		if(v1.isEqual(v2) || v1.isEqual(v3) || v2.isEqual(v3)) {
			break;
		}

		const nextFace = new Face(v1, v2, v3);
		faces.push(nextFace);
		v1.addFace(nextFace);
		v2.addFace(nextFace);
		v3.addFace(nextFace);
	}

	return new Mesh(faces, verticies);
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


	xBuffer = 0.05 * width;
	yBuffer = 0.05 * height;

	for(let i = 0; i < numPoints; ++i) {
		const x = random(xBuffer, width - xBuffer);
		const y = random(yBuffer, height - yBuffer);
		const newPoint = createVector(x, y);
		myPoints.push(newPoint);
	}


	// for(let j = 0; j < 5; ++j) {
	// 	for(let i = 0; i < 5; ++i) {
	// 	const x = i / 5 * 0.9*width + 0.05 * width;
	// 	const y = j / 5 * 0.9*height + 0.05 * height;
	// 	const newPoint = createVector(x, y);
	// 	myPoints.push(newPoint);
	// 	}
	// }

	myPoints.sort((a, b) => a.y - b.y);

	myHull = grahamScan(myPoints);
	// const v1 = new Vertex(myHull[0].x, myHull[0].y);
	// const v2 = new Vertex(myHull[1].x, myHull[1].y);

	// let verticies = [];
	// verticies.push(v1);
	// verticies.push(v2);

	// let faces = [];

	// for(let i = 0; i < myHull.length - 2; i++) {
	// 	const v = new Vertex(myHull[i + 2].x, myHull[i + 2].y);
	// 	verticies.push(v);
		
	// 	const face = new Face(verticies[0], verticies[i + 1], verticies[i + 2]);
	// 	faces.push(face);
		
	// 	verticies[0].addFace(face);
	// 	verticies[i + 1].addFace(face);
	// 	verticies[i + 2].addFace(face);
	// }

	// mesh = new Mesh(faces, verticies);

	mesh = triangleStrip(myHull);
	frameRate(5);
}

/**
*   p5.js draw function, is run every frame to create the desired animation
*/
function draw() {
	background(100);
	drawPoints(myPoints);
	drawHull(myHull, 0);
	mesh.draw();
	if(myPoints.length) {
		const nextVertex = new Vertex(myPoints[0].x, myPoints[0].y);
		// mesh.addVertex(nextVertex);
		// myPoints.shift();
	}
}