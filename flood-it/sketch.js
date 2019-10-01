/*******************************************************************************
 *
 *	@file sketch.js A Simple strategy game where you have to flood the whole
 *  board with one colour
 *
 *	@author Omar Essilfie-Quaye <omareq08@gmail.com>
 *	@version 1.0
 *	@date 30-September-2019
 *
*******************************************************************************/

/**
 * The current number of cols and rows in the grid
 *
 * @type       {Integer}
 */
let gridSize = 10;

/**
 * The current number of colours available to fill tiles in the grid
 *
 * @type       {number}
 */
let numColours = 5;

/**
 * The instance of the Grid object
 *
 * @type       {Grid}
 * @see Grid
 */
let grid = undefined;

/**
 * Handler for the reset button
 *
 * @type       {p5.element}
 */
let resetButton = undefined;

/**
 * Handler for the show numbers toggle button
 *
 * @type       {p5.element}
 */
let numbersButton = undefined;

/**
 * Show numbers state flag
 *
 * @type       {boolean}
 */
let showNumbers = false;

/**
 * Stores the number of clicks the player has taken on their way to the final
 * state
 *
 * @type       {Integer}
 */
let clicks = undefined;

/**
 * Handler for paragraphs element that displays the click value
 *
 * @type       {p5.element}
 */
let clicksDisplay = undefined;

/**
 * Handler for the grid size slider
 *
 * @type       {p5.element}
 */
let gridSizeSlider = undefined;

/**
 * Handler for the paragraphs that displays the current grid size.
 *
 * @type       {p5.element}
 */
let gridSizeDisplay = undefined;

/**
 * Handler for the number of colours slider
 *
 * @type       {p5.element}
 */
let coloursSlider = undefined;

/**
 * Handler for the paragraph that displays how many colours can be selected
 *
 * @type       {p5.element}
 */
let coloursDisplay = undefined;

/**
 * Show / Hide numbers event handler
 */
function numberToggle() {
    if(showNumbers == true) {
        numbersButton.elt.textContent = "Show Numbers";
    } else {
        numbersButton.elt.textContent = "Hide Numbers";
    }

    grid.toggleShowNumbers();
    showNumbers = !showNumbers;
}

/**
 * Mouse down event handler.  Accesses the grid to request the colour of the
 * tile at the cursor location.  Uses this colour to implement the next step in
 * the fill process.  Finally checks to see if the state of the grid matches
 * the end game state or if the game has ended due to an excess of clicks from
 * the player.
 */
function mousePressed() {
    if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        return;
    }
    const selectedColour = grid.colourAt(mouseX, mouseY);
    const failState = grid.fill(selectedColour);
    if(!failState) {
        clicks++;
        clicksDisplay.elt.innerText = clicks + "/" + grid.maxclick + " clicks";
        if (grid.winState()) {
            // game over through win
            console.log("Congratulations You Won The Game\n");
            reset();
        } else if(clicks >= grid.maxclick) {
            // game over through loss
            console.log("Unfortunately You Lost The Game\n");
            reset();
        }
    }
}

/**
 * Reset the grid and all game states
 */
function reset() {
    const x = 0;
    const y = 0;
    const randomise = true;
    grid = new Grid(gridSize, numColours, x, y, width, randomise, showNumbers);
    clicks = 0;
    clicksDisplay.elt.innerText = clicks + "/" + grid.maxclick + " clicks";
}

/**
 *   p5.js setup function, creates canvas.
 */
function setup() {
	let cnvSize;
	if(windowWidth > windowHeight) {
		cnvSize = 0.7 * windowHeight;
	} else {
		cnvSize = 0.7 * windowWidth;
	}
	let cnv = createCanvas(cnvSize, cnvSize);
	cnv.parent('sketch');

    if(showNumbers){
        numbersButton = createButton("Hide Numbers", "value");
    } else {
        numbersButton = createButton("Show Numbers", "value");
    }

    grid = new Grid(gridSize, numColours, 0, 0, width);

    clicksDisplay = createP(clicks + "/" + grid.maxclick + " clicks");
    clicksDisplay.parent("click-val");

    gridSizeDisplay = createP("Grid Size: " + str(gridSize));
    gridSizeDisplay.parent("size-val");

    gridSizeSlider = createSlider(2, 18, gridSize, 1);
    gridSizeSlider.parent("grid-size");

    coloursDisplay = createP("Number of Colours: " + str(numColours));
    coloursDisplay.parent("colours-val");

    coloursSlider = createSlider(3, 10, numColours, 1);
    coloursSlider.parent("colours");

    numbersButton.parent("numbers-button");
    numbersButton.mousePressed(numberToggle);

    resetButton = createButton("Reset", "value");
    resetButton.parent("reset-button");
    resetButton.mousePressed(reset);
    reset();
}

/**
 *   p5.js draw function, is run every frame to create the desired animation
 *   Invokes grid drawing method.
 */
function draw() {
	background(255);
    let sliderVal = gridSizeSlider.value();
    if(sliderVal != gridSize) {
        gridSize = sliderVal;
        gridSizeDisplay.elt.innerText = "Grid Size: " + str(gridSize);
        reset();
    }

    sliderVal = coloursSlider.value();
    if(sliderVal != numColours) {
        numColours = sliderVal;
        coloursDisplay.elt.innerText = "Number of Colours: " + str(numColours);
        reset();
    }

    grid.draw();
}

