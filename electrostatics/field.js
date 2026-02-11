/*******************************************************************************
*   @file field.js
*   @brief A file containing the Field class
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 22-Aug-2018
*
*******************************************************************************/

/**
*	A class representing an electrostatic field and all the particles that
*	create it.
*/
class Field {
	/**
	*	Create a Field
	*
	*	@param {number} width  - The width of the Field
	*	@param {number} height - The height of the Field
	*/
	constructor(width, height) {
		this.width = width;
		this.height = height;

		/**
		*	2D field vector array.
		*	@type {Array<Array<p5.Vector>>}
		*/
		this.field = [];
		arrayCopy(this.zeroField(), this.field);

		/**
		*	Particles stack.
		*	@type {Particle}
		*/
		this.particles = [];
	}

	/**
	*	Creates field array where all values are a zero vector.
	*
	*	@returns {Array<Array<p5.Vector>>} The 2D array containing the zero
	*		field vectors.
	*/
	zeroField() {
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

		return row;
	}

	/**
	*	Adds a particle to the field particles stack.
	*	Calculates the new field vectors.
	*
	*	@param {Particle} part - The particle to be added to the field.
	*/
	addParticle(part) {
		this.particles.push(part);
		for(let w = 0; w < this.width; w+=this.space) {
			for(let h = 0; h < this.height; h+=this.space) {
				const px = part.pos.x;
				const py = part.pos.y;
				const pc = part.charge;

				const d2 = (px - w) * (px - w) + (py - h) * (py - h);

				const vx = w - px;
				const vy = h - py;
				const v = createVector(vx, vy);

				const e = v.mult(pc / d2);

				this.field[w][h] = p5.Vector.add(this.field[w][h], e);
			}
		}
	}

	/**
	*	Pops particle from the fields particles stack.
	*	Recalculates the field with the particle gone.
	*/
	popParticle() {
		let part = this.particles.pop();

		for(let w = 0; w < this.width; w++) {
			for(let h = 0; h < this.height; h++) {
				let px = part.pos.x;
				let py = part.pos.y;
				let pc = part.charge;

				let d2 = (px - w) * (px - w) + (py - h) * (py - h);

				let vx = w - px;
				let vy = h - py;
				let v = createVector(-vx, -vy);

				let e = v.mult(pc / d2);

				this.field[w][h] = p5.Vector.add(this.field[w][h], e);
			}
		}
	}

	/**
	*	Empties the particle stack.
	*	Zeros the field using {@link Field#zeroField}
	*/
	clear() {
		this.particles = [];
		arrayCopy(this.zeroField(), this.field);
	}

	/**
	*	Draws the field vectors. Draws the particles creating the field.
	*
	*	@param {number} space - The distance in pixels between each grid point.
	*	@param {number} scale - A scale factor that shortens or lengthens the
	*		field vectors that are drawn.
	*/
	draw(space, scale) {
		this.space = space;
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