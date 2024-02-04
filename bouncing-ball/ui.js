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
let deleteBallButton;

let maxNumBallsSlider;
let maxNumBallsDisplay;
let maxNumBalls = 50;

let numBallsDisplay;

let pseudoBallWallCORSlider;
let pseudoBallWallCORDisplay;
let pseudoBallWallCOR = 1;

let showGravityVectorButton;
let hideGravityVectorButton;
let showGravityVector = true;

let gravityYSlider;
let gravityYDisplay;
let gravityY = 10;

let gravityXSlider;
let gravityXDisplay;
let gravityX = 0;

function gravityVectorButtonsSetup() {
    showGravityVectorButton = createButton("Show", "value");
    showGravityVectorButton.parent("show-gravity-vector-button");
    showGravityVectorButton.mousePressed(showGravity);

    hideGravityVectorButton = createButton("Hide", "value");
    hideGravityVectorButton.parent("hide-gravity-vector-button");
    hideGravityVectorButton.mousePressed(hideGravity);
}

function showGravity() {
    showGravityVector = true;
}

function hideGravity() {
    showGravityVector = false;
}

function gravitySliderSetup() {
    gravityXSlider = createSlider(-10, 10, gravityX, 1);
    gravityXSlider.parent("gravity-x-slider");

    gravityXDisplay = createP(gravityX);
    gravityXDisplay.parent("gravity-x-display");
    gravityXDisplay.elt.innerText = "Gravity X: " + str(gravityX);


    gravityYSlider = createSlider(-10, 10, gravityY, 1);
    gravityYSlider.parent("gravity-y-slider");

    gravityYDisplay = createP(gravityY);
    gravityYDisplay.parent("gravity-y-display");
    gravityYDisplay.elt.innerText = "Gravity Y: " + str(gravityY);
}

function newBallButtonSetup() {
    newBallButton = createButton("New Ball", "value");
    newBallButton.parent("new-ball-button");
    newBallButton.mousePressed(newBall);
}

function newBall() {
    if(balls.length < maxNumBalls) {
        balls.push(randBall());
        showNumBalls();
    }
}

function deleteBallButtonSetup() {
    deleteBallButton = createButton("Delete Ball", "value");
    deleteBallButton.parent("delete-ball-button");
    deleteBallButton.mousePressed(deleteBall);
}

function deleteBall() {
    if(balls.length > 1) {
        balls = balls.splice(1);
        showNumBalls();
    }
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
    deleteBallButtonSetup();
    numBallsDisplaySetup();
    maxNumBallsSliderSetup();
    pseudoBallWallCORSliderSetup();
    newBallButtonSetup();
    gravitySliderSetup();
    gravityVectorButtonsSetup();
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

    sliderVal = gravityXSlider.value();
    if(sliderVal != gravityX) {
        console.debug("uiPoll: Gravity X slider value has" +
         "changed to: ", sliderVal);
        gravityX = sliderVal;
        gravityXDisplay.elt.innerText = "Gravity X: " + str(gravityX);
    }

    sliderVal = gravityYSlider.value();
    if(sliderVal != gravityY) {
        console.debug("uiPoll: Gravity Y slider value has" +
         "changed to: ", sliderVal);
        gravityY = sliderVal;
        gravityYDisplay.elt.innerText = "Gravity Y: " + str(gravityY);
    }
}