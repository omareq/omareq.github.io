/*******************************************************************************
*   @file ui.js
*   @brief File containing the ui functions for the html elements
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 03-Feb-2024
*
*******************************************************************************/

/**
 * Handler for the control panel DOM element.
 */
let controlPanel;

/**
 * Handler for the reset button DOM element.
 */
let resetButton;

/**
 * Handler for the new ball button DOM element.
 */
let newBallButton;

/**
 * Handler for the delete ball button DOM element.
 */
let deleteBallButton;

/**
 * Handler for the maxNumBalls Slider.
 */
let maxNumBallsSlider;

/**
 * Handler for the maxNumBalls DOM element which acts as a display.
 */
let maxNumBallsDisplay;

/**
 * The maximum number of balls to be rendered on the canvas.
 */
let maxNumBalls = 50;

/**
 * The handler for the number of balls display DOM element.
 */
let numBallsDisplay;

/**
 * Handler for the pseudo ball-wall coefficient of restitution (COR) slider.
 */
let pseudoBallWallCORSlider;

/**
 * Handler for the pseudo ball-wall coefficient of restitution (COR) display
 * DOM element.
 */
let pseudoBallWallCORDisplay;

/**
 * The current value of the pseudo ball-wall coefficient of restitution (COR).
 */
let pseudoBallWallCOR = 1;

/**
 * Handler for the show gravity vector button.
 */
let showGravityVectorButton;

/**
 * Handler for the hide gravity vector button.
 */
let hideGravityVectorButton;

/**
 * The Show gravity vector flag.
 */
let showGravityVector = true;

/**
 * The handler for the y component of the gravity force slider.
 */
let gravityYSlider;

/**
 * The handler for the y component of the gravity force display DOM element.
 */
let gravityYDisplay;

/**
 * The y component of the gravity force.
 */
let gravityY = 10;

/**
 * The handler for the x component of the gravity force slider.
 */
let gravityXSlider;

/**
 * The handler for the x component of the gravity force display DOM element.
 */
let gravityXDisplay;

/**
 * The x component of the gravity force.
 */
let gravityX = 0;

/**
 * Setup the show and hide gravity buttons
 */
function gravityVectorButtonsSetup() {
    showGravityVectorButton = createButton("Show", "value");
    showGravityVectorButton.parent("show-gravity-vector-button");
    showGravityVectorButton.mousePressed(showGravity);

    hideGravityVectorButton = createButton("Hide", "value");
    hideGravityVectorButton.parent("hide-gravity-vector-button");
    hideGravityVectorButton.mousePressed(hideGravity);
}

/**
 * The call back for the show gravity button
 */
function showGravity() {
    showGravityVector = true;
}

/**
 * The call back for the hid gravity button
 */
function hideGravity() {
    showGravityVector = false;
}

/**
 * The setup function for the x and y gravity sliders
 */
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

/**
 * The setup function for the new ball button
 */
function newBallButtonSetup() {
    newBallButton = createButton("New Ball", "value");
    newBallButton.parent("new-ball-button");
    newBallButton.mousePressed(newBall);
}

/**
 * The new ball button call back.  This function does not add a new ball to the
 * balls array if the array is larger than the maxNumBalls variable.
 *
 * Once this is completed the showNumBalls() function is called.
 */
function newBall() {
    if(balls.length < maxNumBalls) {
        balls.push(randBall());
        showNumBalls();
    }
}

/**
 * The setup function for the delete ball button.
 */
function deleteBallButtonSetup() {
    deleteBallButton = createButton("Delete Ball", "value");
    deleteBallButton.parent("delete-ball-button");
    deleteBallButton.mousePressed(deleteBall);
}

/**
 * The delete ball call back.  This function deletes a ball from the balls
 * array.  The function does not remove any balls if there is only one left.
 *
 * Once this is complete the showNumBalls() functions is called.
 */
function deleteBall() {
    if(balls.length > 1) {
        balls = balls.splice(1);
        showNumBalls();
    }
}

/**
 * The pseudo ball-wall coefficient of restitution (COR) slider setup function.
 */
function pseudoBallWallCORSliderSetup() {
    pseudoBallWallCORSlider = createSlider(0, 1, pseudoBallWallCOR, 0.05);
    pseudoBallWallCORSlider.parent("pseudo-ball-wall-cor-slider");

    pseudoBallWallCORDisplay = createP(pseudoBallWallCOR);
    pseudoBallWallCORDisplay.parent("pseudo-ball-wall-cor-display");
    pseudoBallWallCORDisplay.elt.innerText = "Pseudo Ball Wall Coeff of " +
        "Restitution (COR): " + str(pseudoBallWallCOR);
}

/**
 * The max number of balls slider setup function.
 */
function maxNumBallsSliderSetup() {
    maxNumBallsSlider = createSlider(25, 200, maxNumBalls, 25);
    maxNumBallsSlider.parent("max-num-balls-slider");

    maxNumBallsDisplay = createP(maxNumBalls);
    maxNumBallsDisplay.parent("max-num-balls-display");
    maxNumBallsDisplay.elt.innerText = "Max Num of Balls: " +
        str(maxNumBalls);
}

/**
 * Updates the DOM element showing the current number of balls being rendered on
 * the canvas.
 */
function showNumBalls() {
    numBallsDisplay.elt.innerText = "Num of Balls: " +
        str(balls.length) + " / " + str(maxNumBalls);
}

/**
 * The function to setup the DOM element showing the current number of balls
 * being rendered on the canvas.  Once the DOM element has been set up the
 * showNumBalls() function is called.
 */
function numBallsDisplaySetup() {
    numBallsDisplay = createP(str(balls.length));
    numBallsDisplay.parent("num-balls-display");
    showNumBalls();
}

/**
 * The setup function for the control panel.
 */
function controlPanelSetup() {
    controlPanel = document.getElementById("control-panel");
    controlPanelShow();
}

/**
 * Shows the control panel by making the DOM element visible.
 */
function controlPanelShow() {
    controlPanel.style.visibility = "visible";
}

/**
 * Hides the control panel by making the DOM element hidden.
 */
function controlPanelHide() {
    controlPanel.style.visibility = "hidden";
}

/**
 * The setup function for the reset button.
 */
function resetButtonSetup() {
    resetButton = createButton("Reset", "value");
    resetButton.parent("reset-button");
    resetButton.mousePressed(reset);
}

/**
 * The call back for the reset button.  This empties the balls list and adds a
 * random ball.  The time step (dt) is also reset.
 */
function reset() {
    console.debug("Reset");
    dt = 0.1;
    balls = [];
    newBall();
}

/**
 * A function to setup all of the UI elements in the control panel.
 */
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

/**
 * A function that polls all of the ui elements that require polling every
 * frame.
 */
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
