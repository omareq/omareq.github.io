/*******************************************************************************
*   @file ball.js
*   @brief File containing the Ball class
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 02-Aug-2018
*
*******************************************************************************/

/**
*	Class representing a Ball
*/
class Ball {
	/**
	*	Create a Ball
	*
	*	@param {number} x  - The initial x location of the Ball.
	*	@param {number} y  - The initial y location of the Ball.
	*	@param {number} vx - The initial x velocity of the Ball.
	*	@param {number} vy - The initial y velocity of the Ball.
	*	@param {number} r  - The radius of the Ball.
	*	@param {number} m  - The mass of the Ball.
	*/
	constructor(x, y, vx, vy, r, m) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.r = r;
		this.m = m;	
		this.colour = color(255, 255, 255);
	}

	/**
	*	Applies a single force to the Ball.
	*/
	applyForce(fx, fy, dt) {
		let ax = fx/this.m;
		this.vx += ax * dt;
		this.x += this.vx * dt;

		let ay = fy/this.m;
		this.vy += ay * dt;
		this.y += this.vy * dt;
	}

	/**
	*	Checks to see if the Ball has left the boundaries of the canvas. If
	*	they have the ball will bounce back with 90% of it's original speed.
	*/
	checkEdges() {
		if(this.x + this.r > width) {
			this.x = width - this.r;
			this.vx *= -0.9;
			this.colour = color(255, 0, 0);
		}
		if(this.y + this.r > height) {
			this.y = height - this.r;
			this.vy *= -0.9;
			this.colour = color(0, 255, 0);
		}
		if(this.x - this.r < 0) {
			this.x = this.r;
			this.vx *= -0.9;
			this.colour = color(0, 0, 255);
		}
		if(this.y - this.r < 0) {
			this.y = this.r;
			this.vy *= -0.9;
			if(random() <= 0.25) {
				this.vy += 3.0;
				this.vy *= 1.2;
			}
			this.colour = color(255, 255, 255);
		}
	}

	/**
	*	Draws a white ellipse at the Balls position on the canvas
	*/
	show() {
		push();
		fill(this.colour);
		ellipse(this.x, height - this.y, 2 * this.r, 2 * this.r);
		pop();
	}
}