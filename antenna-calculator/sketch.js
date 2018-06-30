/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     30-Jun-2018
*   Program:  Calculating the dimensions of antenna depending on the required
*             transmission frequency.
*
*******************************************************************************/

new p5();

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

function calculate() {
	form_in = document.getElementById("antenna_input_params");
	frequency = form_in.frequency.value * 1e6;
	nturns = form_in.nturns.value;

	let c = 2.99792458e8;
	lambda = c / frequency;

	let pi = 3.1415926535;
	h_circumference = lambda;
	h_diameter = h_circumference / pi;
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
}

function setup() {
	let canvas = createCanvas(600, 400, WEBGL);
  	canvas.parent('sketch');
  	document.getElementById("output").style.display = "none"
}

function draw() {
	background(255);
}
