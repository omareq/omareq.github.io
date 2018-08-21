class Particle {
	constructor(radius, pos, charge) {
		this.radius = radius;
		this.pos = pos;
		this.charge = charge;
	}

	draw() {
		if(this.charge > 0) {
			fill(255, 0, 0);
		} else {
			fill(0, 0, 255);
		}
		ellipse(this.pos.x, this.pos.y, 2 * this.radius, 2 * this.radius);
	}
}