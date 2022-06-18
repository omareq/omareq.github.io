/*******************************************************************************
 *
 *  @file ball.js A file containing the ball class
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
*   Class representing a Ball
*/
class Ball {
    /**
    *   Create a Ball
    *
    *   @param {number} x  - The initial x location of the Ball.
    *   @param {number} y  - The initial y location of the Ball.
    *   @param {number} vx - The initial x velocity of the Ball.
    *   @param {number} vy - The initial y velocity of the Ball.
    *   @param {number} r  - The radius of the Ball.
    *   @param {number} m  - The mass of the Ball.
    */
    constructor(x, y, vx, vy, r) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.colour = color(29, 3, 51);
    }

    /**
    *   Applies the velocity to the Ball.
    */
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.checkEdges();
    }

    /**
    *   Checks to see if the Ball has left the boundaries of the canvas. If
    *   they have the ball will bounce back with 90% of it's original speed.
    */
    checkEdges() {
        if(this.x + this.r > width) {
            this.x = width - this.r;
            this.vx *= -1;
        }
        if(this.y + this.r > height) {
            this.y = height - this.r;
            this.vy *= -1;
        }
        if(this.x - this.r < 0) {
            this.x = this.r;
            this.vx *= -1;
        }
        if(this.y - this.r < 0) {
            this.y = this.r;
            this.vy *= -1;
        }
    }

    /**
    *   Draws a white ellipse at the Balls position on the canvas
    */
    draw() {
        push();
        fill(this.colour);
        ellipse(this.x, this.y, 2 * this.r, 2 * this.r);
        pop();
    }
}