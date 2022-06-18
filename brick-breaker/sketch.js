/*******************************************************************************
 *
 *	@file sketch.js A quick brick breaker game
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 18-June-2022
 *	@link https://omareq.github.io/brick-breaker/
 *	@link https://omareq.github.io/brick-breaker/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2022 Omar Essilfie-Quaye
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

let gameMode = {
    start: 1,
    play: 2,
    newLevel: 3,
    end: 4
};

let currentGameMode = gameMode.play;

let level;


/**
 * p5.js setup function, creates canvas.
 */
function setup() {
	let cnvSize;
	if(windowWidth > windowHeight) {
		cnvSize = 0.9 * windowHeight;
	} else {
		cnvSize = windowWidth;
	}
	let cnv = createCanvas(cnvSize, 0.7 * cnvSize);
	cnv.parent('sketch');
    level = new Level(cols1, rows1, layout1);
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(225);
    switch(currentGameMode) {
        case gameMode.start:

        break;
        case gameMode.play: {
            level.draw();
        }
        break;
        case gameMode.end:

        break;
    }
}

