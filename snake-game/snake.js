/*******************************************************************************
 *
 *  @file snake.js The snake file class
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 14-December-2024
 *  @link https://omareq.github.io/snake-game/
 *  @link https://omareq.github.io/snake-game/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2024 Omar Essilfie-Quaye
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
"use strict";

/**
 * Game Namespace Object
 */
var Game = Game || {};

Game.snakeSetup = function() {
    Game.SNAKE_DIRECTION = Object.freeze({
        UP: 1,
        LEFT: 2,
        DOWN: 3,
        RIGHT: 4
    });

    Game.SNAKE_VEL = Object.freeze({
        UP: createVector(0, -1),
        LEFT: createVector(-1, 0),
        DOWN: createVector(0, 1),
        RIGHT: createVector(1, 0)
    });
};

Game.Snake = class {
    constructor(gameController) {
        this.gameController = gameController;
        this.direction = Game.SNAKE_DIRECTION.LEFT;
        const startX = this.gameController.width / 2;
        const startY = this.gameController.height / 2;
        this.startPos = createVector(startX, startY);
        this.body = [this.startPos];
        this.justEaten = false;

    };

    eat(food) {
        const head = this.body[0].copy();
        if (food.pos.x == head.x && food.pos.y == head.y) {
          this.justEaten = true;
          return true;
        }
        return false;
    };

    die() {
        console.log("DIE");
    };

    update() {
        if(this.justEaten) {
          const tail = this.body[this.body.length - 1].copy();
          this.body.push(tail);
          this.justEaten = false;
        }

        for(let i = this.body.length - 1; i > 0; i --) {
          const section = this.body[i - 1].copy();
          this.body[i] = section;
        }

        let nextPos = this.body[0];

        if(this.direction == Game.SNAKE_DIRECTION.UP) {
          nextPos.add(Game.SNAKE_VEL.UP);
          if (nextPos.y < 0) {
            nextPos.y = this.gameController.height - 1;
          }
        } else if(this.direction == Game.SNAKE_DIRECTION.LEFT) {
          nextPos.add(Game.SNAKE_VEL.LEFT);
          if (nextPos.x < 0) {
            nextPos.x = this.gameController.width - 1;
          }
        } else if(this.direction == Game.SNAKE_DIRECTION.DOWN) {
          nextPos.add(Game.SNAKE_VEL.DOWN);
          if (nextPos.y >=  this.gameController.height) {
            nextPos.y = 0;
          }
        } else if(this.direction == Game.SNAKE_DIRECTION.RIGHT) {
          nextPos.add(Game.SNAKE_VEL.RIGHT);
          if (nextPos.x >= this.gameController.width) {
            nextPos.x = 0;
          }
        }

        //check if body crosses itself
        for (let i = this.body.length - 1; i > 0; i --) {
          const section = this.body[i];
          if (section.x == nextPos.x && section.y == nextPos.y) {
            this.die();
            break;
          }
        }

        this.body[0] = nextPos;
    };

    draw() {
        push();
        const scale = this.gameController.scale;
        for (let i = this.body.length - 1; i >= 0; i --) {
          const section = this.body[i];
          const grey = floor(map(i, 0, this.body.length, 255, 50));
          fill(grey);
          rect(section.x * scale, section.y * scale, scale, scale);
        }

        pop();
    };
};


