/*******************************************************************************
*   @file sketch.js
*   @brief Simulation of bouncing ball physics
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 02-Aug-2018
*
*******************************************************************************/

let balls = [];
let dt;
let updatesPerFrame = 1;

function drawGravity() {
	if(showGravityVector) {
		push();
		strokeWeight(2);
		stroke(155);
		fill(155);
		ellipse(0.5 * width, 0.5 * height, 10, 10);

		const scale = 10;
		line(0.5 * width, 0.5 * height,
			0.5 * width + gravityX * scale, 0.5 * height + gravityY * scale);

		pop();
	}
}

/**
*	Generates a ball with a random velocity and a random radius positions at
*	the current location of the mouse.
*
*	@returns {Ball} Ball Object with random velocity at the pointer location.
*/
function randBall() {
	console.log("New Random Ball");
	let randvx = random(-50, 50);
	let randvy = random(-50, 50);
	let randr = random(3, 20);
	return new Ball(mouseX, height - mouseY, randvx, randvy, randr, 1);
}

/**
*	When the mouse is pressed a new ball is added to the balls array.
*/
function mousePressed() {
	if(mouseX < 0 || mouseX > width) {
		return;
	}

	if(mouseY < 0 || mouseY > height) {
		return;
	}

	newBall();
}

/**
*	p5.js setup function, used to create a canvas and instantiate the first
*	Ball object in the balls array
*/
function setup() {
	let canvas = createCanvas(500, 500);
	canvas.parent('sketch');
	background(0);

	uiSetup();
	reset();
}

/**
*	p5.js draw function, used to draw all balls and apply physics for each
*	frame
*/
function draw() {
	uiPoll();
	background(0);

	drawGravity();

	for(let updates = 0; updates < updatesPerFrame; updates++) {
		for(let i = 0; i < balls.length; i++) {
			let ball = balls[i];
			ball.checkEdges(pseudoBallWallCOR);
			ball.applyForce(gravityX, -gravityY, dt);
			// ball.applyForce(0, 0, dt);

			// for(let j = 0; j < balls.length; j++) {
			// 	if(i == j) {
			// 		continue;
			// 	}

			// 	target = balls[j];
			// 	if(ball.hits(target)) {
			// 		ball.collidePhysics(target);
			// 	}

			// }
		}
	}

	for(let i = 0; i < balls.length; i++) {
		let ball = balls[i];
		// add option to show ball trail or ghost of previous locations
		ball.show();
	}

	push();
	fill(255, 155);
	textSize(0.05 * height);
	textAlign(LEFT, TOP);
	text("Click To Add Ball", 5, 5);
	pop();

	let wallWidth = 4;
	// Ceiling
	push();
	stroke(0, 255, 0);
	strokeWeight(wallWidth);
	line(0, 0, width, 0);
	pop();

	// Floor
	push();
	stroke(255, 255, 255);
	strokeWeight(wallWidth);
	line(0, height, width, height);
	strokeWeight(2);
	stroke(0);
	line(0, height, width, height);
	pop();

	// Right Wall
	push();
	stroke(255, 0, 0);
	strokeWeight(wallWidth);
	line(width, 0, width, height);
	pop();

	// Left Wall
	push();
	stroke(0, 0, 255);
	strokeWeight(wallWidth);
	line(0, 0, 0, height);
	pop();
}