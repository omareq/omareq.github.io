/*******************************************************************************
 *
 *  @file tile.js A class containing a tile maze object
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

class Tile {
    constructor(north, east, south, west, gridSize) {
        this.north = new Wall(north, false, gridSize);
        this.east = new Wall(east , false, gridSize);
        this.south = new Wall(south, false, gridSize);
        this.west = new Wall(west , false, gridSize);
        this.gridSize = gridSize;
        this.visit = 0;
        this.order = 0;
        this.isBlack = false;
        this.isSilver = false;
    }

    resetTile() {
        this.resetIsSilver();
        this.resetIsBlack();
        this.resetVictims();
        this.resetVisit();
        this.resetOrder();
    }

    setAsSilver() {
        if(!this.isBlack) {
            this.resetVictims();
            this.isSilver = true;
            return true;
        }
        return false;
    }

    getIsSilver() {
        return this.isSilver;
    }

    setAsBlack() {
        if(! this.isSilver) {
            this.resetVictims();
            this.isBlack = true;
            return true;
        }
        return false;
    }

    getIsBlack() {
        return this.isBlack;
    }

    resetIsSilver() {
        this.isSilver = false;
    }

    resetIsBlack() {
        this.isBlack = false;
    }

    randomiseVictims(probability) {
        const randNorth = this.north.getIsWall() && ! boolean(int(random(0, probability)));
        const randEast = this.east.getIsWall() && ! boolean(int(random(0, probability)));
        const randSouth = this.south.getIsWall() && ! boolean(int(random(0, probability)));
        const randWest = this.west.getIsWall() && ! boolean(int(random(0, probability)));

        this.north.setVictim(randNorth);
        this.east.setVictim(randEast);
        this.south.setVictim(randSouth);
        this.west.setVictim(randWest);
    }

    resetVictims() {
        this.north.setVictim(false);
        this.east.setVictim(false);
        this.south.setVictim(false);
        this.west.setVictim(false);
    }


    getVisit() {
        return this.visit;
    }

    incrementVist() {
        this.visit += 1;
        return this.visit;
    }

    resetVisit() {
        this.vist = 0;
    }

    setOrder(newVisitOrder) {
        this.order = newVisitOrder;
    }

    getOrder() {
        return this.order;
    }

    resetOrder() {
        this.order = 0;
    }

    hasVictim(direction) {
        if(direction == "north") {
            return this.north.hasVictim();
        }
        if(direction == "east") {
            return this.east.hasVictim();
        }
        if(direction == "south") {
            return this.south.hasVictim();
        }
        if(direction == "west") {
            return this.west.hasVictim();
        }
    }

    hasWall(direction) {
        if(direction == "north") {
            return this.north.getIsWall();
        }
        if(direction == "east") {
            return this.east.getIsWall();
        }
        if(direction == "south") {
            return this.south.getIsWall();
        }
        if(direction == "west") {
            return this.west.getIsWall();
        }
    }

    addWall(direction) {
        if(direction == "north") {
            this.north.setIsWall(true);
            return;
        }
        if(direction == "east") {
            this.east.setIsWall(true);
            return;
        }
        if(direction == "south") {
            this.south.setIsWall(true);
            return;
        }
        if(direction == "west") {
            this.west.setIsWall(true);
            return;
        }
    }

    addAllWalls() {
        this.north.setIsWall(true);
        this.east.setIsWall(true);
        this.south.setIsWall(true);
        this.west.setIsWall(true);
    }

    removeWall(direction) {
        if(direction == "north") {
            this.north.resetWall();
            return;
        }
        if(direction == "east") {
            this.east.resetWall();
            return;
        }
        if(direction == "south") {
            this.south.resetWall();
            return;
        }
        if(direction == "west") {
            this.west.resetWall();
            return;
        }
    }

    removeAllWalls() {
        this.north.resetWall();
        this.east.resetWall();
        this.south.resetWall();
        this.west.resetWall();
    }

    show() {
        let pg = createGraphics(this.gridSize, this.gridSize);

        const grey = 225;
        const black = 0;
        const white = 255;
        push();
        // if(this.isBlack) {
        //     pg.background(black);
        //     fill(black);
        // } else if(this.isSilver) {
        //     fill(grey);
        //     pg.background(grey);
        // } else {
        //     fill(white);
        //     pg.background(white);
        // }

        stroke(white);
        rect(0,0,this.gridSize, this.gridSize);

        if(this.north.getIsWall()) {
            push();
            translate(0, -this.gridSize / 2, 0);
            this.north.show();
            pop();
        }
        if(this.east.getIsWall()) {
            push();
            translate(this.gridSize / 2, 0, 0);
            rotateZ(HALF_PI);
            this.east.show();
            pop();
        }
        if(this.south.getIsWall()) {
            push();
            translate(0, this.gridSize / 2, 0);
            rotateZ(PI);
            this.south.show();
            pop();
        }
        if(this.west.getIsWall()) {
            push();
            translate(-this.gridSize / 2, 0, 0);
            rotateZ(3 * HALF_PI);
            this.west.show();
            pop();
        }


        if(this.visit > 0) {
            push();
            translate(0, 0, 1);
            pg.textSize(this.gridSize / 2);
            pg.textAlign(CENTER, CENTER);

            if(this.isBlack) {
                pg.fill(white);
            } else {
                pg.fill(black);
            }

            pg.text(str(this.visit), this.gridSize / 2, this.gridSize / 2);
            pop();
        }

        if(this.order > 0) {
            push();
            translate(0, 0, 2);
            pg.textSize(this.gridSize / 4);
            pg.textAlign(CENTER, CENTER);

            if(this.isBlack) {
                pg.fill(white);
            } else {
                pg.fill(black);
            }

            pg.text(str(this.order), this.gridSize / 4, this.gridSize / 4);
            pop();
        }
        translate(0, 0, 1);
        texture(pg);
        noStroke();

        plane(this.gridSize - 4);
        pop();
    }
}