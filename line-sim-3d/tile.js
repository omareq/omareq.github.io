/*******************************************************************************
 *
 *  @file ui.js A file with the Tile class
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

/**
 * World Namespace Object
 */
var World = World || {};

World.gridSize = 200;
World.lineThickness = World.gridSize / 10;
World.maxInterLinePointDist = World.lineThickness / 4;

World.TileSetup = function() {
    World.LineConfigs = {};

    World.LineConfigs.blankLine = [];

    World.LineConfigs.verticalLine = [
                createVector(0.5, 0),
                createVector(0.5, 1)
                ];

    World.LineConfigs.horizontalLine = [
                createVector(0, 0.5),
                createVector(1, 0.5)
                ];

    World.Lines = {};
    World.Lines.blankLine = new World.Line(World.LineConfigs.blankLine);
    World.Lines.verticalLine = new World.Line(World.LineConfigs.verticalLine);
    World.Lines.horizontalLine = new World.Line(World.LineConfigs.horizontalLine);

    World.Tiles = {};
    World.Tiles.blankLine = new World.Tile([World.Lines.blankLine.copy()]);
    World.Tiles.verticalLine = new World.Tile([World.Lines.verticalLine.copy()]);
    World.Tiles.horizontalLine = new World.Tile([World.Lines.horizontalLine.copy()]);
    World.Tiles.cross = new World.Tile([World.Lines.horizontalLine.copy(),
        World.Lines.verticalLine.copy()]);
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
        while(loopAgain) {
            loopAgain = false;

            for(let i = 0; i < this.linePoints.length - 1; i++) {
                let v1 = this.linePoints[i].copy();
                let v2 = this.linePoints[i + 1].copy();
                const distance = v1.dist(v2);

                if(distance > this.maxLinePointDist) {
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
};

World.Tile = class {
    constructor(lines) {
        this.lines = lines;
        this.generatePG();
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

    generatePG() {
        this.tileImage = createGraphics(World.gridSize, World.gridSize);
        this.tileImage.background(255);
        this.lines.forEach((line) => {
            if(line.linePoints == undefined) {
                return;
            }

            this.tileImage.noFill();
            this.tileImage.strokeWeight(0.5 * World.lineThickness);
            this.tileImage.stroke(line.color);
            this.tileImage.beginShape();

            line.linePoints.forEach((point) => {
                this.tileImage.vertex(point.x - World.gridSize/4, point.y-World.gridSize/4);
            });
            this.tileImage.endShape();
        });
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
};