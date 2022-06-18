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

class Paddle {

    constructor() {
        this.w = 0.15 * width;
        this.h = 0.025 * height;
        this.x = width / 2 - this.w/2;
        this.y = 0.95 * height;
        this.r = 0.2 * this.h;
        this.dx = 0.1 * this.w;
        this.col = color(29, 3, 51)
    }

    moveLeft() {
        this.x -= this.dx;
        this.checkEdges();
    }

    moveRight() {
        this.x += this.dx;
        this.checkEdges();
    }

    checkEdges() {
        if(this.x < 0) {
            this.x = 0;
            return;
        }

        if(this.x + this.w > width) {
            this.x = width - this.w;
        }
    }

    isHitBy(ball) {
        let xCond = ball.x + ball.r > this.x &&
            ball.x - ball.r < this.x + this.w;
        let yCond = ball.y + ball.r > this.y &&
            ball.y - ball.r < this.y;

        if(xCond && yCond) {
            ball.vy *= -1;
            ball.y = this.y - ball.r - 1;
        }
    }

    draw() {
        push();
        fill(this.col);
        rect(this.x, this.y, this.w, this.h, this.r);
        pop();
    }
}