/*******************************************************************************
 *
 *  @file level.js A file with the level data and class
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 21-December-2024
 *  @link https://omareq.github.io/line-sim-3d/
 *  @link https://omareq.github.io/line-sim-3d/docs/
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

Game.CanvasRes = class {
    constructor(w, h, s) {
        this.width = w;
        this.height = h;
        this.scale = s;
    };
};

Game.Level = class {
    constructor(levelData) {
        // TODO: verify levelData
        this.height = levelData.height;
        this.width = levelData.width;
        this.scale = height / this.height;
        let res = new Game.CanvasRes(this.width, this.height, this.scale);

        const startPos = createVector(levelData.snakeX, levelData.snakeY);
        const startDir = levelData.snakeDir;
        this.snake = new Game.Snake(startPos, startDir, res);

        this.obstacles = [];
        let obstacleArea = 0;
        for(let i = 0; i < levelData.obstacles.length; i++) {
            this.obstacles.push(new Game.Obstacle(res,
                levelData.obstacles[i].x,
                levelData.obstacles[i].y,
                levelData.obstacles[i].width,
                levelData.obstacles[i].height
                ));

            obstacleArea += levelData.obstacles[i].width * levelData.obstacles[i].height;
        }

        this.freeArea = this.height * this.width - obstacleArea;
        this.food = new Game.Food(res);
        this.generateNewFoodLocation();
    };

    draw() {
        this.snake.draw();

        for(let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].draw();
        }

        this.food.draw();
    }

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

    complete() {
        if(this.snake.body.length >= 0.1 * this.freeArea) {
            return true;
        }
        return false;
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
            console.log("Percent Complete: ", this.snake.body.length / (0.1 * this.freeArea));
        }

        if(this.snake.collide(this.obstacles) || this.snake.lostLife) {
            this.snake.die();
            this.lostLife = true;
        }

        this.draw();
    }
};

Game.levelData = [];

Game.levelSetup = function() {
    Game.levelData.push({
        width: 35,
        height: 35,
        snakeX: 17,
        snakeY: 17,
        snakeDir: Game.SNAKE_DIRECTION.LEFT,
        obstacles: []
    });

    Game.levelData.push({
        width: 35,
        height: 35,
        snakeX: 17,
        snakeY: 17,
        snakeDir: Game.SNAKE_DIRECTION.UP,
        obstacles: [
            {x:0, y:0, width:1, height:35},
            {x:34, y:0, width:1, height:35}
        ]
    });

    Game.levelData.push({
        width: 35,
        height: 35,
        snakeX: 17,
        snakeY: 17,
        snakeDir: Game.SNAKE_DIRECTION.LEFT,
        obstacles: [
            {x:0, y:0, width:1, height:35},
            {x:34, y:0, width:1, height:35},
            {x:0, y:0, width:35, height:1},
            {x:0, y:34, width:35, height:1}
        ]
    });

    Game.levelData.push({
        width: 35,
        height: 35,
        snakeX: 17,
        snakeY: 17,
        snakeDir: Game.SNAKE_DIRECTION.LEFT,
        obstacles: [
            {x:5, y:5, width:5, height:5},
            {x:5, y:24, width:5, height:5},
            {x:24, y:5, width:5, height:5},
            {x:24, y:24, width:5, height:5}
        ]
    });

    Game.levelData.push({
        width: 35,
        height: 35,
        snakeX: 17,
        snakeY: 17,
        snakeDir: Game.SNAKE_DIRECTION.LEFT,
        obstacles: [
            {x:0, y:0, width:1, height:35},
            {x:34, y:0, width:1, height:35},
            {x:0, y:0, width:35, height:1},
            {x:0, y:34, width:35, height:1},
            {x:5, y:5, width:5, height:5},
            {x:5, y:24, width:5, height:5},
            {x:24, y:5, width:5, height:5},
            {x:24, y:24, width:5, height:5}
        ]
    });

    Game.levelData.push({
        width: 35,
        height: 35,
        snakeX: 5,
        snakeY: 5,
        snakeDir: Game.SNAKE_DIRECTION.RIGHT,
        obstacles: [
            {x:7, y:17, width:21, height:1},
            {x:17, y:7, width:1, height:21}
        ]
    });

    Game.levelData.push({
        width: 35,
        height: 35,
        snakeX: 5,
        snakeY: 5,
        snakeDir: Game.SNAKE_DIRECTION.RIGHT,
        obstacles: [
            {x:0, y:0, width:1, height:35},
            {x:34, y:0, width:1, height:35},
            {x:0, y:0, width:35, height:1},
            {x:0, y:34, width:35, height:1},
            {x:7, y:17, width:21, height:1},
            {x:17, y:7, width:1, height:21}
        ]
    });

};
