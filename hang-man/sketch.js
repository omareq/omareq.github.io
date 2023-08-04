/*******************************************************************************
 *
 *	@file sketch.js My take of on the classic hang man word guessing game
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 03-August-2023
 *	@link https://omareq.github.io/hang-man/
 *	@link https://omareq.github.io/hang-man/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2023 Omar Essilfie-Quaye
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *****************************************************************************/

/**
 * The handler to control and draw the hangman
 *
 * @type       {Hangman}
 */
let hangman;

/**
 * The handler to control and draw the letter interface
 *
 * @type       {LetterInterface}
 */
let letters;

/**
 * The handler to control and draw the guessed word
 *
 * @type       {Word}
 */
let word;

/**
 * State flag to see if the game has started yet after the wordlist has started
 * loading
 *
 * @type       {boolean}
 */
let startGame = false;

/**
 * State flag to see if the game is over via loss from the player
 *
 * @type       {boolean}
 */
let gameOver = false;

/**
 * State flag to see if the player has won the game
 *
 * @type       {boolean}
 */
let wonGame = false;

/**
 * A json list of words
 *
 * @type       {Object}
 */
let wordList;

/**
 * Array of keys for the json word list
 *
 * @type       {Array}
 */
let wordListKeys;

/**
 * asynchronously loads the word list
 */
function preload() {
  let url = 'word-list.json';
  wordList = loadJSON(url, setupGame);
}

/**
 * Handles the creation of all the objects needed for the game
 */
function setupGame() {

	const drawWidth = 0.75 * width;
	const drawHeight = 0.75 * height;
	const leftPosVal = (width - drawWidth) / 2;
	const topPosVal = (height - drawHeight) / 2 - 5;
	const topLeftPosition = createVector(leftPosVal, topPosVal);

	hangman = new Hangman(topLeftPosition, drawWidth, drawHeight);
	letters = new LettersInterface(createVector(0, 0), 0.1 * width, height);

	wordListKeys = Object.keys(wordList);
	const randomIndex = floor(random(wordListKeys.length));
	const randomWord = wordListKeys[randomIndex];

	word = new Word(randomWord,
		createVector(0.2*width, 0.875*height),
		0.6*width, 0.1*height);

	// console.log("Hangman: ", hangman);
	// console.log("Letters: ", letters);
	// console.log("Word: ", word);
	startGame = true;
}

/**
 * p5.js setup function, creates canvas.
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
	setupDone = true;
}

/**
 * Handles key pressed events
 */
function keyPressed() {
	if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
		return;
	}

	if(letters.pickLetter(key.toLowerCase())) {
		let gotItRight = word.pickLetter(key.toLowerCase());
		if(!gotItRight) {
			hangman.decreaseLives();
			if(hangman.isDead()) {
				gameOver = true;
				console.log("Game Over!!!");
			}
		} else if(word.isComplete()) {
			console.log("You Won!!!");
			wonGame = true;
		}
	}
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(0);
	if(startGame && hangman.width == 0) {
		setupGame();
	}

	if(gameOver) {
		push();
		fill(255);
		stroke(255);
		strokeWeight(1);
		textSize(0.1 * width);
		textAlign(CENTER, CENTER);
		text("Game Over!!!\n" + word.word, width / 2, height / 2);
		pop();
	} else if (wonGame) {
		push();
		fill(255);
		stroke(255);
		strokeWeight(1);
		textSize(0.1 * width);
		textAlign(CENTER, CENTER);
		text("You Won!!!\n" + word.word, width / 2, height / 2);
		pop();
	} else if (!startGame) {
		push();
		fill(255);
		stroke(255);
		strokeWeight(1);
		textSize(0.1 * width);
		textAlign(CENTER, CENTER);
		text("Loading Word List", width / 2, height / 2);
		pop();
	} else {
		hangman.draw();
		letters.draw();
		word.draw();
	}
}

