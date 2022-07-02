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

/**
 * @class      Level() This class describes a level in the game.
 */
class Level {
    /**
     * Constructs a new instance of the level in the game.
     *
     * @example
     * let exampleLayout = [
     *     [{width: 16, hits: 0}],
     *     [{width: 16, hits: 1}],
     *     [{width: 4, hits: 0}, {width: 8, hits: 2}, {width: 4, hits: 0}],
     *     [{width: 4, hits: 0}, {width: 4, hits: 3}, {width: 4, hits: 3}],
     *     [{width: 16, hits: 0}]
     * ];*
     *
     * let newLevel = (numCols, numRows, exampleLayout);
     *
     * @param      {number}  cols    The number of cols
     * @param      {number}  rows    The number of rows
     * @param      {Array<Array<Object>>}  layout  The layout of the bricks
     */
    constructor(cols, rows, layout) {
        this.cols = cols;
        this.rows = rows;

        const bricksWidth = (width - 2) / cols;
        const bricksHeight = 0.65 * height / rows;

        this.bricks = [];

        for(let row = 0; row < layout.length; row++) {
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

    /**
     * Checks to see if any of the bricks in the layout are hit by the ball. If
     * they are then the ball will bounce from the edge of the brick that it
     * hits.
     *
     * @param      {Ball}  ball    The ball
     */
    checkBricksHitBy(ball) {

        for(let i = this.bricks.length - 1; i >= 0 ; i--) {
            // bottom edge
            let xCond = (ball.x + ball.r) > this.bricks[i].x &&
                (ball.x - ball.r) < this.bricks[i].x + this.bricks[i].w;
            let yCond = (ball.y + ball.r) > this.bricks[i].y + this.bricks[i].h
            && (ball.y - ball.r) < this.bricks[i].y + this.bricks[i].h;
            if(xCond && yCond) {
                this.bricks[i].hits -= 1;
                this.bricks[i].setColourByHits();
                ball.setVelY(-ball.vy);
                ball.setY(this.bricks[i].y + this.bricks[i].h + ball.r + 1);
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
                ball.setVelX(-ball.vx);
                ball.setX(this.bricks[i].x - ball.r - 1);
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
                ball.setVelX(-ball.vx);
                ball.setX(this.bricks[i].x + this.bricks[i].w + ball.r + 1);
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
                ball.setVelY(-ball.vy);
                ball.setY(this.bricks[i].y - ball.r - 1);
                if(this.bricks[i].hits == 0) {
                    let deleted = this.bricks.splice(i, 1);
                }
                break;
            }
        }
    }

    /**
     * Checks if there are any bricks left in the layout
     *
     * @return     {Boolean}  True when all bricks are destroyed
     */
    win() {
        return this.bricks.length == 0;
    }

    /**
     * Find the pixel location of the brick with the highest value.  Prefers
     * leftmost bricks in the highest rows first.
     *
     * @return     {p5.Vector}  The pixel location of the brick found
     */
    posHighestBrick() {
        let recordHits = 0;
        let recordPosX;
        let recordPosY;
        for(let i = 0; i < this.bricks.length; i++) {
            if(this.bricks[i].hits > recordHits) {
                recordHits = this.bricks[i].hits;
                recordPosX = this.bricks[i].x;
                recordPosY = this.bricks[i].y;
            }
        }
        return createVector(recordPosX, recordPosY);
    }

    /**
     * Draw all the bricks on the canvas.
     */
    draw() {
        for(let i = 0; i < this.bricks.length; i++) {
            this.bricks[i].draw();
        }
    }
}

/**
 * The number of columns in the brick layout.
 *
 * @type       {number}
 */
let cols1 = 16;

/**
 * The number of rows in the brick layout.
 *
 * @type       {number}
 */
let rows1 = 8;

// Author: Omar Essilfie-Quaye
/**
 * The layout of the bricks in level 0
 *
 * @type       {Array<Array<Object>>}
 */
let layout0 = [
    [{width: 16, hits: 0}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 2}, {width: 2, hits: 2}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 2}, {width: 2, hits: 2}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 16, hits: 0}]
];

// Author: Omar Essilfie-Quaye
/**
 * The layout of the bricks in level 1
 *
 * @type       {Array<Array<Object>>}
 */
let layout1 = [
    [{width: 16, hits: 0}],
    [{width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 4}, {width: 2, hits: 4}, {width: 2, hits: 4}, {width: 2, hits: 4}, {width: 2, hits: 3}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 4}, {width: 2, hits: 5}, {width: 2, hits: 5}, {width: 2, hits: 4}, {width: 2, hits: 3}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 4}, {width: 2, hits: 5}, {width: 2, hits: 5}, {width: 2, hits: 4}, {width: 2, hits: 3}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 4}, {width: 2, hits: 4}, {width: 2, hits: 4}, {width: 2, hits: 4}, {width: 2, hits: 3}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 1}],
    [{width: 16, hits: 0}]
];

// Author: Naomi
/**
 * The layout of the bricks in level 2
 *
 * @type       {Array<Array<Object>>}
 */
let layout2 = [
    [{width: 16, hits: 0}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 5}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 5}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 5}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 5}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 4}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 4}],
    [{width: 2, hits: 1}, {width: 2, hits: 4}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 4}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 4}, {width: 2, hits: 4}, {width: 2, hits: 4}, {width: 2, hits: 4}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 16, hits: 0}]
];

// Author: Naomi
/**
 * The layout of the bricks in level 3
 *
 * @type       {Array<Array<Object>>}
 */
let layout3 = [
    [{width: 16, hits: 0}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 3}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 3}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}, {width: 2, hits: 1}],
    [{width: 16, hits: 0}]
];

/**
 * An array of all level layouts.
 *
 * @type       {Array}
 *
 * @see Level
 */
let levelLayouts = [
    layout0,
    layout1,
    layout2,
    layout3
];