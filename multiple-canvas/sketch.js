/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     30-Jun-2018
*   Program:  Figuring out how todraw multiple canvases to one webpage
*
*******************************************************************************/


var sketch1 = function( p ) {

  var x = 325; 
  var y = 100;
  var vx = -10;

  p.setup = function() {
  	let canvas = p.createCanvas(600, 200);//, p.WEBGL);
  	canvas.parent('sketch1');
    p.createCanvas(700, 410);
  };

  p.draw = function() {
    p.background(0);
    p.translate(0,0,-p.width/2);
    p.fill(255);
    p.rect(x,y,50,50);

    x += vx;
    if(x + 50 > p.width) {
    	vx *= -1;
    }

    if(x < 0) {
    	vx *= -1;
    }

  };
};

var sketch2 = function( p ) {

  var x = 325; 
  var y = 100;
  var vx = 10;

  p.setup = function() {
  	let canvas = p.createCanvas(600, 200);//, p.WEBGL);
  	canvas.parent('sketch2');
    p.createCanvas(700, 410);
  };

  p.draw = function() {
    p.background(255);
    p.translate(0,0,-p.width/2);
    p.fill(0);
    p.rect(x,y,50,50);

    x += vx;
    if(x + 50 > p.width) {
    	vx *= -1;
    }

    if(x < 0) {
    	vx *= -1;
    }
  };
};

var mcanvas1 = new p5(sketch1);
var mcanvas2 = new p5(sketch2);