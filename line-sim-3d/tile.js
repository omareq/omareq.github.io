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

World.lineThickness = 5;
World.maxInterLinePointDist = 5;

World.TileSetup = function() {
    World.Lines = {};

    World.Lines.verticalLine = [
                createVector(0.5, 0),
                createVector(0.5, 1)
                ];

    World.Lines.horizontalLine = [
                createVector(0, 0.5),
                createVector(1, 0.5)
                ];


    World.Tiles = {};
    World.Tiles.verticalLine = new World.Tile(World.Lines.verticalLine);
};

World.Tile = class {
    constructor(points,
        maxLinePointDist=World.maxInterLinePointDist) {

        this.linePoints = points;
        this.maxLinePointDist = maxLinePointDist;
        this.scaleLinePointsToGridSize();
        this.checkInterLinePointDistance();
    }

    scaleLinePointsToGridSize() {
        this.linePoints.forEach((point) => {
            point.mult(World.gridSize);
        });
    }

    checkInterLinePointDistance() {
        console.debug("World.Tile.checkInterLinePointDistance(): \
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

        console.debug("World.Tile.checkInterLinePointDistance(): \
            Updated Tile:\n", this);
    }
};
