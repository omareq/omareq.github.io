/*******************************************************************************
*   @file sketch.js
*   @brief Langtons ant an example of cellular automata
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 09-Jan-2018
*
*   @todo Enumerate bearing values
*   @todo Refactor ant variables and methods into a class
*
*******************************************************************************/

/**
*   The grid variable stores the state of the world that the turmite is moving
*   through in the global namespace.
*
*   @type {Array<Array<boolean>>}
*/
let grid = [];

/**
*   Scale is a global variable that determines how many pixels will take up one
*   grid square.
*
*   @type {number}
*/
let scale = 5;

/**
*   A global variable storing the ant's x position.
*
*   @type {number}
*/
let antx;

/**
*   A global variable storing the ant's y position.
*
*   @type {number}
*/
let anty;

/**
*   A global variable storing the direction that the ant is facing.
*   Can take the value of {@link up}, {@link right}, {@link down} or
*   {@link left}.
*
*   @type {number}
*/
let bearing;

/**
*   A global boolean storing the current ant state.
*
*   @type {boolean}
*/
let antState;

/**
*   A global constant that denotes one of the four possible ant directions in
*   this case it is the upwards direction.
*   Have a look at {@link bearing}
*
*   @type {number}
*/
const up    = 0;

/**
*   A global constant that denotes one of the four possible ant directions in
*   this case it is the right direction.
*   Have a look at {@link bearing}
*
*   @type {number}
*/
const right = 1;

/**
*   A global constant that denotes one of the four possible ant directions in
*   this case it is the downwards direction.
*   Have a look at {@link bearing}
*
*   @type {number}
*/
const down  = 2;

/**
*   A global constant that denotes one of the four possible ant directions in
*   this case it is the left direction.
*   Have a look at {@link bearing}
*
*   @type {number}
*/
const left  = 3;

/**
*   Turn left changing the ants bearing.
*/
function turnLeft() {
  bearing--;
  if(bearing < up) {
    bearing = left;
  }
}

/**
*   Turn right changing the ants bearing.
*/
function turnRight() {
  bearing ++;
  if(bearing > left) {
    bearing = up;
  }
}

/**
*   Change the ants position depending on which direction it is facing.
*/
function moveForward() {
  if(bearing == up) {
    anty--;
    if(anty == -1) {
      anty = grid[0].length - 1;
    }
  } else if(bearing == right) {
    antx++;
    if(antx == grid.length) {
      antx = 0;
    }
  } else if(bearing == down) {
    anty++;
    if(anty == grid[0].length) {
      anty = 0;
    }
  } else {
    antx--;
    if(antx == -1) {
      antx = grid.length - 1;
    }
  }
}

/**
*   p5.js setup function.
*   Creates a html canvas and adds a white background.
*   Set all values in the {@link grid} to 1.
*   Initialise the {@link antx}, {@link anty} and {@link bearing} variables.
*   Set the {@link antState} to false.
*/
function setup() {
  let canvas = createCanvas(floor(0.8*displayWidth), floor(0.8*displayHeight));
  canvas.parent('sketch');

  background(255);
  noStroke();

  //  setup grid with all the values as 1
  for(let i = 0; i <floor(width/scale); i ++) {
    grid[i] = [];
    for(let j = 0; j < floor(height/scale); j++) {
      grid[i][j] = 1;
    }
  }


  //  put the ant in the middle of the grid facing up
  antx = floor(grid.length / 2);
  anty = floor(grid[0].length / 2);
  antState = false;
  bearing = up;
}

/**
*   p5.js draw function.
*   Draws the ant and calculates it's next movement.
*/
function draw() {

  //  antState == false and grid at antpos == 1
  if(!antState && grid[antx][anty] == 1) {
    turnRight();
    grid[antx][anty] = !grid[antx][anty];
    fill(255);
  } else if(antState && grid[antx][anty] == 0){
  //  antState == true and grid at antpos == 0
    turnLeft();
    grid[antx][anty] = !grid[antx][anty];
    fill(0);
  } else {
  //  all other scenarios do not turn and go forward
    //  grid at antpos is now equal to not antstate
    grid[antx][anty] = !antState;
    fill(0);
  }

  //  antState always inverts
  antState = !antState;

  //  draw over the new grid value at the ants old location
  rect(antx * scale, anty * scale, scale, scale);
  moveForward();


  //  draw ant and change colour depending on it's state
  if(antState){
    fill(255, 0, 0);
  } else {
    fill(0, 255, 0);
  }
  rect(antx * scale, anty * scale, scale, scale);
}