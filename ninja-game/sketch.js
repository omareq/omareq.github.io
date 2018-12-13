/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     02-Aug-2018
*   Program:  Making a quick ninja game to aleviate boredom
*
*******************************************************************************/

let floorHeight;
let ninja;
let obstacle;
let physicsHandler;
let idle = [];
let run = [];
let jump = [];
let loading = true;
let loadCounter = 0;
let img;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  floorHeight = 0.8 * height;
}

function keyPressed() {
	if(key.toLowerCase() == "w") {
		ninja.jump();
	} if(key.toLowerCase() == "s") {
		ninja.drop();
	} 
}

function endGame() {
	clearInterval(physicsHandler);
}

function physicsUpdate() {
  ninja.update();
  obstacle.update();

  if(ninja.collideWith(obstacle)) {
  	endGame();
  }
}

function loadSprite(folder, fileStart, index) {
	let file = folder + fileStart + "__00" + index + ".png";
	loadImage(file, loadComplete, errorLoading);

	function loadComplete(img) {
		if(fileStart == "Idle") {
			idle[index] = img;
		} else if(fileStart == "Run") {
			run[index] = img;
		} else if(fileStart == "Jump") {
			jump[index] = img;
		}
		loadCounter++;

		if(loadCounter == 30) {
			ninja.setSprites(idle, run, jump);
			loading = false;
			physicsHandler = setInterval(physicsUpdate, 20);
		}
	}

	function errorLoading(error) {
		console.log("Error whilst loading " + file);
		console.log(error);
	}
}

function loadNinjaSprites(callback) {
	let folder = "assets/ninja-sprite/";
	for(let i = 0; i < 10; i++) {
		loadSprite(folder, "Idle", i);
		loadSprite(folder, "Run", i);
		loadSprite(folder, "Jump", i);
	}
	callback();
}

function setup () {
  	let canvas = createCanvas(windowWidth, windowHeight);
  	canvas.parent('sketch');

	floorHeight = 0.8 * height;
    let ninjaWidth = 72.6;
    let ninjaHeight = 91.6;
    let gravity = 0.8;
  	ninja = new Ninja(width * 0.2,
	  0,
	  ninjaWidth,
	  ninjaHeight,
	  floorHeight,
	  gravity);

  	let obstacleSpeed = -6;
  	let obstacleWidth = 0.4 * ninjaWidth;
  	let obstacleHeight = 0.8 * ninjaHeight;
  	obstacle = new Obstacle(width,
	  floorHeight - obstacleHeight,
	  obstacleSpeed,
	  obstacleWidth,
	  obstacleHeight);
	
  	// come up with a way to use a callback instead of settig ninja sprites in 
  	// the load functino
	function loadComplete() {
		return 0;
	}

	loadNinjaSprites(loadComplete);
}

function draw () {
	if(loading) {
		background(155);
		stroke(255);
		let rh = 20;
		let gap = 50;
		let rw = width - 2*gap;
		noFill();
		rect(gap, height/2 - rh/2, rw, rh);
		
		fill(255);
		noStroke();
		let loadPercent = map(loadCounter, 0, 30, 0, rw);
		rect(gap, height/2 - rh/2, loadPercent, rh);
	} else {
		background(0);
		noFill();
		stroke(255);
		line(0, floorHeight, width, floorHeight);
		obstacle.draw();
		ninja.draw();
	}
}
