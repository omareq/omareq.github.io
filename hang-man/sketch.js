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
 * The handler for the game control class
 *
 * @type       {GameControl}
 */
let game;

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

function setupGame() {
	game = new GameControl();
	game.setupGame();
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
}

/**
 * Handles key pressed events
 */
// let i = 0;
function keyPressed() {
	if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
		return;
	}
	game.pickLetter(key.toLowerCase());
	// saveName = "Word-04-" + String(i).padStart(3, "0") + ".png";
	// saveCanvas(saveName, 'png');
	// i++;
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(0);

	if(game.isNotReady()) {
        game.setupGame();
    }

	game.draw();
}

