/* eslint no-param-reassign: 0 */
/*******************************************************************************
*   @file sketch.js - Figuring out how todraw multiple canvases to one webpage
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 30-Jun-2018
*
*******************************************************************************/

/**
*   Function for the first instance of the p5js object.
*/
let sketch1 = function(p) {

  let x = 325;
  let y = 100;
  let vx = -10;

  p.setup = function() {
  	let canvas = p.createCanvas(600, 200);//, p.WEBGL);
  	canvas.parent('sketch1');
    p.createCanvas(700, 410);
  };

  p.draw = function() {
    p.background(0);
    p.translate(0, 0, -p.width/2);
    p.fill(255);
    p.rect(x, y, 50, 50);

    x += vx;
    if(x + 50 > p.width) {
    	vx *= -1;
    }

    if(x < 0) {
    	vx *= -1;
    }

  };
};


/**
*   Function for the second instance of the p5js object.
*/
let sketch2 = function(p) {

  let x = 325;
  let y = 100;
  let vx = 10;

  p.setup = function() {
  	let canvas = p.createCanvas(600, 200);//, p.WEBGL);
  	canvas.parent('sketch2');
    p.createCanvas(700, 410);
  };

  p.draw = function() {
    p.background(255);
    p.translate(0, 0, -p.width/2);
    p.fill(0);
    p.rect(x, y, 50, 50);

    x += vx;
    if(x + 50 > p.width) {
    	vx *= -1;
    }

    if(x < 0) {
    	vx *= -1;
    }
  };
};

/**
*   Handler for first p5 object
*/
let mcanvas1 = new p5(sketch1);

/**
*   Handler for second p5 object
*/
let mcanvas2 = new p5(sketch2);