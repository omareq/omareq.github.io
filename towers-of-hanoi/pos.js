/*******************************************************************************
*   @file pos.js
*   @brief File containing the Pos class
*   
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 29-Dec-2018
*
*******************************************************************************/

/**
*	Class representing a position state of the towers
*/
class Pos {

	/**
	*	Constructor function for the Pos class
	*
	*	@param {Tower} tower1 - Input tower for the 0 index state
	*	@param {Tower} tower2 - Input tower for the 1 index state
	*	@param {Tower} tower3 - Input tower for the 2 index state
	*/
	constructor(tower1, tower2, tower3) {
		this.state = [[], [], []];
		this.insert(tower1, 0);
		this.insert(tower2, 1);
		this.insert(tower3, 2);
		this.parent = 0;
	}

	/**
	*	Function to give the state at the given index a copy new stack
	*	 identical to tower.
	*
	*	@param {Tower} tower - Tower which contains the stack to be copied.
	*	@param {number} index - An integer number which represents which state
	*	the tower stack shall be copied in to.
	*/
	insert(tower, index) {
		arrayCopy(tower.stack, 0, this.state[index], 0, tower.stackTop + 1);
		
		if(tower.stack.length < tower.stackSize) {
			let start = tower.stackTop;
			let end = tower.stackSize - 1;

			for(let i = start; i < end; ++i) {
				this.state[index].push(0);
			}
		}
	}

	/**
	*	Function to return the size of the plate at the top of the stack for
	*	the given tower.  If the stack is empty 0 will be returned.
	*
	*	@param {number} index - Integer number representing which tower the top
	*	of the stack shall come from.
	*
	*	@returns {number} Value of the top of the stack for the given tower.
	*/
	topOfStack(index) {
		let start = this.state[index].length - 1;
		let end = 0;
		let itt = -1;

		for(let i = start; i != end; i += itt) {
			if(this.state[index][i] != 0) {
				return i;
			}
		}
		return 0;
	}

	/**
	*	Function that calculates the approximate distance between two states.
	*	This is done by using the largest change in height of a single tower
	*	between the states.
	*
	*	@param {Pos} pos - The Pos to measure the distance to.
	*
	*	@returns {number} - An integer number representing the distance.
	*/
	dist(pos) {
		let biggestDiff = 0;
		for(let i = 0; i < 3; ++i) {
			let posTop = pos.topOfStack(i);
			let thisTop = this.topOfStack(i);
			let diff = abs(posTop - thisTop);

			if(diff > biggestDiff) {
				biggestDiff = diff;
			}
		}
		return biggestDiff;
	}

	/**
	*	A function to check if two Pos objects are equivalent.
	*
	*	@param {Pos} pos - Pos object to compare against.
	*
	*	@returns {boolean} - Value of comparison oepration.
	*/
	isEqualTo(pos) {
		for(let towerIndex = 0; towerIndex < 3; ++towerIndex) {
			if(pos.state[towerIndex].length != this.state[towerIndex].length) {
				return false;
			}

			let end = this.state[towerIndex].length;
			for(let i = 0; i < end; ++i) {
				if(pos.state[towerIndex][i] != this.state[towerIndex][i]) {
					return false;
				}
			}
		}
		return true;
	}
}
