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
        this.mazeGeometry = undefined;

        // let emptyTile = Tile(false, false, false, false, this.gridSize);
        for(let x = 0; x < this.mapX; x++) {
            let emptyCol= [];
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
        const y = int(pos.y);
        return this.grid[x][y].hasVictim(direction);
    }

    batchDrawWallsNorth() {
        let wallHeight = this.gridSize / 2;

        for(let y = 0; y < this.mapY; y++) {
            for(let x = 0; x < this.mapX; x++) {
                let totalWallLengthNorth = 0;
                let nextX = x;
                for(let i = x; i < this.mapX; i++) {
                    if(this.grid[i][y].hasWall("north") &&
                        !this.grid[i][y].isCulled) {
                        totalWallLengthNorth++;
                    } else {
                        nextX = i;
                        break;
                    }
                }
                if(totalWallLengthNorth == 0) {
                    continue;
                }

                push();
                stroke(0);
                translate((x + (totalWallLengthNorth) / 2) * this.gridSize,
                    y * this.gridSize, 0);
                translate(0,-this.gridSize / 2, wallHeight / 2 + 2);
                translate(-this.gridSize / 2, 0, 0);
                box(this.gridSize * totalWallLengthNorth, 1, wallHeight);
                pop();

                if(totalWallLengthNorth + x >= this.mapX) {
                    break;
                }
                x = nextX;
            }
        }
    }

    batchDrawWallsEast() {
        let wallHeight = this.gridSize / 2;

        for(let x = this.mapX - 1; x < this.mapX; x++) {
            for(let y = 0; y < this.mapY; y++) {

                let totalWallLengthEast = 0;
                let nextY = y;
                for(let i = y; i < this.mapY; i++) {
                    if(this.grid[x][i].hasWall("east") &&
                        !this.grid[x][i].isCulled) {
                        totalWallLengthEast++;
                    } else {
                        nextY = i;
                        break;
                    }
                }
                if(totalWallLengthEast == 0) {
                    continue;
                }

                push();
                stroke(0);
                translate(x * this.gridSize,
                    (y + (totalWallLengthEast) / 2) * this.gridSize, 0);
                translate(this.gridSize / 2,
                    -this.gridSize / 2,
                    wallHeight / 2 + 2);
                box(1, this.gridSize * totalWallLengthEast, wallHeight);
                pop();

                if(totalWallLengthEast + y >= this.mapY) {
                    break;
                }
                y = nextY;
            }
        }
    }

    batchDrawWallsSouth() {
        let wallHeight = this.gridSize / 2;

        for(let y = this.mapY - 1; y < this.mapY; y++) {
            for(let x = 0; x < this.mapX; x++) {

                let totalWallLengthSouth = 0;
                let nextX = x;
                for(let i = x; i < this.mapX; i++) {
                    if(this.grid[i][y].hasWall("south") &&
                        !this.grid[i][y].isCulled) {
                        totalWallLengthSouth++;
                    } else {
                        nextX = i;
                        break;
                    }
                }
                if(totalWallLengthSouth == 0) {
                    continue;
                }

                push();
                stroke(0);
                translate((x + (totalWallLengthSouth) / 2) * this.gridSize,
                    y * this.gridSize, 0);
                translate(0, this.gridSize / 2, wallHeight / 2 + 2);
                translate(-this.gridSize / 2, 0, 0);
                box(this.gridSize * totalWallLengthSouth, 1, wallHeight);
                pop();

                if(totalWallLengthSouth + x >= this.mapX) {
                    break;
                }
                x = nextX;
            }
        }
    }

    batchDrawWallsWest() {
        let wallHeight = this.gridSize / 2;

        for(let x = 0; x < this.mapX; x++) {
            for(let y = 0; y < this.mapY; y++) {

                let totalWallLengthWest = 0;
                let nextY = y;
                for(let i = y; i < this.mapY; i++) {
                    if(this.grid[x][i].hasWall("west") &&
                        !this.grid[x][i].isCulled) {
                        totalWallLengthWest++;
                    } else {
                        nextY = i;
                        break;
                    }
                }
                if(totalWallLengthWest == 0) {
                    continue;
                }

                push();
                stroke(0);
                translate(x * this.gridSize,
                    (y + (totalWallLengthWest) / 2) * this.gridSize, 0);
                translate(-this.gridSize / 2,
                    -this.gridSize / 2,
                    wallHeight / 2 + 2);
                box(1, this.gridSize * totalWallLengthWest, wallHeight);
                pop();

                if(totalWallLengthWest + y >= this.mapY) {
                    break;
                }

                // if(this.grid[x][nextY].isCulled) {
                //     break;
                // }
                y = nextY;
            }
        }
    }


    batchDrawWalls() {
        this.batchDrawWallsNorth();
        this.batchDrawWallsEast();
        this.batchDrawWallsSouth();
        this.batchDrawWallsWest();
    }

    fovCulling() {
        // eslint-disable-next-line no-underscore-dangle
        const hFov = myCamera._curElement.cameraFOV * 180 / PI;
        // eslint-disable-next-line no-underscore-dangle
        const vFov = hFov / myCamera._curElement.cameraAspect;
        const fovLimit = 1.15 * sqrt(0.25 * hFov * hFov + 0.25 * vFov * vFov);

        const centreX = robot.pos.x * gridSize;
        const centreY = robot.pos.y * gridSize;
        const centreZ = 0;

        const unit = gridSize * zoom;
        const camX = centreX + unit * unitX;
        const camY = centreY + unit * unitY;
        const camZ = centreZ + 1.5 * unit;

        const robotVector = createVector(centreX - camX,
            centreY - camY,
            centreZ - camZ);
        const absRobVec = robotVector.mag();

        for(let y = 0; y < this.mapY; y++) {
            for(let x = 0; x < this.mapX; x++) {
                const tileVector = createVector(x * this.gridSize - camX,
                    y * this.gridSize - camY,
                    0 - camZ);

                const absTileVec = tileVector.mag();
                const dotProduct = robotVector.dot(tileVector);
                const angleRad = acos(dotProduct / (absRobVec * absTileVec));
                const angle = degrees(angleRad);


                this.grid[x][y].isCulled = angle > fovLimit;
            }
        }
    }

    generateMazeGeometry(showWall=false) {
        beginGeometry();
        push();
        this.batchDrawWalls();
        pop();

        const showVictim = true;
        for(let y = 0; y < this.mapY; y++) {
            for(let x = 0; x < this.mapX; x++) {
                push();
                translate(x * this.gridSize , y * this.gridSize,0);
                this.grid[x][y].show(showWall, showVictim);
                pop();
            }
        }

        this.mazeGeometry = endGeometry();
    }

    show(showWall=false) {
        stroke(255);
        fill(255);
        push();
        translate(0.5 * this.mapX * this.gridSize - 0.5 * this.gridSize,
            0.5 * this.mapY * this.gridSize - 0.5 * this.gridSize, 0);
        rect(0,0, this.mapX * this.gridSize, this.mapY * this.gridSize);
        pop();

        if(this.mazeGeometry==undefined) {
            this.generateMazeGeometry(showWall);
        }
// The weakness of the geometry object is that FOV culling is no longer possible
// once the object has been created that is it.  this means that at larger map
// sizes there is wasted computation on rendering portions of the maze that are
// outside of the cameras FOV.  This limits the maximum map size that can be
// accommodated.
// TODO: FOV cull the faces in the geometry object or split into sections
        model(this.mazeGeometry);

        this.fovCulling();
        for(let y = 0; y < this.mapY; y++) {
            for(let x = 0; x < this.mapX; x++) {
                push();
                translate(x * this.gridSize , y * this.gridSize,0);
                this.grid[x][y].show(showWall);
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
        this.grid[x][y].resetOrder();
    }

    getOrder(pos) {
        const x = int(pos.x);
        const y = int(pos.y);
        return this.grid[x][y].getOrder();
    }


    randomise(probability) {
        for(let y = 0; y < this.mapY; y++) {
            for(let x = 0; x < this.mapX; x++) {
                let randNorth = ! boolean(int(random(0, probability)));
                let randEast = ! boolean(int(random(0, probability)));
                let randSouth = ! boolean(int(random(0, probability)));
                let randWest = ! boolean(int(random(0, probability)));

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

                // make first cell clear of walls
                if(x==0 && y==0) {
                    randSouth = false;
                    randEast = false;
                }
                if(x==1 &&y==0) {
                    randWest = false;
                }
                if(x==0 &&y==1) {
                    randNorth = false;
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
