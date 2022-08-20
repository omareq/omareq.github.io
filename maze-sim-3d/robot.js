/*******************************************************************************
 *
 *  @file robot.js A class containing a robot object
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


let speedUp = 3;

class RescueKit {
    constructor(pos, kitSize) {
        this.pos = pos;
        this.kitSize = kitSize;
        this.kitNum = 1;
    }

    incrementKitNum() {
        this.kitNum += 1;
        return this.kitNum;
    }

    show() {
        push();
        fill(0, 255, 0);
        translate(this.pos.x, this.pos.y, 2);
        box(this.kitSize, this.kitSize, 2);
        push();
        translate(0,0, 2);
        textSize(this.kitSize);
        textAlign(CENTER, CENTER);
        fill(0);
        text(str(this.kitNum), 0 , 0);
        pop();
        pop();
    }
}

class Robot {
    constructor(pos, gridSize) {
        this.pos = pos;
        this.gridSize = gridSize;
        this.breadth = 0.6 * this.gridSize;
        this.depth = 0.2 * this.gridSize;
        this.bearing = 180;
        this.rescueKits = [];
    }

    setMaze(maze) {
        this.maze = maze;
    }

    getX() {
        return int(this.pos.x);
    }

    getY() {
        return int(this.pos.y);
    }

    getZ() {
        return 0;
    }

    getBearing() {
        if(this.bearing == 0) {
            return "north";
        } else if (this.bearing == 90) {
            return "east";
        } else if (this.bearing == 180) {
            return "south";
        } else if (this.bearing == 270) {
            return "west";
        }
    }

    hasWallFront() {
        if(this.bearing == 0) {
            return this.maze.hasWall(this.pos, "north");
        } else if (this.bearing == 90) {
            return this.maze.hasWall(this.pos, "east" );
        } else if (this.bearing == 180) {
            return this.maze.hasWall(this.pos, "south");
        } else if (this.bearing == 270) {
            return this.maze.hasWall(this.pos, "west" );
        }
    }

    hasWallLeft() {
        if(this.bearing == 0) {
            return this.maze.hasWall(this.pos, "west" );
        } else if (this.bearing == 90) {
            return this.maze.hasWall(this.pos, "north");
        } else if (this.bearing == 180) {
            return this.maze.hasWall(this.pos, "east" );
        } else if (this.bearing == 270) {
            return this.maze.hasWall(this.pos, "south");
        }
    }

    hasWallBack() {
        if(this.bearing == 0) {
            return this.maze.hasWall(this.pos, "south");
        } else if (this.bearing == 90) {
            return this.maze.hasWall(this.pos, "west" );
        } else if (this.bearing == 180) {
            return this.maze.hasWall(this.pos, "north");
        } else if (this.bearing == 270) {
            return this.maze.hasWall(this.pos, "east" );
        }
    }

    hasWallRight() {
        if(this.bearing == 0) {
            return this.maze.hasWall(this.pos, "east" );
        } else if (this.bearing == 90) {
            return this.maze.hasWall(this.pos, "south");
        } else if (this.bearing == 180) {
            return this.maze.hasWall(this.pos, "west" );
        } else if (this.bearing == 270) {
            return this.maze.hasWall(this.pos, "north");
        }
    }

    checkLeftVisit() {
        if(this.bearing == 0) {
            // x-1
            return this.maze.getVisit(createVector(this.pos.x - 1, this.pos.y));
        } else if (this.bearing == 90) {
            // y-1
            return this.maze.getVisit(createVector(this.pos.x, this.pos.y - 1));
        } else if (this.bearing == 180) {
            // x+1
            return this.maze.getVisit(createVector(this.pos.x + 1, this.pos.y));
        } else if (this.bearing == 270) {
            // y+1
            return this.maze.getVisit(createVector(this.pos.x, this.pos.y + 1));
        }
    }

    checkFrontVisit() {
        if(this.bearing == 0) {
            // y-1
            return this.maze.getVisit(createVector(this.pos.x, this.pos.y - 1));
        } else if (this.bearing == 90) {
            // x+1
            return this.maze.getVisit(createVector(this.pos.x + 1, this.pos.y));
        } else if (this.bearing == 180) {
            // y+1
            return this.maze.getVisit(createVector(this.pos.x, this.pos.y + 1));
        } else if (this.bearing == 270) {
            // x-1
            return this.maze.getVisit(createVector(this.pos.x - 1, this.pos.y));
        }
    }

    checkBackVisit() {
        if(this.bearing == 0) {
            // y+1
            return this.maze.getVisit(createVector(this.pos.x, this.pos.y + 1));
        } else if (this.bearing == 90) {
            // x-1
            return this.maze.getVisit(createVector(this.pos.x - 1, this.pos.y));
        } else if (this.bearing == 180) {
            // y-1
            return this.maze.getVisit(createVector(this.pos.x, this.pos.y - 1));
        } else if (this.bearing == 270) {
            // x+1
            return this.maze.getVisit(createVector(this.pos.x + 1, this.pos.y));
        }
    }

    checkRightVisit() {
        if(this.bearing == 0) {
            // x+1
            return this.maze.getVisit(createVector(this.pos.x + 1, this.pos.y));
        } else if (this.bearing == 90) {
            // y+1
            return this.maze.getVisit(createVector(this.pos.x, this.pos.y + 1));
        } else if (this.bearing == 180) {
            // x-1
            return this.maze.getVisit(createVector(this.pos.x - 1, this.pos.y));
        } else if (this.bearing == 270) {
            // y-1
            return this.maze.getVisit(createVector(this.pos.x, this.pos.y - 1));
        }
    }

    checkLeftOrder() {
        if(this.bearing == 0) {
            // x-1
            return this.maze.getOrder(createVector(this.pos.x - 1, this.pos.y));
        } else if (this.bearing == 90) {
            // y-1
            return this.maze.getOrder(createVector(this.pos.x, this.pos.y - 1));
        } else if (this.bearing == 180) {
            // x+1
            return this.maze.getOrder(createVector(this.pos.x + 1, this.pos.y));
        } else if (this.bearing == 270) {
            // y+1
            return this.maze.getOrder(createVector(this.pos.x, this.pos.y + 1));
        }
    }

    checkFrontOrder() {
        if(this.bearing == 0) {
            // y-1
            return this.maze.getOrder(createVector(this.pos.x, this.pos.y - 1));
        } else if (this.bearing == 90) {
            // x+1
            return this.maze.getOrder(createVector(this.pos.x + 1, this.pos.y));
        } else if (this.bearing == 180) {
            // y+1
            return this.maze.getOrder(createVector(this.pos.x, this.pos.y + 1));
        } else if (this.bearing == 270) {
            // x-1
            return this.maze.getOrder(createVector(this.pos.x - 1, this.pos.y));
        }
    }

    checkBackOrder() {
        if(this.bearing == 0) {
            // y+1
            return this.maze.getOrder(createVector(this.pos.x, this.pos.y + 1));
        } else if (this.bearing == 90) {
            // x-1
            return this.maze.getOrder(createVector(this.pos.x - 1, this.pos.y));
        } else if (this.bearing == 180) {
            // y-1
            return this.maze.getOrder(createVector(this.pos.x, this.pos.y - 1));
        } else if (this.bearing == 270) {
            // x+1
            return this.maze.getOrder(createVector(this.pos.x + 1, this.pos.y));
        }
    }

    checkRightOrder() {
        if(this.bearing == 0) {
            // x+1
            return this.maze.getOrder(createVector(this.pos.x + 1, this.pos.y));
        } else if (this.bearing == 90) {
            // y+1
            return this.maze.getOrder(createVector(this.pos.x, this.pos.y + 1));
        } else if (this.bearing == 180) {
            // x-1
            return this.maze.getOrder(createVector(this.pos.x - 1, this.pos.y));
        } else if (this.bearing == 270) {
            // y-1
            return this.maze.getOrder(createVector(this.pos.x, this.pos.y - 1));
        }
    }

    turnLeft() {
        let endBearing = this.bearing - 90;
        let pError = 90;
        while(abs(this.bearing - endBearing) > 0.01) {
            let error = this.bearing - endBearing;
            let kp = 0.3 * error;
            let kd = 0.15 * pError;
            let turnIncrement = kp - kd;
            this.bearing -= turnIncrement;
            pError = error;
            delay(10 / speedUp);
        }

        this.bearing = endBearing;
        this.bearing %= 360;
    }

    turnRight() {
        let endBearing = this.bearing + 90;
        let pError = 90;

        while(abs(this.bearing - endBearing) > 0.01) {
            let error = this.bearing - endBearing;
            let kp = 0.3 * error;
            let kd = 0.15 * pError;
            let turnIncrement = kp - kd;
            this.bearing -= turnIncrement;
            pError = error;
            delay(10 / speedUp);
        }

        this.bearing = endBearing;
        this.bearing %= 360;
    }

    moveForward() {
        // startPos = this.pos
        let kpTile = 3.5;
        this.maze.incrementVist(this.pos);
        this.maze.incrementOrder(this.pos);
        if(this.hasWallFront()) {
            return false;
        }
        if(this.bearing == 0) {
            this.posIncrement = createVector(0, -0.02);
            this.endPos = createVector(this.pos.x, this.pos.y - 1);
        } else if (this.bearing == 90) {
            this.posIncrement = createVector(0.02, 0);
            this.endPos = createVector(this.pos.x + 1, this.pos.y);
        } else if (this.bearing == 180) {
            this.posIncrement = createVector(0, 0.02);
            this.endPos = createVector(this.pos.x, this.pos.y + 1);
        } else if (this.bearing == 270) {
            this.posIncrement = createVector(-0.02, 0);
            this.endPos = createVector(this.pos.x - 1, this.pos.y);
        }

        while(true) {
            this.pos.add(this.posIncrement);
            // delay(10/speedUp)
            let distance = dist(this.pos.x, this.pos.y, this.endPos.x, this.endPos.y);
            if(distance < 0.05) {
                this.pos.x = this.endPos.x;
                this.pos.y = this.endPos.y;
                break;
            }
            delay(int(1 / (distance * speedUp) * kpTile));
        }
        this.pos = this.endPos;
        delay(250 / speedUp);
        return true;
    }

    hasVictim(direction) {
        return this.maze.hasVictim(this.pos, direction);
    }

    dropRescueKit(direction) {
        delay(1500 / speedUp);
        let xOffset = 0;
        let yOffset = 0;

        if(direction == "north") {
            yOffset = -this.gridSize / 4;
        } else if (direction == "east") {
            xOffset = this.gridSize / 4;
        } else if (direction == "south") {
            yOffset = this.gridSize / 4;
        } else if (direction == "west") {
            xOffset = -this.gridSize / 4;
        }

        let kitPos = createVector(this.pos.x * this.gridSize + xOffset,
            this.pos.y * this.gridSize + yOffset);
        let kitSize = this.gridSize / 8;
        let newKit = RescueKit(kitPos, kitSize);

        for(let i = 0; i < this.rescueKits.length; i++) {
            const xMatch = this.rescueKits[i].pos.x == newKit.pos.x;
            const yMatch = this.rescueKits[i].pos.y == newKit.pos.y;
            if(xMatch && yMatch) {
                kit.incrementKitNum();
                return;
            }
        }
        this.rescueKits.append(newKit);

        console.log("Dropped rescue kit: (" + str(this.pos.x) + ", " +
            str(this.pos.y) + ") " + direction);
    }

    showRescueKits() {
        for(let i = 0; i < this.rescueKits.length; i++) {
            this.rescueKits[i].show();
        }
    }

    show() {
        this.showRescueKits();
        push();
        translate(this.pos.x * this.gridSize, this.pos.y * this.gridSize, this.depth/2 + 5);
        rotateZ(radians(this.bearing));
        fill(150);
        stroke(0);
        box(this.breadth, this.breadth, this.depth);
        stroke(10);
        line(0,0,this.depth/2, 0, -this.breadth/2, this.depth/2);
        pop();
    }
}