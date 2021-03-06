/*******************************************************************************
*   @file sketch.js
*   @brief Simulation of bouncing ball physics
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 02-Aug-2018
*
*******************************************************************************/

let ball;
let balls = [];
let dt;

/**
*	Generates a ball with a random velocity and a random radius positiones at
*	the current location of the mouse.
*
*	@returns {Ball} Ball Object with random velocity at the pointer location.
*/
function randBall() {
	let randvx = random(-50, 50);
	let randvy = random(-50, 50);
	let randr = random(3, 20);
	return new Ball(mouseX, height - mouseY, randvx, randvy, randr, 1);
}

/**
*	When the mouse is pressed a new ball is added to the balls array.
*/
function mousePressed() {
	balls.push(randBall());
}

/**
*	p5.js setup function, used to create a canvas and instantiate the first
*	Ball object in the balls array
*/
function setup() {
	let canvas = createCanvas(500, 500);
	canvas.parent('sketch');
	background(0);
	balls.push(randBall());
	dt = 0.1;
}

/**
*	p5.js draw function, used to draw all balls and apply physics for each
*	frame
*/
function draw() {
	background(0);
	for(let i = 0; i < balls.length; i++) {
		ball = balls[i];
		ball.show();
		ball.checkEdges();
		ball.applyForce(0, -10, dt);
	}
	//console.log(ball.y)
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