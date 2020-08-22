/*******************************************************************************
 *
 *	@file sketch.js A quick mock up of a quadruped design to test Inverse
 *  Kinematics
 *
 *	@author Omar Essilfie-Quaye <omareq08@gmail.com>
 *	@version 1.0
 *	@date 21-August-2020
 *
 ******************************************************************************/

/**
 * Instance of Robot class
 *
 * @type       {Robot}
 */
let natalya;

/**
 * Angle of rotation of the robot on imaginary platform.
 *
 * @type       {number}
 */
let viewAngle = 0;

let i = 0;
let lastState = 1;
let firstState = 0;
let state = firstState;

walk_array = [0.1, 0, 0,
                0, 0, 0,
                0, 0, 0];

/**
 * Function to delay execution of the current thread by the time provided.
 *
 * @param      {number}  milliseconds  The delay period in milliseconds.
 */
function delay(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function preload() {
  natalya = new Robot(1000);
}

/**
 * p5.js setup function, creates canvas.
 */
function setup() {
	let cnvSize;
	if(windowWidth > windowHeight) {
		cnvSize = windowHeight;
	} else {
		cnvSize = windowWidth;
	}
	let cnv = createCanvas(cnvSize, 0.7 * cnvSize, WEBGL);
	cnv.parent('sketch');
    console.log("Set up Complete");
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
    background(250);
    // model(objModel);
    viewAngle += radians(0.5);
    fill(0);
    if(state == 0) {
        natalya.home(i);

    } else if(state == 1) {
        natalya.stand90(i);
    }

    i+=0.01;

    if(i >= 1) {
        i = 0;
        state++;
        if(state > lastState) {
            state = firstState;
        }
    }
    natalya.draw(0,0,0, -PI/6, viewAngle,0);
}

