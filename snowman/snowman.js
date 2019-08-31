/*******************************************************************************
*   @file snowman.js - Contains the classes snowman and ball
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 24-Dec-2017
*
*******************************************************************************/

/**
* Class containing all the information for one ball in a snowman
*/
class ball {

  /**
  * ball constructor function.
  *
  * @param {p5.vector} pos - The position of the ball once it has finished
  * growing
  * @param {number} radius - The radius of the ball once it has finished
  * growing
  */
  constructor(pos, radius) {
    // end position of the ball after growing
    this.pos = pos;
    // end radius of the ball after growing
    this.radius = radius;
    // radius of the ball whilst growing
    this.currentRadius = 0;

    // not all snowmen are made perfectly round
    this.widthStretcher = 0.35*random() + 1;
  }

  /**
  * function to calculate the width of the ball after being stretched
  *
  * @returns {number} width of the ball
  */
  getwidth() {
    return this.widthStretcher * this.radius;
  }

  /**
  * increase the size of the ball by the given radius
  */
  grow(radius) {
    if(this.currentRadius < this.radius) {
      this.currentRadius += radius;
      this.currentRadius  = constrain(this.currentRadius, 0, this.radius);
    }
  }

  /**
  * function that returns if the ball has reached its final radius
  *
  * @returns {boolean} true if the ball's radius has reached it's final value.
  */
  isGrownUp() {
    return this.currentRadius >= this.radius;
  }

  /**
  * function to determine if the ball is hit by the given snowflake.
  *
  * @param {snowflake} flake - The snowflake object to check for collision with
  *
  * @returns {boolean} true if the objects collide
  */
  isHitBy(flake) {
    if(this.currentRadius == 0) {
      return false;
    }

    let currentY = this.pos.y + this.radius - this.currentRadius;
    let distance = dist(this.pos.x, currentY, flake.pos.x, flake.pos.y);
    let isHit = distance < this.currentRadius*this.widthStretcher + flake.r;
    
    //only absrob snowflake if the snowman is still growing
    if(isHit && !this.isGrownUp()) {
      flake.reset();
    }
    return isHit;
  }

  /**
  * draws the ball on the screen
  */
  show() {
    //adjust the  location whilst the ball is growing
    let deltaRadius = this.radius - this.currentRadius;
    fill(255);
    ellipse(this.pos.x, this.pos.y + deltaRadius,
    this.currentRadius * this.widthStretcher, this.currentRadius);
  }
}

/**
* Class containing all the information necessary for a snowmn
*/
class snowman {
  /**
  * snowman constructor function
  *
  * @param {p5.Vector} pos - Location of the bottom of the snowman
  * @param {nummber} numBalls - number of balls used tomake up the snowman
  * @param {number} ballRadius - Size of the largest ball
  */
  constructor(pos, numBalls, ballRadius) {
    this.pos = pos;
    this.numBalls = numBalls;
    this.ballRadius = ballRadius;

    // an array to hold ball objects
    this.balls = [];    
    // how much each ball get smaller by from bottom to top
    this.shrinkFactor = 0.8;
    // check to see if all the balls have been set up
    this.gotSize = false;
    // how much the balls overlap each other
    this.overlap = 0.3;
  }

  /**
  * calculates the dimensions of the snowman, including all of the ball objects
  * that make it up.
  */
  calculateSize() {
    this.gotSize = true;

    // the first ball is done outside the for loop because we know where it goes
    let basePos = createVector(this.pos.x, this.pos.y - this.ballRadius);
    this.balls.push(new ball(basePos, this.ballRadius));
    this.balls[0].currentRadius = 5;

    // all other balls are calculated from the properties of the previous ball
    for(let i = 1; i < this.numBalls; i++) {
      let lastR = this.balls[i-1].radius;
      let nextR = lastR * this.shrinkFactor;
      let nextX = this.pos.x;
      let nextY = this.balls[i-1].pos.y - lastR - (1-this.overlap)*nextR;
      let nextPos = createVector(nextX, nextY);
      this.balls.push(new ball(nextPos, nextR));
    }
  }

  /**
  * loops through all balls to see if any of them have been hit by a snowflake
  *
  * @returns {boolean} if the snowman has been hit by a snowflake
  */
  isHitBy(snowflake) {
    for(let i = 0; i < this.numBalls; i++) {
      if(this.balls[i].isHitBy(snowflake)) {
        return true;
      }           
    }
    return false;
  }

  // grows the first ball that is not already fully grown then skips the rest
  grow(radius) {
    for(let i = 0; i < this.numBalls; i ++) {
      if(this.balls[i].isGrownUp()){
        continue;
      }
      let sizeIncrease = radius * this.balls[i].radius/this.ballRadius;
      this.balls[i].grow(sizeIncrease);
      break;
    }
  }

  /**
  * gives the snowman twiggy arms
  */
  addArms(ball) {
    push();
    stroke(138, 64, 69);
    strokeWeight(4);
    let rightarm = this.pos.x + 0.75 * ball.getwidth();
    let leftarm = this.pos.x - 0.75 * ball.getwidth();
    let yarm = ball.pos.y;
    let v = createVector(this.ballRadius, 0);

    line(rightarm, yarm, rightarm + v.x, yarm + v.y);
    line(leftarm, yarm, leftarm - v.x, yarm + v.y);

    let fingerSize = v.x * 0.2;
    //right fingers
    line(rightarm + v.x - 1.5 * fingerSize,
     yarm, rightarm + v.x, yarm + v.y + fingerSize);

    line(rightarm + v.x - 1.5 * fingerSize,
     yarm, rightarm + v.x, yarm + v.y - fingerSize);

    //left fingers
    line(leftarm - v.x + 1.5 * fingerSize,
     yarm, leftarm - v.x, yarm + v.y + fingerSize);

    line(leftarm - v.x + 1.5 * fingerSize,
     yarm, leftarm - v.x, yarm + v.y - fingerSize);
    pop();
  }

  /**
  * gives the snowman a wnoderful face :-)
  */
  addFace(ball) {
    // eyes
    let eyeOffsetX = ball.getwidth()/3;
    let eyeOffsetY = ball.radius/3;
    let eyeY = ball.pos.y - eyeOffsetY;
    let eyeR = ball.radius / 12;

    fill(0);
    let lEyeX = ball.pos.x - eyeOffsetX; 
    ellipse(lEyeX, eyeY, eyeR, eyeR);

    let rEyeX = ball.pos.x + eyeOffsetX;
    ellipse(rEyeX, eyeY, eyeR, eyeR);

    // nose
    fill(255, 147, 53);
    let noseOffsetY = ball.radius / 8;
    let nosePointX = ball.pos.x + 0.75 * ball.getwidth();

    triangle(ball.pos.x, ball.pos.y + noseOffsetY,
     ball.pos.x, ball.pos.y - noseOffsetY,
     nosePointX, ball.pos.y);

    // smile
    fill(0);
    let startAngle = radians(30);
    let endAngle = radians(150);
    let stoneR = eyeR / 2;
    let numStones = 7;
    let increment = (endAngle - startAngle) / numStones;
    let smileR = 0.75 * ball.radius;

    for(let i = startAngle + increment; i <= endAngle; i += increment) {
      let x = ball.pos.x + smileR * cos(i);
      let y = ball.pos.y + smileR * sin(i);
      ellipse(x, y, stoneR, stoneR);
    }
  }

  /**
  * draws the snowman
  */
  show() {    
    if(!this.gotSize) {
      this.calculateSize();
    }

    for(let i = 0; i < this.numBalls; i++) {
      this.balls[i].show();
    }

    // if the last ball if grown up then the whole snowan is done
    if(this.balls[this.numBalls - 1].isGrownUp()) {
      this.addArms(this.balls[this.numBalls - 2]);
      this.addFace(this.balls[this.numBalls - 1]);
    }
  }
}