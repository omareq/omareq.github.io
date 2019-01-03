/*******************************************************************************
*   @file sketch.js - Creating my own version of the Simon memory game
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 29-Oct-2018
*
*******************************************************************************/

// TODO omar(omareq08@gmail.com): refactor tiles into a class

/**
*   Stores the start frame so that the animations are not clipped at the
*   beginning
*
*   @type{nuber}
*/
let frameOffset = 0;

/**
*   Stores the pattern that needs to be remembered
*
*   @type{Array<number>}
*/
let sequence = [];

/**
*   Stores the position in the sequence the program is at when it is displaying
*   the sequence for the user to remember.
*
*   @type{number}
*/
let position = 0;

/**
*   Flag to say wether or not the sequence is currently being displayed
*
*   @type{boolean}
*/
let showSequence = false;

/**
*   The alpha value for the tiles that are turned on
*
*   @type{number}
*/
let onAlpha = 255;

/**
*   The alpha value for the tiles that are turned off
*
*   @type{number}
*/
let offAlpha = 200;

/**
*   An array of alpha values for all the tiles
*
*   @type{Array<number>}
*/
let alpha = [offAlpha, offAlpha, offAlpha, offAlpha];

/**
*   The index of the green tile in the alpha array
*
*   @type{number}
*/
let greenIndex = 0;

/**
*   The index of the red tile in the alpha array
*
*   @type{number}
*/
let redIndex = 1;

/**
*   The index of the yellowtile in the alpha array
*
*   @type{number}
*/
let yellowIndex = 2;

/**
*   The index of the blue tile in the alpha array
*
*   @type{number}
*/
let blueIndex = 3;

/**
*   A flag to dictate wether the game is being played in the classica way or if
*   the user has to remember the sequence backwards.
*
*   @type{boolean}
*/
let classicMode = false;

/**
*   A flag which dictates if the start screen is shown or not.
*
*   @type{boolean}
*/
let startMode = true;

/**
*   A flag which dictates if the user can input the remembered sequence.
*
*   @type{boolean}
*/
let inputMode = false;

/**
*   A flag to see if the current user input has stopped lighting up
*
*   @type{boolean}
*/
let nextInput = true;

/**
*   An array storing the users input values
*
*   @type{Array<number>}
*/
let input = [];

/**
*   The minimum number of frames between each user input so that the selected
*   tile can light up.
*
*   @type{number}
*/
let inFrequency = 20;

/**
*   The number of frames between each flash of a tile whilst the computer is
*   showing the user the sequence.
*
*   @type{number}
*/
let frequency = 45;

/**
*   The start frame for when the tile flash should turn off so that consecutive
*   flashes of the same tile do not blend into one.
*
*   @type{number}
*/
let delayStart = 30;

/**
*   User score
*
*   @type{number}
*/
let score = -1;

/**
*   Function to add a random number between 1 and 4 to the end of the sequence
*   array
*
*   @param {number} amount - How many numbers to add to the sequence
*/
function extendSequence(amount=1) {
    for(let i = 0; i < amount; ++i) {
        sequence.push(floor(random(1, 5)));
    }
}

/**
*   Function to begin the game
*/
function startGame() {    
    showSequence = true;
    startMode = false;
}

/**
*   Function to reset all game variables
*/
function resetGame() {
    score = sequence.length - 1;
    inputMode = false;
    nextInput = true;
    startMode = true;
    position = 0;
    sequence = [];
    extendSequence();
    input = [];
    frameOffset = frameCount;
}

/**
*   Function to handle key presses.  This will either switch the game to clasic
*   mode or backwards mode.
*/
function keyPressed() {
    if(startMode) {
        if(key.toLowerCase() == "c") {
            classicMode = true;
            resetGame();
            startGame();
        } else if(key.toLowerCase() == "b") {
            classicMode = false;
            resetGame();
            startGame();
        }
    }
}

/**
*   Function to handle mouse press events.  This will either begin the program
*   or act as the user input for the sequence.
*/
function mousePressed() {
    let mx = mouseX;
    let my = mouseY;

    if(mx > width || mx < 0 || my > height || my < 0) {
        return;
    }

    frameOffset = frameCount;
    if(startMode) {
        startGame();
    } else if(inputMode) {
        if(nextInput) {
          nextInput = false;

            if(mx < .5 * width && my < .5 * height) {
                input.push(1);
            } else if(mx > .5 * width && my < .5 * height) {
                input.push(2);
            } else if(mx < .5 * width && my > .5 * height) {
                input.push(3);
            } else if(mx > .5 * width && my > .5 * height) {
                input.push(4);
            }

            let inLength = input.length;
            let inputVal = input[inLength - 1];
            let cReset = inputVal != sequence[inLength - 1];
            let bReset = inputVal != sequence[sequence.length - inLength];
            let reset = classicMode && cReset || !classicMode && bReset;
            if(reset) {
                resetGame();
            }
        }
    }
}

/**
*   p5.js function, creates canvas and intialises sequence
*/
function setup() {
    noStroke();
    let size = 0;
    if(windowHeight > windowWidth) {
        size = .95 * windowWidth;
    } else {
        size = .95 * windowHeight;
    }
    let canvas = createCanvas(size, size);
    canvas.parent('sketch');

    extendSequence();
}

/**
*   Draws which mode is currently active in the top left corner of the screen
*/
function drawMode() {
    let fillVal = 0;
    if(startMode) {
        fillVal = 255;
    }
    fill(fillVal);

    textSize(0.035 * height);
    textAlign(LEFT, TOP);
    let string = "";
    if(classicMode) {
        string = "Classic Mode";
    } else {
        string = "Backwards Mode";
    }
    text(string, 5, 5);
}

/**
*   p5.js function, draws all elements on the screen
*/
function draw() {
    background(0);
    drawMode();

    if(startMode) {
        textAlign(CENTER, CENTER);
        textSize(0.035 * height);
        fill(255);
        text("To play classic Simon click C.  To play backwards Simon click B.",
         .5 * width, .5 * height);
        // text("", .5 * width, .5 * height);
            
        text("Click to see sequence", .5 * width, .75 * height);

        if(score != -1) {
            textSize(.2 * height);
            text(score, .5 * width, .25 * height);
        }
      return;
    }

    alpha[greenIndex]  = offAlpha;
    alpha[redIndex]    = offAlpha;
    alpha[yellowIndex] = offAlpha;
    alpha[blueIndex]   = offAlpha;

    if(showSequence) {
        let sequenceVal = sequence[position];
        if(sequenceVal == 1) {
            alpha[greenIndex] = onAlpha;
        } else if(sequenceVal == 2) {
            alpha[redIndex] = onAlpha;
        } else if(sequenceVal == 3) {
            alpha[yellowIndex] = onAlpha;
        } else if(sequenceVal == 4) {
            alpha[blueIndex] = onAlpha;
        }

        if((frameCount - frameOffset) % frequency == (frequency - 1)) {
            position++;
            if(position == sequence.length) {
                position = 0;
                showSequence = false;
                inputMode = true;
                input = [];
            }
        }

        if((frameCount - frameOffset) % frequency > delayStart) {
            alpha[greenIndex]  = offAlpha;
            alpha[redIndex]    = offAlpha;
            alpha[yellowIndex] = offAlpha;
            alpha[blueIndex]   = offAlpha;
        }
    } else if(inputMode) {
        let inputVal = input[input.length - 1];

        if((frameCount - frameOffset) % inFrequency == 0) {
            nextInput = true;

            if(input.length == sequence.length) {
                inputMode = false;
                showSequence = true;
                position = 0;
                extendSequence();
                input = [];
                frameOffset = frameCount + 10;
            }
        }

        if(!nextInput) {
            if(inputVal == 1) {
                alpha[greenIndex] = onAlpha;
            } else if(inputVal == 2) {
                alpha[redIndex] = onAlpha;
            } else if(inputVal == 3) {
                alpha[yellowIndex] = onAlpha;
            } else if(inputVal == 4) {
                alpha[blueIndex] = onAlpha;
            }
        }
    }

    fill(0, 255, 0, alpha[greenIndex]);
    rect(0, 0, width/2, height/2);

    fill(255, 0, 0, alpha[redIndex]);
    rect(width/2, 0, width/2, height/2);

    fill(255, 255, 0, alpha[yellowIndex]);
    rect(0, height/2, width/2, height/2);

    fill(0, 0, 255, alpha[blueIndex]);
    rect(width/2, height/2, width/2, height/2);

    drawMode();
}