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
     * @param nbits {Number} - The number of bits the architecture supports. Must be on of [8, 16, 32]
     * @param program {BFProgram} - The program to execute
     * @param memorySize {Number} - The size of the allocated memory at start up
     * @param inputCharCodes {Array<Number>} - The ASCII char codes of the input string
     */
    constructor(nbits=8, program, memorySize, inputCharCodes, outputFunction) {
        this.nbits = nbits;
        const allowedBits = [8, 16, 32];
        if(!allowedBits.includes(this.nbits)) {
            throw "BFCpu Architecture NBits must be one of [8, 16, 32]";
        }
        this.program = program;
        this.memorySize = memorySize;
        if(this.memorySize < 1) {
            throw "BFCpu Memory Size must be greater than 0";
        }

        if(this.nbits == 8) {
            this.data = new Uint8Array(this.memorySize);
        } else if(this.nbits == 16) {
            this.data = new Uint16Array(this.memorySize);
        } else if(this.nbits == 32) {
            this.data = new Uint32Array(this.memorySize);
        }

        this.inputBuffer = inputCharCodes;
        this.WATCH_DOG_COUNT = 1000000;
        this.haltExecution = false;
        this.outputFunction = outputFunction;
        this.dataPtrWrap = true;

        this.reset();
    }

    /**
     * Resets the CPU architecture:  clears the output, zeros memory, moves data
     * pointer to the start, moves instruction pointer to the start, zeros the
     * execute counter.
     */
    reset() {
        this.outputFunction("");
        this.data.fill(0);
        this.dataPtr = 0;
        this.instructionPtr = 0;
        this.executeCnt = 0;
        this.outputBuffer = [];
        this.inputPtr = 0;
        this.haltExecution = false;
		this.profileData = {};
		this.profile = false;
    }

	makeProfileData() {
		for(let i = 0; i < this.program.size; i++) {
			const symbol = this.program.instructionsList[i].symbol;
			const indexLocation = i;
				
			if(this.profileData[symbol] == undefined) {
				this.profileData[symbol] = {
					"count": 0, "index": {}
				};
				this.profileData[symbol].index[indexLocation] = 0;
			} else {
				this.profileData[symbol].index[indexLocation] = 0;
				
			}
		}
	}

	pushProfileInfo(data) {
		const indexLocation = data.index;
		this.profileData[data.symbol].count += 1;
		this.profileData[data.symbol].index[indexLocation] += 1;
	}

	enableProfiling() {
		this.profile = true;
	}

	disableProfiling() {
		this.profile = false;
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
     * Sets the data pointer mode to either wrap around or throw an error on
     * overflow and underflow.
     *
     * @param mode {Boolean} - True if wrap
     */
    setDataPtrWrapMode(mode) {
        if(typeof mode != "boolean") {
            throw "BFCpu data pointer wrap mode must be a boolean";
        }
        this.dataPtrWrap = mode;
    }

    /**
     * Set the data pointer to a new value
     *
     * @param value {Number} - The new data pointer location.
     */
    setDataPtr(value) {
        if(this.dataPtrWrap) {
            this.dataPtr = (value % this.data.length + this.data.length) % this.data.length;
        } else {
            this.dataPtr = value;
            if(this.dataPtr < 0) {
                throw "BFCpu Data Pointer Underflow: " + this.dataPtr;
            } else if(this.dataPtr >= this.data.length) {
                throw "BFCpu Data Pointer Overflow: " + this.dataPtr;
            }
        }
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
        if(value < 0 || value >= this.program.size) {
            throw "BFCpu Instruction Pointer out of bounds";
        }
        this.instructionPtr = value;
    }

    /**
     * Execute one instruction and increment the instruction pointer.
     */
    step() {
        if(this.haltExecution) {
            return;
        }
        if(this.instructionPtr >= this.program.size) {
            // TODO: throw an error?
            return;
        }
        const instruction = this.program.instructionsList[this.instructionPtr];
        if(instruction === undefined) {
            console.error("Current instruction is undefined:", instruction);
            this.haltExecution = true;
        }

        // instruction.operation(this);
        try{
			if(this.profile) {
				instruction.operationProfiled(this);
			} else {
				instruction.operation(this);
			}
        } catch (e) {
            if (typeof window !== 'undefined') {
                // this is browser
                console.error(e);
            }
            this.haltExecution = true;
            throw(e);
        }
        this.instructionPtr++;
        this.executeCnt++;
    }

    /**
     * Execute the entire program until the instruction pointer reaches the end
     * of the file.
     */
    execute() {
		if(this.profile) {
			this.makeProfileData();
		}

        while(this.instructionPtr < this.program.size) {
            this.step();
            if(this.executeCnt > this.WATCH_DOG_COUNT) {
                console.warn("BF CPU WATCHDOG Limit Reached: " + this.WATCH_DOG_COUNT);
                alert("Brainfuck CPU WATCHDOG Limit Reached: " +
                    this.WATCH_DOG_COUNT + "\nPossible Infinite Loop");
                break;
            }
            if(this.haltExecution) {
                console.warn("Halting Execution");
                break;
            }
        }
        this.outputFunction(this.outputBuffer.join(""));
    }
}

if (typeof window === 'undefined') {
    module.exports = { BFCpu };
    // this is node
}

