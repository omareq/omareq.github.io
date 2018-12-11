function Particle(pos, fitness) {
	this.pos = pos.copy();
	this.fitness = fitness;
	this.best_pos = pos;
	this.best_fitness = fitness;
	this.vel = p5.Vector.random2D();

	this.show = function() {
		noStroke();
		fill(0, 255, 0);
		ellipse(this.pos.x, this.pos.y, 5, 5);
	}
}