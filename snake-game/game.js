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
        Game.levelSetup();
        frameRate(10);
        this.currentLevelIndex = 0;
        const levelData = Game.levelData[this.currentLevelIndex];
        this.currentLevel = new Game.Level(levelData);

        this.height = this.currentLevel.height;
        this.width = this.currentLevel.width;
        this.scale = this.currentLevel.scale;

        this.playerLives = 3;
    };

    nextLevel() {
        this.currentLevelIndex++;
        if(this.currentLevelIndex >= Game.levelData.length) {
            this.currentLevelIndex = 0; // TODO: completed game
        }

        const levelData = Game.levelData[this.currentLevelIndex];
        this.currentLevel = new Game.Level(levelData);

        this.height = this.currentLevel.height;
        this.width = this.currentLevel.width;
        this.scale = this.currentLevel.scale;
    }

    draw() {
        this.currentLevel.draw();
    };

    update() {
        this.currentLevel.update();
        if(this.currentLevel.complete()) {
            this.nextLevel();
        }
        if(this.currentLevel.lostLife) {
            this.playerLives--;
            console.log("Player Lives: ", this.playerLives);
            if(this.playerLives < 1) {
                this.currentLevelIndex = -1;
                this.nextLevel();
                console.log("Out of Lives Game Over");
                this.playerLives = 3;
            }
            this.currentLevel.lostLife = false;
        }
    };
};