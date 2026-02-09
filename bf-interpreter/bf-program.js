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

// TODO: Think about 8/16/32/64/BIGINT bit instruction set
class Instruction {
    constructor(symbol, locationIndex) {
        let err = "Abstract class Instruction can't be instantiated.";
        if(this.constructor == Instruction) {
            throw new Error(err);
        }

        this.symbol = symbol;
        this.locationIndex = locationIndex;
        this.debugMode
    }

    operation(BFCpu) {
        throw new Error("Method 'operation()' must be implemented.");
    }
}

class Plus extends Instruction {
    constructor(locationIndex) {
        super("+", locationIndex);
    }

    operation(BFCpu) {
        BFCpu.setCurrentCell(BFCpu.getCurrentCell() + 1);
    }
}

class Minus extends Instruction {
    constructor(locationIndex) {
        super("-", locationIndex);
    }

    operation(BFCpu) {
        BFCpu.setCurrentCell(BFCpu.getCurrentCell() - 1);
    }
}

class LShift extends Instruction {
    constructor(locationIndex) {
        super("<", locationIndex);
    }

    operation(BFCpu) {
        BFCpu.setDataPtr(BFCpu.getDataPtr() - 1);
    }
}

class RShift extends Instruction {
    constructor(locationIndex) {
        super(">", locationIndex);
    }

    operation(BFCpu) {
        BFCpu.setDataPtr(BFCpu.getDataPtr() + 1);
    }
}

class Input extends Instruction {
    constructor(locationIndex) {
        super(",", locationIndex);
    }

    operation(BFCpu) {
// TODO: Implement Input
        BFCpu.setCurrentCell(0);
    }
}

class Output extends Instruction {
    constructor(locationIndex) {
        super(".", locationIndex);
    }

    operation(BFCpu) {
        const char = BFCpu.getCurrentCell();
        const ascii = String.fromCharCode(char);
// TODO: Consider how to buffer
        console.log(char + " ASCII: " + ascii);
        document.getElementById("output-text").textContent+=ascii;
    }
}

class PairedInstruction extends Instruction {
    constructor(symbol, locationIndex, pairedLocationIndex) {
        super(symbol, locationIndex);
        let err = "Abstract class PairedInstruction can't be instantiated.";
        if(this.constructor == PairedInstruction) {
            throw new Error(err);
        }
        this.pairedLocationIndex = pairedLocationIndex;
    }

    jumpLocation() {
        return this.pairedLocationIndex;
    }
}

class LBrack extends PairedInstruction {
    constructor(locationIndex, pairedLocationIndex) {
        super("[", locationIndex, pairedLocationIndex);
    }

    operation(BFCpu) {
        if(BFCpu.getCurrentCell() == 0) {
            BFCpu.setInstructionPtr(this.pairedLocationIndex);
        }
    }
}

class RBrack extends PairedInstruction {
    constructor(locationIndex, pairedLocationIndex) {
        super("]", locationIndex, pairedLocationIndex);
    }

    operation(BFCpu) {
        if(BFCpu.getCurrentCell() != 0) {
            BFCpu.setInstructionPtr(this.pairedLocationIndex);
        }
    }
}

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

// TODO: Refactor get jump locations into one function with char params and dir
function getJumpEnd(program, jumpStart) {
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

function getJumpStart(program, jumpEnd) {
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

function optimiseProgramTxt(program) {
    let optimised = optimiseRLE(program, "+");
    optimised = optimiseRLE(optimised, "-");
    optimised = optimiseRLE(optimised, "<");
    optimised = optimiseRLE(optimised, ">");
    return optimised;
}

function parse(programTxt) {
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
            instructionsList[i] = new LBrack(i, jumpEndIndex);
        } else if(programTxt[i] == "]") {
            const jumpStartIndex = getJumpStart(programTxt, i);
            instructionsList[i] = new RBrack(i, jumpStartIndex);
        } else if(programTxt[i] == ".") {
            instructionsList[i] = new Output(i);
        } else if(programTxt[i] == ",") {
            instructionsList[i] = new Input(i);
        }
    }
    return instructionsList;
}

class Program {
    constructor(instructionsList) {
        this.instructionsList = instructionsList;
        this.size = instructionsList.length;
        this.length = instructionsList.length;
    }
}

