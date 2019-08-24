/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     30-Jun-2018
*   Program:  Calculating the dimensions of a folded-dipole antenna depending
*			  on the required transmission frequency.
*
*******************************************************************************/

let folded_dipole_sketch = function(p5) {
	let t = 0;
	let got_data = false;

	// input values from form
	let frequency;

	// calculated values
	let lambda;
	let gain, gain_dbi, impedance;
	let a, b, c, d, r;
	let gap, rod, total;

	// folded-dipole dimensions
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

	p5.calculate_folded_dipole = function() {
		form_in = document.getElementById("folded_dipole_input_params");
		frequency = form_in.frequency.value * 1e6;

		let c_light = 2.99792458e8;
		let vz_factor = 0.8567;
		lambda = c_light / frequency;

		d_length = lambda / 2;

		//gain_dbi = 2.15;
		impedance = 292;

		a = lambda * 0.19 * vz_factor;
		b = lambda * 0.10 * vz_factor;
		c = lambda * 0.40 * vz_factor;
		d = lambda * 0.20 * vz_factor;
		r = lambda * 0.10 * vz_factor / p5.PI;
		gap = lambda * 0.01 * vz_factor;
		rod = lambda / 300;
		total = lambda * vz_factor;

		form_out = document.getElementById("folded_dipole_output");
		form_out.wavelength.value = lambda.toFixed(5);
		form_out.impedance.value = impedance.toFixed(3);
		form_out.a.value = a.toFixed(5);
		form_out.b.value = b.toFixed(5);
		form_out.c.value = c.toFixed(5);
		form_out.d.value = d.toFixed(5);
		form_out.r.value = r.toFixed(5);
		form_out.gap.value = gap.toFixed(5);
		form_out.rod.value = rod.toFixed(5);
		form_out.total.value = total.toFixed(5);

	  	document.getElementById("folded_dipole_output").style.display = "block";
	  	p5.loop();
	  	got_data = true;
	}

	p5.setup = function() {
		let canvas = p5.createCanvas(600, 400);
	  	canvas.parent('folded_dipole_canvas');
	  	document.getElementById("folded_dipole_output").style.display = "none";
	  	p5.stroke(0);
	  	p5.strokeWeight(5);
	  	p5.fill(0, 0);
	  	print("Setup");
	  	// p5.noLoop();
	}

	p5.draw_dimensions = function(count, h, r) {

	}

	p5.draw = function() {
		p5.background(255);
		if(got_data) {
			let radius = p5.height / 8;
			let d_length = p5.width / 4;
			let w2 = 0.5 * p5.width;
			let h2 = 0.5 * p5.height;

			p5.push();
			p5.stroke(0);
			p5.strokeWeight(5);
			// d
			p5.line(w2, h2 + radius, w2 - d_length, h2 + radius);
			p5.arc(w2 - d_length, h2, 2 * radius, 2 * radius, p5.HALF_PI, p5.PI + p5.HALF_PI);
			// c
			p5.line(w2 - d_length, h2 - radius, w2 + d_length, h2 - radius);
			p5.arc(w2 + d_length, h2, 2 * radius, 2 * radius, -p5.HALF_PI, p5.HALF_PI);
			// a
			p5.line(w2 + d_length, h2 + radius, w2 + 0.35 * d_length, h2 + radius);

			p5.pop();

		}
	}
};

folded_dipole_canvas = new p5(folded_dipole_sketch);