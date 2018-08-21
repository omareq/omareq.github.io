class Field {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		let zero = createVector(0, 0);

		let zeroCol = [];

		for(let h = 0; h < this.height; h++) {
			zeroCol.push(zero.copy());
		}

		let row = [];

		for(let w = 0; w < this.width; w++) {
			let newCol = [];
			arrayCopy(zeroCol, newCol);
			row.push(newCol);
		}

		this.field = [];
		arrayCopy(row, this.field);

		this.particles = [];
	}

	addParticle(part) {
		this.particles.push(part);

		for(let w = 0; w < this.width; w++) {
			for(let h = 0; h < this.height; h++) {
				let px = part.pos.x;
				let py = part.pos.y;
				let pc = part.charge;

				let d = dist(w, h, px, py);
				let d2 = d * d;

				let vx = w - px;
				let vy = h - py;
				let v = createVector(vx, vy);

				let e = v.mult(pc / d2);

				this.field[w][h] = p5.Vector.add(this.field[w][h], e);
			}
		}
	}

	draw(space, scale) {
		stroke(0);
		for(let w = 0; w < this.width; w += space) {
			for(let h = 0; h < this.height; h += space) {
				let v = this.field[w][h].copy();
				let l = v.mag();
				let theta = atan2(v.y, v.x);
				let x = scale * l * cos(theta);
				let y = scale * l * sin(theta);

				line(w, h, w + x, h + y);

				ellipse(w, h, space * 0.05, space * 0.05);

			}
		}

		for(let p = 0; p < this.particles.length; p++) {
			let part = this.particles[p];
			part.draw();
		}
	}
}