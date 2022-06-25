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

/**
 * Enum of the possible game states
 *
 * @type       {Enum}
 *
 * @example
 * let gameMode = {
 *    start: 1,
 *    newLevel: 2,
 *    play: 3,
 *    end: 4
 *};
 */
let gameMode = {
    start: 1,
    newLevel: 2,
    play: 3,
    end: 4
};

/**
 * The current game mode
 *
 * @type       {gameMode}
 *
 * @see gameMode
 *
 * @example
 * let currentGameMode = gameMode.start;
 */
let currentGameMode = gameMode.start;

/**
 * Saves the start of a new level in milliseconds to provide debouncing of key
 * presses
 *
 * @type       {number}
 */
let newLevelStartTime;

/**
 * Stores the current level object
 *
 * @type       {Level}
 *
 * @see level
 */
let level;

/**
 * The current level number.  Used to select the correct layout at the start of
 * each new level.
 *
 * @type       {number}
 *
 * @see levelLayouts
 * @see Level
 * @see loadNextLevel
 */
let selectedLevel = 0;

/**
 * The ball object
 *
 * @type       {Ball}
 *
 * @see Ball
 */
let ball;

/**
 * The paddle object
 *
 * @type       {Paddle}
 *
 * @see Paddle
 */
let paddle;

/**
 * The number of lives remaining
 *
 * @type       {number}
 *
 * @see showLives
 */
let lives = 3;

/**
 * Flag to see if cheat mode is on.  When true the paddle will automatically
 * position itself under the ball so that the user doesn't have to.  This is a
 * useful debugging tool when the game needs to be played for long periods.
 *
 * @type       {boolean}
 */
let cheatMode = false;

/**
 * Saves the start time of cheat mode in milliseconds to provide debouncing to
 * key presses.
 *
 * @type       {number}
 */
let cheatModeToggleTime = 0;

/**
 * Noise offset for paddle position when it is cheat mode.  This stops the
 * paddle from always sending the ball straight up.
 *
 * @type       {number}
 *
 * @see Paddle
 */
let noiseOffset = 0;

/**
 * Shows the number of lives remaining on the canvas.
 *
 * @see lives
 */
function showLives() {
    push();
    fill(255);
    textSize(0.03 * height);
    textAlign(LEFT, BOTTOM);
    text("Lives: " + lives, 10, height);
    pop();
}

/**
 * Loads the next level from the levelLayouts array and resets the ball and
 * paddle to the centre.
 *
 * @see levelLayouts
 * @see Level
 */
function loadNextLevel() {
    if(selectedLevel >= levelLayouts.length) {
        currentGameMode = gameMode.end;
        return;
    }
    level = new Level(cols1, rows1, levelLayouts[selectedLevel]);
    let ballR = 7;
    ball = new Ball(width/2, 0.94 * height - ballR / 2,
        random(-2, 0), random(-3, -2),
        ballR);

    paddle = new Paddle();
}

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
    loadNextLevel();
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(225);
    switch(currentGameMode) {
        case gameMode.start: {
            push();
            fill(135, 81, 153);
            textAlign(CENTER, CENTER);
            textSize(0.1 * height);
            text("Press Enter to Start", width / 2, height / 2);
            textSize(0.05 * height);
            text("Press Left Arrow and Right Arrow to move paddle",
                width / 2, 3 * height / 4);
            pop();
            if(keyIsPressed && (keyCode == ENTER)) {
                currentGameMode = gameMode.newLevel;
                newLevelStartTime = millis();
            }
        }
        break;
        case gameMode.newLevel: {
            level.draw();
            paddle.draw();
            ball.draw();
            showLives();
            if(keyIsPressed && (keyCode == ENTER)) {
                if(millis() - newLevelStartTime > 1000) {
                    currentGameMode = gameMode.play;
                }
            }
        }
        break;
        case gameMode.play: {
            showLives();
            level.checkBricksHitBy(ball);
            level.draw();

            if(keyIsDown(LEFT_ARROW)) {
                paddle.moveLeft();
            } else if(keyIsDown(RIGHT_ARROW)) {
                paddle.moveRight();
            }

            if(keyIsPressed && key.toLowerCase() == "c") {
                if(millis() - cheatModeToggleTime > 1000) {
                    cheatMode = !cheatMode;
                }
            }

            if(cheatMode) {
                let noiseAmp = 0.3;
                let n = noise(noiseOffset) * noiseAmp * paddle.w;
                noiseOffset += 0.01;

                let goalBrickPos = level.posHighestBrick();
                let goalAngle = atan2(ball.x - goalBrickPos.x,
                    ball.y - goalBrickPos.y);

                goalAngle = constrain(goalAngle, -QUARTER_PI, QUARTER_PI);

                let goalPaddleOffset = map(goalAngle,
                    QUARTER_PI, -QUARTER_PI,
                    0, paddle.w);

                let goalPaddleX = ball.x - goalPaddleOffset - n;
                goalPaddleX = constrain(goalPaddleX,
                    ball.x - paddle.w,
                    ball.x + paddle.w);

                let errorPaddleX = paddle.x - goalPaddleX;
                let kp = 0.2;
                let deltaPaddleX = -kp * errorPaddleX;

                paddle.setX(paddle.x + deltaPaddleX);
                paddle.checkEdges();
            }
            paddle.isHitBy(ball);
            paddle.draw();

            ball.update();
            ball.draw();

            if(ball.y > paddle.y) {
                lives--;

                if(lives == 0) {
                    currentGameMode = gameMode.end;
                    return;
                }

                currentGameMode = gameMode.newLevel;
                newLevelStartTime = millis();
                paddle = new Paddle();
                let ballR = 7;
                ball = new Ball(width/2, 0.94 * height - ballR / 2,
                    random(-2, 0), random(-3, -2),
                    ballR);
            }

            if(level.win()) {
                currentGameMode = gameMode.newLevel;
                selectedLevel++;
                loadNextLevel();
            }
        }
        break;
        case gameMode.end: {
            push();
            fill(135, 81, 153);
            textAlign(CENTER, CENTER);
            textSize(0.1 * height);
            text("Game Over", width / 2, height / 2);
            pop();
        }
        break;
    }
}

