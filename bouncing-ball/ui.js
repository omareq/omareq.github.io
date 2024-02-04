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

let newBallButton;

let maxNumBallsSlider;
let maxNumBallsDisplay;
let maxNumBalls = 50;

let numBallsDisplay;

let pseudoBallWallCORSlider;
let pseudoBallWallCORDisplay;
let pseudoBallWallCOR = 1;

function newBallButtonSetup() {
    newBallButton = createButton("New Ball", "value");
    newBallButton.parent("new-ball-button");
    newBallButton.mousePressed(newBall);
}

function newBall() {
    balls.push(randBall());
    showNumBalls();
}

function pseudoBallWallCORSliderSetup() {
    pseudoBallWallCORSlider = createSlider(0, 1, pseudoBallWallCOR, 0.05);
    pseudoBallWallCORSlider.parent("pseudo-ball-wall-cor-slider");

    pseudoBallWallCORDisplay = createP(pseudoBallWallCOR);
    pseudoBallWallCORDisplay.parent("pseudo-ball-wall-cor-display");
    pseudoBallWallCORDisplay.elt.innerText = "Pseudo Ball Wall Coeff of " +
        "Restitution (COR): " + str(pseudoBallWallCOR);
}

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
    dt = 0.1;
    balls = [];
    newBall();
}

function uiSetup() {
    controlPanelSetup();
    resetButtonSetup();
    numBallsDisplaySetup();
    maxNumBallsSliderSetup();
    pseudoBallWallCORSliderSetup();
    newBallButtonSetup();
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

    sliderVal = pseudoBallWallCORSlider.value();
    if(sliderVal != pseudoBallWallCOR) {
        console.debug("uiPoll: Pseudo Ball Wall COR slider value has" +
         "changed to: ", sliderVal);
        pseudoBallWallCOR = sliderVal;
        pseudoBallWallCORDisplay.elt.innerText = "Pseudo Ball Wall Coeff of " +
        "Restitution (COR): " + str(pseudoBallWallCOR);
    }
}