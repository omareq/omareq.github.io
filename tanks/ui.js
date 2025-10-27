/*******************************************************************************
 *
 *  @file ui.js A file for ui classes
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 26-October-2025
 *  @link https://omareq.github.io/tanks/
 *  @link https://omareq.github.io/tanks/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2025 Omar Essilfie-Quaye
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

var UI = UI || {};

/**
 * Class UI.Button class
 *
 */
UI.Button = class {
    /**
     * Constructor for the button class
     *
     * @param  {p5.Vector} pos   - Position of the top left of the button
     * @param  {float}     width - The width of the button
     * @param  {float}     height- The height of the button
     * @param  {string}    text  - The text to display on the button
     * @param  {p5.Color}  bg_color - The background color
     */
    constructor(pos, width, height, text, bg_color) {
        this.pos = pos.copy();
        this.width = width;
        this.height = height;
        this.text = text;
        this.bg_color = bg_color;
        this.isTicked = false;
    }

    /**
     * Determines if the button is pressed
     *
     *  @returns {Boolean} - If the button is pressed
     */
    isPressed() {
        if(!mouseIsPressed) {
            return false;
        }

        if(mouseX < this.pos.x || mouseX > this.pos.x + this.width) {
            return false;
        }

        if(mouseY < this.pos.y || mouseY > this.pos.y + this.height) {
            return false;
        }

        return true;
    }

    /**
     * Ticks the button
     */
    tick() {
        this.isTicked = true;
    }

    /**
     * Unticks the button
     */
    untick() {
        this.isTicked = false;
    }

    /**
     * Draws the button
     */
    draw() {
        push();
        fill(this.bg_color);
        stroke(0);
        strokeWeight(0.07 * this.height);
        rectMode(CORNER);
        rect(this.pos.x, this.pos.y, this.width, this.height);

        if(this.isTicked) {
            stroke(55);
            // strokeWeight()
            line(this.pos.x, this.pos.y,
                this.pos.x + this.width, this.pos.y + this.height);
        }

        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(0.5 * this.height);
        text(this.text, this.pos.x + this.width/2, this.pos.y + this.height / 2);
        pop();
    }
};