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
let tileImgs = [];
let tilesLoaded = false;
let totalTileAssets = 19;
let tileLoadCounter = 0;

let sounds = [];
let soundsLoaded = false;
let totalSoundAssets = 1;
let soundLoadCounter = 0;

let totalAssets = totalNinjaAssets + totalSpikeAssets + totalTileAssets + totalSoundAssets;

let startMode = 1;
let playMode = 2;
let endMode = 3;
let gameMode = startMode;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  floorHeight = 0.8 * height;
}

function keyPressed() {
	if(gameMode == startMode && keyCode == ENTER) {
		physicsHandler = setInterval(physicsUpdate, 20);
		gameMode = playMode;
	} else if(gameMode == playMode) {
		if(key.toLowerCase() == "w" || keyCode == UP_ARROW) {
			ninja.jump();
		} if(key.toLowerCase() == "s"  || keyCode == DOWN_ARROW) {
			ninja.drop();
		}
	} else if(gameMode == endMode && keyCode == ENTER) {
		gameMode = startMode;
		ninja.reset();
		obstacle.reset();
	}
}

function endGame() {
	clearInterval(physicsHandler);
	gameMode = endMode;
}

function physicsUpdate() {
  ninja.update();
  obstacle.update();

  if(ninja.collideWith(obstacle)) {
  	endGame();
  }
}

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

function loadTiles() {
	function bgLoadComplete(img) {
		bgTile = img;
		tileLoadCounter++;
		BGLoaded = true;
	}

	function error(err) {
		console.log(err);
	}

	loadImage("assets/tileset/BG/BG.png",
	  bgLoadComplete,
	  error);

	let folder = "assets/tileset/Tiles/";
	for(let i = 1; i < totalTileAssets; i++) {
		loadTileSprite(folder, i);
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

function loadNinjaSprites() {
	let folder = "assets/ninja-sprite/";
	for(let i = 0; i < 10; i++) {
		loadSprite(folder, "Idle", i);
		loadSprite(folder, "Run", i);
		loadSprite(folder, "Jump", i);
	}
}

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
	let counter = ninjaLoadCounter + spikeLoadCounter + tileLoadCounter + soundLoadCounter;
	let loadPercent = map(counter, 0, totalAssets, 0, rw);
	rect(gap, height/2 - rh/2, loadPercent, rh);

	textSize(floor(0.1*height));
	textAlign(CENTER);
	text("Loading Assets", width/2, height/4);
}

function startScreen() {
	background(155);

	textAlign(CENTER);
	textSize(0.06 * width);
	text("Press Enter To Start Game", 0.5 * width, 0.5 * height);

	textSize(0.03 * width);
	text("W - Jump   S - Drop", 0.5 * width, 0.75 * height);

}

function gameLoop() {
	if(BGLoaded) {
		bgx += bgScrollSpeed;
		bgx %= width;

		image(bgTile, bgx, 0, width, height);
		image(bgTile, bgx + width, 0, width, height);
	} else {
		background(255);
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
}

function endScreen() {
	background(155);

	fill(255);
	stroke(255);
	strokeWeight(1);
	textAlign(CENTER);
	textSize(0.12 * width);
	text("Game Over", 0.5 * width, 0.5 * height);

	textSize(0.06 * width);
	text("Press Enter To Continue", 0.5 * width, 0.75 * height);
}

function setup () {
  	let canvas = createCanvas(windowWidth, windowHeight);
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

	function watchdog() {
		loadWatchdogTimer += loadWatchdogInterval;

		if(loadWatchdogTimer > 60000) {
			console.log("Loading of Assets is taking too long reloading page");
			window.location.reload(true);
			clearInterval(loadWatchdogHandler);
			return;
		}

		let loadCounter = ninjaLoadCounter + spikeLoadCounter + tileLoadCounter + soundLoadCounter;
		if(loadCounter == totalAssets) {
			loading = false;
			clearInterval(loadWatchdogHandler);
		}
	}

	loadWatchdogHandler = setInterval(watchdog, loadWatchdogInterval);
}

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
