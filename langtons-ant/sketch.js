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

function turnLeft() {
  bearing--;
  if(bearing == -1) {
    bearing = 3;
  } 
}

function turnRight() {
  bearing ++;
  if(bearing == 4) {
    bearing = 0;
  }
}

function moveForward() {
  if(bearing == 0) {
    anty--;
    if(anty == -1) {
      anty = grid[0].length - 1;
    }
  } else if(bearing == 1) {
    antx++;
    if(antx == grid.length) {
      antx = 0;
    }
  } else if(bearing == 2) {
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
  let canvas = createCanvas(floor(displayWidth/2), floor(displayHeight/2));
  canvas.parent('sketch');

  background(255);
  noStroke();

  for(let i = 0; i <floor(width/scale); i ++) {
    grid[i] = [];
    for(let j = 0; j < floor(height/scale); j++) {
      grid[i][j] = 1;
    }
  }

  antx = floor(grid.length / 2);
  anty = floor(grid[0].length / 2);
  bearing = 0;
}

function draw() {
  if(grid[antx][anty] == 0) {
    turnRight();
    fill(0);
  } else {
    turnLeft();
    fill(255);
  }

  rect(antx * scale, anty * scale, scale, scale);
  grid[antx][anty] = (grid[antx][anty] + 1) % 2;
  moveForward();

  fill(255, 0, 0);
  rect(antx * scale, anty * scale, scale, scale);
}