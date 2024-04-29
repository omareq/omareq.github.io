/*******************************************************************************
 *
 *  @file tile.js A file with the Tile class
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 15-March-2024
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
 * World Namespace Object
 */
var World = World || {};

World.gridSize = 200;

World.TileSetup = function() {
    World.lineThickness = World.gridSize / 10;
    World.maxInterLinePointDist = World.lineThickness / 4;
    World.LineConfigs = {};

    World.LineConfigs.blankLine = [];

    World.LineConfigs.verticalLine = [
                createVector(0.5, 0),
                createVector(0.5, 1)
                ];

    World.LineConfigs.halfLineUp = [
                createVector(0.5, 0),
                createVector(0.5, 0.5)
                ];

    World.LineConfigs.quarterLineUp = [
                createVector(0.5, 0),
                createVector(0.5, 0.25)
                ];

    World.LineConfigs.diagonalUpRight = [
                createVector(0.5, 0.0),
                createVector(1.0, 0.5)
                ];

    World.LineConfigs.quarterCircleUpLeft = [
                createVector(0.500, 0.000),
                createVector(0.492, 0.086),
                createVector(0.469, 0.171),
                createVector(0.433, 0.249),
                createVector(0.383, 0.321),
                createVector(0.321, 0.383),
                createVector(0.250, 0.433),
                createVector(0.171, 0.469),
                createVector(0.086, 0.492),
                createVector(0.000, 0.500)
        ];

    World.LineConfigs.zigZagVertical = [
                createVector(0.50, 0,0),
                createVector(0.50, 0.1),
                createVector(0.25, 0.2),
                createVector(0.50, 0.3),
                createVector(0.75, 0.4),
                createVector(0.50, 0.5),
                createVector(0.25, 0.6),
                createVector(0.50, 0.7),
                createVector(0.75, 0.8),
                createVector(0.50, 0.9),
                createVector(0.50, 1.0)
                ];

    // Lines
    /**************************************************************************/
    World.Lines = {};
    World.Lines.blankLine = new World.Line(World.LineConfigs.blankLine);
    World.Lines.verticalLine = new World.Line(World.LineConfigs.verticalLine);
    World.Lines.horizontalLine = World.Lines.verticalLine.copy().flipDiagonal();

    World.Lines.halfLineUp = new World.Line(World.LineConfigs.halfLineUp);
    World.Lines.halfLineDown = World.Lines.halfLineUp.copy().flipHorizontal();
    World.Lines.halfLineRight = World.Lines.halfLineDown.copy().flipDiagonal();
    World.Lines.halfLineLeft = World.Lines.halfLineRight.copy().flipVertical();

    World.Lines.quarterLineUp = new World.Line(World.LineConfigs.quarterLineUp);
    World.Lines.quarterLineDown = World.Lines.quarterLineUp.copy().flipHorizontal();
    World.Lines.quarterLineRight = World.Lines.quarterLineDown.copy().flipDiagonal();
    World.Lines.quarterLineLeft = World.Lines.quarterLineRight.copy().flipVertical();

    World.Lines.diagonalUpRight = new World.Line(World.LineConfigs.diagonalUpRight);
    World.Lines.diagonalUpLeft = World.Lines.diagonalUpRight.copy().flipVertical();
    World.Lines.diagonalDownLeft = World.Lines.diagonalUpLeft.copy().flipHorizontal();
    World.Lines.diagonalDownRight = World.Lines.diagonalUpRight.copy().flipHorizontal();

    World.Lines.quarterCircleUpLeft = new World.Line(World.LineConfigs.quarterCircleUpLeft);
    World.Lines.quarterCircleUpRight = World.Lines.quarterCircleUpLeft.copy().flipVertical();
    World.Lines.quarterCircleDownRight = World.Lines.quarterCircleUpRight.copy().flipHorizontal();
    World.Lines.quarterCircleDownLeft = World.Lines.quarterCircleUpLeft.copy().flipHorizontal();

    World.Lines.zigZagVertical = new World.Line(World.LineConfigs.zigZagVertical);
    World.Lines.zigZagHorizontal = World.Lines.zigZagVertical.copy().flipDiagonal();

    // Tiles
    /**************************************************************************/
    World.Tiles = {};
    World.Tiles.proxySubject = {};

    World.Tiles.proxySubject.blankLine = new World.Tile([World.Lines.blankLine.copy()]);
    World.Tiles.proxySubject.verticalLine = new World.Tile([World.Lines.verticalLine.copy()]);
    World.Tiles.proxySubject.horizontalLine = new World.Tile([World.Lines.horizontalLine.copy()]);
    World.Tiles.proxySubject.cross = new World.Tile([World.Lines.horizontalLine.copy(),
        World.Lines.verticalLine.copy()]);

    World.Tiles.proxySubject.halfLineUp = new World.Tile([World.Lines.halfLineUp.copy()]);
    World.Tiles.proxySubject.halfLineDown = new World.Tile([World.Lines.halfLineDown.copy()]);
    World.Tiles.proxySubject.halfLineRight = new World.Tile([World.Lines.halfLineRight.copy()]);
    World.Tiles.proxySubject.halfLineLeft = new World.Tile([World.Lines.halfLineLeft.copy()]);

    World.Tiles.proxySubject.quarterLineUp = new World.Tile([World.Lines.quarterLineUp.copy()]);
    World.Tiles.proxySubject.quarterLineDown = new World.Tile([World.Lines.quarterLineDown.copy()]);
    World.Tiles.proxySubject.quarterLineRight = new World.Tile([World.Lines.quarterLineRight.copy()]);
    World.Tiles.proxySubject.quarterLineLeft = new World.Tile([World.Lines.quarterLineLeft.copy()]);

    World.Tiles.proxySubject.gapQuarterLineHorizontal = new World.Tile([World.Lines.quarterLineRight.copy(),
        World.Lines.quarterLineLeft.copy()]);
    World.Tiles.proxySubject.gapQuarterLineVertical = new World.Tile([World.Lines.quarterLineUp.copy(),
        World.Lines.quarterLineDown.copy()]);

    World.Tiles.proxySubject.cornerUpLeft = new World.Tile([World.Lines.halfLineUp.copy(),
        World.Lines.halfLineLeft.copy()]);
    World.Tiles.proxySubject.cornerUpRight = new World.Tile([World.Lines.halfLineUp.copy(),
        World.Lines.halfLineRight.copy()]);
    World.Tiles.proxySubject.cornerDownLeft = new World.Tile([World.Lines.halfLineDown.copy(),
        World.Lines.halfLineLeft.copy()]);
    World.Tiles.proxySubject.cornerDownRight = new World.Tile([World.Lines.halfLineDown.copy(),
        World.Lines.halfLineRight.copy()]);

    World.Tiles.proxySubject.diagonalUpRight = new World.Tile([World.Lines.diagonalUpRight.copy()]);
    World.Tiles.proxySubject.diagonalUpLeft = new World.Tile([World.Lines.diagonalUpLeft.copy()]);
    World.Tiles.proxySubject.diagonalDownRight = new World.Tile([World.Lines.diagonalDownRight.copy()]);
    World.Tiles.proxySubject.diagonalDownLeft = new World.Tile([World.Lines.diagonalDownLeft.copy()]);

    World.Tiles.proxySubject.diagonalVUp = new World.Tile([World.Lines.diagonalUpRight.copy(),
        World.Lines.diagonalUpLeft.copy()]);
    World.Tiles.proxySubject.diagonalVDown = new World.Tile([World.Lines.diagonalDownRight.copy(),
        World.Lines.diagonalDownLeft.copy()]);
    World.Tiles.proxySubject.diagonalVRight = new World.Tile([World.Lines.diagonalDownRight.copy(),
        World.Lines.diagonalUpRight.copy()]);
    World.Tiles.proxySubject.diagonalVLeft = new World.Tile([World.Lines.diagonalDownLeft.copy(),
        World.Lines.diagonalUpLeft.copy()]);

    World.Tiles.proxySubject.diagBoxGapDownLeft = new World.Tile([World.Lines.diagonalUpRight.copy(),
        World.Lines.diagonalUpLeft.copy(), World.Lines.diagonalDownRight.copy()]);
    World.Tiles.proxySubject.diagBoxGapUpLeft = new World.Tile([World.Lines.diagonalUpRight.copy(),
        World.Lines.diagonalDownLeft.copy(), World.Lines.diagonalDownRight.copy()]);
    World.Tiles.proxySubject.diagBoxGapDownRight = new World.Tile([World.Lines.diagonalUpRight.copy(),
        World.Lines.diagonalUpLeft.copy(), World.Lines.diagonalDownLeft.copy()]);
    World.Tiles.proxySubject.diagBoxGapUpRight = new World.Tile([World.Lines.diagonalUpLeft.copy(),
        World.Lines.diagonalDownLeft.copy(), World.Lines.diagonalDownRight.copy()]);

    World.Tiles.proxySubject.quarterCircleUpLeft = new World.Tile([World.Lines.quarterCircleUpLeft.copy()]);
    World.Tiles.proxySubject.quarterCircleUpRight = new World.Tile([World.Lines.quarterCircleUpRight.copy()]);
    World.Tiles.proxySubject.quarterCircleDownLeft = new World.Tile([World.Lines.quarterCircleDownLeft.copy()]);
    World.Tiles.proxySubject.quarterCircleDownRight = new World.Tile([World.Lines.quarterCircleDownRight.copy()]);

    World.Tiles.proxySubject.zigZagVertical = new World.Tile([World.Lines.zigZagVertical.copy()]);
    World.Tiles.proxySubject.zigZagHorizontal = new World.Tile([World.Lines.zigZagHorizontal.copy()]);


    // Tiles Proxies
    /**************************************************************************/
    World.Tiles.blankLine = new World.Tile.Proxy(World.Tiles.proxySubject.blankLine);

    World.Tiles.verticalLine = new World.Tile.Proxy(World.Tiles.proxySubject.verticalLine);
    World.Tiles.horizontalLine = new World.Tile.Proxy(World.Tiles.proxySubject.horizontalLine);
    World.Tiles.cross = new World.Tile.Proxy(World.Tiles.proxySubject.cross);

    World.Tiles.halfLineUp = new World.Tile.Proxy(World.Tiles.proxySubject.halfLineUp);
    World.Tiles.halfLineDown = new World.Tile.Proxy(World.Tiles.proxySubject.halfLineDown);
    World.Tiles.halfLineRight = new World.Tile.Proxy(World.Tiles.proxySubject.halfLineRight);
    World.Tiles.halfLineLeft = new World.Tile.Proxy(World.Tiles.proxySubject.halfLineLeft);

    World.Tiles.quarterLineUp = new World.Tile.Proxy(World.Tiles.proxySubject.quarterLineUp);
    World.Tiles.quarterLineDown = new World.Tile.Proxy(World.Tiles.proxySubject.quarterLineDown);
    World.Tiles.quarterLineRight = new World.Tile.Proxy(World.Tiles.proxySubject.quarterLineRight);
    World.Tiles.quarterLineLeft = new World.Tile.Proxy(World.Tiles.proxySubject.quarterLineLeft);

    World.Tiles.gapQuarterLineHorizontal = new World.Tile.Proxy(World.Tiles.proxySubject.gapQuarterLineHorizontal);
    World.Tiles.gapQuarterLineVertical = new World.Tile.Proxy(World.Tiles.proxySubject.gapQuarterLineVertical);

    World.Tiles.cornerUpLeft = new World.Tile.Proxy(World.Tiles.proxySubject.cornerUpLeft);
    World.Tiles.cornerUpRight = new World.Tile.Proxy(World.Tiles.proxySubject.cornerUpRight);
    World.Tiles.cornerDownLeft = new World.Tile.Proxy(World.Tiles.proxySubject.cornerDownLeft);
    World.Tiles.cornerDownRight = new World.Tile.Proxy(World.Tiles.proxySubject.cornerDownRight);

    World.Tiles.diagonalUpRight = new World.Tile.Proxy(World.Tiles.proxySubject.diagonalUpRight);
    World.Tiles.diagonalUpLeft = new World.Tile.Proxy(World.Tiles.proxySubject.diagonalUpLeft);
    World.Tiles.diagonalDownRight = new World.Tile.Proxy(World.Tiles.proxySubject.diagonalDownRight);
    World.Tiles.diagonalDownLeft = new World.Tile.Proxy(World.Tiles.proxySubject.diagonalDownLeft);

    World.Tiles.diagonalVUp = new World.Tile.Proxy(World.Tiles.proxySubject.diagonalVUp);
    World.Tiles.diagonalVDown = new World.Tile.Proxy(World.Tiles.proxySubject.diagonalVDown);
    World.Tiles.diagonalVRight = new World.Tile.Proxy(World.Tiles.proxySubject.diagonalVRight);
    World.Tiles.diagonalVLeft = new World.Tile.Proxy(World.Tiles.proxySubject.diagonalVLeft);

    World.Tiles.diagBoxGapUpLeft = new World.Tile.Proxy(World.Tiles.proxySubject.diagBoxGapDownLeft);
    World.Tiles.diagBoxGapUpRight = new World.Tile.Proxy(World.Tiles.proxySubject.diagBoxGapUpRight);
    World.Tiles.diagBoxGapDownLeft = new World.Tile.Proxy(World.Tiles.proxySubject.diagBoxGapDownLeft);
    World.Tiles.diagBoxGapDownRight = new World.Tile.Proxy(World.Tiles.proxySubject.diagBoxGapDownRight);

    World.Tiles.quarterCircleUpLeft = new World.Tile.Proxy(World.Tiles.proxySubject.quarterCircleUpLeft);
    World.Tiles.quarterCircleUpRight = new World.Tile.Proxy(World.Tiles.proxySubject.quarterCircleUpRight);
    World.Tiles.quarterCircleDownLeft = new World.Tile.Proxy(World.Tiles.proxySubject.quarterCircleDownLeft);
    World.Tiles.quarterCircleDownRight = new World.Tile.Proxy(World.Tiles.proxySubject.quarterCircleDownRight);

    World.Tiles.zigZagVertical = new World.Tile.Proxy(World.Tiles.proxySubject.zigZagVertical);
    World.Tiles.zigZagHorizontal = new World.Tile.Proxy(World.Tiles.proxySubject.zigZagHorizontal);
};

World.setGridSize = function(gridSize) {
    if(abs(gridSize - World.gridSize) < Number.EPSILON) {
        return;
    }

    World.gridSize = gridSize;
    World.TileSetup();
};

World.Line = class {
    constructor(points,
        maxLinePointDist = World.maxInterLinePointDist,
        color = "#000000",
        copied = false) {
        this.setPoints(points);
        this.maxLinePointDist = maxLinePointDist;
        this.color = color;

        if(!copied) {
            this.scaleLinePointsToGridSize();
        }
        this.checkInterLinePointDistance();
    }

    setPoints(points) {
        this.linePoints = [];
        if(points.length == 0) {
            return;
        }
        points.forEach((point) => {
            this.linePoints.push(point.copy());
        });
    }

    scaleLinePointsToGridSize() {
        if(this.linePoints == undefined) {
            return;
        }
        this.linePoints.forEach((point) => {
            point.mult(World.gridSize);
        });
    }

    checkInterLinePointDistance() {
        if(this.linePoints == undefined) {
            return;
        }

        console.debug("World.Line.checkInterLinePointDistance(): \
            Original Tile:\n", this);

        let loopAgain = true;
        // don't need to loop again if you are adding a midpoint
        let distThresh = 2 * this.maxLinePointDist;

        while(loopAgain) {
            loopAgain = false;

            for(let i = 0; i < this.linePoints.length - 1; i++) {
                const v1 = this.linePoints[i].copy();
                const v2 = this.linePoints[i + 1].copy();
                const distance = v1.dist(v2);

                if(distance > distThresh) {
                    const midPoint = v1.add(v2).div(2);
                    this.linePoints.splice(i + 1, 0, midPoint);
                    i++;
                    loopAgain = true;
                }
            }
        }

        console.debug("World.Line.checkInterLinePointDistance(): \
            Updated Tile:\n", this);
    }

    copy() {
        const maxLinePointDist = this.maxLinePointDist;
        const color = this.color;
        let points = [];

        if(this.linePoints.length > 0) {
            this.linePoints.forEach((point) => {
                points.push(point.copy());
            });
        }

        const copied = true;
        return new World.Line(points, maxLinePointDist, color, copied);
    }

    flipVertical() {
        // change x axis values
        if(this.linePoints.length > 0) {
            for(let i = 0; i < this.linePoints.length; i++) {
                const newX = World.gridSize - this.linePoints[i].x;
                this.linePoints[i] = createVector(newX, this.linePoints[i].y);
            }
        }
        return this;
    }

    flipHorizontal() {
        // change y axis values
        if(this.linePoints.length > 0) {
            for(let i = 0; i < this.linePoints.length; i++) {
                const newY = World.gridSize - this.linePoints[i].y;
                this.linePoints[i] = createVector(this.linePoints[i].x, newY);
            }
        }
        return this;
    }

    flipDiagonal() {
        // swap x and y axis values
        if(this.linePoints.length > 0) {
            for(let i = 0; i < this.linePoints.length; i++) {
                this.linePoints[i] = createVector(this.linePoints[i].y,
                    this.linePoints[i].x);
            }
        }
        return this;
    }
};


/**
 * TODO make tile class less expensive to use. Use Proxy Pattern?
 */
World.Tile = class {
    constructor(lines, pos=createVector(0,0)) {
        this.lines = lines;
        // this.generatePG();
        this.setPos(pos);
    }

    getLines() {
        return this.lines;
    }

    setLines(lines) {
        this.lines = [];
        if(lines.length == 0) {
            return;
        }
        lines.forEach((line) => {
            this.lines.push(line.copy());
        });
    }

    setPos(newPos) {
        this.pos = newPos.copy();
    }

    generatePG() {
        this.tileImage = createGraphics(World.gridSize, World.gridSize);
        this.tileImage.pixelDensity(1);
        this.tileImage.background(255);
        this.lines.forEach((line) => {
            if(line.linePoints == undefined) {
                return;
            }

            this.tileImage.noFill();
            this.tileImage.strokeWeight(World.lineThickness);
            this.tileImage.stroke(line.color);
            this.tileImage.beginShape();

            line.linePoints.forEach((point) => {
                this.tileImage.vertex(point.x, point.y);
            });
            this.tileImage.endShape();
        });
    }

    getPG() {
        if(this.tileImage == undefined) {
            this.generatePG();
        }
        return this.tileImage;
    }

    copy() {
        let linesCopy = [];
        if(this.lines.length > 0) {
            this.lines.forEach((line) => {
                linesCopy.push(line.copy());
            });
        }
        return new World.Tile(linesCopy);
    }

    draw() {
        if(this.tileImage == undefined) {
            this.generatePG();
        }
        image(this.tileImage,
            this.pos.x, this.pos.y,
            World.gridSize, World.gridSize);
    }


};


World.Tile.Proxy = class {
    constructor(tile, pos=createVector(0,0)) {
        this.tile = tile;
        this.setPos(pos);
        this.tile.setPos(this.pos);
    }

    getLines() {
        this.tile.setPos(this.pos);
        return this.tile.getLines();
    }

    setLines(lines) {
        this.lines = [];
        if(lines.length == 0) {
            return;
        }

        this.tile.setPos(this.pos);
        this.tile.setLines(lines);
    }

    setPos(newPos) {
        this.pos = newPos.copy();
        this.tile.setPos(newPos);
    }

    generatePG() {
        this.tile.setPos(this.pos);
        this.tile.generatePG();
    }

    getPG() {
        this.tile.setPos(this.pos);
        return this.tile.getPG();
    }

    copy() {
        return new World.Tile.Proxy(this.tile, this.pos.copy());
    }

    draw() {
        this.tile.setPos(this.pos);
        this.tile.draw();
    }


};
