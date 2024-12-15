/*******************************************************************************
 *
 *  @file obstacle.js A file with the obstacle implementation
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

Game.Obstacle = class {
    constructor(gameController, x, y, w=1, h=1) {
        // TODO: check input params are correct types
        this.gameController = gameController;
        this.pos = createVector(x, y);
        this.width = w;
        this.height = h;
    };

    contains(location) {
        // TODO: check input params are correct types
        if(location.x < this.pos.x || location.x >= (this.pos.x + this.width)) {
            return false;
        }

        if(location.y < this.pos.y || location.y >= (this.pos.y + this.height)) {
            return false;
        }

        return true;
    };

    draw() {
        push();
        fill(170, 10, 10);
        const scale = this.gameController.scale;
        for(let x = 0; x < this.width; x ++) {
            for(let y = 0; y < this.height; y++) {
                rect((this.pos.x + x) * scale,
                    (this.pos.y + y) * scale,
                    scale, scale);
            }
        }
        pop();
    };
};
