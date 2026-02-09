/*******************************************************************************
 *
 *  @file bf-program.js A Brain Fuck CPU Interpreter
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 08-February-2026
 *  @link https://omareq.github.io/bf-interpreter/
 *  @link https://omareq.github.io/bf-interpreter/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2026 Omar Essilfie-Quaye
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


class BFCpu {
    constructor(nbits, program, memorySize) {
        this.nbits = nbits;
        this.program = program;
        this.memorySize = memorySize;
        this.data = new Array(this.memorySize);

        this.reset();
    }

    reset() {
        document.getElementById("output-text").textContent = "";
        this.data.fill(0);
        this.dataPtr = 0;
        this.instructionPtr = 0;
        this.executeCnt = 0;
    }

    setCurrentCell(value) {
    // TODO: apply n bit overflow calculations
        this.data[this.dataPtr] = value;
    }

    getCurrentCell() {
        return this.data[this.dataPtr];
    }

    setDataPtr(value) {
    // TODO: apply data overflow checks
        this.dataPtr = value;
    }

    getDataPtr() {
        return this.dataPtr;
    }

    setInstructionPtr(value) {
    //TODO: apply sanity checking
        this.instructionPtr = value;
    }

    step() {
        const instruction = this.program.instructionsList[this.instructionPtr];
        instruction.operation(this);
        this.instructionPtr++;
        this.executeCnt++;
    }

    execute() {
        while(this.instructionPtr < this.program.size) {
            this.step();
        }
    }
}

