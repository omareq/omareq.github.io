/*******************************************************************************
 *
 *  @file bf-program.js A Brain Fuck Program Parser
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

// TODO: Think about un/signed 8/16/32/64/BIGINT bit instruction set

/**
 * A class which is the interface for CPU Instructions.
 *
 * @see BFCpu
 * @see BFProgram
 */
class BFInstruction {
    /**
     * Constructor for the BFInstructor Abstract Interface class.
     *
     * @param symbol {String} - The symbol for the instruction
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     *
     * @throws {Error} Abstract class BFInstruction can't be instantiated
     */
    constructor(symbol, locationIndex) {
        let err = "Abstract class BFInstruction can't be instantiated.";
        if(this.constructor == BFInstruction) {
            throw new Error(err);
        }

        this.symbol = symbol;
        this.locationIndex = locationIndex;
    }

    /**
     * Applies the Instruction operation to the CPU.
     *
     * @param cpu {BFCpu} - The cpu to apply the operation on.
     *
     * @throws {Error} Method Operation() must be implemented.
     */
    operation(cpu) {
        throw new Error("Method 'operation()' must be implemented.");
    }
}

/**
 * The Add instruction that increments the current data cell by N
 */
class Add extends BFInstruction {
    /**
     * Constructor for the add instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     * @param N {Number} - Positive Integer to add to current data cell
     */
    constructor(locationIndex, N) {
        super(`__ADD_${N}__`, locationIndex);
        if(!Number.isInteger(N)) {
            throw new Error(`N Should be an integer: ${N}`);
        }
        if(N < 0 ) {
            throw new Error(`N should should be positive ${N}`)
        }
        this.N = N;
    }

    /**
     * Applies the add N instruction to the cpu
     *
     * @param cpu {BFCpu} - The cpu to apply the operation on.
     */
    operation(cpu) {
        cpu.setCurrentCell(cpu.getCurrentCell() + this.N);
    }
}

/**
 * The plus instruction that increments the current data cell
 */
class Plus extends Add {
    /**
     * Constructor for the plus instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     */
    constructor(locationIndex) {
        super(locationIndex, 1);
    }
}

/**
 * The Add instruction that decrements the current data cell by N
 */
class Sub extends BFInstruction {
    /**
     * Constructor for the sub instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     * @param N {Number} - Positive Integer to sub from the current data cell
     */
    constructor(locationIndex, N) {
        super(`__SUB_${N}__`, locationIndex);
        if(!Number.isInteger(N)) {
            throw new Error(`N Should be an integer: ${N}`);
        }
        if(N < 0 ) {
            throw new Error(`N should should be positive ${N}`)
        }
        this.N = N;
    }

    /**
     * Applies the sub N instruction to the cpu
     *
     * @param cpu {BFCpu} - The cpu to apply the operation on.
     */
    operation(cpu) {
        cpu.setCurrentCell(cpu.getCurrentCell() - this.N);
    }
}


/**
 * The Minus instruction that decrements the current data cell
 */
class Minus extends Sub {
    /**
     * Constructor for the minus instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     */
    constructor(locationIndex) {
        super(locationIndex, 1);
    }
}

/**
 * The left shift instruction that shifts the data pointer to the left N cells
 *
 */
class LShiftN extends BFInstruction {
    /**
     * Constructor for the Left Shift instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     * @param N {Number} - Positive Integer to shift data pointer to the left by
     */
    constructor(locationIndex, N) {
        super(`__L_SHIFT_${N}__`, locationIndex);
        if(!Number.isInteger(N)) {
            throw new Error(`N Should be an integer: ${N}`);
        }
        if(N < 0 ) {
            throw new Error(`N should should be positive ${N}`)
        }
        this.N = N;
    }

    /**
     * Applies the left shift instruction to the cpu
     *
     * @param cpu {BFCpu} - The cpu to apply the operation on.
     */
    operation(cpu) {
        //TODO: Data ptr overflow/underflow error catch rethrow with line num
        cpu.setDataPtr(cpu.getDataPtr() - this.N);
    }
}

/**
 * The left shift instruction that shifts the data pointer to the left
 */
class LShift extends LShiftN {
    /**
     * Constructor for the Left Shift instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     */
    constructor(locationIndex) {
        super(locationIndex, 1);
    }
}

/**
 * The right shift instruction that shifts the data pointer to the right N cells
 *
 */
class RShiftN extends BFInstruction {
    /**
     * Constructor for the Right Shift instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     * @param N {Number} - Positive Integer to shift data pointer to the right by
     */
    constructor(locationIndex, N) {
        super(`__R_SHIFT_${N}__`, locationIndex);
        if(!Number.isInteger(N)) {
            throw new Error(`N Should be an integer: ${N}`);
        }
        if(N < 0 ) {
            throw new Error(`N should should be positive ${N}`)
        }
        this.N = N;
    }

    /**
     * Applies the right shift instruction to the cpu
     *
     * @param cpu {BFCpu} - The cpu to apply the operation on.
     */
    operation(cpu) {
        //TODO: Data ptr overflow/underflow error catch rethrow with line num
        cpu.setDataPtr(cpu.getDataPtr() + this.N);
    }
}

/**
 * The right shift instruction that shifts the data pointer to the right
 */
class RShift extends RShiftN {
    /**
     * Constructor for the right shift instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     */
    constructor(locationIndex) {
        super(locationIndex, 1);
    }
}

/**
 * The input instruction that reads the input and places it in the current data
 * cell.  Uses ASCII formatting.
 */
class Input extends BFInstruction {
    /**
     * Constructor for the input instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     */
    constructor(locationIndex) {
        super(",", locationIndex);
    }

    /**
     * Applies the input instruction to the cpu
     *
     * @param cpu {BFCpu} - The cpu to apply the operation on.
     */
    operation(cpu) {
        cpu.setCurrentCell(cpu.getNextInput());
    }
}

/**
 * The output instruction that writes the output from the current cell.  Uses
 * ASCII formatting.
 */
class Output extends BFInstruction {
    /**
     * Constructor for the output instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     */
    constructor(locationIndex) {
        super(".", locationIndex);
    }

    /**
     * Applies the output instruction to the cpu
     *
     * @param cpu {BFCpu} - The cpu to apply the operation on.
     */
    operation(cpu) {
        const char = cpu.getCurrentCell();
        const ascii = String.fromCharCode(char);
        cpu.outputBuffer.push(ascii);
    }
}

/**
 * The paired instruction.  This saves two locations one for the current
 * instruction and one for a jump location.
 *
 * @see BFInstruction
 * @see LBrack
 * @see RBrack
 */
class PairedInstruction extends BFInstruction {
    /**
     * Constructor for the paired instruction abstract class interface
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     * @param pairedLocationIndex {Number} - The location of the jump instruction within the unoptimised source code
     *
     * @throws {Error} Abstract class PairedInstruction can't be instantiated
     */
    constructor(symbol, locationIndex, pairedLocationIndex) {
        super(symbol, locationIndex);
        let err = "Abstract class PairedInstruction can't be instantiated.";
        if(this.constructor == PairedInstruction) {
            throw new Error(err);
        }
        this.pairedLocationIndex = pairedLocationIndex;
    }

    /**
    * Gets the jump location index of the paired instruction
    *
    * @returns {Number} - The jump location index
    */
    jumpLocation() {
        return this.pairedLocationIndex;
    }
}

/**
 * The left bracket instruction which starts a while loop.  This is paired with
 * the right bracket instruction to close the loop.
 *
 * @see BFInstruction
 * @see PairedInstruction
 * @see RBrack
 */
class LBrack extends PairedInstruction {
    /**
     * Constructor for the Left Bracket instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     * @param pairedLocationIndex {Number} - The location of the jump instruction within the unoptimised source code
     */
    constructor(locationIndex, pairedLocationIndex) {
        super("[", locationIndex, pairedLocationIndex);
    }

    /**
     * Applies the Left bracket instruction to the cpu.  Only jumps to the close
     * bracket if the value at the current data cell is zero.
     *
     * @param cpu {BFCpu} - The cpu to apply the operation on.
     */
    operation(cpu) {
        if(cpu.getCurrentCell() == 0) {
            cpu.setInstructionPtr(this.pairedLocationIndex);
        }
    }
}

/**
 * The right bracket instruction which closes a while loop.  This is paired with
 * the left bracket instruction to start the loop.
 *
 * @see BFInstruction
 * @see PairedInstruction
 * @see LBrack
 */
class RBrack extends PairedInstruction {
    /**
     * Constructor for the Right Bracket instruction
     *
     * @param locationIndex {Number} - The location of the instruction within the unoptimised source code
     * @param pairedLocationIndex {Number} - The location of the jump instruction within the unoptimised source code
     */
    constructor(locationIndex, pairedLocationIndex) {
        super("]", locationIndex, pairedLocationIndex);
    }

    /**
     * Applies the right bracket instruction to the cpu.  Only jumps to the start
     * bracket if the value at the current data cell is not zero.  Notionally
     * this instruction can be an unconditional jump as the left bracket will
     * do this check anyway. However doing the check at the close saves an
     * additional cpu cycle jumping back and then forward again.
     *
     * @param cpu {BFCpu} - The cpu to apply the operation on.
     */
    operation(cpu) {
        if(cpu.getCurrentCell() != 0) {
            cpu.setInstructionPtr(this.pairedLocationIndex);
        }
    }
}

/**
 * A function to remove comments and excess white space from the source code.
 *
 * @param rawProgramtext {String} - The raw source code
 *
 * @returns {String} - The preprocessed source code
 */
function preProcess(rawProgramtext) {
    const textArr = rawProgramtext.split("");
    const program = textArr.filter(operation =>
        operation.includes(["+"]) ||
        operation.includes(["-"]) ||
        operation.includes(["."]) ||
        operation.includes([","]) ||
        operation.includes(["<"]) ||
        operation.includes([">"]) ||
        operation.includes(["["]) ||
        operation.includes(["]"])
    );
    return program;
}

/**
 * Function to find the matching jump end for a particular left bracket.  If not
 * matching returns undefined.
 *
 * @returns {Number} - Jump index location
 */
function getJumpEnd(program, jumpStart) {
    // TODO: throw on error finding jump end
    // TODO: Refactor get jump locations into one function with char params and dir
    // assert(jumpStart >= program.instructions && jumpStart < program.end);
    let i_ptr = jumpStart;

    let bracket_cnt = 1;
    while (bracket_cnt > 0) {
        i_ptr++;

        if(i_ptr >= program.length) {
            return;
        }

        if(program[i_ptr] == '[') {
            bracket_cnt++;
        } else if(program[i_ptr] == ']') {
            bracket_cnt--;
        }
    }
    return i_ptr;
}

/**
 * Function to find the matching jump start for a particular right bracket.  If
 * not matching returns undefined.
 *
 * @returns {Number} - Jump index location
 */
function getJumpStart(program, jumpEnd) {
    // TODO: throw on error finding jump start
    // assert(jumpEnd >= program.instructions && jumpEnd < program.end);
    let i_ptr = jumpEnd;

    let bracket_cnt = 1;
    while (bracket_cnt > 0) {
        i_ptr--;

        if(i_ptr < 0) {
            return;
        }

        if(program[i_ptr] == ']') {
            bracket_cnt++;
        } else if(program[i_ptr] == '[') {
            bracket_cnt--;
        }
    }
    return i_ptr;
}

/**
 * Function to compress program using run length encoding for a given char.  If
 * a run of more than 1 character is found then the sequence of repeated chars
 * is replaced with the length of the sequence then the char.  EG
 *
 * optimiseRLE("++++", "+") -> Returns "4+""
 *
 * Note that the return type is now an array of strings not chars.
 *
 * @param program {Array<Char>} - Array of source code characters
 * @param char {char} - The character to compress
 *
 * @returns {Array<String>} - Returns array of RLE compressed source code
 */
function optimiseRLE(program, char) {
    let optimised = [];
    let encodeChar = char;
    for(let i = 0; i < program.length; i++) {
        if(program[i] == encodeChar && program[i+1] == encodeChar) {
            let charCount = 1;
    // TODO: replace while loop with for loop ending at end of program
            while(program[i + charCount] == encodeChar) {
                charCount++;
            }

            optimised.push(charCount + encodeChar);
            i += charCount -1;
            continue;
        }

        optimised.push(program[i]);
    }
    // console.log("RLE: " + optimised);
    return optimised;
}

/**
 * Applies optimisations to the source code of the program
 * Note that the return type is now an array of strings not chars.
 *
 * @param program {Array<char>} - The pre processed source code with no comments
 *
 * @returns {Array<String>} - The optimised source code
 */
function optimiseProgramTxt(program) {
    let optimised = optimiseRLE(program, "+");
    optimised = optimiseRLE(optimised, "-");
    optimised = optimiseRLE(optimised, "<");
    optimised = optimiseRLE(optimised, ">");
    return optimised;
}

/**
 * A function to parse the optimised source code into BFInstruction objects
 *
 * @param programText {Array<char>} - The source code
 *
 * @returns {Array<BFInstruction>} - The list of instructions
 */
function parse(programTxt) {
//TODO: Search through BFInstructions compare to symbols automatically
    let instructionsList = new Array(programTxt.length);
    for(let i = 0; i < programTxt.length; i++) {
        if(programTxt[i] == "+") {
            instructionsList[i] = new Plus(i);
        } else if(programTxt[i] == "-") {
            instructionsList[i] = new Minus(i);
        } else if(programTxt[i] == "<") {
            instructionsList[i] = new LShift(i);
        } else if(programTxt[i] == ">") {
            instructionsList[i] = new RShift(i);
        } else if(programTxt[i] == "[") {
            const jumpEndIndex = getJumpEnd(programTxt, i);
// TODO: error on unmatched bracket
            instructionsList[i] = new LBrack(i, jumpEndIndex);
        } else if(programTxt[i] == "]") {
            const jumpStartIndex = getJumpStart(programTxt, i);
// TODO: error on unmatched bracket
            instructionsList[i] = new RBrack(i, jumpStartIndex);
        } else if(programTxt[i] == ".") {
            instructionsList[i] = new Output(i);
        } else if(programTxt[i] == ",") {
            instructionsList[i] = new Input(i);
        }
    }
    return instructionsList;
}

/**
 * A class containing a list of BFInstructions and the length of the code.
 */
class BFProgram {
    /**
     * The constructor for a BF program
     *
     * @param instructionsList {Array<BFInstructions>} - The instructions list
     */
    constructor(instructionsList) {
        this.instructionsList = instructionsList;
        this.size = instructionsList.length;
        this.length = instructionsList.length;
    }
}

if (typeof window === 'undefined') {
    module.exports = { parse, BFProgram, preProcess };
    // this is node
}
