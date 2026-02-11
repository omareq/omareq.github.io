const {BFCpu} = require("../bf-interpreter/bf-interpreter.js");
const {parse, BFProgram} = require("../bf-interpreter/bf-program.js");

function output() {} // Inject empty dependency for the BF CPU

QUnit.test("p_032 BF Interpreter: Hello Test", function(assert) {
    assert.ok(1 == "1", "Passed!" );
});

QUnit.test("p_032 BF Interpreter Test: +", function(assert) {
    const inputAsciiCodes = [0];
    const program = new BFProgram(parse("+"));
    const memSize = 1;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.data[0], 1, "BF Interpreter Test: +");
});

QUnit.test("p_032 BF Interpreter Test: Hello World", function(assert) {
    const programText = "++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>++.>+.+++++++..+++.<<++.>+++++++++++++++.>.+++.------.--------.";
    const inputAsciiCodes = [0];
    const program = new BFProgram(parse(programText));
    const memSize = 10;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.outputBuffer.join(""), "Hello World", "BF Interpreter Test: Hello World");
});

QUnit.test("p_032 BF Interpreter Test: Print A-Z", function(assert) {
    const programText = "++++++[->++++++++++<]>+++++<++++++++++++++++++++++++++[->.+<]";
    const inputAsciiCodes = [0];
    const program = new BFProgram(parse(programText));
    const memSize = 10;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.outputBuffer.join(""), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "BF Interpreter Test: Print A-Z");
});

QUnit.test("p_032 BF Interpreter Test: Echo Input", function(assert) {
    const programText = ",[.,]";
    const inputAsciiCodes = [65, 66, 67, 68, 69];
    const program = new BFProgram(parse(programText));
    const memSize = 10;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.outputBuffer.join(""), "ABCDE", "BF Interpreter Test: Echo Input");
});

QUnit.test("p_032 BF Interpreter Test: Reverse Input", function(assert) {
    const programText = ">,[>,]<[.<]";
    const inputAsciiCodes = [65, 66, 67, 68, 69];
    const program = new BFProgram(parse(programText));
    const memSize = 10;
    let cpu = new BFCpu(8, program, memSize, inputAsciiCodes, output);
    cpu.execute();
    // console.log(cpu);
    assert.equal(cpu.outputBuffer.join(""), "EDCBA", "BF Interpreter Test: Reverse Input");
});



