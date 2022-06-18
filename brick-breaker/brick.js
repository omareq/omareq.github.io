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

class Brick {
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

    toggleShowNumbers() {
        this.showNumbers = !this.showNumbers;
    }

    showNumbersOn() {
        this.showNumbers = true;
    }

    showNumbersOff() {
        this.showNumbers = false;
    }

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

    draw() {
        push();
        fill(this.col);
        rect(this.x, this.y, this.w, this.h);
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