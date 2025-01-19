"use strict";


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
 * A function to give you the number of itterations it takes to determine if a
 * coordinate is in the Mandelbrot set.
 *
 * @param   {number}    x   x-coordinate
 * @param   {number}    y   y-coordinate
 * @param   {number}    maxSteps    The maximum number of iterations
 * @param   {number}    threshold   The threshold to determine if the complex
 *                                  number is in the mandelbrot set
 *
 * @return  {number}    The number of iterations to determine
 */
function mandelbrot(x, y, maxSteps, threshold) {
    let c = math.complex(x, y);
    let itt = 1;
    let z = c;

    while(itt < maxSteps && z.mul(z.conjugate()).re < threshold) {
        z = z.mul(z).add(c);
        itt ++;
    }
    return itt;
}
