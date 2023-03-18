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

/**
 * A function that generates an array of evenly spaced numbers in a closed
 * interval
 *
 * @param      {number}  start   The start of the interval
 * @param      {number}  stop    The end of the interval
 * @param      {number}  [numPts=100]  The number of points in the interval
 * @return     {Array}  The array containing the evenly spaced numbers
 */
function linspace(start, stop, numPts=100) {
    let [begin, end] = [start, stop];
    if(stop < start) {
        [begin, end] = [stop, start];
    }

    let a = Array.from(Array(numPts).keys());

    let range = end - begin;

    return a.map(function(num){
        return num * range / (numPts - 1) + start;
    });
}

/**
 * A function that generates a picture of the Mandelbrot set
 *
 * @param      {number}  [xNumPts=150]            The number of x points
 * @param      {number}  [yNumPts=150]            The number of y points
 * @param      {Array(2)}  [xLimits=[-2, 0.5]]      The x limits
 * @param      {Array(2)}  [yLimits=[-1.15, 1.15]]  The y limits
 * @param      {number}  [maxSteps=100]           The maximum steps
 * @param      {number}  [threshold=4]            The threshold
 * @return     {p5.Image}  Image of the Mandelbrot set in the given location
 */
function generateMandelbrotSet(
    xNumPts = 150,
    yNumPts = 150,
    xLimits = [-2,0.5],
    yLimits = [-1.15, 1.15],
    maxSteps = 100,
    threshold = 4 ) {

    let xx = linspace(xLimits[0], xLimits[1], xNumPts);
    let yy = linspace(yLimits[0], yLimits[1], yNumPts);

    let img = createImage(xNumPts, yNumPts);
    img.loadPixels();

    for(let i = 0; i < xx.length; i++) {
        for(let j = 0; j < yy.length; j++) {
            x = xx[i];
            y = yy[j];

            let c = math.complex(x, y);
            let itt = 1;
            let z = c;

            while(itt < maxSteps && z.mul(z.conjugate()).re < threshold) {
                z = z.mul(z).add(c);
                itt ++;
            }
            img.set(i, j, color(255 - itt * itt, 255 - itt, 255 - itt));
        }
    }
    img.updatePixels();
    return img;
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
    let img = generateMandelbrotSet(floor(width), floor(height));
    image(img, 0, 0, width, height);
    noLoop();
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {

}

