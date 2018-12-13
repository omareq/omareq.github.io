class Obstacle {

	constructor(x, y, vx, w, h) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.w = w;
		this.h = h;
	}

	setPos(x) {
		this.x = x;
	}

	setVel(vx) {
		this.vx = vx;
	}

	update() {
		this.x += this.vx;

		if(this.x < 0) {
			this.x = width;
		}
	}

	draw() {
		stroke(255, 0, 0);
		fill(0);
		rect(this.x, this.y, this.w, this.h);
	}
}