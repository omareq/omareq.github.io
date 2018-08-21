/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     20-08-2018
*   Program:  Bouncing Ball Code
*
*******************************************************************************/

let ball;
let balls = [];
let dt;

function randBall() {
	let randvx = random(-50, 50);
	let randvy = random(-50, 50);
	let randr  = random(3, 20);
	return new Ball(mouseX, height - mouseY, randvx, randvy, randr, 1);
}

function mousePressed() {
	balls.push(randBall());
}

function setup() {
	let canvas = createCanvas(500, 500);
	canvas.parent('sketch');
	background(0);
	balls.push(randBall());
	dt = 0.1;
}

function draw() {
	background(0);
	for(let i = 0; i < balls.length; i++) {
		ball = balls[i];
		ball.show();
		ball.checkEdges();
		ball.applyForce(0, -10, dt);
	}
	//console.log(ball.y)
}