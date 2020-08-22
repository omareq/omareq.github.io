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
let firstState = 0;
let lastState = 2;
let state = firstState;
let gaitCounter = 0;

/**
 * Array to control the walking gait as well as the static pose of the robot.
 * The order of the control parameters in the array are as follows:
 *
 *   [0] Walking X          [1] Walking Y            [2] Walking Rotation
 *   [3] Static Offset X    [4] Static Offset Y      [5] Static Offset Z
 *   [6] Static Offset Yaw  [7] Static Offset Pitch  [8] Static Offset Roll
 *
 *   @type      {Array<number>}
 **/
walkArray = [0.5, 0, 0,
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
  console.log("Delay " + milliseconds + "(ms)");
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
		cnvSize = 0.6 * windowWidth;
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
    i+=0.01;
    viewAngle += radians(0.5);
    fill(0);

    if(state == 0) {
        natalya.home(i);
    } else if(state == 1) {
        natalya.stand90(i);
    } else if(state == 2) {
        i+=0.09;
        natalya.walk(walkArray, i);
        if(i >= 1) {
            gaitCounter++;
            state--;
            if(gaitCounter > 10 * 12) {
                state++;
                gaitCounter = 0;
            }
        }
    }

    if(i >= 1) {
        i = 0;
        state++;
        if(state > lastState) {
            state = firstState;
            delay(250);
        }
    }

    natalya.draw(0,0,0, -PI/6, viewAngle,0);
}

