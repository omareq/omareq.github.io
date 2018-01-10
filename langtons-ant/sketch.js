/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     09-Jan-2018
*   Program:  Langtons ant an example of cellular automata
*
*******************************************************************************/

let grid = [];
let scale = 5;
let antx, anty, bearing;
let antState;
let up = 0, right = 1, down = 2, left = 3;

//  turn left changing the ants bearing
function turnLeft() {
  bearing--;
  if(bearing < up) {
    bearing = left;
  } 
}

//  turn right changing the ants bearing
function turnRight() {
  bearing ++;
  if(bearing > left) {
    bearing = up;
  }
}

//  change the ants position depending on which direction it is facing
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

function draw() {

  //  antState == false and grid at antpos == 1
  if(!antState && grid[antx][anty] == 1) {
    turnRight();
    grid[antx][anty] = !grid[antx][anty];
    fill(255);
  } 

  //  antState == true and grid at antpos == 0
  else if(antState && grid[antx][anty] == 0){
    turnLeft();
    grid[antx][anty] = !grid[antx][anty];
    fill(0);
  } 

  //  all other scenarios do not turn and go forward
  else {
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