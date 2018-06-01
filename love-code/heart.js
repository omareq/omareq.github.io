class Heart{

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

	getPos() {
		return createVector(this.x, this.y);
	}

	setPos(newx, newy) {
		for (let i = this.vertexes.length - 1; i >= 0; i--) {
			this.vertexes[i].x += newx - this.x;
			this.vertexes[i].y += newy - this.y;
		}
		this.x = newx;
		this.y = newy;
	}

	getRadius() {
		return this.r;
	}

	setRadius(newRadius) {
		this.r = abs(newRadius);
		let points = map(this.r, 0, width, 10, 60)
		let step = PI/points;

		this.vertexes = []

		for(let t = -PI; t < PI; t += step) {
			let y1 = 13 * cos(t)
			let y2 = 5 * cos(2 * t)
			let y3 = 2 * cos(3 * t);
			let y4 = cos(4 * t);
			
			let y  = (y1 - y2 - y3 - y4);
			let x  = 16 * pow(sin(t), 3);	

			y /= 16;
			x /= 16;
			this.vertexes.push(createVector(this.x + this.r * x, this.y - this.r * y));
		}
	}

	setColor(newColor) {
		if(newColor == "pink") {
			this.color = color(255, 48, 217);
		} else if(newColor	== "red") {
			this.color = color(247, 12, 12);
		} else {
			this.color = newColor;
		}
	}

	stopPulse() {
		this.isPulsing = false;
		this.setRadius(this.startRadius);
		this.pulseTime = 0;
		this.pulseSize = 0;
	}

	pulse(amplitude) {
		this.isPulsing = true;
		this.startRadius = this.r;
		this.pulseTime = 0;
		this.pulseSize = amplitude;
	}

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