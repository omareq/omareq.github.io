/*******************************************************************************
 *
 *  @file room.js A class containing a room maze object
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

class Room {
    constructor(mapX, mapY, gridSize) {
        this.mapX = mapX;
        this.mapY = mapY;
        this.gridSize = gridSize;
        this.tileCount = 0;
        this.grid = [];

        // let emptyTile = Tile(false, false, false, false, this.gridSize);
        for(let x = 0; x < this.mapX; x++) {
            let emptyCol= []
            for(let y = 0; y < this.mapY; y++) {
                emptyCol.push(new Tile(false, false, false, false,
                    this.gridSize));
            }
            this.grid.push(emptyCol);
        }
    }

    hasWall(pos, direction) {
        const x = int(pos.x);
        const y = int(pos.y);
        return this.grid[x][y].hasWall(direction);
    }

    hasVictim(pos, direction) {
        const x = int(pos.x);
        const y = int(pos.y);;
        return this.grid[x][y].hasVictim(direction);
    }

    show() {
        for(let y = 0; y < this.mapY; y++) {
            for(let x = 0; x < this.mapX; x++) {
                push();
                translate(x * this.gridSize , y * this.gridSize,0);
                this.grid[x][y].show();
                pop();
            }
        }
    }

    incrementVist(pos) {
        const x = int(pos.x);
        const y = int(pos.y);
        this.grid[x][y].incrementVist();
    }

    resetVisit(pos) {
        const x = int(pos.x);
        const y = int(pos.y);
        this.grid[x][y].resetVist();
    }

    getVisit(pos) {
        const x = int(pos.x);
        const y = int(pos.y);
        return this.grid[x][y].getVisit();
    }

    incrementOrder(pos) {
        const x = int(pos.x);
        const y = int(pos.y);
        const currentOrder = this.grid[x][y].getOrder();

        if(currentOrder != 0) {
            return;
        }

        this.tileCount = this.tileCount + 1;
        this.grid[x][y].setOrder(this.tileCount);
        // console.log("Tile Count: " + str(this.tileCount));
    }

    resetOrder(pos) {
        const x = int(pos.x);
        const y = int(pos.y);
        this.grid[x][y].resetOrder()
    }

    getOrder(pos) {
        const x = int(pos.x);
        const y = int(pos.y);
        return this.grid[x][y].getOrder()
    }


    randomise(probability) {
        for(let y = 0; y < this.mapY; y++) {
            for(let x = 0; x < this.mapX; x++) {
                let randNorth = ! boolean(int(random(0, probability)));
                let randEast  = ! boolean(int(random(0, probability)));
                let randSouth = ! boolean(int(random(0, probability)));
                let randWest  = ! boolean(int(random(0, probability)));

                if(x==0 || this.grid[x - 1][y].hasWall("east")) {
                    randWest = true;
                }

                if(x==(this.mapX - 1)) {
                    randEast = true;
                }

                if(y==0 || this.grid[x][y-1].hasWall("south")) {
                       randNorth = true;
                   }

                if(y==(this.mapY - 1)) {
                    randSouth = true;
                }

                if(y > 0 && randNorth) {
                    this.grid[x][y-1].addWall("south");
                }

                if(x > 0 && randWest) {
                    this.grid[x-1][y].addWall("east");
                }

                let randomTile = new Tile(randNorth, randEast,
                    randSouth, randWest,
                    this.gridSize);
                this.grid[x][y] = randomTile;
            }
        }

        for(let y = 0; y < this.mapY; y++) {
            for(let x = 0; x < this.mapX; x++) {
                this.grid[x][y].randomiseVictims(probability);
            }
        }
        this.grid[0][0].setAsSilver();
    }
}
