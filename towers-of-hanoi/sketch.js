/*******************************************************************************
*   @file sketch.js
*   @brief Recreation of Towers of Hanoi puzzle
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 29-Dec-2018
*
*******************************************************************************/

/**
*	A global variable that holds the information for the first Tower object.
*
*	@type {Tower}
*/
let tower1;

/**
*	A global variable that holds the information for the second Tower object.
*
*	@type {Tower}
*/
let tower2;


/**
*	A global variable that holds the information for the third Tower object.
*
*	@type {Tower}
*/
let tower3;

/**
*	A variable that holds which tower was last clicked
*
*	@type {number}
*/
let towerSelected = 0;

/**
*	A variable that dictates how many plates will be in the puzzle
*
*	@type {number}
*/
let plates = 7;

/**
*	A variable that stores the highest value plate of the last clicked tower.
*
*	@type {number}
*/
let topPlate;

/**
*	A variable that dictates if the AI is solving the puzzle or if the user is.
*
*	@type{boolean}
*/
let autoSolve = true;

/**
*	Flag to see if the AI resets and continues to solve the puzzle once it has
*	reached to goal state.
*
*	@type{boolean}
*/
let loopSolve = true;

/**
*
*
*	@type {number}
*/
let solveIndex = 0;

/**
*	An array that stores a list of Pos objects which make up the solution of
*	the puzzle from a given state.
*
*	@type{Array<Pos>}
*/
let solution = [];

/**
*	Function that determines if a mouse has been pressed or not and handles the
*	movement of the plates between the towers.
*/
function mousePressed() {
// TODO omar(omareq08@gmail.com): refactor to use arrays
	if(!autoSolve) {
		let towerPressed = 0;

		if(tower1.pressed()) {
			towerPressed = 1;
			if(towerSelected == 0) {
				topPlate = tower1.peek();
				towerSelected = 1;
				return;
			}
		}
		if(tower2.pressed()) {
			towerPressed = 2;
			if(towerSelected == 0) {
				topPlate = tower2.peek();
				towerSelected = 2;
				return;
			}
		}
		if(tower3.pressed()) {
			towerPressed = 3;
			if(towerSelected == 0) {
				topPlate = tower3.peek();
				towerSelected = 3;
				return;
			}
		}

		if(towerPressed == 0) {
			towerSelected = 0;
			topPlate = 0;
			return;
		}

		if(towerSelected == 1) {
			if(towerPressed == 2 && tower2.push(topPlate)) {
				tower1.pop();
			} else if(towerPressed == 3 && tower3.push(topPlate)) {
				tower1.pop();
			}
		} else if(towerSelected == 2) {
			if(towerPressed == 1 && tower1.push(topPlate)) {
				tower2.pop();
			} else if(towerPressed == 3 && tower3.push(topPlate)) {
				tower2.pop();
			}
		} else if(towerSelected == 3) {
			if(towerPressed == 1 && tower1.push(topPlate)) {
				tower3.pop();
			} else if(towerPressed == 2 && tower2.push(topPlate)) {
				tower3.pop();
			}
		}
		tower1.isPressed = false;
		tower2.isPressed = false;
		tower3.isPressed = false;
		towerSelected = 0;
		topPlate = 0;
	}
}

/**
*   Function to find the solution from the current state of the towers.  If the
*   current state is in a solution that has already been calculated the function
*   will not recalculate the solution.
*/
function solve() {
	let start = currentPos();
	if(solution.length > 0 && contains(solution, start)) {
		solveIndex = find(solution, start);
	} else {
		solution = solveBFS(currentPos());
		solveIndex = 0;
		loopSolve = false;
	}
	tower1.isPressed = false;
	tower2.isPressed = false;
	tower3.isPressed = false;
}


/**
*	Function to handle key presses.  Will toggle autosolve or reset towers.
*/
function keyPressed() {
	if(key.toLowerCase() == "s") {
		autoSolve = !autoSolve;
		if(autoSolve) {
			solve()
		}
	} if(key.toLowerCase() == "r") {
			tower1.setAsFull();
			tower2.empty();
			tower3.empty();
			solve();
			loopSolve = true;
			autoSolve = true;
	} if(key.toLowerCase() == "l") {
		loopSolve = !loopSolve;
	}
}

/**
*	Function to get the current state of the towers.
*
*	@returns {Pos} Pos state of the towers
*/
function currentPos() {
	return new Pos(tower1, tower2, tower3);
}

/**
 * p5.js setup function, used to create a canvas and instantiate the tower
 * objects
 */
function setup() {
	let canvas = createCanvas(0.8*windowWidth, 0.8 * windowHeight);
	canvas.parent('sketch');

	let yPos = 0.75 * height;
	let towerW = 0.25 * width;
	let towerH = 0.5 * height;

	let r = "#ff0000";
	let g = "#00ff00";
	let b = "#0000ff";

	tower1 = new Tower(plates, 0.20 * width, yPos, towerW, towerH, r, true );
	tower2 = new Tower(plates, 0.50 * width, yPos, towerW, towerH, g, false);
	tower3 = new Tower(plates, 0.80 * width, yPos, towerW, towerH, b, false);

	if(autoSolve) {
		solve()
		loopSolve = true;
	}
}

/**
*	p5.js draw function, used to draw all towers
*/
function draw() {
	background(255);
	textSize(0.035 * height);
	textAlign(LEFT, TOP);
	text("Toggle Auto Solve (S), Reset (R) ", 0, 0);

	if(autoSolve && frameCount % 20 == 0) {
		solveIndex++;
		if(solveIndex == solution.length) {
			if(loopSolve) {
				solveIndex = 0;
			} else {
				autoSolve = false;
				solveIndex--;
			}
		}
		tower1.setStack(solution[solveIndex].state[0]);
		tower2.setStack(solution[solveIndex].state[1]);
		tower3.setStack(solution[solveIndex].state[2]);
	}

	tower1.draw();
	tower2.draw();
	tower3.draw();
}