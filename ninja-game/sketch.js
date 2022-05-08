/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     02-Aug-2018
*   Program:  Making a quick ninja game to alleviate boredom
*
*******************************************************************************/

let floorHeight;
let ninja;
let obstacle;
let fgScrollSpeed = -7;
let fgx = 0;
let physicsHandler;
let idle = [];
let run = [];
let jump = [];
let loading = true;
let totalNinjaAssets = 30;
let ninjaLoadCounter = 0;

let spikeImgs = [];
let totalSpikeAssets = 1;
let spikeLoadCounter = 0;

let bgx = 0;
let bgScrollSpeed = -2;
let BGLoaded = false;
let BGNightLoaded = false;
let nightTime = false;
let tileImgs = [];
let tilesLoaded = false;
let totalTileAssets = 19;
let tileLoadCounter = 0;

let sounds = [];
let soundsLoaded = false;
let totalSoundAssets = 1;
let soundLoadCounter = 0;

let totalAssets = totalNinjaAssets + totalSpikeAssets + totalTileAssets +
	totalSoundAssets;

let startMode = 1;
let playMode = 2;
let endMode = 3;
let gameMode = startMode;
let gameScore = 0;

/**
* p5.js windowResized function, used to update the size of the canvas when the
* window is adjusted.
*/
function windowResized() {
  resizeCanvas(0.8 * windowWidth, 0.8 * windowHeight);
  floorHeight = 0.8 * height;
}

/**
* p5.js keyPressed function used to control the ninja and also to switch game
* modes at the start screen and end screen.
*
*	"w" - Jump
* "S" - Drop
* "K" - Kill
*/
function keyPressed() {
	if(gameMode == startMode && keyCode == ENTER) {
		startGame();
	} else if(gameMode == playMode) {
		if(key.toLowerCase() == "w" || keyCode == UP_ARROW) {
			ninja.jump();
		} else if(key.toLowerCase() == "s" || keyCode == DOWN_ARROW) {
			ninja.drop();
		} else if(key.toLowerCase() == "k") {
			endGame();
		}
	} else if(gameMode == endMode && keyCode == ENTER) {
		resetGame();
	}
}

/**
* p5.js mousePressed function used to control the ninja and also to switch game
* modes at the start screen and end screen.
*/
function mousePressed() {
	if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
		return;
	}

	if(gameMode == startMode) {
		startGame();
	} else if(gameMode == playMode) {
		ninja.jump();
	} else if(gameMode == endMode) {
		resetGame();
	}
}

/**
* Resets the game mode, game score, ninja and obstacles back to the beginning
* of the game
*/
function resetGame() {
	gameMode = startMode;
	ninja.reset();
	obstacle.reset();
	gameScore = 0;
}

/**
* Starts a game by initialising the physics loop and switching the game mode to
* playMode
*/
function startGame() {
	physicsHandler = setInterval(physicsUpdate, 20);
	gameMode = playMode;
}

/**
* Ends a game by destroying the physics loop and switching the game mode to
* endMode
*/
function endGame() {
	clearInterval(physicsHandler);
	gameMode = endMode;
  console.log("Game Score: " + gameScore);
}

/**
* The physics update function is called once every 20ms and calculates the game
* physics on the ninja and obstacle.  It will also check for collisions with the
* ninja object.
*/
function physicsUpdate() {
  ninja.update();
  obstacle.update();

  if(ninja.collideWith(obstacle)) {
  	endGame();
  }
}

/**
* Loads spikes sprite image.  Contains internal functions for success and error
* handling.
*/
function loadSpikes() {
	loadImage("assets/spikes/double-wood-spike-block.png",
	  loadComplete,
	  error);

	function loadComplete(img) {
		spikeImgs[0] = img;
		spikeLoadCounter++;
		obstacle.setSprite(img);
	}

	function error(err) {
		console.log(err);
	}
}

/**
* Loads single tile sprite image.  Contains internal functions for success and
* error handling.
*/
function loadTileSprite(folder, index) {
	let file = folder + index + ".png";
	loadImage(file, loadComplete, errorLoading);


	function loadComplete(img) {
		tileImgs[index] = img;
		tileLoadCounter++;

		if(tileLoadCounter == totalTileAssets) {
			tilesLoaded = true;
		}
	}

	function errorLoading(error) {
		console.log("Error whilst loading " + file);
		console.log(error);
	}
}

/**
* Loads all tile sprite image.  This includes the background tile.  Contains
* internal functions for success and error handling.
*/
function loadTiles() {
	function bgLoadComplete(img) {
		bgTile = img;
		tileLoadCounter++;
		BGLoaded = true;
	}

	function bgNightLoadComplete(img) {
		bgNightTile = img;
		tileLoadCounter++;
		BGNightLoaded = true;
	}

	function error(err) {
		console.log(err);
	}

	loadImage("assets/tileset/BG/BG.png",
	  bgLoadComplete,
	  error);

	loadImage("assets/tileset/BG/BG-Night.png",
	  bgNightLoadComplete,
	  error);

	let folder = "assets/tileset/Tiles/";
	for(let i = 1; i < totalTileAssets; i++) {
		loadTileSprite(folder, i);
	}
}

/**
* Loads single ninja sprite image.  Contains internal functions for success and
* error handling.
*/
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
		ninjaLoadCounter++;

		if(ninjaLoadCounter == totalNinjaAssets) {
			ninja.setSprites(idle, run, jump);
		}
	}

	function errorLoading(error) {
		console.log("Error whilst loading " + file);
		console.log(error);
	}
}

/**
* Loads all ninja sprite images.
*/
function loadNinjaSprites() {
	let folder = "assets/ninja-sprite/";
	for(let i = 0; i < 10; i++) {
		loadSprite(folder, "Idle", i);
		loadSprite(folder, "Run", i);
		loadSprite(folder, "Jump", i);
	}
}

/**
* Loads sounds for ninja jumping.  Contains internal functions for success and
* error handling.
*/
function loadSounds() {
	soundFormats('mp3', 'ogg');
	loadSound("assets/sound/spin-jump.mp3", loadComplete, errorLoading);

	function loadComplete(sound) {
		let sounds = [];
		sounds.push(sound);
		ninja.setSounds(sounds);
		soundLoadCounter++;
	}

	function errorLoading(error) {
		console.log(error);
		return;
	}
}

/**
* Shows a loading bar whilst all of the game assets are being loaded.
*/
function loadingAnimation() {
	background(155);
	stroke(255);
	let rh = 20;
	let gap = 50;
	let rw = width - 2*gap;
	noFill();
	rect(gap, height/2 - rh/2, rw, rh);

	fill(255);
	noStroke();
	let counter = ninjaLoadCounter + spikeLoadCounter + tileLoadCounter +
		soundLoadCounter;
	let loadPercent = map(counter, 0, totalAssets, 0, rw);
	rect(gap, height/2 - rh/2, loadPercent, rh);

	textSize(floor(0.1*height));
	textAlign(CENTER);
	text("Loading Assets", width/2, height/4);
}

/**
* Draws a start screen on the canvas with information about key controls for
* the ninja character.
*/
function startScreen() {
	background(155);

	textAlign(CENTER);
	textSize(0.06 * width);
	text("Press Enter To Start Game", 0.5 * width, 0.5 * height);

	textSize(0.03 * width);
	text("W - Jump    S - Drop    K - Kill", 0.5 * width, 0.75 * height);

}

/**
* Draws an end screen on the canvas with the final score information.
*/
function endScreen() {
	background(155);

	fill(255);
	stroke(255);
	strokeWeight(1);
	textAlign(CENTER);
	textSize(0.12 * width);
	text("Game Over", 0.5 * width, 0.25 * height);
	text("Score: " + gameScore, 0.5 * width, 0.5 * height);

	textSize(0.06 * width);
	text("Press Enter To Continue", 0.5 * width, 0.75 * height);
}

/**
* Draws the position of all the elements in the game.  Adds 1 point to the game
* score for every frame of animation.
*/
function gameLoop() {
	if(nightTime) {
		if(BGNightLoaded) {
			bgx += bgScrollSpeed;
			bgx %= width;

			image(bgNightTile, bgx, 0, width, height);
			image(bgNightTile, bgx + width, 0, width, height);
		} else {
			background(66, 53, 111);
		}
	} else {
		if(BGLoaded) {
			bgx += bgScrollSpeed;
			bgx %= width;

			image(bgTile, bgx, 0, width, height);
			image(bgTile, bgx + width, 0, width, height);
		} else {
			background(221, 248, 255);
		}
	}

	if(tilesLoaded) {
		let tileWidth = tileImgs[2].width;
		let tileHeight = height - floorHeight;
		fgx += fgScrollSpeed;
		fgx %= tileWidth;

		for(let x = fgx; x < width; x+= tileWidth) {
			image(tileImgs[2], x, floorHeight, tileWidth, tileHeight);
		}

	} else {
		stroke(0);
		strokeWeight(3);
		line(0, floorHeight, width, floorHeight);
	}

	obstacle.draw();
	ninja.draw();
	gameScore += 1;
	textSize(floor(0.06*height));
	textAlign(CENTER);
	text("Score: " + gameScore, 0.2 * width, 0.95 * height);

	if(gameScore % 5000 == 0) {
		nightTime = !nightTime;
	}
}

/**
* p5.js setup function, used to create a canvas and instantiate the ninja and
* obstacle objects. Also loads the various assets needed for drawing the game.
*/
function setup () {
  	let canvas = createCanvas(0.8 * windowWidth, 0.8 * windowHeight);
  	canvas.parent('sketch');

	floorHeight = 0.8 * height;
    let ninjaWidth = 75;
    let ninjaHeight = 90;
    let gravity = 0.8;
  	ninja = new Ninja(width * 0.2,
	  0,
	  ninjaWidth,
	  ninjaHeight,
	  floorHeight,
	  gravity);

  	let obstacleSpeed = fgScrollSpeed;
  	let obstacleWidth = 0.9 * ninjaWidth;
  	let obstacleHeight = 0.8 * ninjaHeight;
  	obstacle = new Obstacle(width,
	  floorHeight - obstacleHeight,
	  obstacleSpeed,
	  obstacleWidth,
	  obstacleHeight);

	loadNinjaSprites();
	loadSpikes();
	loadTiles();
	loadSounds();

	let loadWatchdogHandler;
	let loadWatchdogInterval = 5;
	let loadWatchdogTimer = 0;

	/**
	* Watchdog function to check if the asset loading is taking too long
	*/
	function watchdog() {
		loadWatchdogTimer += loadWatchdogInterval;

		if(loadWatchdogTimer > 60000) {
			console.log("Loading of Assets is taking too long reloading page");
			window.location.reload(true);
			clearInterval(loadWatchdogHandler);
			return;
		}

		let loadCounter = ninjaLoadCounter + spikeLoadCounter + tileLoadCounter +
			soundLoadCounter;
		if(loadCounter == totalAssets) {
			loading = false;
			clearInterval(loadWatchdogHandler);
		}
	}

	loadWatchdogHandler = setInterval(watchdog, loadWatchdogInterval);
}

/**
* p5.js draw function, used to draw the animation to the canvas depending on the
* current game mode.
*/
function draw () {
	if(loading) {
		loadingAnimation();
	} else if(gameMode == startMode) {
		startScreen();
	} else if(gameMode == playMode) {
		gameLoop();
	} else if(gameMode == endMode) {
		endScreen();
	}
}
