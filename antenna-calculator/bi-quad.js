/*******************************************************************************
*   Author:   Omar Essilfie-Quaye
*   Email:    omareq08@gmail.com
*   Date:     30-Jun-2018
*   Program:  Calculating the dimensions of a bi-quad antenna depending on the 
*			  required transmission frequency.
*
*******************************************************************************/

let bi_quad_sketch = function(p5) {
	let t = 0;
	let got_data = false;

	// input values from form
	let frequency;

	// calculated values
	let lambda;
	// let gain, gain_dbi, impedance;
	let l1, l2, wire_diam, wire_length;

	// bi-quad dimensions
	let d_length, w_length, h_length;

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

	p5.calculate_bi_quad = function() {
		form_in = document.getElementById("bi_quad_input_params");
		frequency = form_in.frequency.value * 1e6;

		let c = 2.99792458e8;
		lambda = c / frequency;

		d_length = lambda / 2;

		l1 = 0.025 * 9.7 * lambda;
		l2 = 0.7   * 9.7 * lambda;
		wire_diam = 0.6 * Math.pow(frequency / 1e6, -0.8);
		wire_length = ( 20 * lambda*1e6 + 40 * p5.PI * wire_diam )/10000000;

		w_length = 0.5 * lambda;
		h_length = 2 * w_length;
		d_length = lambda / 8;

		form_out = document.getElementById("bi_quad_output");
		form_out.wavelength.value = lambda.toFixed(5);
		form_out.l1.value = l1.toFixed(5);
		form_out.l2.value = l2.toFixed(5);
		form_out.wire_diam.value = wire_diam.toFixed(5);
		form_out.wire_length.value = wire_length.toFixed(5);
		form_out.w_length.value = w_length.toFixed(5);
		form_out.h_length.value = h_length.toFixed(5);
		form_out.d_length.value = d_length.toFixed(5);
	  	
	  	document.getElementById("bi_quad_output").style.display = "block";
	  	//document.getElementById("helix_slider_div").style.display = "block"
	  	p5.loop();
	  	got_data = true;
	};

	p5.setup = function() {
		let canvas = p5.createCanvas(600, 400);
	  	canvas.parent('bi_quad_canvas');
	  	document.getElementById("bi_quad_output").style.display = "none";
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
			p5.translate(p5.width/2, p5.height/2);
			let u = 0.25 * p5.height;

			p5.strokeWeight(5);
			p5.stroke(0);
			//right square
			p5.line(0, 10, u, u);
			p5.line(u, u, 2*u, 0);
			p5.line(2*u, 0, u, -u);
			p5.line(u, -u, 0, -10);

			//left square
			p5.line(0, 10, -u, u);
			p5.line(-u, u, -2*u, 0);
			p5.line(-2*u, 0, -u, -u);
			p5.line(-u, -u, 0, -10);

			//reflector
			let n = 1.4;
			p5.rect(-2 * n * u, -n * u, 4 * n *u, 2 * n * u);
			
			//coaxial connector
			p5.strokeWeight(3);
			p5.ellipse(0, 4, 30, 30);
			p5.ellipse(0, 4, 10, 10);

			//dimensions
			p5.stroke(0, 155, 0);

			p5.textSize(20);
			p5.textAlign(p5.CENTER);

			//l1
			p5.strokeWeight(2);
			p5.line(2*u + 20, -20, u + 20, -u -20);
			p5.strokeWeight(1);
			p5.text("L1: " + l1.toFixed(4) + " m", 1.95 * u + 20, - 0.7 * u - 20);
			
			//l2
			p5.strokeWeight(2);
			p5.line(-2*u, u + 20 ,2*u, u + 20);
			p5.strokeWeight(1);
			p5.text("L2: " + l2.toFixed(4) + " m", 0, 0.95* u);
			
			//base reflector length
			p5.strokeWeight(2);
			p5.line(-2 * n * u, 1.2 * n * u + 20, 2 * n * u, 1.2 * n * u + 20);
			p5.strokeWeight(1);
			p5.text("BRL: " + h_length.toFixed(4) + " m", 0, 1.2 * n * u);
			
			//base reflector width
			p5.textAlign(p5.LEFT);
			p5.strokeWeight(2);
			p5.line(-2 * n * u + 20, -n * u, -2 * n * u + 20, n * u);
			p5.strokeWeight(1);
			p5.text("BRW: " + w_length.toFixed(4) + " m", -2 * n * u + 30, - 0.8 * n * u);

		}
	};
};

bi_quad_canvas = new p5(bi_quad_sketch);