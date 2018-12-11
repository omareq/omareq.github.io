function snowflake(minr, maxr) {
  this.minr = minr;
  this.maxr = maxr;

  // get random radius which is more likely to be small
  let rand1 = constrain(random(this.maxr), this.minr, this.maxr);
  let rand2 = constrain(random(this.maxr), this.minr, this.maxr);
  this.r = rand1 < rand2 ? rand1 : rand2;

  // physics variables
  this.pos = createVector(random(width), -random(height));
  this.vel = createVector(0, 2*this.r);
  this.acc = createVector(0, 0);

  // sin osscilaion variables
  this.omega = random(0.1, 0.2);
  this.angle = random(0, PI);
  this.sinAmplitude = random(1, 10);
  this.xoff = random(0, this.sinAmplitude * this.r);

  // get random radius which is more likely to be small
  this.getRandomRadius = function() {
    let rand1 = constrain(random(this.maxr), this.minr, this.maxr);
    let rand2 = constrain(random(this.maxr), this.minr, this.maxr);
    return rand1 < rand2 ? rand1 : rand2;
  }

  // return snowflake to the top of the screen with new variables
  this.reset = function() {
    this.r = this.getRandomRadius();
    this.pos = createVector(random(width), -random(0.3 * height));
    this.vel = createVector(0, 2*this.r);
    this.acc = createVector(0,0);
    this.omega = random(0.1, 0.2);
    this.angle = random(0, PI);
    this.sinAmplitude = random(1, 10);
    this.xoff = random(0, this.sinAmplitude * this.r);
  }

  // add physics to the system so we can have gravity and wind
  this.applyForce = function(force) {
    this.acc.add(force.div(this.r));
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  // returns true is the snowflake has moved off screen
  this.offScreen = function() {
    let left = this.pos.x < 0 ? true : false;
    let right = this.pos.x > width ? true : false;
    let bottom = this.pos.y > height ? true : false;

    return bottom || left || right;
  }

  // draws the snowflake
  this.show = function() {
    fill(255);
    ellipse(this.pos.x + this.xoff, this.pos.y, this.r, this.r);

    this.angle += this.omega;
    this.xoff = this.sinAmplitude * sin(this.angle);

    if(this.offScreen()) {
      this.reset();
    }
    this.acc = createVector(0,0);
  }
}