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

const algorithms = {
	MONOTONE: "Monotne Chain",
	JARVIS: "Jarvis March",
	DIVIDE: "Divide & Conquer"
}

let algorithm = algorithms.JARVIS;

let points = [];

let hull = [];

let numPoints = 20;

let pointRadius = 10;

//  JARVIS MARCH

const jarvisSteps = {
	LEFT: 0,
	CALCULATE: 1,
	DONE: 2
}

let jarvisStep = 0;

let leftPointIndex;

let currentIndex = -1;

let nextIndex = 1;

let index = 2;

let time = 0;

let leftPointFrameRate = 4;

let calculateFrameRate = 15;

function jarvisMarch() {
	switch(jarvisStep) {
		case jarvisSteps.LEFT:
			if(currentIndex != -1) {
				if(points[currentIndex].x < points[leftPointIndex].x) {
					leftPointIndex = currentIndex;
					frameRate(leftPointFrameRate);
				}

				// Draw red around the point that is being checked
				push();
				stroke(255, 0, 0);
				strokeWeight(0.3 * pointRadius);
				const currentPoint = points[currentIndex];
				ellipse(currentPoint.x, currentPoint.y, pointRadius, pointRadius);	
				pop();

				// Draw green around the current left most point
				push();
				stroke(0, 255, 0);
				strokeWeight(0.3 * pointRadius);
				const leftPoint = points[leftPointIndex];
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

		case jarvisSteps.CALCULATE:

			// Draw current hull
			push();
			fill(0, 0, 255, 155);
			beginShape();
			for (var i = hull.length - 1; i >= 0; i--) {
				push();
				stroke(0, 0, 255);
				strokeWeight(0.3 * pointRadius);
				ellipse(hull[i].x, hull[i].y, pointRadius, pointRadius);
				vertex(hull[i].x, hull[i].y);
				pop();
			}
			endShape(CLOSE);
			pop();


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

			if (cross.z < 0) {
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

		case jarvisSteps.DONE:
			// Draw current hull
			push();
			fill(0, 0, 255, 155);
			beginShape();
			for (var i = hull.length - 1; i >= 0; i--) {
				push();
				stroke(0, 0, 255);
				strokeWeight(0.3 * pointRadius);
				ellipse(hull[i].x, hull[i].y, pointRadius, pointRadius);
				vertex(hull[i].x, hull[i].y);
				pop();
			}
			endShape(CLOSE);
			pop();

			time++;

			if (time > frameRate() * 4) {
				jarvisStep = jarvisSteps.LEFT;
				time = 0;
				frameRate(leftPointFrameRate);
				hull = [];
				currentIndex = -1;
				nextIndex = 1;
				index = 2;

				points = [];
				for(let i = 0; i < numPoints; ++i) {
					let x = random(xBuffer, width - xBuffer);
					let y = random(yBuffer, height - yBuffer);
					let newPoint = createVector(x, y);
					points.push(newPoint);
				}
			}
		break;

	}
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
		let x = random(xBuffer, width - xBuffer);
		let y = random(yBuffer, height - yBuffer);
		let newPoint = createVector(x, y);
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

	for (var i = points.length - 1; i >= 0; i--) {
		ellipse(points[i].x, points[i].y, pointRadius, pointRadius);
	}

	if(algorithm == algorithms.JARVIS) {
		jarvisMarch();
	}

	

}

