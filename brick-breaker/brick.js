/*******************************************************************************
 *
 *  @file brick.js A file containing the brick class
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 18-June-2022
 *  @link https://omareq.github.io/brick-breaker/
 *  @link https://omareq.github.io/brick-breaker/docs/
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
 * @class      Brick () This class describes a brick.
 */
class Brick {
    /**
     * Constructs a new instance of a Brick
     *
     * @param      {number}  x       The x location on the canvas
     * @param      {number}  y       The y location on the canvas
     * @param      {number}  w       The width of the brick in pixels
     * @param      {number}  h       The height of the brick in pixels
     * @param      {number}  hits    The number of hits to destroy the brick
     * @param      {p5.Color}  [col=color(135, 81, 153)]   The colour of the brick
     */
    constructor(x, y, w, h, hits, col) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.hits = hits;
        this.showNumbers = true;

        if(col != null) {
            this.col = col;
        } else {
            this.setColourByHits();
        }
    }

    /**
     * Toggles the show numbers flag
     */
    toggleShowNumbers() {
        this.showNumbers = !this.showNumbers;
    }

    /**
     * Sets the show numbers flag to true
     */
    showNumbersOn() {
        this.showNumbers = true;
    }

    /**
     * Sets the show numbers flag to false
     */
    showNumbersOff() {
        this.showNumbers = false;
    }

    /**
     * Sets the colour of the brick depending on how many hits it takes to
     * destroy the brick.
     *
     * @example
     * // Change colour to blue for 1 hit
     * this.col = color(41, 103, 204);
     * // Change colour to red for 2 hits
     * this.col = color(204, 41, 52);
     * // Change colour to green for 3 hits
     * this.col = color(41, 204, 74);
     * // Change colour to yellow for 4 hits
     * this.col = color(204, 199, 41);
     * // Change colour to orange for 5 hits
     * this.col = color(204, 109, 41);
     * // Change colour to purple by default
     * this.col = color(135, 81, 153);
     */
    setColourByHits() {
        switch(this.hits) {
                case 1:
                // Change colour to blue
                this.col = color(41, 103, 204);
                break;
                case 2:
                // Change colour to red
                this.col = color(204, 41, 52);
                break;
                case 3:
                // Change colour to green
                this.col = color(41, 204, 74);
                break;
                case 4:
                // Change colour to yellow
                this.col = color(204, 199, 41);
                break;
                case 5:
                // Change colour to orange
                this.col = color(204, 109, 41);
                break;
                default:
                    this.col = color(135, 81, 153);
                break;
            }
    }

    /**
     * Draws the brick on the canvas
     */
    draw() {
        push();
        fill(this.col);
        rect(this.x, this.y, this.w, this.h, 0.2 * this.h);
        pop();

        if(this.showNumbers) {
            push();
            fill(225, 225, 225);
            textSize(0.75 * this.h);
            textAlign(CENTER, CENTER);
            text(this.hits, this.x + this.w / 2, this.y + this.h / 2);
            pop();
        }
    }
}