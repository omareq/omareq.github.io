/*******************************************************************************
 *
 *  @file finite-state-machine.js Implementation of static tile mode.
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 27-July-2024
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
 * Finite State Machine namespace object
 */
var FSM = FSM || {};

FSM.Manager = class {
    constructor(startingState) {
        if(!(startingState instanceof FSM.StateInterface)) {
            const err = "FSM.Manager.constructor(startingState): " +
            "startingState should be an instance of FSM.StateInterface";
            throw(err);
        }

        this.callbackList = [];

        this.state = startingState;
        this.state.setManager(this);
        this.state.enterState();
        this.lastInput = undefined;
    }


    addStateChangeCallback(callback) {
        if(!(typeof callback == "function")) {
            throw new Error("callback needs to be of type function");
        }
        this.callbackList.push(callback);
    }

    handleAllStateChangeCallbacks(newState) {
        for(let i = 0; i < this.callbackList.length; i++) {
            this.callbackList[i](this.state, newState, this.lastInput);
        }
    }

    handle(input) {
        this.lastInput = input;
        return this.state.handle(input);
    }

    setState(newState) {
        if(!(newState instanceof FSM.StateInterface)) {
            const err = "FSM.Manager.setState(newState): " +
            "newState should be an instance of FSM.StateInterface";
            throw(err);
        }

        this.state.exitState();
        this.handleAllStateChangeCallbacks(newState);
        this.state = newState;
        this.state.setManager(this);
        this.state.enterState();
    }
};

FSM.StateInterface = class {
    constructor() {
        const err = "Abstract class FSM.StateInterface can't be instantiated.";
        if(this.constructor == FSM.StartStateInterface) {
          throw new Error(err);
        }
    }

    enterState() {
        throw new Error("Method 'enterState()' must be implemented.");
    }

    handle(input) {
        throw new Error("Method 'handle()' must be implemented.");
    }

    exitState() {
        throw new Error("Method 'exitState()' must be implemented.");
    }

    setManager(manager) {
        if(!(manager instanceof FSM.Manager)) {
            const err = "FSM.StateInterface.setManager(manager): " +
            "manager should be an instance of FSM.Manager";
            throw(err);
        }
        this.manager = manager;
    }
};


FSM.EmptyState = class extends FSM.StateInterface {
    constructor() { super(); }

    enterState() {};

    handle(input) {};

    exitState() {};
};

FSM.DebugGreenPrint = class extends FSM.StateInterface {
    constructor() {
        super();
    }

    enterState() {
        console.log("Entering green state");
        this.prevTime = millis();
    };

    handle(input) {
        if(millis() - this.prevTime > 3500) {
            console.log("Green");
            let newState = new FSM.DebugRedPrint();
            this.manager.setState(newState);
        }
    };

    exitState() {
        console.log("Exiting Green State");
    };
};

FSM.DebugRedPrint = class extends FSM.StateInterface {
    constructor() {
        super();
    }

    enterState() {
        console.log("Entering red state");
        this.prevTime = millis();
    };

    handle(input) {
        if(millis() - this.prevTime > 3500) {
            console.log("Red");
            let newState = new FSM.DebugGreenPrint();
            this.manager.setState(newState);
        }
    };

    exitState() {
        console.log("Exiting red State");
    };
};

