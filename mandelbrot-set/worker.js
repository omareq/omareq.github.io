"use strict";

importScripts("../libraries/mathjs-10.6.0.min.js");
importScripts("mandelbrot.js");

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
