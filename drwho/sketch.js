/*******************************************************************************
*   @file sketch.js - Creating my own version of the time vortex from Dr Who
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 27-Oct-2018
*
*******************************************************************************/

/**
*   A global number storing the start angle for the helix that vortex
*   represents
*
*   @type {number}
*/
let startAngle = 0;

/**
*   A global number that is used like an argument to the cos function to help
*   determine how the end point of the helix moves in the x direction
*
*   @type {number}
*/
let xoff = 0;

/**
*   A global number that determines the number of points in the helix
*
*   @type {number}
*/
let numPoints = 2000;

/**
*   A global number that represents the exact endpoint of the helix in the x
*   direction
*
*   @type {number}
*/
let endX = 0;

/**
*   A global number that represents the exact endpoint of the helix in the y
*   direction
*
*   @type {number}
*/
let endY = 0;

/**
*   A global number that represents speed of rotation of the helix
*
*   @type {number}
*/
let speed = 20;

/**
*   A global number that represents the radius of the helix
*
*   @type {number}
*/
let radius;

/**
* p5.js setup function, used to create a canvas and instantiate WEBGL renderer
*/
function setup() {
  let somex = 512;
  let somey = 512;
  let canvas = createCanvas(somex, somey, WEBGL);
  canvas.parent('sketch');
  ellipseMode(CENTER);
  camera(0,0,1,0,0,0, 0,-1,0 );
  radius = width;
  noFill();
}

/**
* p5.js draw function, used to draw the vortex at each point in time
*/
function draw() {
  background(0);
  for(i = startAngle; i < startAngle + numPoints; i++) {    
    let angle = radians(i) + 2 * noise(xoff);

    let x = radius * cos(angle) 
      + endX * (i - startAngle)/numPoints;
    let y = radius * sin(angle) 
      + endY * (i - startAngle)/numPoints;
    let z = 2 * startAngle - i;

    push();
    translate(x + noise(xoff), y, z + random(0, 5));
    stroke(100*sin(angle) + 100, 15, 225 + 25*sin(angle), 200);
    strokeWeight(10);
    
    line(0,0,0, 0,0, random(5) -numPoints * 0.1 * noise(xoff) );
    pop();
  }
  startAngle += map(mouseX, 0, width, 1, speed);
  xoff+=0.01;
  endX += width/75 * cos(xoff);
  //endY += height/75 * cos(xoff);

}