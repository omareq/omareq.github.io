/*******************************************************************************
 *
 *  @file level.js A file describing the Level class
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

let cols1 = 16;

let rows1 = 8;

let layout1 = [
    [{width: 16, hits: 0}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 2}, {width: 2, hits: 2}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 2}, {width: 2, hits: 2}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 16, hits: 0}]
];

class Level {
    constructor(cols, rows, layout) {
        this.cols = cols;
        this.rows = rows;

        const bricksWidth = (width - 2) / cols;
        const bricksHeight = 0.65 * height / rows;

        this.bricks = [];

        for(let row = 0; row < this.rows; row++) {
            let widthCounter = 0;
            for(let brick = 0; brick < layout[row].length; brick++) {
                let currentWidth = layout[row][brick].width;
                let currentHits = layout[row][brick].hits;

                if(currentHits == 0) {
                    widthCounter += currentWidth;
                    continue;
                }

                let x = widthCounter * bricksWidth;
                let y = row * bricksHeight;

                this.bricks.push(new Brick(x, y,
                    currentWidth * bricksWidth, bricksHeight,
                    currentHits));

                widthCounter += currentWidth;
            }
        }
    }

    checkBricksHitBy(ball) {

        for(let i = this.bricks.length - 1; i >= 0 ; i--) {
            // bottom edge
            let xCond = (ball.x + ball.r) > this.bricks[i].x &&
                (ball.x - ball.r) < this.bricks[i].x + this.bricks[i].w;
            let yCond = (ball.y + ball.r) > this.bricks[i].y + this.bricks[i].h  &&
                (ball.y - ball.r) < this.bricks[i].y + this.bricks[i].h;
            if(xCond && yCond) {
                this.bricks[i].hits -= 1;
                this.bricks[i].setColourByHits();
                ball.vy *= -1;
                ball.y = this.bricks[i].y + this.bricks[i].h + ball.r + 1;
                if(this.bricks[i].hits == 0) {
                    let deleted = this.bricks.splice(i, 1);
                }
                break;
            }

            // left edge
            xCond = (ball.x + ball.r) > this.bricks[i].x &&
                (ball.x - ball.r) < this.bricks[i].x;
            yCond = (ball.y + ball.r) > this.bricks[i].y &&
                (ball.y - ball.r) < this.bricks[i].y + this.bricks[i].h;
            if(xCond && yCond) {
                this.bricks[i].hits -= 1;
                this.bricks[i].setColourByHits();
                ball.vx*= -1;
                ball.x = this.bricks[i].x - ball.r - 1;
                if(this.bricks[i].hits == 0) {
                    let deleted = this.bricks.splice(i, 1);
                }
                break;
            }

            // right edge
            xCond = (ball.x + ball.r) > this.bricks[i].x + this.bricks[i].w &&
                (ball.x - ball.r) < this.bricks[i].x + this.bricks[i].w;
            yCond = (ball.y + ball.r) > this.bricks[i].y &&
                (ball.y - ball.r) < this.bricks[i].y + this.bricks[i].h;
            if(xCond && yCond) {
                this.bricks[i].hits -= 1;
                this.bricks[i].setColourByHits();
                ball.vx*= -1;
                ball.x = this.bricks[i].x + this.bricks[i].w + ball.r + 1;
                if(this.bricks[i].hits == 0) {
                    let deleted = this.bricks.splice(i, 1);
                }
                break;
            }

            // top edge
            xCond = (ball.x + ball.r) > this.bricks[i].x &&
                (ball.x - ball.r) < this.bricks[i].x + this.bricks[i].w;
            yCond = (ball.y + ball.r) > this.bricks[i].y &&
                (ball.y - ball.r) < this.bricks[i].y;
            if(xCond && yCond) {
                this.bricks[i].hits -= 1;
                this.bricks[i].setColourByHits();
                ball.vy *= -1;
                ball.y = this.bricks[i].y - ball.r - 1;
                if(this.bricks[i].hits == 0) {
                    let deleted = this.bricks.splice(i, 1);
                }
                break;
            }
        }
    }

    draw() {
        for(let i = 0; i < this.bricks.length; i++) {
            this.bricks[i].draw();
        }
    }
}