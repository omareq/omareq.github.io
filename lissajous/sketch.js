/*******************************************************************************
*   @file sketch.js - Creating my own version of the lissajous patterns
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 27-Oct-2018
*
*******************************************************************************/

/**
*   A gloabl vairable that scales the amount of time that has passed so that it
*   is more suitable for the lissajous pattern to be visible
*
*   @type{number}
*/
let time = 0;

/**
*   A gloabl vairable which stores the time step per frame
*
*   @type{number}
*/
let dt;

/**
*   A gloabl vairable that stores all the previous positions of the "electron"
*
*   @type{array}
*/
let posArray = [];

/**
*   A gloabl vairable that dictates how many previous values of the electrons
*   position shall be saved.
*
*   @type{number}
*/
let posArrayLen = 250;

/**
*   A gloabl vairable that changes the frequency of the lissajous pattern in
*   the x direction
*
*   @type{number}
*/
let kx;

/**
*   A gloabl vairable that changes the frequency of the lissajous pattern in
*   the y direction
*
*   @type{number}
*/
let ky;

/**
*   A gloabl vairable that stores the relative phaxe of the x component of the
*   wave with respect to zero
*
*   @type{number}
*/
let phaseX;

/**
*   A gloabl vairable that stores the relative phaxe of the y component of the
*   wave with respect to zero
*
*   @type{number}
*/
let phaseY;

/**
*   A global variable that checks if the frequency of the wave has been changed
*   by the user
*
*   @type{boolean}
*/
let frequencyChanged = false;

/**
*  A p5.js function the is used to setup the canvas
*
*/
function setup() {
  let somex = floor(0.75 * windowWidth);
  let somey = 700;
  let canvas = createCanvas(somex, somey);
  canvas.parent('sketch');
  for (let i = 0; i < posArrayLen; ++i) {
    posArray.push(createVector(-1, -1));
  }

  dt = radians(0.25);
  phaseX = 3*PI/13;
  phaseY = 13*PI/3;
  kx = 10;
  ky = 13;
}

/**
*   A p5.js function that passes mouse click information to the progeram.  In
*   this case it is being used to adjust the x and y frequency of the wave if
*   the mouse is over the sliders.
*/
function mouseClicked() {
  if(mouseY > height - 50 && mouseY < height) {
    kx = map(mouseX, 0, width, 1, 50);
    frequencyChanged = true;
  }

  if(mouseX > 0 && mouseX < 50) {
    ky = map(mouseY, 0, height, 1, 50);
    frequencyChanged = true;
  }
}

/**
*   Draws the x frequency slider on the bottom of the canvas
*/
function xslider() {
  x = map(kx, 1, 50, 0, width);

  stroke(255, 0, 0);
  strokeWeight(4);
  line(x, height - 25, x, height);
}

/**
*   Draws the y frequency slider on the side of the canvas
*/
function yslider() {
  y = map(ky, 1, 50, 0, height);

  stroke(255, 0, 0);
  strokeWeight(4);
  line(0, y, 25, y);
}

/**
*   A p5.js function that renders the changes to the canvas.
*/
function draw() {
  background(0);
  ellipseMode(CENTER);

  let electronRadius = 2;
  let electronGreen = color(25, 255, 0);
  stroke(electronGreen);

  let x = 0.5 * width * sin(kx * time + phaseX) + 0.5 * width;
  let y = 0.5 * height* sin(ky * time + phaseY) + 0.5 * height;

  if(frequencyChanged) {
    for(let i = posArray.length - 1; i > 0; --i) {
      posArray[i].x = x;
      posArray[i].y = y;
    }
    frequencyChanged = false;
  }


  fill(electronGreen);
  ellipse(x, y, electronRadius, electronRadius);
  posArray[0] = createVector(x, y);

  for (let i = posArray.length - 1; i > 0; --i) {
    let alpha = 100 * (posArray.length - i)/posArray.length;
    let currentX = posArray[i].x;
    let currentY = posArray[i].y;

    fill(electronGreen, alpha);
    //ellipse(currentX, currentY, electronRadius, electronRadius);
    stroke(electronGreen, alpha);
    strokeWeight(alpha*0.05*electronRadius);
    line(currentX, currentY, posArray[i - 1].x, posArray[i - 1].y);

    posArray[i].x = posArray[i - 1].x;
    posArray[i].y = posArray[i - 1].y;

  }
  time += dt;

  xslider();
  yslider();
}