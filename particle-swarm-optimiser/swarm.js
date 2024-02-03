function Swarm(num_particles, xbounds, ybounds, steps, func) {
	this.num = num_particles;
	this.xbounds = xbounds;
	this.ybounds = ybounds;
	this.fitness_func = func;
	this.particles = [];
	this.steps = steps;
	this.counter = 0;
	this.best_fitness = null;
	this.best_pos = null;

	this.p_momentum = 0.5;
	this.p_personal = 2;
	this.p_global = 0.01;

	this.history = [];

	this.check_global_fitness = function(pos, fitness) {
		if(fitness < this.best_fitness) {
			this.best_fitness = fitness;
			this.best_pos = pos.copy();
		}
	};

	for(let i = 0; i < this.num; i++) {
		let xpos = random(this.xbounds[0], this.xbounds[1]);
		let ypos = random(this.ybounds[0], this.ybounds[1]);

		// console.log("xpos "+xpos+" ypos "+ypos)
		let pos = createVector(xpos, ypos);
		// console.log("pos.x "+pos.x+" pos.y "+pos.y)

		let fitness = this.fitness_func(pos.x, pos.y);
		part = new Particle(pos, fitness);
		this.particles.push(part);

		if(i != 0) {
			this.check_global_fitness(pos, fitness);
		} else {
			this.best_pos = pos.copy();
			this.best_fitness = fitness;
		}

	}
		// console.log(this.best_pos);
		// console.log(this.best_fitness);

	this.add_history = function() {
		let generation = [];
		for(let i = 0; i< this.num; i++) {
			let x = this.particles[i].pos.x;
			let y = this.particles[i].pos.y;
			let f = this.particles[i].fitness;
			let part_hist = [x, y, f];
			generation.push(part_hist);
		}
		this.history.push(generation);
	};

	this.show = function() {
		if(swarmTrailsVisible) {
			for(let i = 0; i < this.num; i++) {
				push();
				noFill();
				stroke(155, 155, 155, 100);
				beginShape();
				for(let j = 0; j < this.counter; j++) {
					vertex(this.history[j][i][0], this.history[j][i][1]);
				}
				endShape();
				pop();
			}
		}

		if(swarmVectorVisible && this.counter > 2) {
			for(let i = 0; i < this.num; i++) {
				push();
				noFill();
				stroke(255);
				line(this.history[this.counter - 1][i][0],
					 this.history[this.counter - 1][i][1],
					 this.history[this.counter - 2][i][0],
					 this.history[this.counter - 2][i][1])
				pop();
			}
		}

		if(swarmParticlesVisible) {
			for(let i = 0; i < this.num; i++) {
				this.particles[i].show();
			}
		}

		if(swarmBestFitnessVisible) {
			push();
			let c = color(90, 25, 247);
			stroke(c);
			strokeWeight(2);
			line(this.best_pos.x, 0, this.best_pos.x, height);
			line(0, this.best_pos.y, width, this.best_pos.y);

			noFill();
			ellipse(this.best_pos.x, this.best_pos.y, 50, 50);

			fill(c);
			stroke(255);
			strokeWeight(1);
			ellipse(this.best_pos.x, this.best_pos.y, 10, 10);
			pop();
		}
	};

	this.run = function(stepsPerFrame) {

		for(let j = 0; j < stepsPerFrame; j++) {
			if(this.counter >= this.steps) {
				return;
			}
			this.counter++;

			for(let i = 0; i < this.num; i++) {
				let r1 = 5 * random();
				let r2 = 5 * random();

				let c_pos = this.particles[i].pos.copy();
				let pb_pos = this.particles[i].best_pos.copy();
				let gb_pos = this.best_pos.copy();

				let c_vel = this.particles[i].vel.copy().mult(this.p_momentum);
				let pb_vel = pb_pos.sub(c_pos).mult(r1 * this.p_personal);
				let gb_vel = gb_pos.sub(c_pos).mult(r2 * this.p_global);

				let n_vel = c_vel.add(pb_vel).add(gb_vel);
				let n_pos = c_pos.add(n_vel);

				let nx = constrain(n_pos.x, this.xbounds[0], this.xbounds[1]);
				let ny = constrain(n_pos.y, this.ybounds[0], this.ybounds[1]);


				n_pos = createVector(nx, ny);

				let fitness = this.fitness_func(n_pos.x, n_pos.y);
				// console.log("nx: " + n_pos.x + " ny: " + n_pos.y + " f: " + fitness )

				if(fitness < this.particles[i].fitness) {
					this.particles[i].best_fitness = fitness;
					this.particles[i].best_pos = n_pos.copy();
					this.check_global_fitness(n_pos, fitness);
				}

				this.particles[i].fitness = fitness;
				this.particles[i].pos = n_pos.copy();
			}
			this.add_history();

			console.debug("generation: " + this.counter +
				" best fitness: " + this.best_fitness +
				" x: " + this.best_pos.x + " y: " + this.best_pos.y);
		}
	};
}