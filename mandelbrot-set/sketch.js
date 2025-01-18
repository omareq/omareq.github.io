/*******************************************************************************
 *
 *	@file sketch.js A script to generate the mandelbrot-set
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 18-March-2023
 *	@link https://omareq.github.io/mandelbrot-set/
 *	@link https://omareq.github.io/mandelbrot-set/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2023 Omar Essilfie-Quaye
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *****************************************************************************/

let img = undefined;
let workers = [];
let workerTasks = [];

function clearImage() {
    img.loadPixels();
    for(let i = 0; i < img.width; i++) {
        for(let j = 0; j < img.height; j++) {
            img.set(i, j, color(0,0,0));
        }
    }
    img.updatePixels();
}

function updateImage(rowNumber, rowArray) {
    img.loadPixels();

    for(let i = 0; i < rowArray.length; i++) {
        const itt = rowArray[i];
        img.set(i, rowNumber, color(255 - itt * itt, 255 - itt, 255 - itt));

        // Should be faster than img.set()?
        // const d = 1; // pixel density
        // const x = rowArray.length;
        // const y = x;

        // let index = 4 * ((y * d + rowNumber) * width * d + (x * d + i));
        // img.pixels[index + 0] = 255 - itt * itt;
        // img.pixels[index + 1] = 255 - itt;
        // img.pixels[index + 2] = 255 - itt;
        // img.pixels[index + 3] = 255;
    }
    img.updatePixels();
}

function setupWorkerTasks(defaultTask, numRows) {
    for(let i = 0; i < numRows; i++) {
        let nextTask = {...defaultTask};
        nextTask.row = i;
        workerTasks.push(nextTask);
    }
}

function activateWorkers(numWorkers=1) {
    for(let i = 0; i < numWorkers; i ++) {
        workers[i] = new Worker("worker.js");
        const task = workerTasks.shift();
        workers[i].postMessage(task);


        workers[i].onmessage = (e) => {
            updateImage(e.data.row, [...e.data.array]);
            const newTask = workerTasks.shift();

            if(newTask != undefined) {
                workers[i].postMessage(newTask);
            }
        };
    }
}


/**
 * A function that generates a picture of the Mandelbrot set
 *
 * @param      {number}  [xNumPts=150]            The number of x points
 * @param      {number}  [yNumPts=150]            The number of y points
 * @param      {Array(2)}  [xLimits=[-2, 0.5]]      The x limits
 * @param      {Array(2)}  [yLimits=[-1.15, 1.15]]  The y limits
 * @param      {number}  [maxSteps=255]           The maximum steps
 * @param      {number}  [threshold=4]            The threshold
 * @return     {p5.Image}  Image of the Mandelbrot set in the given location
 */
function generateMandelbrotSet(
    xNumPts = 150,
    yNumPts = 150,
    xLimits = [-2,0.5],
    yLimits = [-1.15, 1.15],
    maxSteps = 255,
    threshold = 4 ) {

    const defaultMessage = {
        row: -1,
        xNumPts: xNumPts,
        yNumPts: yNumPts,
        xLimits: xLimits,
        yLimits: yLimits,
        maxSteps: maxSteps,
        threshold: threshold,
    };

    console.debug("Default message: ", defaultMessage);

    img = createImage(xNumPts, yNumPts);
    //clearImage();

    setupWorkerTasks(defaultMessage, yNumPts);
    const numWorkers = 8;
    activateWorkers(numWorkers);
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
	let cnv = createCanvas(0.7 * cnvSize, 0.7 * cnvSize);
	cnv.parent('sketch');

    colorMode(HSB, 255);
    generateMandelbrotSet(floor(width), floor(height));
    image(img, 0, 0, width, height);
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
    image(img, 0, 0, width, height);
}

