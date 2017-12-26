/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     24-Dec-2017
*   Program:  Making Snowmen from snowflakes as an expansion to the challenge on
*             the coding train
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
  createCanvas(600, 600);
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
