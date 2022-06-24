/*******************************************************************************
 *
 *  @file paddle.js A file containing the paddle class
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
 * @class      Paddle () This class describes a paddle as controlled by a player
 *             to bounce the ball.
 */
class Paddle {

    /**
     * Constructs a new instance of Paddle.
     */
    constructor() {
        this.w = 0.15 * width;
        this.h = 0.025 * height;
        this.x = width / 2 - this.w/2;
        this.y = 0.95 * height;
        this.r = 0.2 * this.h;
        this.dx = 0.1 * this.w;
        this.col = color(29, 3, 51);
    }

    /**
     * A function to move the paddle to the left
     */
    moveLeft() {
        this.x -= this.dx;
        this.checkEdges();
    }

    /**
     * A function to move the paddle to the right
     */
    moveRight() {
        this.x += this.dx;
        this.checkEdges();
    }

    /**
     * A function to check if the paddle has gone off the edge of the screen.
     * Stops the paddle at the edge of the screen once it goes goes past the
     * boundaries.
     */
    checkEdges() {
        if(this.x < 0) {
            this.x = 0;
            return;
        }

        if(this.x + this.w > width) {
            this.x = width - this.w;
        }
    }

    /**
     * Determines whether the paddle is hit by the ball.  If it is it will
     * reposition the ball so that it hasn't gone beyond the top surface of the
     * paddle.  The angle the ball leaves the paddle is determined by the
     * position it strikes the paddle.  This goes from -45 to 45 degrees.
     *
     *
     * @param      {Ball}  ball    The ball object
     *
     * @example
     *  let xDiff = this.x + this.w / 2 - ball.x;
     *  let angle = map(xDiff,
     *      -this.w/2, this.w/2,
     *      QUARTER_PI, -QUARTER_PI);
     */
    isHitBy(ball) {
        let xCond = ball.x + ball.r > this.x &&
            ball.x - ball.r < this.x + this.w;
        let yCond = ball.y + ball.r > this.y &&
            ball.y - ball.r < this.y;

        if(xCond && yCond) {
            let currentSpeed = ball.getSpeed();
            let xDiff = this.x + this.w / 2 - ball.x;
            let angle = map(xDiff,
                -this.w/2, this.w/2,
                QUARTER_PI, -QUARTER_PI);

            let newVelX = currentSpeed * sin(angle);
            let newVelY = -currentSpeed * cos(angle);
            ball.setVelX(newVelX);
            ball.setVelY(newVelY);

            ball.setY(this.y - ball.r - 1);
        }
    }

    /**
     * A function to draw the paddle on the canvas.
     */
    draw() {
        push();
        fill(this.col);
        rect(this.x, this.y, this.w, this.h, this.r);
        pop();
    }
}