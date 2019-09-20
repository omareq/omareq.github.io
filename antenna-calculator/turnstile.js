/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     30-Jun-2018
*   Program:  Calculating the dimensions of a turnstile antenna depending
*			  on the required transmission frequency.
*
*******************************************************************************/

let turnstile_sketch = function(p5) {
	let t = 0;
	let got_data = false;

	// input values from form
	let frequency;

	// calculated values
	let lambda;
	let gain, gain_dbi, impedance;

	// turnstile dimensions
	let d_length;

	let val = 255;

	p5.pause_animation = function() {
		p5.noLoop();
	};

	p5.continue_animation = function() {
		p5.loop();
	};

	p5.change_dipole_polarisation = function() {
		vp = !vp;
	};

	p5.calculate_turnstile = function() {
		form_in = document.getElementById("turnstile_input_params");
		frequency = form_in.frequency.value * 1e6;

		let c = 2.99792458e8;
		lambda = c / frequency;

		d_length = lambda / 2;

		//gain_dbi = 2.15;
		//impedance = 73.1;

		form_out = document.getElementById("turnstile_output");
		form_out.wavelength.value = lambda.toFixed(5);
		//form_out.gain.value = gain_dbi.toFixed(5);
		//form_out.impedance.value = impedance.toFixed(1);
		//form_out.d_length.value = d_length.toFixed(5);

	  	document.getElementById("turnstile_output").style.display = "block";
	  	//document.getElementById("helix_slider_div").style.display = "block"
	  	p5.loop();
	  	got_data = true;
	};

	p5.setup = function() {
		let canvas = p5.createCanvas(600, 400);
	  	canvas.parent('turnstile_canvas');
	  	document.getElementById("turnstile_output").style.display = "none";
	  	//document.getElementById("helix_slider_div").style.display = "none"
	  	p5.stroke(0);
	  	p5.strokeWeight(5);
	  	p5.fill(0, 0);
	  	p5.noLoop();
	  	//calculate_helix();
	};

	let c = 1;

	p5.draw_dimensions = function(count, h, r) {

	};

	p5.draw = function() {
		if(got_data) {

		}
	};
};

turnstile_canvas = new p5(turnstile_sketch);