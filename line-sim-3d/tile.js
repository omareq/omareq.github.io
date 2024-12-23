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

World.TilesAddName = function() {
    const keys = Object.keys(World.Tiles.proxySubject);
    for(let i = 0; i < keys.length; i++) {
        World.Tiles.proxySubject[keys[i]].setName(keys[i]);
    }
};

/**
 * Tile setup function.  Calculates all the line and tile sizes with respect to
 * the chosen grid size.
 */
World.TileSetup = function() {
    World.lineThickness = World.gridSize / 10;
    World.maxInterLinePointDist = World.lineThickness / 4;

    // From file tile-data.js
    World.setupLineConfigs();
    World.setupLines();
    World.setupTiles();
    World.setupTileProxies();

    World.TilesAddName();
};

/**
 * Sets the World.gridSize Variable.  If the grid size is exactly the same then
 * it returns early.
 *
 * If the grid size is different then the World.TileSetup() function is called.
 *
 * @param gridSize {number} - The new grid size
 */
World.setGridSize = function(gridSize) {
// TODO: add param checks
    if(abs(gridSize - World.gridSize) < Number.EPSILON) {
        return;
    }

    World.gridSize = gridSize;
    World.TileSetup();
};

/**
 * Class describing an individual line.  This is done as a series of points
 * along a defined path.  There is a minimum distance between points that needs
 * to be adhered to in order for the line following to work correctly.  This
 * distance is defined by World.maxInterLinePointDist.  This class ensures
 * that this limit is obeyed and adds extra points using linear interpolation
 * if necessary.
 *
 * The points only need to be defined at corners for straight line objects.  For
 * curves the points should be defined frequently enough to show the shape of
 * the curve to the desired resolution.  The class will add more to ensure the
 * max inter line point distance threshold is obeyed.
 *
 * The line point data is scaled to the grid size.
 *
 * @see World.Tile
 * @see World.Tile.proxy
 * @see World.Room
 *
 */
World.Line = class {
    /**
     * The constructor for the World.Line class.
     * @param points {Array<p5.Vector>} - An array of points with x/y values between
     *   zero and one to indicate the edges of a tile.
     * @param maxLinePointDist {number} - The maximum spacing between adjacent
     *   points. Default World.maxInterLinePointDist
     * @param color {String} - Hex string for rgb color eg "#AABBCC"
     * @param copied {Boolean} - Flag to show if the data is from World.Line.copy().
     *   This prevents the data from being rescaled to the grid size.
     */
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

    /**
     * Copies the original points into an internal array of points.
     *
     * @param points {p5.Vector} - The list of points to copy.
     */
    setPoints(points) {
        this.linePoints = [];
        if(points.length == 0) {
            return;
        }
        points.forEach((point) => {
            this.linePoints.push(point.copy());
        });
    }

    /**
     * Scales the 0-1 normalized points to grid size.  This is done by
     * multiplying all points by World.gridSize.
     */
    scaleLinePointsToGridSize() {
        if(this.linePoints == undefined) {
            return;
        }
        this.linePoints.forEach((point) => {
            point.mult(World.gridSize);
        });
    }

    /**
     * Checks the inter point distance and adds a point between them if they
     * are further apart than the maximum inter point distance.  This continues
     * until no pair of adjacent points are further apart than the inter point
     * distance threshold.
     */
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

    /**
     * Copies the line object.  All points are copied and a new World.Line
     * object is instantiated with the copy argument set to true.  This prevents
     * the object from rescaling to World.gridSize.
     */
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

    /**
     * Flips all of the line points in the vertical direction.  i.e a reflection
     * in the horizontal axis.
     *
     * @returns {World.Line} - Returns this so that calls can be chained.
     */
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

    /**
     * Flips all of the line points in the horizontal direction.  i.e a
     * reflection in the vertical axis.
     *
     * @returns {World.Line} - Returns this so that calls can be chained.
     */
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

    /**
     * Flips all of the line points in the diagonal direction.  i.e a
     * reflection along the line y=x.
     *
     * @returns {World.Line} - Returns this so that calls can be chained.
     */
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
 * Tile class that stores a list of lines and encapsulates the position and
 * drawing of these lines.  The drawing is done through the use of a portable
 * graphics object image.  This is expensive to create so is not generated in
 * the constructor.  The image is lazily created when a call to draw is made or
 * if getPG is called, whichever happens first.
 *
 * @see World.Line
 * @see World.Tile.proxy
 * @see World.Room
 */
World.Tile = class {
    /**
     * constructor for the Tile
     *
     * @param lines {Array<World.Line>} - The lines in the tile
     * @param pos {p5.Vector} - The position of the tile
     */
    constructor(lines, pos=createVector(0,0)) {
        this.lines = lines;
        // this.generatePG();
        this.setPos(pos);
    }

    /**
     * Get the lines stored in the tile
     *
     * @returns {Array<World.Line>} - The lines stored in the tile
     */
    getLines() {
        return this.lines;
    }

    /**
     * Sets the lines in the tile
     *
     * @param {Array<World.Line>} - The lines to store in the tile
     */
    setLines(lines) {
        this.lines = [];
        if(lines.length == 0) {
            return;
        }
        lines.forEach((line) => {
            this.lines.push(line.copy());
        });
    }

    /**
     * Change the position of the tile
     *
     * @param newPos {p5.Vector} - The new position of the tile
     */
    setPos(newPos) {
        this.pos = newPos.copy();
    }

    /**
     * Set the name of the tile
     *
     * @param name {string} - name of the tile
     */
    setName(name) {
        this.name = name;
    }

    /**
     * get the name of the tile
     *
     * @returns {string} - name of the tile
     */
    getName() {
        return this.name;
    }

    /**
     * Generate the portable graphics image for the tile.
     */
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

    /**
     * Gets the current image of the tile.  If the tile image hasn't been
     * created then it will be lazily generated before being returned.
     *
     * @return {p5.Graphics} - The tile image
     */
    getPG() {
        if(this.tileImage == undefined) {
            this.generatePG();
        }
        return this.tileImage;
    }

    /**
     * Copies the all of the lines in the tile object and returns a new tile.
     *
     * @returns {World.Tile} - The new tile
     */
    copy() {
        let linesCopy = [];
        if(this.lines.length > 0) {
            this.lines.forEach((line) => {
                linesCopy.push(line.copy());
            });
        }
        return new World.Tile(linesCopy);
    }

    /**
     * Draws the tile.  If the tile image hasn't been created it is lazily
     * generated before it is drawn.
     */
    draw() {
        if(this.tileImage == undefined) {
            this.generatePG();
        }
        image(this.tileImage,
            this.pos.x, this.pos.y,
            World.gridSize, World.gridSize);
    }
};

/**
 * Tile proxy class.  This is created to act as a proxy to the expensive tile
 * class.  Each type of tile is created in World.TileSetup() and then a proxy
 * object takes the reference to each tile and is used by the rest of the
 * simulation.  This prevents expensive copies of the tile being created.
 *
 * The proxy object stores a local copy of the position of the object so that if
 * another proxy changes it for the subject tile it can be changed back.  This
 * is critical for position dependent code such as calls to
 * WorldTile.Proxy.draw().
 *
 * @see World.Line
 * @see World.Tile
 * @see World.Room
 */
World.Tile.Proxy = class {
    /**
     * Constructor for a tile proxy.
     *
     * @param tile {World.Tile} - A reference to tile object that is the proxy
     *  subject
     * @param pos {p5.Vector} - The position of the proxy tile
     */
    constructor(tile, pos=createVector(0,0)) {
        this.tile = tile;
        this.setPos(pos);
        this.tile.setPos(this.pos);
    }

    /**
     * Pass through to World.Tile.getLines()
     *
     * @returns {Array<World.Line>} - The array of lines in the tile
     */
    getLines() {
        this.tile.setPos(this.pos);
        return this.tile.getLines();
    }

    /**
     * Pass through to World.Tile.setLines(lines)
     *
     * @param lines {Array<World.Line>} - The new array of lines
     */
    setLines(lines) {
        this.lines = [];
        if(lines.length == 0) {
            return;
        }

        this.tile.setPos(this.pos);
        this.tile.setLines(lines);
    }

    /**
     * Pass through to World.Tile.setPos(newPos).  The proxy object also saves
     * the location for the position so that when it calls position dependent
     * pass through functions it can set the position correctly.
     *
     * @param newPos {p5.Vector} - the new position of the tile
     */
    setPos(newPos) {
        this.pos = newPos.copy();
        this.tile.setPos(newPos);
    }

    /**
     * set the name of the tile proxy
     *
     * @param name {string} - the name of the tile proxy
     */
    setName(name) {
        this.tile.setName(name);
    }

    /**
     * get name of the tile proxy
     *
     * @returns {string} - the name of the tile
     */
    getName() {
        return this.tile.getName();
    }

    /**
     * Pass through to World.Tile.generatePg()
     */
    generatePG() {
        this.tile.setPos(this.pos);
        this.tile.generatePG();
    }

    /**
     * Pass through to World.Tile.getPG()
     *
     * @returns {p5.Graphics} - The tile image
     */
    getPG() {
        this.tile.setPos(this.pos);
        return this.tile.getPG();
    }


    /**
     * A method to copy this proxy object.  It passes a reference to the subject
     * tile and a copy of the current position.
     *
     * This is not a pass through to the World.Tile.copy() method.
     *
     * @returns {World.Tile.Proxy} - A new proxy to the same tile subject
     */
    copy() {
        return new World.Tile.Proxy(this.tile, this.pos.copy());
    }

    /**
     * Draws the tile subject in the location that the proxy has saved
     */
    draw() {
        this.tile.setPos(this.pos);
        this.tile.draw();
    }
};
