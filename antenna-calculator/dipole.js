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
	let vp = true;
	let points_per_wave = 25;

	// input values from form
	let frequency;

	// calculated values
	let lambda;
	let gain, gain_dbi, impedance;

	// dipole dimensions
	let d_length;

	let val = 255;

	p5.pause_animation = function() {
		p5.noLoop();
	}

	p5.continue_animation = function() {
		p5.loop();
	}

	p5.change_dipole_polarisation = function() {
		vp = !vp;
	}

	p5.change_helix_res = function() {
		points_per_turn = document.getElementById("dipole_res").value;
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
	  	p5.strokeWeight(5);
	  	p5.fill(0, 0);
	  	p5.noLoop();
	  	//calculate_helix();
	}

	let c = 1;

	p5.draw_dimensions = function(count, h, r) {

	}

	p5.draw = function() {
		if(got_data) {
			p5.background(255);

			if(vp) {
				p5.stroke(50, 50, 225);
				p5.line(.25 * p5.width, .50 * p5.height, p5.width, .50 * p5.height);	
				
				let h = .30 * p5.height;
				p5.stroke(225, 50, 50);
				let start = .25 * p5.width;
				let end = p5.width;
				let itt = p5.TWO_PI / (points_per_wave);

				let x, y;
				p5.beginShape()
				for(let theta = start; theta <= end; theta += itt) {
					x = theta;//lambda * theta/p5.TWO_PI;
					y = h * p5.sin(0.05* theta + t) + .5 * p5.height;

					p5.vertex(x, y);
				}
				p5.endShape();

				p5.stroke(0);
				p5.strokeWeight(8);
				p5.line(.25 * p5.width, .20 * p5.height, .25 * p5.width, .46 * p5.height);
				p5.line(.25 * p5.width, .54 * p5.height, .25 * p5.width, .80 * p5.height);
				
				p5.strokeWeight(5);
				p5.line(.20 * p5.width, .46 * p5.height, .25 * p5.width, .46 * p5.height);
				p5.line(.20 * p5.width, .54 * p5.height, .25 * p5.width, .54 * p5.height);	

				

				t -= 0.1;
			} else {
				p5.stroke(225, 20, 20);
				p5.line(.25 * p5.width, .50 * p5.height, p5.width, .50 * p5.height);	
				
				let h = .30 * p5.height;
				p5.stroke(50, 50, 225);
				let start = .25 * p5.width;
				let end = p5.width;
				let itt = 0.2;

				let x, y;
				p5.beginShape()
				for(let theta = start; theta <= end; theta += itt) {
					x = theta;//lambda * theta/p5.TWO_PI;
					y = h * p5.sin(lambda * theta/p5.TWO_PI + t) + .5 * p5.height;

					p5.vertex(x, y);
				}
				p5.endShape();

				p5.stroke(0);
				p5.line(.20 * p5.width, .50 * p5.height, .25 * p5.width, .50 * p5.height);	
				p5.fill(0);
				p5.ellipse(.25 * p5.width, .50 * p5.height, 8, 8);
				p5.noFill();
				t -= 0.1;
			}
		}
	}
};

dipole_canvas = new p5(dipole_sketch);