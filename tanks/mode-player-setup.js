/*******************************************************************************
 *
 *  @file mode-player-setup.js A file to setup players for the game
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 19-April-2025
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

/**
 * Class empty mode that doesn't do anything.
 *
 * @see TankGame.Mode
 */
TankGame.ModeList.PlayerSetup = class extends TankGame.Mode {
    /**
     * Constructor for the Debug projectile mode.
     */
    constructor() {
        super();
        console.debug("Start the Player Setup Mode");
        this.playerNumber = 1;
        this.name = "";
        this.setupColors();
        this.keyPressTime = 0;

        this.playerNames = [];
        this.playerColor = [];

        this.setupSubmitButtons();
        this.setupColorButtons();
        this.setupAIButtons();
    };

    /**
     * Startup actions that require access to the game engine
     */
    startup() {
    }

    /**
     * Setup the default tank colors.
     */
    setupColors() {
        this.black = color(0);
        this.red = color(155, 0, 10);
        this.green = color(0, 155, 10);
        this.blue = color(0, 10, 250);
        this.defaultColor = this.green;
        this.color = this.defaultColor;
    }

    /**
     * Setup the buttons to submit the current player and start the game.
     */
    setupSubmitButtons() {
        const buttonW = 0.2 * width;
        const buttonH = 0.1 * height;
        const npbPos = createVector(0.25 * width, 0.775 * height);
        const sgbPos = createVector(0.55 * width, 0.775 * height);

        this.nextPlayerButton = new UI.Button(
            npbPos, buttonW, buttonH, "Next Player", color(200, 28, 49));

        this.startGameButton = new UI.Button(
            sgbPos, buttonW, buttonH, "Start Game", color(28, 200, 49));
    }

    /**
     * Setup the colour radio buttons
     */
    setupColorButtons() {
        const colorButtonSize = 0.075 * height;
        const kPos = createVector(0.40 * width, 0.46 * height);
        const rPos = createVector(0.48 * width, 0.46 * height);
        const gPos = createVector(0.56 * width, 0.46 * height);
        const bPos = createVector(0.64 * width, 0.46 * height);

        this.colorButtonK = new UI.Button(
            kPos, colorButtonSize, colorButtonSize, "", this.black);

        this.colorButtonR = new UI.Button(
            rPos, colorButtonSize, colorButtonSize, "", this.red);

        this.colorButtonG = new UI.Button(
            gPos, colorButtonSize, colorButtonSize, "", this.green);
        this.colorButtonG.tick();

        this.colorButtonB = new UI.Button(
            bPos, colorButtonSize, colorButtonSize, "", this.blue);
    }

    /**
     * Setup up the ai buttons
     */
    setupAIButtons() {
        const AIButtonSize = 0.075 * height;
        const nPos = createVector(0.40 * width, 0.56 * height);
        const ePos = createVector(0.48 * width, 0.56 * height);
        const mPos = createVector(0.56 * width, 0.56 * height);
        const hPos = createVector(0.64 * width, 0.56 * height);
        const white = color(225);
        const colEasy = color(10, 225, 10);
        const colMed = color(225, 127, 5);
        const colHard = color(225, 25, 5);

        this.aiButtonNone = new UI.Button(
            nPos, AIButtonSize, AIButtonSize, "N", white);
        this.aiButtonNone.tick();

        this.aiButtonEasy = new UI.Button(
            ePos, AIButtonSize, AIButtonSize, "E", colEasy);

        this.aiButtonMed = new UI.Button(
            mPos, AIButtonSize, AIButtonSize, "M", colMed);

        this.aiButtonHard = new UI.Button(
            hPos, AIButtonSize, AIButtonSize, "H", colHard);
    }

    /**
     * Actions to run on the shutdown of the game mode
     */
    shutdown() {
        this.addPlayersToGameEngine();
    }


    /**
     * Update the projectile debug mode - adds new projectile if there are none
     * currently in the screen
     *
     * @param {number} dt - The time between the current frame and the previous frame.
     */
    update(dt) {
    };

    /**
     * Untick all color buttons
     */
    clearColorButtons() {
        this.colorButtonK.untick();
        this.colorButtonR.untick();
        this.colorButtonG.untick();
        this.colorButtonB.untick();
    }

    /**
     * Untick all ai difficulty buttons
     */
    clearAIButtons() {
        this.aiButtonNone.untick();
        this.aiButtonEasy.untick();
        this.aiButtonMed.untick();
        this.aiButtonHard.untick();
    }

    /**
     * Check if string is alphanumeric
     *
     * @param {String} str - the string
     */
    isAlphaNumeric(str) {
        return /^[a-zA-Z0-9]+$/.test(str);
    }

    /**
     * Add the current player information to a list ready to be added to the
     * game engine
     */
    submitPlayer() {
        let playerName = "Player " + this.playerNumber;
        if(this.name != "") {
            playerName = this.name;
        }
        this.playerNames.push(playerName);
        this.playerColor.push(this.color);

        this.name = "";
        this.color = this.defaultColor;
        this.playerNumber++;
    };

    /**
     * Add all of the players to the game engine
     */
    addPlayersToGameEngine() {
        for(let i = 0; i < this.playerNames.length; i++) {
            let player = new TankGame.Player(this.playerNames[i]);

            this.gameEngine.addPlayer(player);

            const tankWidth = width * 0.035;
            const x = 10 + width * i / this.playerNames.length;
            const tankPos = createVector(x, height / 2);

            let tank = new TankGame.Tank(tankWidth, tankPos, this.playerColor[i]);

            player.attachTank(tank);
            this.gameEngine.addTank(tank);
        }
    }

    /**
     * Draw danger stripes at the top and bottom of the screen
     */
    drawDangerStripes() {
        push();
        fill(247, 239, 0);
        rect(-1,-1, width + 1, 0.1 * height);
        rect(-1,0.9 * height, width + 1, 0.1 * height);
        const numStripes = 20;
        for(let i = 0; i < 2 * width; i += width / numStripes) {
            stroke(0);
            strokeWeight(width / (2 * numStripes));
            const x = i - height;
            line(i, -1, x, height + 1);
        }

        textSize(0.085 * height);
        fill(240, 13, 18);
        stroke(240, 13, 18);
        strokeWeight(2);
        text("TOP SECRET", width / 2, 0.05 * height);
        text("TOP SECRET", width / 2, 0.95 * height);

        pop();
    }

    /**
     * Draw the title
     */
    drawTitle() {
        push();
        fill(45, 12, 230);
        stroke(45, 12, 230);
        strokeWeight(3);
        textSize(0.085 * height);
        text("TANK GAME", width / 2, 0.2 * height);
        pop();
    }

    /**
     * Draw player select
     */
    drawPlayerSelect() {
        push();
        rectMode(CENTER);
        fill(97);
        rect(width/2, height/2, 0.5 * width, 0.5 * height, 0.03 * height);

        const idStr = "Player " + this.playerNumber;
        fill(0);
        textSize(0.05 * height);
        text(idStr, width / 2, 0.3 * height);

        textAlign(LEFT, CENTER);
        text("Name: ", 0.3 * width, 0.4 * height);
        const nameWidth = textWidth("Name: ");
        push();
        rectMode(CORNER);
        fill(255);
        // WHITE RECT FOR NAME
        rect(0.3 * width + nameWidth, 0.4 * height - 0.6 * textSize(),
            0.4 * width - nameWidth, 1.25 * textSize());
        pop();
        if(this.name == "") {
            fill(155);
            text("Player " + this.playerNumber,
                0.3 * width + 1.04 * nameWidth, 0.4 * height);
        } else {
            let showName = this.name;
            if(frameCount % 100 < 60) {
                showName += "|";
            }
            text(showName, 0.3 * width + 1.04 * nameWidth, 0.4 * height);
        }


        fill(0);
        text("Color: ", 0.3 * width, 0.5 * height);

        fill(0);
        text("AI: ", 0.3 * width, 0.6 * height);

        pop();
    }

    /**
     * Draw the color selection buttons
     */
    drawColorButtons() {
        this.colorButtonK.draw();
        this.colorButtonR.draw();
        this.colorButtonG.draw();
        this.colorButtonB.draw();
    }

    /**
     * Draw the ai buttons
     */
    drawAiButtons() {
        this.aiButtonNone.draw();
        this.aiButtonEasy.draw();
        this.aiButtonMed.draw();
        this.aiButtonHard.draw();
    }


    /**
     * Draw mode player setup
     */
    draw() {
        if(keyIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            const currentTime = this.gameEngine.currentFrameData.timeSinceStartSeconds;
            if(!(this.keyPressTime != undefined &&
                currentTime - this.keyPressTime < 0.2)) {

                if(keyCode == BACKSPACE) {
                    if(this.name.length > 0) {
                        this.name = this.name.slice(0, -1);
                    }
                } else if (keyCode == ENTER) {
                    this.submitPlayer();
                } else if(this.isAlphaNumeric(key)) {
                    this.name += key;
                }

                this.keyPressTime = currentTime;
            }

        }

        if(mouseIsPressed) {
            if(this.nextPlayerButton.isPressed()) {
                if(this.name != "") {
                    this.submitPlayer();
                } else {
                    console.log("Please give the player a name");
                }
            } else if (this.startGameButton.isPressed()) {
                if(this.name != "") {
                    this.submitPlayer();
                }

                if(this.playerNames.length < 2) {
                    console.warn("Need at least two players.  Also how did you even get here?");
                } else {
                    this.gameEngine.setMode(new TankGame.ModeList.GamePlay());
                }
            } else if(this.colorButtonK.isPressed()) {
                this.clearColorButtons();
                this.colorButtonK.tick();
                this.color = this.black;
            } else if(this.colorButtonR.isPressed()) {
                this.clearColorButtons();
                this.colorButtonR.tick();
                this.color = this.red;
            } else if(this.colorButtonG.isPressed()) {
                this.clearColorButtons();
                this.colorButtonG.tick();
                this.color = this.green;
            } else if(this.colorButtonB.isPressed()) {
                this.clearColorButtons();
                this.colorButtonB.tick();
                this.color = this.blue;
            } else if(this.aiButtonNone.isPressed()) {
                this.clearAIButtons();
                this.aiButtonNone.tick();
            }

        }

        push();
        textAlign(CENTER, CENTER);
        this.drawDangerStripes();
        this.drawTitle();
        this.drawPlayerSelect();
        this.nextPlayerButton.draw();
        if(this.playerNames.length > 0) {
            this.startGameButton.draw();
        }
        this.drawColorButtons();
        this.drawAiButtons();
        pop();
    };
};