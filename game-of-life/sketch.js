/*******************************************************************************
*
*   @file sketch.js
*   @brief Game of Life simulation
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 06-Jan-2019
*
*******************************************************************************/

/**
*	Variable to hold the shape of a glider, an oscilating pattern which
*	translates across the page.
*
*	@type {Array<Array<number> >}
*/
let glider = [[0, 0, 0, 0, 0],
			  [0, 0, 0, 1, 0],
			  [0, 1, 0, 1, 0],
			  [0, 0, 1, 1, 0],
			  [0, 0, 0, 0, 0]];

/**
*	Variable to hold the shape of a light weight space ship, an oscilating
*	pattern which translates across the page.
*
*	@type {Array<Array<number> >}
*/
let lightSpaceShip = [[0, 0, 0, 0, 0, 0, 0],
					  [0, 0, 1, 1, 1, 1, 0],
					  [0, 1, 0, 0, 0, 1, 0],
					  [0, 0, 0, 0, 0, 1, 0],
					  [0, 1, 0, 0, 1, 0, 0],
					  [0, 0, 0, 0, 0, 0, 0]];

/**
*	Variable to hold the shape of a Gosper Glider Gun.  This is interesting as
*	it proves that a finite number of cells can replicate indefinietly.
*
*	@type {Array<Array<number> >}
*/
let gliderGun = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
				 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
				 [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				 [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

/**
*	Used to hold the state of all cell sites in the simulation.
*
*	@type {Array<Array<number> >}
*/
let grid1 = [];

/**
*	Used to hold the state of all cell sites in the simulation.
*
*	@type {Array<Array<number> >}
*/
let grid2 = [];

/**
*	Stores the width of the simulation grid
*
*	@type {number}
*/
let gridX = 75;

/**
*	Stores the height of the simulation grid
*
*	@type  {number}
*/
let gridY = 75;

/**
*	Stores the size of one grid cell
*
*	@type {number}
*/
let size;

/**
*	Stores which grid is currently being displayed.  This allows for the rules
*	to be applied on the sites of the alternate grid without changing the sites
*	that are being read.
*
*	@type {boolean}
*/
let usingGrid1 = true;

/**
*	Flag to see if the simulation has been paused.
*
*	@type {boolean}
*/
let paused = false;

/**
*	The interval number of frames between simulation updates.
*
*	@type {number}
*/
let updateRate = 2;

/**
*	What type of object will be inserted when the mouse is clicked.
*
*	@type {string}
*/
let selectedInsertion = "cell";

/**
*	Function to get the number of live neighbours around a certain cell.  If
*	the cell is at the edge this function will automatically wrap around to
*	the other side of the grid.
*
*	@param {Array<Array<number> >} grid - The array on which the neighbours
*	shall be counted.
*	@param {number} x - The coloumn for the cell that will be checked
*	@param {number} y - The row for the cell that will be checked
*
*	@return {number} - How many cells are alive around the given cell.
*/
function neighbours(grid, x, y) {
	let numNeighbours = 0;
	for(let col = -1; col < 2; ++col) {
		for(let row = -1; row < 2; ++row) {
			if(row == 0 && col == 0) {
				continue;
			}

			let xIndex = (x + col);// % grid.length;
			if(xIndex < 0) {
				xIndex += grid.length;
			} else if(xIndex >= grid.length) {
				xIndex -= grid.length;
			}

			let yIndex = (y + row);// % grid[xIndex].length;
			if(yIndex < 0) {
				yIndex += grid[xIndex].length;
			} else if(yIndex >= grid[xIndex].length) {
				yIndex -= grid[xIndex].length;
			}

			if(grid[xIndex][yIndex]) {
				numNeighbours++;
			}
		}
	}
	return numNeighbours;
}

/**
*	Handles key presses.  Will either switch the global selectedInsertion
*	variable, pause the simulation of clear the screen.
*/
function keyPressed() {
	if(key.toLowerCase() == "d") {
		clearGrid();
	} else if(key.toLowerCase() == "r") {
		randomiseGrid();
	} else if(key.toLowerCase() == "p") {
		paused = !paused;
	} else if(key.toLowerCase() == "g") {
		selectedInsertion = "glider";
	} else if(key.toLowerCase() == "c") {
		selectedInsertion = "cell";
	} else if(key.toLowerCase() == "l") {
		selectedInsertion = "lightSpaceShip";
	} else if(key.toLowerCase() == "h") {
		selectedInsertion = "gliderGun";
	}
}

/**
*	Will insert the selected object at the mouse location.  Will wrap cells
*	that go over the edge to the other side of the screen.
*/
function mousePressed() {
	if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
		return;
	}

	let x = floor(mouseX / size);
	let y = floor(mouseY / size);
	if(selectedInsertion == "cell") {
		if(x >= 0 && y >= 0 && x < gridX && y < gridY) {
			grid1[x][y] = (grid2[x][y] + 1) % 2;
			grid2[x][y] = grid1[x][y];
		}
	} else if(selectedInsertion == "glider") {
		for(let i = 0; i < glider.length; ++i) {
			for(let j = 0; j < glider[i].length; ++j) {
				let xIndex = (x + j) % gridX;
				let yIndex = (y + i) % gridY;
				grid1[xIndex][yIndex] = glider[j][i];
				grid2[xIndex][yIndex] = glider[j][i];
			}
		}
	} else if(selectedInsertion == "lightSpaceShip") {
		for(let i = 0; i < lightSpaceShip.length; ++i) {
			for(let j = 0; j < lightSpaceShip[i].length; ++j) {
				let xIndex = (x + i) % gridX;
				let yIndex = (y + j) % gridY;
				grid1[xIndex][yIndex] = lightSpaceShip[i][j];
				grid2[xIndex][yIndex] = lightSpaceShip[i][j];
			}
		}
	} else if(selectedInsertion == "gliderGun") {
		for(let i = 0; i < gliderGun.length; ++i) {
			for(let j = 0; j < gliderGun[i].length; ++j) {
				let xIndex = (x + i) % gridX;
				let yIndex = (y + j) % gridY;
				grid1[xIndex][yIndex] = gliderGun[i][j];
				grid2[xIndex][yIndex] = gliderGun[i][j];
			}
		}
	}
}

/**
*	Removes all live cells from the grid.
*/
function clearGrid() {
	grid1 = [];
	grid2 = [];
	for(let x = 0; x < gridX; ++x) {
		let emptyCol1 = [];
		let emptyCol2 = [];
		for(let y = 0; y < gridY; ++y) {
			emptyCol2.push(0);
			emptyCol1.push(0);
		}
		grid1.push(emptyCol1);
		grid2.push(emptyCol2);
	}
	usingGrid1 = true;
}

/**
*	Randomly kills or inserts cells at every point on the grid.  There is a 50
*	percent chance of either occurence.
*/
function randomiseGrid() {
	grid1 = [];
	grid2 = [];
	for(let x = 0; x < gridX; ++x) {
		let randCol1 = [];
		let randCol2 = [];
		for(let y = 0; y < gridY; ++y) {
			randCol1.push(round(random()));
			randCol2.push(round(random()));
		}
		grid1.push(randCol1);
		grid2.push(randCol2);
	}
	usingGrid1 = true;
}

/**
*	Draws the menu with the keyboard operations on the side of the canvas.
*/
function drawMenu() {
	textAlign(LEFT, TOP);
	textSize(0.035 * height);
	fill(155);

	if(paused) {
		fill(255);
	}
	text("Click P to Pause", 1.02 * height, 0.05 * height);

	fill(155);
	text("Click D to Delete All", 1.02 * height, 0.05 * 3 * height);
	text("Click R to Randmoise", 1.02 * height, 0.05 * 5 * height);

	fill(155);
	if(selectedInsertion == "cell") {
		fill(255);
	}
	text("Click C to add Cell", 1.02 * height, 0.05 * 7 * height);

	fill(155);
	if(selectedInsertion == "glider") {
		fill(255);
	}
	text("Click G to add Glider", 1.02 * height, 0.05 * 9 * height);

	fill(155);
	if(selectedInsertion == "lightSpaceShip") {
		fill(255);
	}
	text("Click L to add Light Ship", 1.02 * height, 0.05 * 11 * height);

	fill(155);
	if(selectedInsertion == "gliderGun") {
		fill(255);
	}
	text("Click H to add Glider Gun", 1.02 * height, 0.05 * 13 * height);
}

/**
*	p5.js setup function, creates canvas and randomises grid1 and grid2.
*/
function setup() {
	let cnvSize;
	if(windowWidth > windowHeight) {
		cnvSize = windowHeight;
	} else {
		cnvSize = windowWidth;
	}
	let cnv = createCanvas(cnvSize, 0.7 * cnvSize);
	cnv.parent('sketch');

	size = height / gridY;

	randomiseGrid();
}

/**
*	p5.js draw function, draws cells on the canvas and updates the simulation
*	based on updateRate.
*/
function draw() {
	background(0);

	stroke(155);
	strokeWeight(1);
	line(height, 0, height, height);
	drawMenu();

	noStroke();

	for(x = 0; x < gridX; ++x) {
		for(y = 0; y < gridY; ++y) {
			if(usingGrid1) {
				if(!paused && frameCount % updateRate == 0) {
					let numNeighbours = neighbours(grid1, x, y);
					grid2[x][y] = grid1[x][y];

					if((grid1[x][y] == 1) && (numNeighbours <= 1 || numNeighbours >= 4)) {
						grid2[x][y] = 0;
					}
					if(grid1[x][y] == 1 && numNeighbours < 4 && numNeighbours > 1) {
						grid2[x][y] = 1;
					}
					if(grid1[x][y] == 0 && numNeighbours == 3) {
						grid2[x][y] = 1;
					}
				}

				if(grid2[x][y] == 1) {
					fill(0, 255, 0);
					rect(x * size, y * size, size, size);
				}

			} else {
				if(!paused && frameCount % updateRate == 0) {
					let numNeighbours = neighbours(grid2, x, y);
					grid1[x][y] = grid2[x][y];

					if((grid2[x][y] == 1) && (numNeighbours < 2 || numNeighbours > 3)) {
						grid1[x][y] = 0;
					}
					if(grid2[x][y] == 1 && numNeighbours < 4 && numNeighbours > 1) {
						grid1[x][y] = 1;
					}
					if(grid2[x][y] == 0 && numNeighbours == 3) {
						grid1[x][y] = 1;
					}
				}

				if(grid1[x][y] == 1) {
					fill(0, 255, 0);
					rect(x * size, y * size, size, size);
				}
			}
		}
	}
	if(!paused && frameCount % updateRate == 0) {
		usingGrid1 = !usingGrid1;
	}
}