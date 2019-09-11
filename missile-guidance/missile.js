/*******************************************************************************
*
*	@file missile.js
*	@brief	Missile class
*
*	@author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*	@version 1.0
*	@date 27-August-2019
*
*******************************************************************************/

/**
 * Class for missile.
 *
 * @class      Missile (name)
 */
class Missile {

	/**
	 * Constructs the MIssile object.
	 *
	 * @param      {p5.Vector}  pos               The initial position
	 * @param      {p5.Vector}  vel               The initial velocity
	 * @param      {Integer}    burnTime          The burn time of the rocket
	 * @param      {Integer}     selfDestructTime  The self destruct time
	 * @param      {Float}      gain              The guidance gain
	 */
	constructor(pos, vel, burnTime, selfDestructTime, gain) {
		this.pos = pos;
		this.vel = vel;
		this.burnTime = burnTime;
		this.selfDestructTime = selfDestructTime;
		this.gain = gain;
	}


	/**
	 * Function returning the thrust calculated from the thrust curve at the
	 * given time
	 *
	 * @param      {Float}  time    The time, must be greater than zero
	 * @return     {Float}  The force given from the rocket motor
	 */
	thrust(time) {
		return 0.8 * exp(-pow(0.01 * time - 3, 2))
			+ 0.2 * Math.tanh(0.01 * time - 3) + 0.2;
	}

	/**
	 * Applies a force to steer the missile towards the target according to the
	 * provided algorithm
	 *
	 * @param      {p5.Vector}    target 	The targets position vector
	 * @param      {Function}  [method=algorithm.PURSUIT] The guidance method
	 */
	steerTo(target, method=algorithm.PURSUIT) {
		let targetPos = target.copy();
		let targetVec = targetPos.sub(this.pos);

		let angle1 = targetVec.heading();
		let angle2 = this.vel.heading();
		let angle = angle1 - angle2;

		if(angle > PI || angle < -PI) {
			targetPos.x*=-1;
			this.pos.x*=-1;
			this.pos.y*=-1;
			this.vel.x*=-1;
			this.vel.y*=-1;
			targetVec = targetPos.sub(this.pos);

			angle1 = targetVec.heading();
			angle2 = this.vel.heading();
			angle = angle1 - angle2;
			this.pos.x*=-1;
			this.pos.y*=-1;
			this.vel.x*=-1;
			this.vel.y*=-1;
		}

		if(method == algorithm.PURSUIT) {
			const steer = this.gain * angle;
			this.vel.rotate(steer);
		} else {
			const steer = this.gain * angle;
			this.vel.rotate(steer);
		}
	}


	/**
	 * Calculates the new position of the missile depending on the current
	 * velocity and the thrust of the rocket motor at the current time.
	 *
	 * @param      {number}  time    The time
	 */
	update(time) {
		const currentMag = mag(this.vel.x, this.vel.y);
		let newMag = currentMag + this.thrust(time);
		if(time > this.burnTime) {
			newMag = currentMag;
			// console.log("End burn")
		}
		this.vel.setMag(newMag);
		this.pos.add(this.vel);
	}


	/**
	 * Draws the missile at the given time.  IF the time is greater than the
	 * burn time then the rocket exhaust is not included in the rendering.
	 *
	 * @param      {number}  time    The time
	 */
	draw(time) {
		let vel = this.vel.copy();
		vel.setMag(0.015 * width);
		stroke(0);
		line(this.pos.x, this.pos.y, this.pos.x + vel.x, this.pos.y + vel.y);
		if(time < this.burnTime) {
			vel = this.vel.copy();
			vel.mult(3);
			stroke(255, 0, 0);
			line(this.pos.x, this.pos.y,
				this.pos.x - vel.x, this.pos.y - vel.y);
		}
	}
}