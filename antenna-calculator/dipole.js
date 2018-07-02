/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     30-Jun-2018
*   Program:  Calculating the dimensions of a dipole antenna depending on the 
*			  required transmission frequency.
*
*******************************************************************************/

let dipole_sketch = function(p5) {
	let t = 0;
	let got_data = false;
	let hp = true;

	// input values from form
	let frequency;

	// calculated values
	let lambda;
	let gain, gain_dbi, impedance;

	// dipole dimensions
	let d_length;

	let val = 255;

	p5.change_dipole_polarisation = function() {
		hp = !hp;
	}

	p5.calculate_dipole = function() {
		form_in = document.getElementById("dipole_input_params");
		frequency = form_in.frequency.value * 1e6;

		let c = 2.99792458e8;
		lambda = c / frequency;

		d_length = lambda / 2;

		gain_dbi = 2.15;
		impedance = 73.1;

		form_out = document.getElementById("dipole_output");
		form_out.wavelength.value = lambda.toFixed(5);
		form_out.gain.value = gain_dbi.toFixed(5);
		form_out.impedance.value = impedance.toFixed(1);
		form_out.d_length.value = d_length.toFixed(5);
	  	
	  	document.getElementById("dipole_output").style.display = "block"
	  	//document.getElementById("helix_slider_div").style.display = "block"
	  	p5.loop();
	  	got_data = true;
	}

	p5.setup = function() {
		let canvas = p5.createCanvas(600, 400);
	  	canvas.parent('dipole_canvas');
	  	document.getElementById("dipole_output").style.display = "none"
	  	//document.getElementById("helix_slider_div").style.display = "none"
	  	p5.stroke(0);
	  	p5.strokeWeight(10);
	  	p5.fill(0, 0);
	  	p5.noLoop();
	  	//calculate_helix();
	}

	let c = 1;

	p5.draw_dimensions = function(count, h, r) {

	}

	p5.draw = function() {
		if(got_data) {
			p5.background(0);
			
		}
	}
};

dipole_canvas = new p5(dipole_sketch);