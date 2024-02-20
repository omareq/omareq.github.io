/*******************************************************************************
 *
 *  @file wall.js A class containing a wall maze object
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 19-August-2022
 *  @link https://omareq.github.io/maze-sim-3d/
 *  @link https://omareq.github.io/maze-sim-3d/docs/
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

class Wall {
    constructor(isWall, victim, gridSize) {
        this.isWall = isWall;
        // right now victim is true false later on it will be a string
        this.victim = victim;
        this.gridSize = gridSize;
        this.wallHeight = gridSize / 2;
    }

    resetWall() {
        this.isWall = False;
        this.victim = False;
    }

    setIsWall(isWall) {
        this.isWall = isWall;
    }

    getIsWall() {
        return this.isWall;
    }

    setVictim(victim) {
        this.victim = victim;
    }

    hasVictim() {
        return this.victim;
    }

    show(showWall=false) {
        if(this.isWall) {
            push();
            translate(0, 0, this.wallHeight / 2 + 2);
            fill(255);
            stroke(0);
            if(showWall) {
                box(this.gridSize, 1, this.wallHeight);
            }
            if (!(this.victim == 0)) {
                fill(255, 0, 0);
                push();
                translate(0, 1, this.wallHeight/ 4);
                const alphaVal = map(millis() % 2000, 0, 2000, 0, 255);
                fill(255, alphaVal, alphaVal);
                box(this.wallHeight/3, 1, this.wallHeight/3);
                push();
                translate(0,0, this.wallHeight);
                box(this.wallHeight / 4, 1, this.wallHeight / 4);
                pop();
                line(0,0,0,0,0,this.wallHeight);
                pop();
            }
            fill(255);
            pop();
        }
    }
}