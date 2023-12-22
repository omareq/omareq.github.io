/*******************************************************************************
 *
 *  @file word.js This file implements the word class
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
/**
 * This class describes a word.
 *
 * @class      Word (name)
 */
class Word {
    /**
     * Constructs a new instance of the Word to be guessed
     *
     * @param      {string}  word              The word
     * @param      {p5.Vector}  pos            The top left position in pixels
     * @param      {number}  width             The width in pixels
     * @param      {number}  height            The height in pixels
     * @param      {number}  [strokeWeight=1]  The stroke weight in pixels
     * @param      {number}  [strokeCol=255]   The stroke colour
     */
    constructor(word, pos, width, height, strokeWeight=1, strokeCol=255) {
        this.strokeWeight = strokeWeight;
        this.strokeCol = strokeCol;
        this.word = word.toLowerCase();
        this.selectedChars = new Array(this.word.length).fill(false);

        this.resize(pos, width, height);
    }

     /**
     * Resizes the word interface
     *
     * @param      {p5.Vector}  pos  The position of the top left in pixels
     * @param      {number}  width   The width in pixels
     * @param      {number}  height  The height in pixels
     */
    resize(pos, width, height) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.calculateLocations();
    }

    /**
     * Calculates the locations of key points to be drawn in the future
     */
    calculateLocations() {
        this.left = this.pos.x;
        this.right = this.pos.x + this.width;
        this.top = this.pos.y;
        this.centreY = this.top + 0.5 *this.height;
        this.bottom = this.pos.y + this.height;

        this.boxWidth = this.width / this.word.length;
        this.gap = 0.05 * this.boxWidth;

        this.fontSize = 0.95 * this.height;
    }

    /**
     * Tests to see if a given letter is in the word and sets the show flag to
     * true so that that character is displayed at the bottom of the canvas
     *
     * @param      {string}   letter  The letter
     * @return     {boolean}  True if the letter is in the word
     */
    pickLetter(letter) {
        if(this.word.includes(letter.toLowerCase())) {
            for(let i = 0; i < this.word.length; i ++) {
                if(this.word[i] == letter) {
                    this.selectedChars[i] = true;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Determines if all the characters in the word have been revealed
     *
     * @return     {boolean}  True if complete, False otherwise.
     */
    isComplete() {
        return !this.selectedChars.includes(false);
    }

    /**
     * Draw the word
     */
    draw() {
        push();
        textSize(this.fontSize);
        textAlign(CENTER, CENTER);
        stroke(this.strokeCol);
        strokeWeight(this.strokeWeight);
        fill(this.strokeCol);
        for(let i = 0; i < this.selectedChars.length; i++) {
            if(this.selectedChars[i]) {
                text(this.word[i],
                    this.left + this.boxWidth * (i + 0.5),
                    this.centreY);
            }
            line(this.left + this.boxWidth * i + this.gap, this.bottom,
                this.left + this.boxWidth * (i + 1) - this.gap, this.bottom);
        }
        pop();
    }
}