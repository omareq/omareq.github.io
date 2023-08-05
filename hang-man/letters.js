/*******************************************************************************
 *
 *  @file letters.js This file implements the letters class
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
 * This class describes a letters interface.
 *
 * @class      LettersInterface (name)
 */
class LettersInterface {
    /**
     * Constructs a new instance of LettersIngterface
     *
     * @param      {p5.Vector}  pos            The top left position in pixels
     * @param      {number}  width             The width in pixels
     * @param      {number}  height            The height in pixels
     * @param      {number}  [strokeWeight=1]  The stroke weight
     * @param      {number}  [strokeCol=255]   The stroke col
     */
    constructor(pos, width, height, strokeWeight=1, strokeCol=255) {
        this.strokeWeight = strokeWeight;
        this.strokeCol = strokeCol;

        this.alphabet = {
            "a":false,
            "b":false,
            "c":false,
            "d":false,
            "e":false,
            "f":false,
            "g":false,
            "h":false,
            "i":false,
            "j":false,
            "k":false,
            "l":false,
            "m":false,
            "n":false,
            "o":false,
            "p":false,
            "q":false,
            "r":false,
            "s":false,
            "t":false,
            "u":false,
            "v":false,
            "w":false,
            "x":false,
            "y":false,
            "z":false
        };

        this.alphabetKeys = Object.keys(this.alphabet);
        this.alphabetSize = this.alphabetKeys.length;

        this.resize(pos, width, height);
    }

    /**
     * Resizes the letters interface
     *
     * @param      {p5.Vector}  pos     The position of the top left in pixels
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
     * Calculates the locations of the parts of the letters drawing. Is called
     * on instantiation of the class as well as during resizing events.
     */
    calculateLocations() {
        this.left = this.pos.x;
        this.right = this.pos.x + this.width;
        this.top = this.pos.y;
        this.bottom = this.pos.y + this.height;
        this.centreX = this.pos.x + 0.5 * this.width;

        this.boxWidth = 0.5 * this.width;
        this.halfBoxWidth = 0.5 * this.boxWidth;
        this.rowSpacing = this.height / (0.5 * this.alphabetSize);
        this.halfRowSpacing = 0.5 * this.rowSpacing;
        this.fontSize = 0.75 * this.rowSpacing;

        this.leftTextX = this.left + this.halfBoxWidth;
        this.rightTextX = this.centreX + this.halfBoxWidth;
    }

    /**
     * Picks a letter from the alphabet and sets the flag in the alphabet object
     * for that letter to true.  This causes the letter to be drawn with a
     * different background.
     *
     * @param      {string}   letter  The letter
     * @return     {boolean}  If the letter was in the alphabet return true
     */
    pickLetter(letter) {
        if(this.alphabetKeys.includes(letter.toLowerCase()) &&
            !this.alphabet[letter.toLowerCase()] ) {

            this.alphabet[letter.toLowerCase()] = true;
            return true;
        }
        return false;
    }

    /**
     * Draw the letters interface on the canvas.
     */
    draw() {
        push();
        stroke(this.strokeCol);
        strokeWeight(this.strokeWeight);
        textSize(this.fontSize);
        textAlign(CENTER, CENTER);
        for(let i = 0; i < this.alphabetSize; i+=2) {
            const y = 0.5 * i * this.rowSpacing;
            noFill();
            if(this.alphabet[this.alphabetKeys[i]]) {
                fill(255, 0, 0);
            }
            rect(this.left, y, this.boxWidth, this.rowSpacing);

            noFill();
            if(this.alphabet[this.alphabetKeys[i + 1]]) {
                fill(255, 0, 0);
            }
            rect(this.centreX, y, this.boxWidth, this.rowSpacing);

            fill(this.strokeCol);

            text(this.alphabetKeys[i],
                this.leftTextX,
                y + this.halfRowSpacing);

            text(this.alphabetKeys[i+1],
                this.rightTextX,
                y + this.halfRowSpacing);
        }
        pop();
    }
}