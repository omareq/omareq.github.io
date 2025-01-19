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
"use strict";
/**
 * The image of the mandelbrot set.
 *
 * @type{p5.Image}
 */
let img = undefined;

/**
 * The lost of workers that will calculate the 2d surface of the MNandelbrot set.
 *
 * @type{Array<window.Worker>}
 */
let workers = [];

/**
 * The messages describing the task each worker will need to complete.
 *
 * @type{Object}
 */
let workerTasksQueue = [];

/**
 * A look up table which turns the number of iterations it takes to
 * calculate if a complex number is in the Mandelbrot set or not and turns it
 * into a p5.color.  The size of this array is 256.
 *
 * @type{Array<p5.color>}
 */
let colorLUT = [];

/**
 * Data to describe the operations to calculate the Mandelbrot set if the
 * browser does not support workers.
 *
 * @type{Object}
 */
let noWorkerData = {
    xIndex:0,
    yIndex:0,
    defaultTask: undefined
};

/**
 * A function to setup the color look up table
 */
function setupColorLUT() {
    for(let i = 0; i < 256; i++) {
        const gb = 255 - i;
        colorLUT[i] = color(255 - i * i, gb, gb);
    }
}

/**
 * A function to clear the image before filling it with the Mandelbrot set.
 */
function clearImage() {
    img.loadPixels();
    for(let i = 0; i < img.width; i++) {
        for(let j = 0; j < img.height; j++) {
            img.set(i, j, colorLUT[255]);
        }
    }
    img.updatePixels();
}

/**
 * A function to update an image with a new row once it has been calculated by
 * a worker.
 *
 * @param   {number}    rowNumber   Which row has been updated
 * @param   {number}    rowArray    The image data for the given row
 */
function updateImage(rowNumber, rowArray) {
    // img.loadPixels();

    for(let i = 0; i < rowArray.length; i++) {
        const itt = rowArray[i];
        img.set(i, rowNumber, colorLUT[itt]);
    }
    img.updatePixels();
}

/**
 * A function to set up all the tasks to calculate the Mandelbrot set
 *
 * @param   {Object}    defaultTask The default message to pass to the worker
 * @param   {number}    totalNumRows    The total number of rows the prepare
 */
function setupWorkerTasks(defaultTask, totalNumRows) {
    for(let i = 0; i < totalNumRows; i++) {
        let nextTask = {...defaultTask};
        nextTask.row = i;
        workerTasksQueue.push(nextTask);
    }
}

/**
 * A function to activate workers with tasks in the queue.
 *
 * @param   {number}    numWorkers The number of workers to use for the calculations
 */
function activateWorkers(numWorkers=1) {
    for(let i = 0; i < numWorkers; i ++) {
        workers[i] = new Worker("worker.js");
        const task = workerTasksQueue.shift();
        workers[i].postMessage(task);


        workers[i].onmessage = (e) => {
            updateImage(e.data.row, [...e.data.array]);
            const newTask = workerTasksQueue.shift();

            if(newTask != undefined) {
                workers[i].postMessage(newTask);
            } else {
                workers[i].terminate();
                workers[i] = undefined;

                if(allWorkersTerminated()) {
                    noLoop();
                }
            }
        };
    }
}

/**
 * Checks if all of the activated workers have been set undefined.
 *
 * @return  {boolean}   True if all workers are terminate.
 */
function allWorkersTerminated() {
    for(let i = 0; i < workers.length; i++) {
        if(workers[i] != undefined) {
            return false;
        }
    }
    return true;
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
    clearImage();

    if(window.Worker) {
        setTimeout(() => {
            setupWorkerTasks(defaultMessage, yNumPts);
            const numWorkers = 8;
            activateWorkers(numWorkers);
        }, 0);
    } else {
        noWorkerData.defaultTask = defaultMessage;
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
		cnvSize = windowWidth;
	}
	let cnv = createCanvas(0.7 * cnvSize, 0.7 * cnvSize);
	cnv.parent('sketch');

    colorMode(HSB, 255);
    setupColorLUT();
    // window.Worker = undefined;
    generateMandelbrotSet(floor(width), floor(height));
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
    if(window.Worker == undefined) {
        const xNumPts = noWorkerData.defaultTask.xNumPts;
        const yNumPts = noWorkerData.defaultTask.yNumPts;
        const xLimits = noWorkerData.defaultTask.xLimits;
        const yLimits = noWorkerData.defaultTask.yLimits;
        const maxSteps = noWorkerData.defaultTask.maxSteps;
        const threshold = noWorkerData.defaultTask.threshold;

        const xx = linspace(xLimits[0], xLimits[1], xNumPts);
        const yy = linspace(yLimits[0], yLimits[1], yNumPts);

        for(let i = 0; i < 50; i++) {
            const itt = mandelbrot(
                xx[noWorkerData.xIndex],
                yy[noWorkerData.yIndex],
                maxSteps,
                threshold
            );

            // img.loadPixels();
            img.set(noWorkerData.xIndex, noWorkerData.yIndex, colorLUT[itt]);
            img.updatePixels();

            noWorkerData.xIndex++;
            if(noWorkerData.xIndex >= xNumPts) {
                noWorkerData.xIndex = 0;
                noWorkerData.yIndex++;
                if(noWorkerData.yIndex >= yNumPts) {
                    noLoop();
                }
            }
        }
    }

    image(img, 0, 0, width, height);
}

