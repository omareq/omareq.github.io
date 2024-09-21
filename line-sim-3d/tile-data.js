/*******************************************************************************
 *
 *  @file tile-data.js A file which sets up tile data
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


World.setupLineConfigs = function() {
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

    World.LineConfigs.threeQuarterCircleUpRight = [
                createVector(0.750, 0.500),
                createVector(0.741, 0.565),
                createVector(0.717, 0.625),
                createVector(0.677, 0.677),
                createVector(0.625, 0.717),
                createVector(0.565, 0.741),
                createVector(0.500, 0.750),
                createVector(0.435, 0.741),
                createVector(0.375, 0.717),
                createVector(0.323, 0.677),
                createVector(0.283, 0.625),
                createVector(0.259, 0.565),
                createVector(0.250, 0.500),
                createVector(0.259, 0.435),
                createVector(0.283, 0.375),
                createVector(0.323, 0.323),
                createVector(0.375, 0.283),
                createVector(0.435, 0.259),
                createVector(0.500, 0.250)
                ];

    World.LineConfigs.halfCircleDown = [
                createVector(1.000, 0.500),
                createVector(0.950, 0.500),
                createVector(0.943, 0.578),
                createVector(0.923, 0.654),
                createVector(0.890, 0.725),
                createVector(0.845, 0.789),
                createVector(0.789, 0.845),
                createVector(0.725, 0.890),
                createVector(0.654, 0.923),
                createVector(0.578, 0.943),
                createVector(0.500, 0.950),
                createVector(0.422, 0.943),
                createVector(0.346, 0.923),
                createVector(0.275, 0.890),
                createVector(0.211, 0.845),
                createVector(0.155, 0.789),
                createVector(0.110, 0.725),
                createVector(0.077, 0.654),
                createVector(0.057, 0.578),
                createVector(0.050, 0.500),
                createVector(0.000, 0.500)
                ];

    World.LineConfigs.smallHalfCircleDownLeftSide = [
                createVector(0.500, 0.500),
                createVector(0.497, 0.539),
                createVector(0.486, 0.577),
                createVector(0.470, 0.613),
                createVector(0.447, 0.645),
                createVector(0.420, 0.672),
                createVector(0.388, 0.695),
                createVector(0.352, 0.711),
                createVector(0.314, 0.722),
                createVector(0.275, 0.725),
                createVector(0.236, 0.722),
                createVector(0.198, 0.711),
                createVector(0.163, 0.695),
                createVector(0.130, 0.672),
                createVector(0.103, 0.645),
                createVector(0.080, 0.613),
                createVector(0.064, 0.577),
                createVector(0.053, 0.539),
                createVector(0.050, 0.500),
                createVector(0.000, 0.500)
                ];
}

World.setupLines = function() {
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

    World.Lines.threeQuarterCircleUpRight = new World.Line(World.LineConfigs.threeQuarterCircleUpRight);
    World.Lines.threeQuarterCircleUpLeft = World.Lines.threeQuarterCircleUpRight.copy().flipVertical();
    World.Lines.threeQuarterCircleDownLeft = World.Lines.threeQuarterCircleUpLeft.copy().flipHorizontal();
    World.Lines.threeQuarterCircleDownRight = World.Lines.threeQuarterCircleUpRight.copy().flipHorizontal();

    World.Lines.zigZagVertical = new World.Line(World.LineConfigs.zigZagVertical);
    World.Lines.zigZagHorizontal = World.Lines.zigZagVertical.copy().flipDiagonal();

    World.Lines.halfCircleDown = new World.Line(World.LineConfigs.halfCircleDown);
    World.Lines.halfCircleUp = World.Lines.halfCircleDown.copy().flipHorizontal();
    World.Lines.halfCircleLeft = World.Lines.halfCircleUp.copy().flipDiagonal();
    World.Lines.halfCircleRight = World.Lines.halfCircleLeft.copy().flipVertical();

    World.Lines.smallHalfCircleDownLeftSide = new World.Line(World.LineConfigs.smallHalfCircleDownLeftSide);
    World.Lines.smallHalfCircleDownRightSide = World.Lines.smallHalfCircleDownLeftSide.copy().flipVertical();

    World.Lines.smallHalfCircleUpRightSide = World.Lines.smallHalfCircleDownLeftSide.copy().flipHorizontal().flipVertical();
    World.Lines.smallHalfCircleUpLeftSide = World.Lines.smallHalfCircleDownLeftSide.copy().flipHorizontal();

    World.Lines.smallHalfCircleRightBottom = World.Lines.smallHalfCircleDownLeftSide.copy().flipDiagonal().flipVertical();
    World.Lines.smallHalfCircleRightTop = World.Lines.smallHalfCircleRightBottom.copy().flipHorizontal();

    World.Lines.smallHalfCircleLeftTop = World.Lines.smallHalfCircleRightBottom.copy().flipHorizontal().flipVertical();
    World.Lines.smallHalfCircleLeftBottom = World.Lines.smallHalfCircleLeftTop.copy().flipHorizontal();
}

World.setupTiles = function() {
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

    World.Tiles.proxySubject.threeQuarterCircleUpRight = new World.Tile([World.Lines.threeQuarterCircleUpRight.copy(),
        World.Lines.quarterLineUp.copy(), World.Lines.quarterLineRight.copy()]);
    World.Tiles.proxySubject.threeQuarterCircleUpLeft = new World.Tile([World.Lines.threeQuarterCircleUpLeft.copy(),
        World.Lines.quarterLineUp.copy(), World.Lines.quarterLineLeft.copy()]);
    World.Tiles.proxySubject.threeQuarterCircleDownRight = new World.Tile([World.Lines.threeQuarterCircleDownRight.copy(),
        World.Lines.quarterLineDown.copy(), World.Lines.quarterLineRight.copy()]);
    World.Tiles.proxySubject.threeQuarterCircleDownLeft = new World.Tile([World.Lines.threeQuarterCircleDownLeft.copy(),
        World.Lines.quarterLineDown.copy(), World.Lines.quarterLineLeft.copy()]);

    World.Tiles.proxySubject.zigZagVertical = new World.Tile([World.Lines.zigZagVertical.copy()]);
    World.Tiles.proxySubject.zigZagHorizontal = new World.Tile([World.Lines.zigZagHorizontal.copy()]);

    World.Tiles.proxySubject.halfCircleUp = new World.Tile([World.Lines.halfCircleUp.copy()]);
    World.Tiles.proxySubject.halfCircleDown = new World.Tile([World.Lines.halfCircleDown.copy()]);
    World.Tiles.proxySubject.halfCircleLeft = new World.Tile([World.Lines.halfCircleLeft.copy()]);
    World.Tiles.proxySubject.halfCircleRight = new World.Tile([World.Lines.halfCircleRight.copy()]);

    World.Tiles.proxySubject.sClockwiseHorizontal = new World.Tile([World.Lines.smallHalfCircleUpRightSide.copy(), World.Lines.smallHalfCircleDownLeftSide.copy()]);
    World.Tiles.proxySubject.sClockwiseVertical = new World.Tile([World.Lines.smallHalfCircleLeftTop.copy(), World.Lines.smallHalfCircleRightBottom.copy()]);
    World.Tiles.proxySubject.sAntiClockwiseHorizontal = new World.Tile([World.Lines.smallHalfCircleUpLeftSide.copy(), World.Lines.smallHalfCircleDownRightSide.copy()]);
    World.Tiles.proxySubject.sAntiClockwiseVertical = new World.Tile([World.Lines.smallHalfCircleLeftBottom.copy(), World.Lines.smallHalfCircleRightTop.copy()]);

    World.Tiles.proxySubject.tDown = new World.Tile([World.Lines.halfLineDown.copy(), World.Lines.horizontalLine.copy()]);
    World.Tiles.proxySubject.tUp = new World.Tile([World.Lines.halfLineUp.copy(), World.Lines.horizontalLine.copy()]);
    World.Tiles.proxySubject.tLeft = new World.Tile([World.Lines.halfLineLeft.copy(), World.Lines.verticalLine.copy()]);
    World.Tiles.proxySubject.tRight = new World.Tile([World.Lines.halfLineRight.copy(), World.Lines.verticalLine.copy()]);
}

World.setupTileProxies = function() {
    World.Tiles = World.Tiles || {};

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

    World.Tiles.diagBoxGapUpLeft = new World.Tile.Proxy(World.Tiles.proxySubject.diagBoxGapUpLeft);
    World.Tiles.diagBoxGapUpRight = new World.Tile.Proxy(World.Tiles.proxySubject.diagBoxGapUpRight);
    World.Tiles.diagBoxGapDownLeft = new World.Tile.Proxy(World.Tiles.proxySubject.diagBoxGapDownLeft);
    World.Tiles.diagBoxGapDownRight = new World.Tile.Proxy(World.Tiles.proxySubject.diagBoxGapDownRight);

    World.Tiles.quarterCircleUpLeft = new World.Tile.Proxy(World.Tiles.proxySubject.quarterCircleUpLeft);
    World.Tiles.quarterCircleUpRight = new World.Tile.Proxy(World.Tiles.proxySubject.quarterCircleUpRight);
    World.Tiles.quarterCircleDownLeft = new World.Tile.Proxy(World.Tiles.proxySubject.quarterCircleDownLeft);
    World.Tiles.quarterCircleDownRight = new World.Tile.Proxy(World.Tiles.proxySubject.quarterCircleDownRight);

    World.Tiles.threeQuarterCircleUpLeft = new World.Tile.Proxy(World.Tiles.proxySubject.threeQuarterCircleUpLeft);
    World.Tiles.threeQuarterCircleUpRight = new World.Tile.Proxy(World.Tiles.proxySubject.threeQuarterCircleUpRight);
    World.Tiles.threeQuarterCircleDownLeft = new World.Tile.Proxy(World.Tiles.proxySubject.threeQuarterCircleDownLeft);
    World.Tiles.threeQuarterCircleDownRight = new World.Tile.Proxy(World.Tiles.proxySubject.threeQuarterCircleDownRight);

    World.Tiles.zigZagVertical = new World.Tile.Proxy(World.Tiles.proxySubject.zigZagVertical);
    World.Tiles.zigZagHorizontal = new World.Tile.Proxy(World.Tiles.proxySubject.zigZagHorizontal);

    World.Tiles.halfCircleUp = new World.Tile.Proxy(World.Tiles.proxySubject.halfCircleUp);
    World.Tiles.halfCircleDown = new World.Tile.Proxy(World.Tiles.proxySubject.halfCircleDown);
    World.Tiles.halfCircleLeft = new World.Tile.Proxy(World.Tiles.proxySubject.halfCircleLeft);
    World.Tiles.halfCircleRight = new World.Tile.Proxy(World.Tiles.proxySubject.halfCircleRight);

    World.Tiles.sClockwiseHorizontal = new World.Tile.Proxy(World.Tiles.proxySubject.sClockwiseHorizontal);
    World.Tiles.sClockwiseVertical = new World.Tile.Proxy(World.Tiles.proxySubject.sClockwiseVertical);
    World.Tiles.sAntiClockwiseHorizontal = new World.Tile.Proxy(World.Tiles.proxySubject.sAntiClockwiseHorizontal);
    World.Tiles.sAntiClockwiseVertical = new World.Tile.Proxy(World.Tiles.proxySubject.sAntiClockwiseVertical);

    World.Tiles.tDown = new World.Tile.Proxy(World.Tiles.proxySubject.tDown);
    World.Tiles.tUp = new World.Tile.Proxy(World.Tiles.proxySubject.tUp);
    World.Tiles.tLeft = new World.Tile.Proxy(World.Tiles.proxySubject.tLeft);
    World.Tiles.tRight = new World.Tile.Proxy(World.Tiles.proxySubject.tRight);
}