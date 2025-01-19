"use strict";

importScripts("../libraries/mathjs-10.6.0.min.js");
importScripts("mandelbrot.js");

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

onmessage = (e) => {
    const row = e.data.row;
    const xNumPts = e.data.xNumPts;
    const yNumPts = e.data.yNumPts;
    const xLimits = e.data.xLimits;
    const yLimits = e.data.yLimits;
    const maxSteps = e.data.maxSteps;
    const threshold = e.data.threshold;

    const xx = linspace(xLimits[0], xLimits[1], xNumPts);
    const yy = linspace(yLimits[0], yLimits[1], yNumPts);

    let arr = [];
    let xy = [];

    for(let i = 0; i < xx.length; i++) {
        arr[i] = (mandelbrot(xx[i], yy[row], maxSteps, threshold));

        xy[i] = (
            {
                x:xx[i],
                y:yy[row]
            }
        );
    }

    const result = {
        row: row,
        array: arr,
    };

    postMessage(result);
};
