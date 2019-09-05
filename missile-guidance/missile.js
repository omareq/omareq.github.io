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

// thrust curve
// 0.8 * e^(-(x-3)^2) + 0.2 * tanh(x-3) + 0.2
class Missile {
	constructor(pos, vel, burnTime, gain) {
		this.pos = pos;
		this.vel = vel;
		this.burnTime = burnTime;
		this.gain = gain;
	}

	thrust(time) {
		return 0.8 * exp(-pow(0.01 * time - 3, 2)) +0.2 * Math.tanh(0.01 * time - 3) + 0.2;
	}

	steerTo(target) {
		const targetPos = target.copy();
		const targetVec = targetPos.sub(this.pos);

		let angle1 = targetVec.heading();
		let angle2 = this.vel.heading();
		let angle = angle1 - angle2;

		if(angle > PI) {
		 	angle = TWO_PI - angle;
		} else if(angle < -PI) {
			angle = TWO_PI + angle;
		}
		// console.log("Angle: " + degrees(angle));	
		const steer = this.gain * angle;
		this.vel.rotate(steer);
	}

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

	draw(time) {
		let vel = this.vel.copy();
		vel.setMag(0.015 * width);
		stroke(0);
		line(this.pos.x, this.pos.y, this.pos.x + vel.x, this.pos.y + vel.y);
		if(time < this.burnTime) {
			vel = this.vel.copy();
			vel.mult(3);
			stroke(255, 0, 0);
			line(this.pos.x, this.pos.y, this.pos.x - vel.x, this.pos.y - vel.y);
		}
	}
}