/*******************************************************************************
 *
 *  @file game.js This file implements the game control class
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 03-August-2023
 *  @link https://omareq.github.io/hang-man/
 *  @link https://omareq.github.io/hang-man/docs/
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

class GameControl {

    /**
     * Constructs a new instance of GameControl
     */
    constructor() {
        this.setupGame();
    }

    /**
     * Handles the creation of all the objects needed for the game
     */
    setupGame() {
        this.startGame = false;
        this.gameOver = false;
        this.wonGame = false;

        const drawWidth = 0.75 * width;
        const drawHeight = 0.75 * height;
        const leftPosVal = (width - drawWidth) / 2;
        const topPosVal = (height - drawHeight) / 2 - 5;
        const topLeftPosition = createVector(leftPosVal, topPosVal);

        this.hangman = new Hangman(topLeftPosition, drawWidth, drawHeight);
        this.letters = new LettersInterface(createVector(0, 0), 0.1 * width, height);

        wordListKeys = Object.keys(wordList);
        const randomIndex = floor(random(wordListKeys.length));
        const randomWord = wordListKeys[randomIndex];

        this.word = new Word(randomWord,
            createVector(0.2*width, 0.875*height),
            0.6*width, 0.1*height);

        // console.log("Hangman: ", this.hangman);
        // console.log("Letters: ", this.letters);
        // console.log("Word: ", this.word);
        this.startGame = true;
    }

    /**
     * Processes the letter that the player has guessed
     *
     * @param      {string}  letter  The guessed letter
     */
    pickLetter(letter) {
        if(this.letters.pickLetter(letter.toLowerCase())) {
            const gotItRight = this.word.pickLetter(letter.toLowerCase());
            if(!gotItRight) {
                this.hangman.decreaseLives();
                if(this.hangman.isDead()) {
                    this.gameOver = true;
                    console.log("Game Over!!!");
                }
            } else if(this.word.isComplete()) {
                console.log("You Won!!!");
                this.wonGame = true;
            }
        }
    }

    /**
     * Determines if the game state is usable
     *
     * @return     {boolean}  True if not ready, False otherwise.
     */
    isNotReady() {
        return this.startGame && this.hangman.width == 0;
    }

    /**
     * Determines if the game is over
     *
     * @return     {boolean}  True if over, False otherwise.
     */
    isOver() {
        return this.gameOver || this.wonGame;
    }

    /**
     * Draw the game
     */
    draw() {
        if(this.gameOver) {
            push();
            fill(255);
            stroke(255);
            strokeWeight(1);
            textSize(0.1 * width);
            textAlign(CENTER, CENTER);
            text("Game Over!!!\n" + this.word.word + "\nClick To Restart",
                width / 2, height / 2);
            pop();
        } else if (this.wonGame) {
            push();
            fill(255);
            stroke(255);
            strokeWeight(1);
            textSize(0.1 * width);
            textAlign(CENTER, CENTER);
            text("You Won!!!\n" + this.word.word + "\nClick To Restart",
                width / 2, height / 2);
            pop();
        } else if (!this.startGame) {
            push();
            fill(255);
            stroke(255);
            strokeWeight(1);
            textSize(0.1 * width);
            textAlign(CENTER, CENTER);
            text("Loading Word List", width / 2, height / 2);
            pop();
        } else {
            this.hangman.draw();
            this.letters.draw();
            this.word.draw();
        }
    }
}