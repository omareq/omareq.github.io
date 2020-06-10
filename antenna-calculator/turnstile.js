/* eslint no-param-reassign: 0 */
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

		gain_dbi = 2.1 - 3;
		impedance = 36;

		form_out = document.getElementById("turnstile_output");
		form_out.wavelength.value = lambda.toFixed(5);
		form_out.gain.value = gain_dbi.toFixed(5);
		form_out.impedance.value = impedance.toFixed(1);
		form_out.d_length.value = d_length.toFixed(5);

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
		p5.background(255);
		if(got_data) {
			let cx = 0.5 * p5.width;
			let cy = 0.5 * p5.height;
			let h = 0.40 * p5.height;
			let w = h;

			let g = 0.1 * h;

			p5.stroke(0);
			p5.strokeWeight(8);
			// Draw vertical antenna arms
			p5.line(cx, cy - g, cx, cy - h);
			p5.line(cx, cy + g, cx, cy + h);

			// Draw horizontal antenna arms
			p5.line(cx - g, cy, cx - w, cy);
			p5.line(cx + g, cy, cx + w, cy);

			p5.strokeWeight(6);
			// Draw feed points for vertical arms

			// Draw feed points for horizontal arms


			let txt_size = 18;
			p5.textSize(txt_size);
			p5.textAlign(p5.CENTER);
			// Draw vertical arm dimensions
            p5.stroke(0, 155, 0);
			p5.strokeWeight(2);
			p5.line(cx - w, cy + h, cx - w, cy - h);
			p5.line(cx - w - g, cy + h, cx - w + g, cy + h);
			p5.line(cx - w - g, cy - h, cx - w + g, cy - h);
			p5.strokeWeight(1);
			p5.text("L: " + d_length.toFixed(4) + " m", cx - 1.35 * w, cy);

			// Draw horizontal arm dimensions
			p5.strokeWeight(2);
			p5.line(cx - w, cy + h, cx, cy + h);
			p5.line(cx - w, cy + h - g, cx - w, cy + h + g);
			p5.line(cx, cy + h - g, cx, cy + h + g);
			p5.strokeWeight(1);
			p5.text("L: " + 0.5 * d_length.toFixed(4) + " m", cx - 0.5 * w,
				cy + h + g);


			// Animation of transmission current


		}
	};
};

turnstile_canvas = new p5(turnstile_sketch);