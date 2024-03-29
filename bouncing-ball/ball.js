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
	 * Sets the x position of the ball.
	 *
	 * @param {number} newX - The new x value of the ball.
	 */
	setX(newX) {
		this.x = newX;
	}

	/**
	 * Sets the y position of the ball.
	 *
	 * @param {number} newY - The new y value of the ball.
	 */
	setY(newY) {
		this.y = newY;
	}

	/**
	 * Sets the x velocity of the ball.
	 *
	 * @param {number} newVelX - The new x velocity of the ball.
	 */
	setVelX(newVelX) {
		this.vx = newVelX;
	}

	/**
	 * Sets the y velocity of the ball.
	 *
	 * @param {number} newVelY - The new y velocity of the ball.
	 */
	setVelY(newVelY) {
		this.vy = newVelY;
	}

	/**
	*	Applies a single force to the Ball.
	*
	*	@param {number} fx  - The x component of the force.
	*	@param {number} fy  - The y component of the force.
	*	@param {number} dt  - The time step.
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
	checkEdges(ballWallPseudoCOR) {
		const cor = constrain(ballWallPseudoCOR, 0, 1);
		if(this.x + this.r > width) {
			this.x = width - this.r;
			this.vx *= -cor;
			this.colour = color(255, 0, 0);
		}
		if(this.y + this.r > height) {
			this.y = height - this.r;
			this.vy *= -cor;
			this.colour = color(0, 255, 0);
		}
		if(this.x - this.r < 0) {
			this.x = this.r;
			this.vx *= -cor;
			this.colour = color(0, 0, 255);
		}
		if(this.y - this.r < 0) {
			this.y = this.r;
			this.vy *= -cor;
			this.colour = color(255, 255, 255);
		}
	}

	/**
	*	Checks to see if the given ball collides with this ball.
	*
	*	@param {number} ball - The ball to check the collision against.
	*/
	hits(ball) {
		let distSqr = (this.x - ball.x)**2 + (this.y - ball.y)**2;
		if(distSqr <= (this.r + ball.r)**2	) {
			return true;
		}
		return false;
	}

	/**
	*	Applies physics for elastic collision between balls.
	*
	*	@param {number} ball - The ball to do the collision against.
	*/
	collidePhysics(ball) {
		let distSqr = abs(this.x - ball.x)**2 + abs(this.y - ball.y)**2;
		let crossoverLen = this.r - (sqrt(distSqr) - ball.r);
		let normalX = ball.x - this.x;
		let normalY = ball.y - this.y;
		let normalisationConst = 1.0 / sqrt(normalX**2 + normalY**2);
		normalX *= normalisationConst;
		normalY *= normalisationConst;

		// let tangentX = -normalY;
		// let tangentY = normalX;

		this.x -= 0.5 * crossoverLen * normalX;
		this.y -= 0.5 * crossoverLen * normalY;
		ball.setX(ball.x + 0.5 * crossoverLen * normalX);
		ball.setY(ball.y + 0.5 * crossoverLen * normalY);

		// let collisionPointX = this.x + normalX * this.r;
		// let collisionPointY = this.y + normalY * this.r;

		let kebefore = 0.5 * this.m * (this.vx**2 + this.vy**2);
		kebefore += 0.5 + ball.m * (ball.vx**2 + ball.vy**2);


		let m1Reduced = 2.0 * ball.m / (this.m + ball.m);
		let inner12 = (this.vx - ball.vx) * (this.x - ball.x);
		inner12 += (this.vy - ball.vy) * (this.y - ball.y);

		let d12Recip = 1.0 / (this.r + ball.r)**2;
		// let d12Recip = 1.0 / ((this.x - ball.x)**2 + (this.y - ball.y)**2);

		this.vx -= m1Reduced * inner12 * d12Recip * (this.x - ball.x);
		this.vy -= m1Reduced * inner12 * d12Recip * (this.y - ball.y);


		let m2Reduced = 2.0 * ball.m / (this.m + ball.m);
		let inner21 = (ball.vx - this.vx) * (ball.x - this.x);
		inner21 += (ball.vy - this.vy) * (ball.y - this.y);

		let d21Recip = 1.0 / (this.r + ball.r)**2;
		// let d21Recip = 1.0 / ((ball.x - this.x)**2 + (ball.y - this.y)**2);

		ball.setVelX(ball.vx -
			m2Reduced * inner21 * d21Recip * (ball.x - this.x));
		ball.setVelY(ball.vy -
			m2Reduced * inner21 * d21Recip * (ball.y - this.y));

		let keafter = 0.5 * this.m * (this.vx**2 + this.vy**2);
		keafter += 0.5 + ball.m * (ball.vx**2 + ball.vy**2);

		console.log("KE Before: ", kebefore, " KE After: ", keafter);
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
