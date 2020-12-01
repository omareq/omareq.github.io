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
// let y = 0;
// let yInc = 0.05;

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

let lfScatterChart;
let rfScatterChart;
let lbScatterChart;
let rbScatterChart;

/**
 * Function to delay execution of the current thread by the time provided.
 *
 * @param      {number}  milliseconds  The delay period in milliseconds.
 *
 * @example <caption> Example usage of the delay method. </caption>
 * console.log("Start Program");
 * delay(2000); // wait for 2 seconds
 * console.log("End Program");
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
 * Function to setup chart js canvases to plot the angles of all the leg servos.
 */
function chartSetup() {
    let lfCtx = document.getElementById('lfChart');
    lfScatterChart = new Chart(lfCtx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'LF Hip Yaw',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(255, 0, 0, 0.35)'
                },
                {
                    label: 'LF Hip Elevation',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(0, 255, 0, 0.35)'
                },
                {
                    label: 'LF Knee Extension',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(0, 0, 255, 0.35)'
                }
            ]
        },
        options: {
            animation: {
                duration: 0 // general animation time
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves float value 0 to 1
                }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',

                }],
                yAxes: [{
                    min: 0,
                    max: 180
                }],
            },
            // showLines: false // disable for all datasets
        }
    });

    let rfCtx = document.getElementById('rfChart');
    rfScatterChart = new Chart(rfCtx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'RF Hip Yaw',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(255, 0, 0, 0.35)'
                },
                {
                    label: 'RF Hip Elevation',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(0, 255, 0, 0.35)'
                },
                {
                    label: 'RF Knee Extension',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(0, 0, 255, 0.35)'
                }
            ]
        },
        options: {
            animation: {
                duration: 0 // general animation time
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves float value 0 to 1
                }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }],
                yAxes: [{
                    min: 0,
                    max: 180
                }]
            },
            // showLines: false // disable for all datasets
        }
    });

    let lbCtx = document.getElementById('lbChart');
    lbScatterChart = new Chart(lbCtx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'LB Hip Yaw',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(255, 0, 0, 0.35)'
                },
                {
                    label: 'LB Hip Elevation',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(0, 255, 0, 0.35)'
                },
                {
                    label: 'LB Knee Extension',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(0, 0, 255, 0.35)'
                }
            ]
        },
        options: {
            animation: {
                duration: 0 // general animation time
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves float value 0 to 1
                }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }],
                yAxes: [{
                    min: 0,
                    max: 180
                }]
            },
            // showLines: false // disable for all datasets
        }
    });

    let rbCtx = document.getElementById('rbChart');
    rbScatterChart = new Chart(rbCtx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'RB Hip Yaw',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(255, 0, 0, 0.35)'
                },
                {
                    label: 'RB Hip Elevation',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(0, 255, 0, 0.35)'
                },
                {
                    label: 'RB Knee Extension',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    backgroundColor: 'rgba(0, 0, 255, 0.35)'
                }
            ]
        },
        options: {
            animation: {
                duration: 0 // general animation time
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves float value 0 to 1
                }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }],
                yAxes: [{
                    min: 0,
                    max: 180
                }]
            },
            // showLines: false // disable for all datasets
        }
    });
}

/**
 * Function to plot the angles of all the leg servos on the chart js canvases.
 */
function chartUpdate() {
    if(frameCount % 5 == 0) {
        for(let i = 0; i < 3; i++) {
            lfScatterChart.data.datasets[i].data.push({x: frameCount, y: natalya.lf_servos_read()[i]*180.0/3.1415927});
            rfScatterChart.data.datasets[i].data.push({x: frameCount, y: natalya.rf_servos_read()[i]*180.0/3.1415927});
            lbScatterChart.data.datasets[i].data.push({x: frameCount, y: natalya.lb_servos_read()[i]*180.0/3.1415927});
            rbScatterChart.data.datasets[i].data.push({x: frameCount, y: natalya.rb_servos_read()[i]*180.0/3.1415927});
            if(rbScatterChart.data.datasets[i].data["length"] >= 80) {
                lfScatterChart.data.datasets[i].data.shift();
                rfScatterChart.data.datasets[i].data.shift();
                lbScatterChart.data.datasets[i].data.shift();
                rbScatterChart.data.datasets[i].data.shift();
            }

        }
        lfScatterChart.update(0);
        rfScatterChart.update(0);
        lbScatterChart.update(0);
        rbScatterChart.update(0);
    }
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
    chartSetup();
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
        // let angles = natalya.IK([5, y, 10]);
        // y+= yInc;
        // if(abs(y) > 3){
        //     yInc *=-1;
        // }
        // natalya.rb_servos_write(angles);
        // i-=0.01;
    }

    if(i >= 1) {
        i = 0;
        state++;
        if(state > lastState) {
            state = firstState;
            delay(250);
        }
    }

    chartUpdate();
    natalya.draw(0,0,0, -PI/6, viewAngle,0);
}

