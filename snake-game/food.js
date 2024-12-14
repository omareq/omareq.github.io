/*******************************************************************************
 *
 *  @file food.js A file with the food implementation
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


Game.Food = class {
  constructor(gameController) {
    this.gameController = gameController;
    this.newLocation();
  };

  newLocation() { // TODO: adjust so that it is not on the snake body
    this.pos = createVector(floor(random(this.gameController.width)),
        floor(random(this.gameController.height)));
  };

  draw() {
    push();
    fill(0, 255, 0);
    const scale = this.gameController.scale;
    rect(this.pos.x * scale, this.pos.y * scale, scale, scale);
    pop();
  };
};