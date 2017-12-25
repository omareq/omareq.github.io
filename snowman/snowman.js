function ball(pos, radius) {
  // end position of the ball after growing
  this.pos = pos;
  // end radius of the ball after growing
  this.radius = radius;
  // radius of the ball whilst growing
  this.currentRadius = 0;

  // not all snowmen are made perfectly round
  this.widthStretcher = 0.35*random() + 1

  // return the width of the ball after being stretched
  this.getwidth = function() {
    return this.widthStretcher * this.radius;
  }

  // increase the size of the ball by the given radius
  this.grow = function(radius) {
    if(this.currentRadius < this.radius) {
      this.currentRadius += radius;
      this.currentRadius  = constrain(this.currentRadius, 0, this.radius);
    }
  }

  // returns true if the ball has reached its final radius
  this.isGrownUp = function() {
    return this.currentRadius >= this.radius;
  }

  // returns true if the ball is hit by the given snowflake
  this.isHitBy = function(snowflake) {
    if(this.currentRadius == 0) {
      return false;
    }

    let currentY = this.pos.y + this.radius - this.currentRadius;
    let distance = dist(this.pos.x, currentY, snowflake.pos.x, snowflake.pos.y);
    let isHit = distance < this.currentRadius*this.widthStretcher + snowflake.r;
    
    //only absrob snowflake if the snowman is still growing
    if(isHit && !this.isGrownUp()) {
      snowflake.reset();
    }
    return isHit;
  }

  // draws the ball
  this.show = function() {
    //adjust the  location whilst the ball is growing
    let deltaRadius = this.radius - this.currentRadius;
    fill(255);
    ellipse(this.pos.x, this.pos.y + deltaRadius,
     this.currentRadius * this.widthStretcher, this.currentRadius);
  }
}



function snowman(pos, numBalls, ballRadius) {
  // location of the bottom of the snowman
  this.pos = pos;
  // number of balls used tomake up the snowman
  this.numBalls = numBalls;
  // an array to hold ball objects
  this.balls = [];
  // size of the largest ball
  this.ballRadius = ballRadius;
  // how much eash ball get smaller by from bottom to top
  this.shrinkFactor = 0.8;
  // check to see if all the balls have been set up
  this.gotSize = false;
  // how much the balls overlap each other
  this.overlap = 0.3;

  this.calculateSize = function() {
    this.gotSize = true;

    // the first ball is done outside the for loop because we know where it goes
    let basePos = createVector(this.pos.x, this.pos.y - this.ballRadius);
    this.balls.push(new ball(basePos, this.ballRadius));
    this.balls[0].currentRadius = 5;

    // all other balls are calculated from the properties of the previous ball
    for(let i = 1; i < numBalls; i++) {
      let lastR = this.balls[i-1].radius;
      let nextR = lastR * this.shrinkFactor;
      let nextX = this.pos.x;
      let nextY = this.balls[i-1].pos.y - lastR - (1-this.overlap)*nextR;
      let nextPos = createVector(nextX, nextY);
      this.balls.push(new ball(nextPos, nextR));
    }
  }

  // loops through all balls to see if any of them have been hit by a snowflake
  this.isHitBy = function(snowflake) {
    for(let i = 0; i < this.numBalls; i++) {
      if(this.balls[i].isHitBy(snowflake)) {
        return true;
      }           
    }
    return false;
  }

  // grows the first ball that is not already fully grown then skips the rest
  this.grow = function(radius) {
    for(let i = 0; i < this.numBalls; i ++) {
      if(this.balls[i].isGrownUp()){
        continue;
      }
      let sizeIncrease = radius * this.balls[i].radius/this.ballRadius;
      this.balls[i].grow(sizeIncrease);
      break;
    }
  }

  // gives the snowman twiggy arms
  this.addArms = function(ball) {
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

  // gives the snowman a wnoderful face :)
  this.addFace = function(ball) {
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

  // draws the snowman
  this.show = function() {    
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