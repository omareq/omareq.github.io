/*******************************************************************************
*   @file ui.js
*   @brief File containing the ui functions for the html elements
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 03-Feb-2024
*
*******************************************************************************/

let controlPanel;

let resetButton;

let maxNumBallsSlider;
let maxNumBallsDisplay;
let maxNumBalls = 50;

let numBallsDisplay;

function maxNumBallsSliderSetup() {
    maxNumBallsSlider = createSlider(25, 200, maxNumBalls, 25);
    maxNumBallsSlider.parent("max-num-balls-slider");

    maxNumBallsDisplay = createP(maxNumBalls);
    maxNumBallsDisplay.parent("max-num-balls-display");
    maxNumBallsDisplay.elt.innerText = "Max Num of Balls: " +
        str(maxNumBalls);
}

function showNumBalls() {
    numBallsDisplay.elt.innerText = "Num of Balls: " +
        str(balls.length) + " / " + str(maxNumBalls);
}

function numBallsDisplaySetup() {
    numBallsDisplay = createP(str(balls.length));
    numBallsDisplay.parent("num-balls-display");
    showNumBalls();
}

function controlPanelSetup() {
    controlPanel = document.getElementById("control-panel");
    controlPanelShow();
}

function controlPanelShow() {
    controlPanel.style.visibility = "visible";
}

function controlPanelHide() {
    controlPanel.style.visibility = "hidden";
}

function resetButtonSetup() {
    resetButton = createButton("Reset", "value");
    resetButton.parent("reset-button");
    resetButton.mousePressed(reset);
}

function reset() {
    console.debug("Reset");
    balls = [];
    balls.push(randBall());
    showNumBalls();
}

function uiSetup() {
    controlPanelSetup();
    resetButtonSetup();
    numBallsDisplaySetup();
    maxNumBallsSliderSetup();
}

function uiPoll() {
    let sliderVal = maxNumBallsSlider.value();
    if(sliderVal != maxNumBalls) {
        console.debug("uiPoll: Maximum Number of Balls slider value has" +
         "changed to: ", sliderVal);
        maxNumBalls = sliderVal;
        maxNumBallsDisplay.elt.innerText = "Max Num of Balls: " +
            str(maxNumBalls);
        reset();
    }
}