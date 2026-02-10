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

/**
 * A class that stores the CPU model for the BF program execution.  This
 * includes the: data and instruction pointers, the instruction list, the memory
 * and the execution counter
 *
 * @see Program
 * @see Instruction
 */
class BFCpu {
    /**
     * The constructor for the BF CPU
     *
     * @param nbits {Number} - The number of bits the architecture supports
     * @param program {BFProgram} - The program to execute
     * @param memorySize {Number} - The size of the allocated memory at start up
     * @param inputCharCodes {Array<Number>} - The ASCII char codes of the input string
     */
    constructor(nbits, program, memorySize, inputCharCodes) {
        this.nbits = nbits;
        this.program = program;
        this.memorySize = memorySize;
        this.data = new Array(this.memorySize);
        this.outputHandle = document.getElementById("output-text");
        this.inputBuffer = inputCharCodes;
        this.WATCH_DOG_COUNT = 1000000;

        this.reset();
    }

    /**
     * Resets the CPU architecture:  clears the output, zeros memory, moves data
     * pointer to the start, moves instruction pointer to the start, zeros the
     * execute counter.
     */
    reset() {
        this.outputHandle.textContent = "";
        this.data.fill(0);
        this.dataPtr = 0;
        this.instructionPtr = 0;
        this.executeCnt = 0;
        this.outputBuffer = [];
        this.inputPtr = 0;
    }

    /**
     * Get the next input from the input buffer.  Returns zero at the end of the
     * array if it is not Null terminated.
     *
     * @returns {Number} - The ASCII char code
     */
    getNextInput() {
        if(this.inputPtr >= this.inputBuffer.length) {
            return 0;
        }
        return this.inputBuffer[this.inputPtr++];
    }

    /**
     * Set the current data cell to a new value.
     *
     * @param value {Number} - The new cell value
     */
    setCurrentCell(value) {
    // TODO: apply n bit overflow calculations
        this.data[this.dataPtr] = value;
    }

    /**
     * Gets the current data cell value.
     *
     * @returns {Number} - The current cell value
     */
    getCurrentCell() {
        return this.data[this.dataPtr];
    }

    /**
     * Set the data pointer to a new value
     *
     * @param value {Number} - The new data pointer location.
     */
    setDataPtr(value) {
    // TODO: apply data overflow checks
        this.dataPtr = value;
    }

    /**
     * Get the current location of the data pointer.
     *
     * @returns {Number} - The data pointer location.
     */
    getDataPtr() {
        return this.dataPtr;
    }

    /**
     * Set the instruction pointer to a new location
     *
     * @param value {Number} - The new instruction location
     */
    setInstructionPtr(value) {
    //TODO: apply sanity checking
        this.instructionPtr = value;
    }

    /**
     * Execute one instruction and increment the instruction pointer.
     */
    step() {
        const instruction = this.program.instructionsList[this.instructionPtr];
        instruction.operation(this);
        this.instructionPtr++;
        this.executeCnt++;
    }

    /**
     * Execute the entire program until the instruction pointer reaches the end
     * of the file.
     */
    execute() {
        while(this.instructionPtr < this.program.size) {
            this.step();
            if(this.executeCnt > this.WATCH_DOG_COUNT) {
                console.warn("BF CPU WATCHDOG Limit Reached: " + this.WATCH_DOG_COUNT);
                alert("Brainfuck CPU WATCHDOG Limit Reached: " +
                    this.WATCH_DOG_COUNT + "\nPossible Infinite Loop");
                break;
            }
        }
        this.outputHandle.textContent = this.outputBuffer.join("");
    }
}

