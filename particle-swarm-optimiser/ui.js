let controlPanel;

let resetButton;

let numParticlesSlider;
let numParticlesDisplay;
let numberOfParticles = 25;

let numSimulationStepsSlider;
let numSimulationStepsDisplay;
let maxNumOfSimulationSteps = 250;

let numStepsPerFrameSlider;
let numStepsPerFrameDisplay;
let stepsPerFrame = 1;

let swarmParticlesVisible = true;
let swarmTrailsVisible = false;
let swarmVectorVisible = true;
let swarmBestFitnessVisible = true;

let showParticlesButton;
let hideParticlesButton;

let showVectorButton;
let hideBectorButton;

let showTrailButton;
let hideTrailButton;

let showBestFitnessButton;
let hideBestFitnessButton;

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

function swarmParametersSetup() {
    numParticlesSlider = createSlider(10, 1000, numberOfParticles, 5);
    numParticlesSlider.parent("num-particles-slider");

    numParticlesDisplay = createP(numberOfParticles);
    numParticlesDisplay.parent("num-particles-display");
    numParticlesDisplay.elt.innerText = "Number of Particles: " +
        str(numberOfParticles);


    numSimulationStepsSlider = createSlider(10, 5000,
        maxNumOfSimulationSteps, 10);
    numSimulationStepsSlider.parent("num-steps-slider");

    numSimulationStepsDisplay = createP(maxNumOfSimulationSteps);
    numSimulationStepsDisplay.parent("num-steps-display");
    numSimulationStepsDisplay.elt.innerText = "Number of Simulation Steps: " +
        str(maxNumOfSimulationSteps);


    numStepsPerFrameSlider = createSlider(1, 100,
        stepsPerFrame, 1);
    numStepsPerFrameSlider.parent("num-steps-per-frame-slider");

    numStepsPerFrameDisplay = createP(stepsPerFrame);
    numStepsPerFrameDisplay.parent("num-steps-per-frame-display");
    numStepsPerFrameDisplay.elt.innerText = "Number of Steps Per Frame: " +
        str(stepsPerFrame);
}

function swarmParticlesShow() {
    swarmParticlesVisible = true;
}

function swarmParticlesHide() {
    swarmParticlesVisible = false;
}

function swarmTrailShow() {
    swarmTrailsVisible = true;
}

function swarmTrailHide() {
    swarmTrailsVisible = false;
}

function swarmVectorShow() {
    swarmVectorVisible = true;
}

function swarmVectorHide() {
    swarmVectorVisible = false;
}

function swarmBestFitnessShow() {
    swarmBestFitnessVisible = true;
}

function swarmBestFitnessHide() {
    swarmBestFitnessVisible = false;
}

function swarmDrawingButtonsSetup() {
    showParticlesButton = createButton("Show", "value");
    showParticlesButton.parent("show-particles-button");
    showParticlesButton.mousePressed(swarmParticlesShow);

    hideParticlesButton = createButton("Hide", "value");
    hideParticlesButton.parent("hide-particles-button");
    hideParticlesButton.mousePressed(swarmParticlesHide);


    showVectorButton = createButton("Show", "value");
    showVectorButton.parent("show-vector-button");
    showVectorButton.mousePressed(swarmVectorShow);

    hideVectorButton = createButton("Hide", "value");
    hideVectorButton.parent("hide-vector-button");
    hideVectorButton.mousePressed(swarmVectorHide);


    showTrailButton = createButton("Show", "value");
    showTrailButton.parent("show-trail-button");
    showTrailButton.mousePressed(swarmTrailShow);

    hideTrailButton = createButton("Hide", "value");
    hideTrailButton.parent("hide-trail-button");
    hideTrailButton.mousePressed(swarmTrailHide);


    showBestFitnessButton = createButton("Show", "value");
    showBestFitnessButton.parent("show-best-button");
    showBestFitnessButton.mousePressed(swarmBestFitnessShow);

    hideBestFitnessButton = createButton("Hide", "value");
    hideBestFitnessButton.parent("hide-best-button");
    hideBestFitnessButton.mousePressed(swarmBestFitnessHide);
}

function resetButtonSetup() {
    resetButton = createButton("Reset", "value");
    resetButton.parent("reset-button");
    resetButton.mousePressed(reset);
}

function reset() {
    console.debug("Reset");
    xbds=[0, width];
    ybds=[0, height];
    theSwarm = new Swarm(numberOfParticles,
        xbds, ybds,
        maxNumOfSimulationSteps,
        func);

    console.log(the_swarm);
}

function uiSetup() {
    controlPanelSetup();
    resetButtonSetup();
    swarmParametersSetup();
    swarmDrawingButtonsSetup();
}

function uiPoll() {
    let sliderVal = numParticlesSlider.value();
    if(sliderVal != numberOfParticles) {
        console.debug("uiPoll: Number of Particles slider value has" +
         "changed to: ", sliderVal);
        numberOfParticles = sliderVal;
        numParticlesDisplay.elt.innerText = "Number of Particles: " +
            str(numberOfParticles);
        reset();
    }

    sliderVal = numSimulationStepsSlider.value();
    if(sliderVal != maxNumOfSimulationSteps) {
        console.debug("uiPoll: Number of simulation Steps slider value has" +
         "changed to: ", sliderVal);
        maxNumOfSimulationSteps = sliderVal;
        numSimulationStepsDisplay.elt.innerText = "Number of Simulation Steps: "
            + str(maxNumOfSimulationSteps);
        reset();
    }

    sliderVal = numStepsPerFrameSlider.value();
    if(sliderVal != stepsPerFrame) {
        console.debug("uiPoll: Number of simulation Steps per frame slider " +
            "value has changed to: ", sliderVal);
        stepsPerFrame = sliderVal;
        numStepsPerFrameDisplay.elt.innerText = "Number of Steps Per Frame: "
            + str(stepsPerFrame);
        reset();
    }

}