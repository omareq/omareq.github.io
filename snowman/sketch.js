/*******************************************************************************
*   @file sketch.js - Making Snowmen from snowflakes as an expansion to the
*     challenge on the coding train.
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 24-Dec-2017
*
*******************************************************************************/

let numFlakes = 200;
let maxFlakeSize = 7;
let minFlakeSize = 1;
let flakes = [];

let noiseOff;
let windMag = 5;

let gravity;

let frosty;

function setup () {
  var canvas = createCanvas(600, 600);
  canvas.parent('sketch');
  ellipseMode(RADIUS);

  gravity = createVector(0, 0.5);
  noiseOff = random(100);

  for(let i = 0; i < numFlakes; i++) {
    flakes.push(new snowflake(minFlakeSize, maxFlakeSize));
  }

  frostyPos = createVector(width/2, height);
  frosty = new snowman(frostyPos, 3, 60);
}

function draw () {
  background(0);
  grownThisFrame = false;
  noiseOff += 0.01;

  frosty.show();

  for(let i = 0; i < flakes.length; i++) {
    let windx = windMag * noise(flakes[i].pos.x, flakes[i].pos.y, noiseOff);
    
    //make sure that the wind goes left as well as right
    windx -= 0.5 * windMag;
    let wind = createVector(windx, 0);

    flakes[i].applyForce(wind);
    flakes[i].applyForce(gravity);
    flakes[i].show();

    if(!grownThisFrame && frosty.isHitBy(flakes[i])) {
      frosty.grow(flakes[i].r);
      grownThisFrame = true;
    }
  }
}
