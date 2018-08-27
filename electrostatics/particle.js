/*******************************************************************************
*   @file particle.js
*   @brief File containing Particle class.
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 22-Aug-2018
*
*******************************************************************************/

/**  Class representing a particle */
class Particle {

	/**
	*	Create a Particle.
	*
	*	@param {number} radius - The radius of the particle.
	*	@param {p5.Vector} pos - The position vector of the particle.
	*	@param {number} charge - The electric charge of the particle.
	*/
	constructor(radius, pos, charge) {
		this.radius = radius;
		this.pos = pos;
		this.charge = charge;
	}

	/**
	*	Draws the particle on the screen. The fill of the particle changes
	*	depending on the charge of the particle.  Red is positive blue is
	*	negative.
	*/
	draw() {
		if(this.charge > 0) {
			fill(255, 0, 0);
		} else {
			fill(0, 0, 255);
		}
		ellipse(this.pos.x, this.pos.y, 2 * this.radius, 2 * this.radius);
	}
}