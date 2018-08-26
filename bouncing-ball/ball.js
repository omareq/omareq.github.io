
class Ball {
	constructor(x, y, vx, vy, r, m) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.r = r;
		this.m = m;	
	}

	applyForce(fx, fy, dt) {
		let ax = fx/this.m;
		this.vx += ax * dt;
		this.x += this.vx * dt;

		let ay = fy/this.m;
		this.vy += ay * dt;
		this.y += this.vy * dt;
	}

	checkEdges() {
		if(this.x + this.r > width) {
			this.x = width - this.r;
			this.vx *= -0.9;
		}
		if(this.y + this.r > height) {
			this.y = height - this.r;
			this.vy *= -0.9;
		}
		if(this.x - this.r < 0) {
			this.x = this.r;
			this.vx *= -0.9;
		}
		if(this.y - this.r < 0) {
			this.y = this.r;
			this.vy *= -0.9;
		}
	}

	show() {
		fill(225);
		ellipse(this.x, height - this.y, 2 * this.r, 2 * this.r);
	}
}