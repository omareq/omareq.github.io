/*******************************************************************************
 *
 *  @file game.js A file with the game engine implementation
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

Game.SnakeGameEngine = class {
    constructor() {
        Game.snakeSetup();
        frameRate(10);
        this.height = 35;
        this.width = this.height;
        this.scale = height / this.height; // TODO: do this in a clever way
        this.snake = new Game.Snake(this);
        this.food = new Game.Food(this);
        this.obstacles = [];
        this.obstacles.push(new Game.Obstacle(this, 0, 0, 1, this.height));
        this.obstacles.push(new Game.Obstacle(this, this.width-1, 0, 1, this.height));
    };

    draw() {
        this.snake.draw();

        for(let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].draw();
        }

        this.food.draw();
    };

    generateNewFoodLocation() { // TODO: adjust so not on snake body
        let badLocation = true;
        while(badLocation) {
            this.food.newLocation();
            badLocation = false;
            for(let i = 0; i < this.obstacles.length; i++) {
                if(this.obstacles[i].contains(this.food.pos)) {
                    badLocation = true;
                    console.log("Bad food location moving");
                    break;
                }
            }
        }
    };

    update() {
        if(keyIsPressed) {
            if (keyIsDown(LEFT_ARROW) || key.toLowerCase() == "a") {
                this.snake.setDirection(Game.SNAKE_DIRECTION.LEFT);
            } else if (keyIsDown(RIGHT_ARROW) || key.toLowerCase() == "d") {
                this.snake.setDirection(Game.SNAKE_DIRECTION.RIGHT);
            } else if (keyIsDown(UP_ARROW) || key.toLowerCase() == "w") {
                this.snake.setDirection(Game.SNAKE_DIRECTION.UP);
            } else if (keyIsDown(DOWN_ARROW) || key.toLowerCase() == "s") {
                this.snake.setDirection(Game.SNAKE_DIRECTION.DOWN);
            }
        }

        this.snake.update();

        if(this.snake.eat(this.food)) {
            this.generateNewFoodLocation();
        }

        if(this.snake.collide(this.obstacles)) {
            this.snake.die();
        }

        this.draw();
    };
};