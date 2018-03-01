/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     09-Jan-2018
*   Program:  TexType based on Typespeed but with LaTeX
*
*******************************************************************************/
let missLimit = 10;
let minWordLength = 2;
let maxWordLength = 15;
let minWordsOnScreen = 1;
let maxWordsOnScreen = 20;
let minSpeed = 0.7;
let maxSpeed = 2; 
let speedStep = 0.005;
let numCommands;
let textHeight = 20;

let masterCommandsList;
let commands = [];

let keyStack = [];
let typedChars = 0;
let cps = 0;
let score = 0;
let speed = minSpeed;
let adjustSpeed = false;
let misses = 0;
let wpm = 0;
let totalCharsTyped = 0;
let errorCharsTyped = 0;

let blue, red;

let loading = true;
function preload() {
  try {
    //masterCommandsList = loadJSON('assets/commands.json', pickCommands);
    masterCommandsList = [
    "sin",
    "theta",
    "omega",
    "will",
    "rule",
    "coding",
    "name",
    "here",
    "nerd",
    "the",
    "looks",
    "lass",
    "something",
    "there",
    "and",
    "lad",
    "like",
    "party",
    "time",
    "hell",
    "heaven",
    "processing",
    "sharp"]
  }
  catch(err) {
    console.log("Failed to load commands");
  }
  loading = false;
}

function pickCommands() {
  for(let i = 0; i < masterCommandsList.length; i++) {
    let selectingY = true;
    let ypos;
    let watchdog = 0;
    while(selectingY) {
      selectingY = false;
      ypos = floor(random(1, 22)) * textHeight;
      watchdog++;
      if(watchdog > height/textHeight) {
        break;
      }
      for(let j = 0; j < i; j++) {
        if(ypos == commands[j].y) {
          selectingY = true;
          break;
        }
      }
    }
    commands.push(new Word(masterCommandsList[i], ypos, textHeight));
    commands[i].setSpeed(speed);
  }
}

const isAlphaNumeric = ch => {
  return ch.match(/^[a-zA-Z0-9]+$/i) !== null;
}

function keyPressed() {
  if(isAlphaNumeric(key || key == "\\")) {
    keyStack.push(key);
  } else if(keyCode == BACKSPACE) {
    keyStack.pop();
  } else {
    let stack = join(keyStack, '').toLowerCase();
    totalCharsTyped+=keyStack.length;
    
    let foundWord = false;
    for(let i = 0; i < commands.length; i++) {
      if(commands[i].run && stack == commands[i].val.toLowerCase()) {
        foundWord = true;
        commands[i].holdOn();
        activateNewCommand();

        typedChars += keyStack.length;

        prevScore = score;
        score += keyStack.length * ceil(speed);

        if(score%50 < prevScore%50) {
          activateNewCommand();
          if(score%150 < prevScore%150) {
            speed += speedStep;
            adjustSpeed = true;
            if(speed > maxSpeed) {
              speed = maxSpeed;
            }
          } 
        }
        break;
      }
    }
    if(!foundWord) {
      errorCharsTyped+= keyStack.length;
    }
    keyStack = [];
  }
}

function activateNewCommand() { 
  i = 0; 
  while(true) {
  let rand = random(commands);
    if(!rand.run) {
      rand.holdOff();
      break;
    }
    if(i > commands.length) {
      break;
    }
    i++;
  }
}

function stopAllCommands() {
  for(let i = 0; i < commands.length; i++) {
    commands[i].holdOn();
  }
}

function setup() {
  let canvas = createCanvas(80*10, 24 * textHeight);
  canvas.parent('sketch');
  textAlign(LEFT, TOP);
  textSize(textHeight);
  textFont('Consolas');

  background(0);

  numCommands = floor(1.1 * maxWordsOnScreen);
  pickCommands();
  activateNewCommand();

  blue = color(110, 65, 240);
  red = color(255, 0, 0);
}

function draw() {
  background(0);

  if(loading) {
    fill(255);
    ellipse(width/2, height/2, 30,30);
  }

  for(let i = 0; i < commands.length; i++) {
    commands[i].show();
    if(commands[i].runOffscreen()) {
      commands[i].holdOn();
      activateNewCommand();
      misses++;

      if(misses >= missLimit) {
        console.log("Final score:" + score);
        console.log("Final WPM:" + wpm);
        console.log("Error: " + floor(100*errorCharsTyped/totalCharsTyped) + "%");
        stopAllCommands();
        break;
      }
    }

    if(adjustSpeed) {
      commands[i].setSpeed(speed);
    } 
  }
  adjustSpeed = false;

  stroke(blue);
  line(0, height - textHeight, width, height - textHeight);
  stroke(0);
  fill(255);
  let stack = join(keyStack, '').toLowerCase();
  text(">" + stack + "<", 10, height - textHeight);

  cps = typedChars/(millis()/1000);
  fill(blue);
  text("CPS: ", 0.45 * width, height - textHeight);
  fill(red);
  text(round(cps), textWidth("CPS: ") + 0.45 * width, height - textHeight);
  
  wpm = cps * 12;
  fill(blue);
  text("WPM: ", 0.55 * width, height - textHeight);
  fill(red);
  text(round(wpm), textWidth("WPM: ") + 0.55 * width, height - textHeight);


  fill(blue);
  text("Misses: ", 0.7 * width , height - textHeight);
  fill(red);
  text(misses, textWidth("Misses: ") + 0.7 * width , height - textHeight);
  
  fill(blue);
  text("Score: ", 0.85 * width , height - textHeight);
  fill(red);
  text(floor(score), textWidth("Score: ") + 0.85 * width , height - textHeight);
}
