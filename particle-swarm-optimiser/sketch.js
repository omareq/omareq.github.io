/*******************************************************************************
*   @file sketch.js - Particle swarm optimiser, because nature is a great
*     source of inspiration
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 24-Nov-2018
*
*******************************************************************************/

/**
*   A global variable that stores a 2d array representing the function to be
*   optimised
*
*   @type{Array<Array<number>>}
*/
let surface = [];

/**
 * A global variable to store a rendered version of the function to be optimised
 *
 * @type{p5.Image}
 */
let img = undefined;

/**
*   A global variable that stores the number of pixels in the x direction
*
*   @type{number}
*/
let x_num = 100;

/**
*   A global variable that stores the number of pixels in the y direction
*
*   @type{number}
*/
let y_num = 100;

/**
*   A global variable that stores the number step size between pixels in the
*   x direction
*
*   @type{number}
*/
let x_step;

/**
*   A global variable that stores the number step size between pixels in the
*   y direction
*
*   @type{number}
*/
let y_step;

/**
*   A global variable that stores the minimum value of the optimised function
*   that is displayed on the screen
*
*   @type{number}
*/
let min_val;

/**
*   A global variable that stores the maximum value of the optimised function
*   that is displayed on the screen
*
*   @type{number}
*/
let max_val;

/**
*   A global variable that stores the optimiser object
*
*   @type{object}
*/
let the_swarm;

/**
*   The function that is going to optimised by the swarm
*
*   @param {number} x - The x coordinate at which the function will be
*     evaluated
*   @param {number} y - The y coordinate at which the function will be
*     evaluated
*
*   @returns {number} A single number providing the value of the function at
*     x and y
*/
function func(x, y) {
  return sin(0.07 * y + 100) * sin(0.08 * x) * 0.01 * pow(x - 200, 2) + 0.01 * pow(y - 200, 2);
}

/**
* p5.js setup function, used to create a canvas and instantiate the "the_swarm"
* variable.
*/
function setup () {
  var canvas = createCanvas(400, 400);
  canvas.parent('sketch');

  x_step = width / x_num;
  y_step = height / y_num;

  for(let x = 0; x < width; x+=x_step) {
    surf_strip = [];
    for(let y = 0; y < height; y+=y_step) {
      next_val = func(x, y);
      surf_strip.push(next_val);

      if (x !=0 && y!=0) {
        if(next_val < min_val) {
          min_val = next_val;
        }
        if(next_val > max_val) {
          max_val = next_val;
        }
      } else {
        min_val = next_val;
        max_val = next_val;
        first = false;
      }
    }
    surface.push(surf_strip);
  }

  img = createImage(x_num, y_num);
  img.loadPixels();

  let half = 0.5 * (max_val + min_val);
  // console.log("Half: " + str(half));
  for(let x = 0; x < x_num; x+= 1) {
    for(let y = 0; y < y_num; y+= 1) {
      let val = surface[x][y];
      let r = 0;
      let b = 0;
      if(val <= half) {
        // b = (val - min_val) / half;
        b = map(val, min_val, half, 255, 0);
        // r = 125 - b;
      } else {
        // r = (max_val - val) / half;
        r = map(val, half, max_val, 0, 255);
        // b = 125 - r;
      }

      // console.log("x: " + str(x) + " y: " + str(y) + " red: " + str(r) + " blue: " + str(b));
      noStroke();
      const c = color(r, 0, b);
      img.set(x, y, c);
    }
  }

  img.updatePixels();
  uiSetup();
  reset();
}


/**
* p5.js draw function, used to draw the color plot of the surface and to
* evaluate the next generation for the swarm.
*/
function draw () {
  uiPoll();
  image(img, 0, 0, width, height);

  theSwarm.run(stepsPerFrame);
  theSwarm.show();
}
