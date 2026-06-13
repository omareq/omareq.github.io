const {BFCpu} = require("../bf-interpreter/bf-interpreter.js");
const {parse, BFProgram, preProcess} = require("../bf-interpreter/bf-program.js");

function output() {} // Inject empty dependency for the BF CPU

QUnit.module.only("p_032", function (hooks) {

QUnit.test("BF Interpreter: Hello Test", function(assert) {
    assert.ok(1 == "1", "Passed!" );
});

QUnit.test("BF Interpreter: Parser Simple", function(assert) {
    const sourceWithComments = "prepended comment to ignore +- appended comment";
    const instructionsComments = preProcess(sourceWithComments);
    assert.equal(instructionsComments.length, 2, "BF Preprocessor Remove Comments");

    const sourceCode = "+-,.<>[]";
    const expectedSymbol = [
        "__ADD_1__",
        "__SUB_1__",
        ",",
        ".",
        "__L_SHIFT_1__",
        "__R_SHIFT_1__",
        "[",
        "]"
    ];

    const instructions = parse(sourceCode);

    for(let i = 0; i < instructions.length; i++) {
        let output = instructions[i].symbol == expectedSymbol[i];
        output = output || instructions[i].symbol == sourceCode[i];
        assert.equal(output, true,
            "BF Parser Test: " + sourceCode[i]);
    }
});

QUnit.test("BF Interpreter: +", function(assert) {
    const inputAsciiCodes = [0];
    const program = new BFProgram(parse("+"));
    const memSize = 1;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.data[0], 1, "BF Interpreter Test: +");
});

QUnit.test("BF Interpreter: NBits Uint[8,16,32] architectures", function(assert) {
    const inputAsciiCodes = [0];
    const underflowProgram = new BFProgram(parse("-"));
    const memSize = 1;
    const NBits = [8, 16, 32];

    assert.throws(function () {
        let cpu = new BFCpu(1, underflowProgram, memSize, inputAsciiCodes, output);
    },
    (err) => err.toString() === "BFCpu Architecture NBits must be one of [8, 16, 32]",
    "BF Interpreter Test: NBits Arch Incorrect NBits selected"
  );

    // Underflow
    for(let i = 0; i < NBits.length; i++) {
        let cpu = new BFCpu(NBits[i], underflowProgram, memSize, inputAsciiCodes, output);
        cpu.execute();
        assert.equal(cpu.data[0], 2**NBits[i] - 1, "BF Interpreter Test: NBits Arch Underflow " + NBits[i]);
    }

    // Overflow
    for(let i = 0; i < NBits.length; i++) {
        const overFlowSource = "+".repeat(2**NBits);
        const overflowProgram = new BFProgram(parse(overFlowSource));
        let cpu = new BFCpu(NBits[i], overflowProgram, memSize, inputAsciiCodes, output);
        cpu.execute();
        assert.equal(cpu.data[0], 0, "BF Interpreter Test: NBits Arch Overflow " + NBits[i]);
    }
});

QUnit.test("BF Interpreter: Memory", function(assert) {
    const inputAsciiCodes = [0];
    const underflowProgram = new BFProgram(parse("<"));
    const overflowProgram = new BFProgram(parse(">>"));

    // memory size -1 throw error
    assert.throws(function () {
        let cpu = new BFCpu(8, underflowProgram, -1, inputAsciiCodes, output);
    },
    (err) => err.toString() === "BFCpu Memory Size must be greater than 0",
    "BF Interpreter Test: Memory Size > 0: Value -1"
    );

    // memory size 0 throw error
    assert.throws(function () {
        let cpu = new BFCpu(8, underflowProgram, 0, inputAsciiCodes, output);
    },
    (err) => err.toString() === "BFCpu Memory Size must be greater than 0",
    "BF Interpreter Test: Memory Size > 0: Value 0"
    );

    // memory underflow in cpu memory error mode
    assert.throws(function () {
        let cpu = new BFCpu(8, underflowProgram, 2, inputAsciiCodes, output);
        cpu.setDataPtrWrapMode(false);
        cpu.execute();
    },
    (err) => err.toString() === "BFCpu Data Pointer Underflow: -1",
    "BF Interpreter Test: Data pointer wrap mode ERROR: Underflow"
    );

    // memory overflow in cpu memory error mode
    assert.throws(function () {
        let cpu = new BFCpu(8, overflowProgram, 2, inputAsciiCodes, output);
        cpu.setDataPtrWrapMode(false);
        cpu.execute();
    },
    (err) => err.toString() === "BFCpu Data Pointer Overflow: 2",
    "BF Interpreter Test: Data pointer wrap mode ERROR: Overflow"
    );

    // memory underflow in cpu memory wrap mode
    let cpuunder = new BFCpu(8, underflowProgram, 2, inputAsciiCodes, output);
    cpuunder.execute();
    assert.equal(cpuunder.dataPtr, 1, "BF Interpreter Test: Data pointer wrap mode WRAP: Underflow");

    // memory overflow in cpu memory wrap mode
    let cpuover = new BFCpu(8, overflowProgram, 2, inputAsciiCodes, output);
    cpuover.execute();
    assert.equal(cpuover.dataPtr, 0,"BF Interpreter Test: Data pointer wrap mode WRAP: Overflow");
});

QUnit.test("BF Interpreter: Basic Instructions", function(assert) {
    const inputAsciiCodes = [65];
    const program = new BFProgram(parse("+-><,.[-]"));
    const memSize = 2;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    // console.log(cpu);
    // +
    cpu.step();
    assert.equal(cpu.data[0], 1, "BF Interpreter Test: +");

    // -
    cpu.step();
    assert.equal(cpu.data[0], 0, "BF Interpreter Test: -");

    // >
    cpu.step();
    assert.equal(cpu.dataPtr, 1, "BF Interpreter Test: >");

    // <
    cpu.step();
    assert.equal(cpu.dataPtr, 0, "BF Interpreter Test: <");

    // ,
    cpu.step();
    assert.equal(cpu.data[0], inputAsciiCodes[0], "BF Interpreter Test: ,");

    // .
    cpu.step();
    assert.equal(cpu.outputBuffer[0], "A", "BF Interpreter Test: .");

    // post [-] should clear cell 0
    cpu.execute();
    assert.equal(cpu.data[0], 0, "BF Interpreter Test: [-] Clear cell");

    // Simple paired instruction test []
    assert.equal(program.instructionsList[6].pairedLocationIndex, 8, "BF Interpreter Test: [ Jump Index")
    assert.equal(program.instructionsList[8].pairedLocationIndex, 6, "BF Interpreter Test: ] Jump Index")

// TODO: test nested paired instructions to make sure they jump to the correct location
});

QUnit.test("BF Interpreter: Hello World", function(assert) {
    const programText = "++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>++.>+.+++++++..+++.<<++.>+++++++++++++++.>.+++.------.--------.";
    const inputAsciiCodes = [0];
    const program = new BFProgram(parse(programText));
    const memSize = 10;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.outputBuffer.join(""), "Hello World", "BF Interpreter Test: Hello World");
});

QUnit.test("BF Interpreter: Print A-Z", function(assert) {
    const programText = "++++++[->++++++++++<]>+++++<++++++++++++++++++++++++++[->.+<]";
    const inputAsciiCodes = [0];
    const program = new BFProgram(parse(programText));
    const memSize = 10;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.outputBuffer.join(""), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "BF Interpreter Test: Print A-Z");
});

QUnit.test("BF Interpreter: Input EOF", function(assert) {
    const programText = ",,";
    const inputAsciiCodes = [65];
    const program = new BFProgram(parse(programText));
    const memSize = 1;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.step();
    assert.equal(cpu.data[0], 65, "BF Interpreter Test: Echo Input");
    cpu.step();
    assert.equal(cpu.data[0], 0, "BF Interpreter Test: Echo Input");
    // console.log(cpu);
});

QUnit.test("BF Interpreter: Echo Input", function(assert) {
    const programText = ",[.,]";
    const inputAsciiCodes = [65, 66, 67, 68, 69];
    const program = new BFProgram(parse(programText));
    const memSize = 10;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.outputBuffer.join(""), "ABCDE", "BF Interpreter Test: Echo Input");
});

QUnit.test("BF Interpreter: Reverse Input", function(assert) {
    const programText = ">,[>,]<[.<]";
    const inputAsciiCodes = [65, 66, 67, 68, 69];
    const program = new BFProgram(parse(programText));
    const memSize = 10;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.outputBuffer.join(""), "EDCBA", "BF Interpreter Test: Reverse Input");
});

QUnit.test("BF Interpreter: Speed Test", function(assert) {
    const expectedTime = 1000; // ms - expecting less than 50ms on i5 at 1.6GHz
    const startTime = Date.now()
    const programText = "+++++++++++++++++[>+++++++++++++++<-]>[>+++++++++++++++++[>+++++++++++++++<-]<-]>>>++++++++[<++++++>-]<.";
    const inputAsciiCodes = [0];
    const program = new BFProgram(parse(programText));
    const memSize = 30000;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    const endTime = Date.now();

    const executionTime = endTime - startTime;
    assert.equal(cpu.outputBuffer.join(""), "1", "BF Interpreter Test: Speed Test Expected Output");
    const errorMessage  = `BF Interpreter Test: Execution Speed is insufficient: Execution Time ${executionTime}ms > ${expectedTime}ms budget.`
    assert.ok(executionTime < expectedTime, errorMessage);
});

});

