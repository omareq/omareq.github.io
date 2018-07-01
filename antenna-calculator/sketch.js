/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     30-Jun-2018
*   Program:  Calculating the dimensions of antenna depending on the required
*             transmission frequency.
*
*******************************************************************************/

new p5();

let t = 0;
let got_data = false;
let points_per_turn;

// input values from form
let frequency, nturns;

// calculated values
let lambda;
let gain, gain_dbi, impedance;
let reflector_diameter;

// helix dimensions
let h_diameter, h_circumference;
let h_spacing, h_pitch;
let h_length, h_wire_length;

let val = 255;

function change_res() {
	points_per_turn = document.getElementById("helix_res").value;
}

function calculate() {
	form_in = document.getElementById("antenna_input_params");
	frequency = form_in.frequency.value * 1e6;
	nturns = form_in.nturns.value;

	let c = 2.99792458e8;
	lambda = c / frequency;

	h_circumference = lambda;
	h_diameter = h_circumference / PI;
	h_spacing = 0.25 * lambda;
	h_length = nturns * h_spacing;
	h_pitch = degrees(atan2(h_spacing, h_circumference));
	h_wire_length = sqrt(h_circumference**2 + h_spacing**2) * nturns;

	let r_lambda = 1 / lambda;
	gain = 15 * (h_circumference * r_lambda)**2;
	gain *= nturns * h_spacing * r_lambda;
	gain_dbi = 10 * Math.log10(0.8 * nturns);
	impedance = 140 * h_circumference * r_lambda;
	reflector_diameter = 1.1 * lambda;

	form_out = document.getElementById("output");
	form_out.wavelength.value = lambda.toFixed(5);
	form_out.gain.value = gain_dbi.toFixed(5);
	form_out.impedance.value = impedance.toFixed(1);
	form_out.h_diameter.value = h_diameter.toFixed(5);
	form_out.h_spacing.value = h_spacing.toFixed(5);
	form_out.h_pitch.value = h_pitch.toFixed(5);
	form_out.h_length.value = h_length.toFixed(5);
	form_out.h_wire_length.value = h_wire_length.toFixed(5);
	form_out.reflector_diameter.value = reflector_diameter.toFixed(5);
  	
  	document.getElementById("output").style.display = "block"
  	document.getElementById("helix_slider_div").style.display = "block"

  	got_data = true;
}

function setup() {
	let canvas = createCanvas(600, 400, WEBGL);
  	canvas.parent('sketch');
  	document.getElementById("output").style.display = "none"
  	document.getElementById("helix_slider_div").style.display = "none"
  	stroke(0);
  	strokeWeight(10);
  	fill(0, 0);
  	change_res();
  	//calculate();
}

let c = 1;

function draw_dimensions(count, h, r) {
	if(count < 100) {
		push();
		stroke(255, 0, 0);
		translate(0, r + 1, 0);
		rotateX(PI/2);
		line(0, r, h_spacing/h, r);
		pop();
	} else if(count < 200) {

	} else if(count < 300) {

	}

}

function draw() {
	if(got_data) {
		background(255);
		let h = 1.1 * width / (nturns * TWO_PI);
		let r = 0.2 * height;
		translate(0, 0, -0.5*h*TWO_PI*nturns);
		rotateY(t);
		t += 0.01;
		if(t >= HALF_PI && c != 0) {
			t = HALF_PI;
			c += 1;
			if(c > 300) {
				t = HALF_PI;
				c = 0;
			}
			//draw_dimensions(c, h, r);
		}

		if(t >= TWO_PI) {
			t = 0;
			c = 1;
		}


		let start = - 0.5 * nturns * TWO_PI;
		let end = -1 * start;
		let itt = TWO_PI / points_per_turn;
		stroke(0);
		beginShape();
		for(let theta = start; theta <= end; theta += itt) {
			x = r * cos(theta);
			y = r * sin(theta);
			z = h * theta;
			vertex(x, y, z);
		}
		endShape();
	}
}
