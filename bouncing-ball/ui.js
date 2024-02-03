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
}

function uiSetup() {
    controlPanelSetup();
    resetButtonSetup();
}

function uiPoll() {

}