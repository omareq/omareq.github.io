/*******************************************************************************
*   @file sketch.js - Making Snowmen from snowflakes as an expansion to the
*     challenge on the coding train.
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 24-Dec-2017
*
*******************************************************************************/

/**
* The number of snowflakes that will be insantiated
*
* @type{number}
*/
let numFlakes = 200;

/**
* The maximum size that a snowflake can be.
*
* @type{number};
*/
let maxFlakeSize = 7;

/**
* The minimum size that a snowflake can be
*
* @type{number}
*/
let minFlakeSize = 1;

/**
* An array that will hold all of the snowflake objects.
*
* @type{Arraya<snowflake>}
*/
let flakes = [];

/**
* The noise offset for the wind forces.
*
* @type{number}
*/
let noiseOff;

/**
* The maximum magnitude of the wind vector forces.
*
* @type{number}
*/
let windMag = 5;

/**
* The accelaration due to gravity for the snowflakes.
*
* @type{number}
*/
let gravity;

/**
* The variable that holds the snowman object
*
* @type{snowman}
*/
let frosty;


/**
* p5.js setup function, used to create a canvas and instantiate the snowman
* object as well as the snowflakes.
*/
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

/**
* p5.js draw function, used to draw frosty the snowman and controls the phsyics
* for the snowflakes.
*/
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
