/*******************************************************************************
*   @file tower.js
*   @brief File containing the Tower class
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 29-Dec-2018
*
*******************************************************************************/

/**
*	Class representing a Tower
*/
class Tower {
	/**
	*	Create a Tower
	*
	*	@param {number} stackSize  - The maximum number of plates on the tower.
	*	@param {number} xPos - The x location for the bottowm cetnre of the
	*		tower.
	*	@param {number} yPos - The y location for the bottowm cetnre of the
	*		tower.
	*	@param {number} width - The width of the tower.
	*	@param {number} height - The height of the tower.
	*	@param {color} color - hex value for the color of the plates.
	*	@param {boolean} full - If the tower has the macimum number of plates
	*		on it when it is instantiated.
	*/
	constructor(stackSize, xPos, yPos, width, height, color="#ffffff", full=false) {
		this.stackSize = stackSize;
		this.stack = [];
		this.stackTop = -1;

		if(full) {
			this.setAsFull();
		}

		this.x = xPos;
		this.y = yPos;
		this.w = width;
		this.h = height;
		this.c = color;

		this.rh = this.h / this.stackSize;
		this.rw = this.w / (2 * this.stackSize);
	}

	/**
	*	Function to determine wether the mouse is within the bounds of the
	*	tower when it is pressed.
	*
	*	@returns {boolean} If the tower has been pressed or not.
	*/
	pressed() {
		let xDiff = abs(mouseX - this.x);

		if(xDiff < this.w/2 && mouseY < this.y && mouseY > this.y - this.h) {
			this.isPressed = true;
			return true;
		}

		this.isPressed = false;
		return false;
	}

	/**
	*	Function to look at the plate at the top of the tower
	*
	*	@returns {number} The size of the plate at the top of the tower. If
	*	the tower stack is empty 0 is returned.
	*/
	peek() {
		if(this.stackTop != -1) {
			return this.stack[this.stackTop];
		}

		return 0;
	}

	/**
	*	Function to add plate to the tower
	*
	*	@param {number} plate - The size of the plate to push onto the stack.
	*
	*	@returns {boolean} Value determining wether or not the operation was a
	*	success.
	*/
	push(plate) {
	//TODO omar(omareq08@gmail.com): type checking on plate
		// if(plate == NaN) {
		// 	return false;
		// }

		if(plate == undefined) {
			return false;
		}

		if(this.stackTop < this.stackSize - 1) {
			if(plate < this.stack[this.stackTop] || this.stackTop == -1) {
				this.stack.push(plate);
				this.stackTop++;
				return true;
			}
		}
		return false;
	}

	/**
	*	Function to coppy the values of an array into the tower.  If the array
	*	is empty then the tower stack shall be empty.  If the array has plates
	*	which are large on top of smaller plates the function will restore the
	*	original value of the stack and return false.  If the input array is
	*	larger than the maximum stack size the function will return false.
	*
	*	@param {array} arr - The new value of the stack
	*
	*	@returns {boolean} Value determining wether or not the opertion was a
	*	success.
	*/
	setStack(arr) {
		let backup = this.stack;
		this.stack = [];

		if(arr.length > this.stackSize) {
			return false;
		} else if (arr.length == 0) {
			return true;
		}

		this.stackTop = -1;
		for(let i = 0; arr[i] != 0 && i < arr.length; i++) {
			if(arr[i] == undefined) {
				continue;
			}

			if(i > 0 && arr[i] > arr[i - 1]) {
				this.stack = backup;
				return  false;
			}
			this.stack.push(arr[i]);
			this.stackTop ++;
		}
		// console.log("Setting Stack");
		// console.log("Input: ", arr, " Output: ", this.stack);
		return true;
	}

	/**
	*	Function to fill the tower with plates.
	*/
	setAsFull() {
		this.stack = [];
		for(let i = this.stackSize; i >= 1; --i) {
			this.stack.push(i);
		}
		this.stackTop = this.stackSize - 1;
	}

	/**
	*	Function to empty the tower of plates.
	*/
	empty() {
		this.stack = [];
		this.stackTop = -1;
	}

	/**
	*	Function to remove plate from the tower
	*
	*	@returns {number} Value of the top plate in the stack.  If there is no
	*	top plate in the stack then NaN is returned.
	*/
	pop() {
		if(this.stackTop >= 0) {
			this.stackTop--;
			return this.stack.pop();
		}
		return NaN;
	}

	/**
	*	Draws a tower with all the plates it contains.
	*/
	draw() {
		push();
		rectMode(CENTER);
		translate(this.x, this.y);

		strokeWeight(4);
		line(-0.5 * this.w, this.rh/2, 0.5 * this.w, this.rh/2);
		line(0, this.rh/2, 0, -this.h);

		if(this.stackTop != -1) {
			strokeWeight(1);
			fill(this.c);
			for(let i = 0; i <= this.stackTop; ++i) {
				if(i != 0) {
					translate(0, -this.rh);
				}

				if(this.isPressed && i == this.stackTop) {
					strokeWeight(3);
					stroke(0, 255, 255);
				} else {
					stroke(0);
				}

				let rectW = map(this.stack[i], 1, this.stackSize, this.rw, this.w);
				rect(0,0, rectW, this.rh);
			}
		}
		pop();
	}
}