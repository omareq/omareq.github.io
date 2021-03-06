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
let x = 1;
let y = 1;
let yInc = 0.1;
let roll = 0;
let pitch = 1.25;
let rollInc = 0.25;
let pitchInc = 0.25;

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
                    pointRadius: 0,
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 0.65)',
                    // fill: false
                },
                {
                    label: 'LF Hip Elevation',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    borderColor: 'rgba(0, 255, 0, 0.65)',
                    // fill: false
                },
                {
                    label: 'LF Knee Extension',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    borderColor: 'rgba(0, 0, 255, 0.65)',
                    // fill: false
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
                    scaleLabel: {
                        display: true,
                        labelString: 'Frame'
                      }
                }],
                yAxes: [{
                    min: 0,
                    max: 180,
                    scaleLabel: {
                        display: true,
                        labelString: 'Angle Degrees'
                      }}],
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
                    pointRadius: 0,
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 0.65)',
                    // fill: false
                },
                {
                    label: 'RF Hip Elevation',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    borderColor: 'rgba(0, 255, 0, 0.65)',
                    // fill: false
                },
                {
                    label: 'RF Knee Extension',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    borderColor: 'rgba(0, 0, 255, 0.65)',
                    // fill: false
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
                    scaleLabel: {
                        display: true,
                        labelString: 'Frame'
                      }
                }],
                yAxes: [{
                    min: 0,
                    max: 180,
                    scaleLabel: {
                        display: true,
                        labelString: 'Angle Degrees'
                      }}],
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
                    pointRadius: 0,
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 0.65)',
                    // fill: false
                },
                {
                    label: 'LB Hip Elevation',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    borderColor: 'rgba(0, 255, 0, 0.65)',
                    // fill: false
                },
                {
                    label: 'LB Knee Extension',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    borderColor: 'rgba(0, 0, 255, 0.65)',
                    // fill: false
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
                    scaleLabel: {
                        display: true,
                        labelString: 'Frame'
                      }
                }],
                yAxes: [{
                    min: 0,
                    max: 180,
                    scaleLabel: {
                        display: true,
                        labelString: 'Angle Degrees'
                      }}],
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
                    pointRadius: 0,
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 0.65)',
                    // fill: false
                },
                {
                    label: 'RB Hip Elevation',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    borderColor: 'rgba(0, 255, 0, 0.65)',
                    // fill: false
                },
                {
                    label: 'RB Knee Extension',
                    data: [{
                        x: 0,
                        y: 90
                    }],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    borderColor: 'rgba(0, 0, 255, 0.65)',
                    // fill: false
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
                    scaleLabel: {
                        display: true,
                        labelString: 'Frame'
                      }
                }],
                yAxes: [{
                    min: 0,
                    max: 180,
                    scaleLabel: {
                        display: true,
                        labelString: 'Angle Degrees'
                      }}],
            },
            // showLines: false // disable for all datasets
        }
    });
}

/**
 * Function to plot the angles of all the leg servos on the chart js canvases.
 */
function chartUpdate() {
    if(frameCount % 3 == 0) {
        for(let i = 0; i < 3; i++) {
            lfScatterChart.data.datasets[i].data.push({x: frameCount, y: natalya.lf_servos_read()[i]*180.0/3.1415927});
            rfScatterChart.data.datasets[i].data.push({x: frameCount, y: natalya.rf_servos_read()[i]*180.0/3.1415927});
            lbScatterChart.data.datasets[i].data.push({x: frameCount, y: natalya.lb_servos_read()[i]*180.0/3.1415927});
            rbScatterChart.data.datasets[i].data.push({x: frameCount, y: natalya.rb_servos_read()[i]*180.0/3.1415927});
            if(rbScatterChart.data.datasets[i].data["length"] >= 155) {
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
    } else if(state == 3) {
        roll += rollInc;
        if(roll < -7 || roll > 7) {
            rollInc *= -1;
        }

        pitch += pitchInc;
        if(pitch < -7 || pitch > 7) {
            pitchInc *= -1;
        }

        y+= yInc;
        x = 5;
        if(y > 20 || y <=-20){
            yInc *=-1;
        }
        i-=0.01;

        let deltaRoll = 100 * 0.5 * natalya.under_base_width * sin(radians(roll));
        let deltaPitch = 100 * 0.5 * natalya.under_base_width * sin(radians(pitch));
        let z = 9;
        let lfz = z + deltaRoll + deltaPitch;
        let rfz = z - deltaRoll + deltaPitch;
        let lbz = z + deltaRoll - deltaPitch;
        let rbz = z - deltaRoll - deltaPitch;

        let rf_angles = natalya.rf_IK([x, x, rfz]);
        let lf_angles = natalya.lf_IK([-x, x, lfz]);
        let rb_angles = natalya.rb_IK([x, -x, rbz]);
        let lb_angles = natalya.lb_IK([-x, x, lbz]);
        natalya.rf_servos_write(rf_angles);
        natalya.lf_servos_write(lf_angles);
        natalya.rb_servos_write(rb_angles);
        natalya.lb_servos_write(lb_angles);
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
    // rotateY(radians(-y));
    // natalya.draw(0,0,0, radians(-0.5*pitch), PI/4, radians(0.5*roll));
    natalya.draw(0,0,0, -PI/6, 0.1*viewAngle,0);//radians(roll));
    // natalya.draw(0,0,0, radians(pitch), viewAngle, radians(roll));
    // natalya.draw(0,0,0, -PI/6, viewAngle, radians(roll));
}

