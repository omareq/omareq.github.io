/*******************************************************************************
 *
 *  @file mode-buy-weapons.js The game play mode
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 28-October-2025
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
 * Class Buy Weapons
 *
 * @see TankGame.Mode
 */
TankGame.ModeList.BuyWeapons = class extends TankGame.Mode {
    /**
     * Constructor for the Buy Weapons Mode
     */
    constructor() {
        super();
        console.debug("Start the Buy Weapons Mode");

        this.playerIndex = 0;
        this.buttons = [];
        this.cost = [];
        this.inventory = [];
        this.numWpns = Object.keys(TankGame.ProjectileParamList).length;
        this.keyPressTime = 0;

        const nextPos = createVector(0.8 * width, 0.9 * height);
        this.nextButton = new UI.Button(
            nextPos, 0.2 * width, 0.1 * height, "Next", color(89, 170, 98));
    };

    /**
     * Startup actions that require access to the game engine
     */
    startup() {
        this.gameEngine.activePlayerIndex = 0;
        this.setupWeaponButtons();
    }

    /**
     * Shutdown the weapons buying mode and reset the tanks for game play
     */
    shutdown() {
        // setup tanks
        this.gameEngine.tanks = [];
        const tankWidth = width * 0.035;
        for(let i = 0; i < this.gameEngine.players.length; i++) {
            const x = 10 + width * i / this.gameEngine.players.length;
            const tankPos = createVector(x, height / 2);
            let newTank = new TankGame.Tank(tankWidth, tankPos,
                this.gameEngine.players[i].tank.color);

            this.gameEngine.players[i].dettachTank();
            this.gameEngine.players[i].attachTank(newTank);
            this.gameEngine.addTank(newTank);
        }

        this.gameEngine.activePlayerIndex = 0;
        let lowestScore = this.gameEngine.players[0].score;
        for(let i = 1; i < this.gameEngine.players.length; i++) {
            if(this.gameEngine.players[i].score < lowestScore) {
                lowestScore = this.gameEngine.players[i].score;
                this.gameEngine.activePlayerIndex = i;
            }
        }
    }

    /**
     * Setup the weapon buying buttons
     */
    setupWeaponButtons() {
        this.buttons = [];
        this.cost = [];
        this.inventory = [];

        let i = 0;
        const startY = 0.20 * height;
        const endY = 0.85 * height;
        const yGap = (endY - startY) / this.numWpns;
        const padY = 0.05 * yGap;
        const bWidth = 0.3 * width;
        const bHeight = yGap - padY;
        const bg_color = color(155);
        const red_cost_color = color(155, 130, 130);
        const green_cost_color = color(130, 155, 130);
        const keys = Object.keys(TankGame.ProjectileParamList)
        const leftX = 0.075 * width;
        for(let i = 0; i < keys.length; i++) {
            const yVal = startY + i * yGap;
            const pos = createVector(leftX, yVal);
            const wpnButton = new UI.Button(
                pos, bWidth, bHeight, keys[i], bg_color);

            this.buttons.push(wpnButton);

            const cost = TankGame.ProjectileParamList[keys[i]].cost;
            const posCost = createVector(leftX + bWidth, yVal);
            let cost_color = green_cost_color;
            if(cost > this.gameEngine.currentPlayer().money) {
                cost_color = red_cost_color;
            }
            const costButton = new UI.Button(
                posCost, 0.2 * bWidth, bHeight, cost, cost_color);

            this.cost.push(costButton);

            const wpnCnt = this.gameEngine.currentPlayer().getWeaponCount(keys[i]);
            const posCnt = createVector(leftX + 1.2 * bWidth, yVal);
            const cntBtn = new UI.Button(
                posCnt, 0.2 * bWidth, bHeight, wpnCnt, bg_color);

            this.inventory.push(cntBtn);
        }

    }

    /**
     * Draw the weapon buttons
     */
    drawWeaponButtons() {
        for(let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
            this.cost[i].draw();
            this.inventory[i].draw();
        }
    }

    /**
     * Draw title
     */
    drawTitle() {
        push();
        textAlign(CENTER, CENTER);
        textSize(0.1 * height);
        fill(62, 125, 58);
        text("ARMOURY", width / 2, 0.1 * height);
        pop();
    }

    /**
     * Update the buy weapons mode
     *
     * @param {number} dt - The time between the current frame and the previous frame.
     */
    update(dt) {
        const currentTime = this.gameEngine.currentFrameData.timeSinceStartSeconds;
        for(let i = 0; i < this.buttons.length; i++) {
            if(currentTime - this.keyPressTime < 0.35) {
                return;
            }

            if(this.buttons[i].isPressed()) {
                this.keyPressTime = currentTime;
                console.debug("Button pressed: " + this.buttons[i].text);
                const cost = TankGame.ProjectileParamList[this.buttons[i].text].cost;

                this.gameEngine.currentPlayer().addWeapon(this.buttons[i].text, cost);
                this.setupWeaponButtons();
            }
        }

        if(this.nextButton.isPressed()) {
            this.keyPressTime = currentTime;
            console.debug("Next Player");
            this.gameEngine.activePlayerIndex++;
            if(this.gameEngine.activePlayerIndex >= this.gameEngine.players.length) {
                console.debug("Last player is done");
                this.gameEngine.activePlayerIndex = 0;
                this.gameEngine.setMode(new TankGame.ModeList.GamePlay());
                return;
            }
            this.setupWeaponButtons();
        }
    };

    /**
     * draw the buy weapons mode
     */
    draw() {
        push();
        background(0);

        this.drawTitle();
        this.drawWeaponButtons();

        fill(89);
        rect(0, 0.9 * height, width, 0.1 * height);
        textAlign(LEFT, CENTER);
        noStroke();
        fill(this.gameEngine.currentPlayer().tank.color);
        textSize(0.065 * height);
        text(this.gameEngine.currentPlayer().name,
            0.075 * width, 0.95 * height);


        fill(0);
        textAlign(RIGHT, CENTER);
        const playerMoney = "$" + this.gameEngine.currentPlayer().money;
        text(playerMoney, 0.75 * width, 0.95 * height);

        this.nextButton.draw();
        pop();
    };
};