/*******************************************************************************
*   @file snowman.js - Contains the class snowflake
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 24-Dec-2017
*
*******************************************************************************/

/**
* Class containing all the information necessary to draw and carry out physics
* for a snowflake.
*/
class snowflake {
  /**
  * Constructor function for snowflake
  *
  * @param (number) minr - Minimum value of the radius for the snowflake
  * @param (number) maxr - Mzximum value of the radius for the snowflake
  */
  constructor(minr, maxr) {
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
  }

  /**
  * function to get random radius which is more likely to be small
  *
  * @returns {number} random number between minr and maxr
  */
  getRandomRadius() {
    let rand1 = constrain(random(this.maxr), this.minr, this.maxr);
    let rand2 = constrain(random(this.maxr), this.minr, this.maxr);
    return rand1 < rand2 ? rand1 : rand2;
  }

  /**
  * returns the snowflake to the top of the screen with new variables
  */
  reset() {
    this.r = this.getRandomRadius();
    this.pos = createVector(random(width), -random(0.3 * height));
    this.vel = createVector(0, 2*this.r);
    this.acc = createVector(0,0);
    this.omega = random(0.1, 0.2);
    this.angle = random(0, PI);
    this.sinAmplitude = random(1, 10);
    this.xoff = random(0, this.sinAmplitude * this.r);
  }

  /**
  * apply a force to the snowflake so that it can be affected by gravity and
  * wind
  *
  * @param {p5.Vector} force - The force to be applied to the snowflake.
  */
  applyForce(force) {
    this.acc.add(force.div(this.r));
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  /**
  * functino to calculate if the snowflake has moved off screen
  *
  * @returns {boolean} true if the snowflake is off the screen
  */
  offScreen() {
    let left = this.pos.x < 0 ? true : false;
    let right = this.pos.x > width ? true : false;
    let bottom = this.pos.y > height ? true : false;

    return bottom || left || right;
  }

  /**
  * draws the snowflake
  */
  show() {
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