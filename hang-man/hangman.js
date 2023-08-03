/*******************************************************************************
 *
 *  @file hangman.js This file implements the hangman class
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 03-August-2023
 *  @link https://omareq.github.io/hang-man/
 *  @link https://omareq.github.io/hang-man/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2023 Omar Essilfie-Quaye
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
 * This class describes a hangman.
 *
 * @class      Hangman (name)
 */
class Hangman {

    /**
     * Constructs a new instance of Hangman
     *
     * @param      {p5.Vector}  pos            The top left position
     * @param      {number}  width             The width in pixels
     * @param      {number}  height            The height in pixels
     * @param      {number}  [strokeWeight=5]  The stroke weight
     * @param      {number}  [strokeCol=255]   The stroke col
     */
    constructor(pos, width, height, strokeWeight=5, strokeCol=255) {
        this.strokeWeight = strokeWeight;
        this.strokeCol = strokeCol;
        this.numberOfLinesToDraw = 0;
        this.maximumNumLinesToDraw = 13;

        this.resize(pos, width, height);
        this.calculateLocations();
    }

    /**
     * Resize the drawing of the hangman
     *
     * @param      {p5.Vector}  pos     The top left position
     * @param      {number}  width   The width in pixels
     * @param      {number}  height  The height in pixels
     */
    resize(pos, width, height) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.calculateLocations();
    }

    /**
     * Calculates the locations of the parts of the drawing.  Is called on
     * instantiation of the class as well as during resizing events.
     */
    calculateLocations() {
        this.centreX = this.pos.x + 0.5 * this.width;
        this.centreY = this.pos.y + 0.5 * this.height;
        this.left = this.pos.x;
        this.right = this.pos.x + this.width;
        this.top = this.pos.y;
        this.bottom = this.pos.y + this.height;

        this.verticalPoleX = this.left + 0.25 * this.width;
        this.lowerSupprtY = this.bottom - 0.25 * this.height;
        this.upperSupprtY = this.top + 0.25 * this.height;
        this.hangX = this.verticalPoleX + 0.5 * this.width;
        this.hangY = this.top + 0.15 * this.height;

        this.headSize = 0.1 * this.height;
        this.torsoY = this.top + 0.45 * this.height;
        this.armLeft = this.hangX - 0.15 * this.height;
        this.armRight = this.hangX + 0.15 * this.height;
        this.armTopY = this.top + 0.25 * this.height;
        this.armBottomY = this.top + 0.4 * this.height;
        this.legBottom = this.top + 0.7 * this.height;
    }

    /**
     * Draws a base.
     */
    drawBase() {
        line(this.left, this.bottom, this.right, this.bottom);
    }

    /**
     * Draws a vertical pole.
     */
    drawVerticalPole() {
        line(this.verticalPoleX, this.bottom, this.verticalPoleX, this.top);
    }

    /**
     * Draws a horizontal pole.
     */
    drawHorizontalPole() {
        line(this.verticalPoleX, this.top, this.hangX, this.top);
    }

    /**
     * Draws a triangle support lower left.
     */
    drawTriangleSupportLowerLeft() {
        line(this.left, this.bottom, this.verticalPoleX, this.lowerSupprtY);
    }

    /**
     * Draws a triangle support lower right.
     */
    drawTriangleSupportLowerRight() {
        line(this.centreX, this.bottom, this.verticalPoleX, this.lowerSupprtY);
    }

    /**
     * Draws a triangle support upper.
     */
    drawTriangleSupportUpper() {
        line(this.centreX, this.top, this.verticalPoleX, this.upperSupprtY);
    }

    /**
     * Draws a hanging vertical.
     */
    drawHangingVertical() {
        line(this.hangX, this.top, this.hangX, this.hangY);
    }

    /**
     * Draws a head.
     */
    drawHead() {
        ellipse(this.hangX, this.hangY, this.headSize, this.headSize);
    }

    /**
     * Draws a torso.
     */
    drawTorso() {
        line(this.hangX, this.hangY, this.hangX, this.torsoY);
    }

    /**
     * Draws a left arm.
     */
    drawLeftArm() {
        line(this.hangX, this.armTopY, this.armLeft, this.armBottomY);
    }

    /**
     * Draws a right arm.
     */
    drawRightArm() {
        line(this.hangX, this.armTopY, this.armRight, this.armBottomY);
    }

    /**
     * Draws a left leg.
     */
    drawLeftLeg() {
        line(this.hangX, this.torsoY, this.armLeft, this.legBottom);
    }

    /**
     * Draws a right leg.
     */
    drawRightLeg() {
        line(this.hangX, this.torsoY, this.armRight, this.legBottom);
    }

    /**
     * Decreases the lives by one.
     */
    decreaseLives() {
        this.numberOfLinesToDraw++;
    }

    /**
     * Checks if the player is dead
     *
     * @return     {boolean}  True if dead, False otherwise.
     */
    isDead() {
        return this.numberOfLinesToDraw >= this.maximumNumLinesToDraw;
    }

    /**
     * Draws elements of the hangman based on the input arguments.  Uses the
     * fall through feature of the switch case to draw all the elements needed.
     *
     */
    draw() {
        push();
        strokeWeight(this.strokeWeight);
        stroke(this.strokeCol);
        switch(this.numberOfLinesToDraw) {
          default:
            // Used for debugging
            console.log("Default Draw All Lines In Hangman");
          case 13:
            this.drawRightLeg();
          case 12:
            this.drawLeftLeg();
          case 11:
            this.drawRightArm();
          case 10:
            this.drawLeftArm();
          case 9:
            this.drawTorso();
          case 8:
            this.drawHead();
          case 7:
            this.drawHangingVertical();
          case 6:
            this.drawTriangleSupportUpper();
          case 5:
            this.drawHorizontalPole();
          case 4:
            this.drawTriangleSupportLowerRight();
          case 3:
            this.drawTriangleSupportLowerLeft();
          case 2:
            this.drawVerticalPole();
          case 1:
            this.drawBase();
          case 0:
        }
        pop();
    }
}
