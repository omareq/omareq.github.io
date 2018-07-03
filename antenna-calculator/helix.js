/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     30-Jun-2018
*   Program:  Calculating the dimensions of antenna depending on the required
*             transmission frequency.
*
*******************************************************************************/

let helix_sketch = function(p5) {
	let t = 0;
	let got_data = false;
	let points_per_turn;
	let lhp = true;

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

	p5.change_helix_polarisation = function() {
		lhp = !lhp;
	}

	p5.change_helix_res = function() {
		points_per_turn = document.getElementById("helix_res").value;
	}

	p5.calculate_helix = function() {
		form_in = document.getElementById("helix_input_params");
		frequency = form_in.frequency.value * 1e6;
		nturns = form_in.nturns.value;

		let c = 2.99792458e8;
		lambda = c / frequency;

		h_circumference = lambda;
		h_diameter = h_circumference / p5.PI;
		h_spacing = 0.25 * lambda;
		h_length = nturns * h_spacing;
		h_pitch = p5.degrees(p5.atan2(h_spacing, h_circumference));
		h_wire_length = p5.sqrt(h_circumference**2 + h_spacing**2) * nturns;

		let r_lambda = 1 / lambda;
		gain = 15 * (h_circumference * r_lambda)**2;
		gain *= nturns * h_spacing * r_lambda;
		gain_dbi = 10 * Math.log10(0.8 * nturns);
		impedance = 140 * h_circumference * r_lambda;
		reflector_diameter = 1.1 * lambda;

		form_out = document.getElementById("helix_output");
		form_out.wavelength.value = lambda.toFixed(5);
		form_out.gain.value = gain_dbi.toFixed(5);
		form_out.impedance.value = impedance.toFixed(1);
		form_out.h_diameter.value = h_diameter.toFixed(5);
		form_out.h_spacing.value = h_spacing.toFixed(5);
		form_out.h_pitch.value = h_pitch.toFixed(5);
		form_out.h_length.value = h_length.toFixed(5);
		form_out.h_wire_length.value = h_wire_length.toFixed(5);
		form_out.reflector_diameter.value = reflector_diameter.toFixed(5);
	  	
	  	document.getElementById("helix_output").style.display = "block"
	  	document.getElementById("helix_slider_div").style.display = "block"
	  	p5.loop();
	  	got_data = true;
	}

	p5.calculate_dipole = function() {
		form_in = document.getElementById("dipole_input_params");
		frequency = form_in.frequency.value * 1e6;

		let c = 2.99792458e8;
		lambda = c / frequency;
	}

	p5.setup = function() {
		let canvas = p5.createCanvas(600, 400, p5.WEBGL);
	  	canvas.parent('helix_canvas');
	  	document.getElementById("helix_output").style.display = "none"
	  	document.getElementById("helix_slider_div").style.display = "none"
	  	p5.stroke(0);
	  	p5.strokeWeight(10);
	  	p5.fill(0, 0);
	  	p5.change_helix_res();
	  	p5.noLoop();
	  	//calculate_helix();
	}

	let c = 1;

	p5.draw_dimensions = function(count, h, r) {
		//draw spacing
		if(count < 100) {
			p5.push();
			p5.stroke(255, 0, 0);
			p5.translate(0, r + 1, 0);
			p5.rotateX(p5.PI/2);
			p5.line(0, r, h_spacing/h, r);
			p5.pop();
		} else if(count < 200) {

		} else if(count < 300) {

		}

	}

	p5.draw = function() {
		if(got_data) {
			p5.background(255);
			let h = 1.1 * p5.width / (nturns * p5.TWO_PI);
			let r = 0.2 * p5.height;
			p5.translate(0, 0, -0.5*h*p5.TWO_PI*nturns);
			p5.rotateY(t);
			t += 0.01;
			if(t >= p5.HALF_PI && c != 0) {
				t = p5.HALF_PI;
				c += 1;
				if(c > 300) {
					t = p5.HALF_PI;
					c = 0;
				}
				//draw_dimensions(c, h, r);
			}

			if(t >= p5.TWO_PI) {
				t = 0;
				c = 1;
			}


			let start = - 0.5 * nturns * p5.TWO_PI;
			let end = -1 * start;
			let itt = p5.TWO_PI / points_per_turn;
			p5.stroke(0);
			let x, y, z;
			p5.beginShape();
			for(let theta = start; theta <= end; theta += itt) {
				x = r * p5.cos(theta);
				y = r * p5.sin(theta);
				z = h * theta;
				if(lhp) {
					y = -y
				}
				p5.vertex(x, y, z);
			}
			p5.endShape();
		}
	}
};


helix_canvas = new p5(helix_sketch);
