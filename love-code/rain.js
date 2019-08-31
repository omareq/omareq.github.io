/*******************************************************************************
*   @file rain.js
*   @brief File containing the Rain class.
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 29-Mar-2017
*
*******************************************************************************/

/**	Class that holds all the information of one column of rain. */
class Rain {

	/**
	*	Create a Rain object
	*
	*	@param {number} col    - Which column of rain this object is.  Counted
	*		from the left.
	*	@param {number} width  - How wide this column of rain will be.
	*	@param {number} maxLen - The maximum number of hearts in the column.
	*	@param {number} speed  - How fast the column falls dows the screem.
	*/
	constructor(col, width, maxLen, speed) {
		this.col = col;
		this.width = width;
		this.maxLen = maxLen;
		this.randomLength();
		this.speed = speed;
		this.scale = 0.45;
		this.setHeight();
	}

	/**
	*	Changes the height of the column and creates new heart objects above
	*	the screen.
	*/
	setHeight() {
		// height denotes the y position of the column, not the length.
		let newHeight = random(-height, 0);
		this.symbols = [];

		this.symbols.push(new Heart(this.col * this.width,
		  newHeight,
		  this.width * this.scale,
		  "pink"));
		
		for (let i = this.len - 2; i >= 0; i--) {
			this.symbols.push(new Heart(this.col * this.width,
			 newHeight - 2 * (this.len - 1) * this.width + 2 * i * this.width,
			 this.width * this.scale,
			 "red"));
		}
	}

	/**
	*	Randomises the length of the column.
	*/
	randomLength() {
		this.len = floor(random(1, this.maxLen));
	}

	/**
	*	Resets the column with new parameters.
	*/
	reset() {
		this.randomLength();
		this.setHeight();
		this.symbols[0].stopPulse();
		//console.log("Reseting rain at col: ", this.col);
	}

	/**
	*	Draws each heart in the column and then moves it down by an amount
	*	determined by the speed of the column.
	*/
	draw() {
		for (let i = this.len - 1; i >= 0; i--) {
			// for some reason that i am not yet aware of this loops  begins
			// out of bounds therefore a try catch is included to catch these
			// exceptions.  If they are not caused by this problem the exception
			// is thrown anyway.
			try {
				this.symbols[i].draw();
			} catch (e) {
				if(i >= this.len) {
					continue;
				}
				throw(e);
			}
			let pos = this.symbols[i].getPos();
			this.symbols[i].setPos(pos.x, pos.y + this.speed);

			if(i == this.len - 1) {
				if(pos.y > height) {
					this.reset();
				}
			}
		}

		// 5% chance of starting a new pulse.
		if(random() < 0.05) {
			this.symbols[0].pulse(0.05 * this.width);
		}
	}
}