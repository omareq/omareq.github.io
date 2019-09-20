/*******************************************************************************
*   @file heart.js
*   @brief File containing the Heart class.
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 29-Mar-2017
*
*******************************************************************************/

/** Class representing a heart. */
class Heart {

	/**
	*	Create a heart.
	*
	*	@param {number} x - x position of the Heart.
	*	@param {number} y - y position of the Heart.
	*	@param {number} r - radius of the Heart, given by the distance from
	*		the centre of the Heart to the right most vertex.
	*	@param {string|p5.Color} c - The string can either have the values of
	*		"pink" or "red".  The p5.Color can be any valid p5.Color value.
	*/
	constructor(x, y, r, c) {
		this.x = x;
		this.y = y;
		this.setRadius(r);
		this.startRadius = this.r;
		this.setColor(c);
		this.isPulsing = false;
		this.pulseTime = 0;
		this.pulseSize = 0;
	}

	/**
	*	@returns {p5.Vector} A p5.Vector containing the x and y position of the
	*	Heart.
	*/
	getPos() {
		return createVector(this.x, this.y);
	}

	/**
	*	Changes the position of the Heart.
	*
	*	@param {number} newx - The new x position of the Heart.
	*	@param {number} newy - The new y position of the Heart.
	*/
	setPos(newx, newy) {
		for (let i = this.vertexes.length - 1; i >= 0; i--) {
			this.vertexes[i].x += newx - this.x;
			this.vertexes[i].y += newy - this.y;
		}
		this.x = newx;
		this.y = newy;
	}

	/**
	*	@returns {number} the radius of the Heart.
	*/
	getRadius() {
		return this.r;
	}

	/**
	*	Set the radius of the Heart.
	*
	*	@param {number} newRadius - The new radius of the Heart.
	*/
	setRadius(newRadius) {
		this.r = abs(newRadius);
		let points = map(this.r, 0, width, 10, 60);
		let step = PI/points;

		this.vertexes = [];

		for(let t = -PI; t < PI; t += step) {
			let y1 = 13 * cos(t);
			let y2 = 5 * cos(2 * t);
			let y3 = 2 * cos(3 * t);
			let y4 = cos(4 * t);

			let y  = (y1 - y2 - y3 - y4);
			let x  = 16 * pow(sin(t), 3);

			y /= 16;
			x /= 16;
			let v = createVector(this.x + this.r * x, this.y - this.r * y);
			this.vertexes.push(v);
		}
	}

	/**
	*	Set the color of the Heart
	*
	* 	@param {string|p5.Color} c - The string can either have the values of
	*		"pink" or "red".  The p5.Color can be any valid p5.Color value.
	*/
	setColor(newColor) {
		if(newColor == "pink") {
			this.color = color(255, 48, 217);
		} else if(newColor	== "red") {
			this.color = color(247, 12, 12);
		} else {
			this.color = newColor;
		}
	}

	/**
	*	Stops the pulsing of the Heart, this only has an effect if the Heart
	*	has it's isPulsing flag set.  Set's the pulseTime and the pulseSize
	*	back to 0.
	*/
	stopPulse() {
		if(this.isPulsing) {
			this.isPulsing = false;
			this.setRadius(this.startRadius);
			this.pulseTime = 0;
			this.pulseSize = 0;
		}
	}

	/**
	*	Starts the pulsing of the Heart and sets the isPulsing flag to true.
	*
	*	@param {number} amplitude - Sets the size the Heart will pulse to.
	*/
	pulse(amplitude) {
		this.isPulsing = true;
		this.startRadius = this.r;
		this.pulseTime = 0;
		this.pulseSize = amplitude;
	}

	/**
	*	Draw the Heart.
	*/
	draw() {
		push();
		noStroke();
		fill(this.color);

		if(this.isPulsing) {
			if(this.pulseTime > PI) {
				this.stopPulse();
			} else {
				this.setRadius(this.startRadius + this.pulseSize * sin(this.pulseTime));
				this.pulseTime += PI / 30;
				fill(250);
			}
		}

		beginShape();
		for (let i = this.vertexes.length - 1; i >= 0; i--) {
			vertex(this.vertexes[i].x, this.vertexes[i].y);
		}
		endShape(CLOSE);
		pop();
	}
}