/*******************************************************************************
*   @file ai.js
*   @brief File containing the functions to solve the towers of hanoi
*
*   @author <a href='mailto:omareq08@gmail.com'> Omar Essilfie-Quaye </a>
*   @version 1.0
*   @date 29-Dec-2018
*
*******************************************************************************/

//TODO omar(omareq08@gmail.com): refactor solving into a class

/**
*	Function to find the index of a pos object in a list
*
*	@param {array} list - list to search through
*	@param {Pos} pos - Pos object to locate
*
*	@returns {number} Index value of the object in the array. If the value is
*	not in the array false will be returned.
*/
function find(list, pos) {
	for(let i = 0; i < list.length; ++i) {
		if(pos.isEqualTo(list[i])) {
			return i;
		}
	}
	return false;
}

/**
*	Function to check if a pos object is in a list
*
*	@param {array} list - list to search through
*	@param {Pos} pos - Pos object to locate
*
*	@returns {boolean} Value indicating if the object is in the list or not
*/
function contains(list, pos) {
	for(let i = 0; i < list.length; ++i) {
		if(pos.isEqualTo(list[i])) {
			return true;
		}
	}
	return false;
}

/**
*	Function to get the neighbouring states of a given pos.
*
*	@param {Pos} node - The game state whose neighbours are to be found.
*
*	@returns {Array<Pos>} - An array of all the neighbouring states.
*/
function getNeighbours(node) {
	neighbours = [];
	test1 = new Tower(plates, 0, 0, 0, 0, "#000000", false);
	test2 = new Tower(plates, 0, 0, 0, 0, "#000000", false);
	test3 = new Tower(plates, 0, 0, 0, 0, "#000000", false);

	test1.setStack(node.state[0]);
	test2.setStack(node.state[1]);
	test3.setStack(node.state[2]);

	testArr = [test1, test2, test3];
	// console.log("Test Array: ", test);

	for(let towerIndex = 0; towerIndex < 3; ++towerIndex) {
		let len = testArr[towerIndex].stackTop;
		if(len == -1) {
			continue;
		}
		let plate = testArr[towerIndex].stack[len];
		// console.log("Moving plate: ", plate);
		for(let testIndex = 0; testIndex < 3; ++testIndex) {
			// console.log("Towers (", towerIndex + 1, ",", testIndex + 1, ")");
			if(testIndex == towerIndex) {
				// console.log("skipped");
				continue;
			}

			if(testArr[testIndex].push(plate)) {
				testArr[towerIndex].pop();
				validNeighbour = new Pos(testArr[0], testArr[1], testArr[2]);
				neighbours.push(validNeighbour);

				testArr[towerIndex].push(plate);
				testArr[testIndex].pop();
			}
		}
	}
	return neighbours;
}

/**
*	Function to solve the puzzle depending on the given starting state using
*	the Breadth First Search (BFS) Algortihm.
*
*	@returns {Array<Pos>} An array of all the states between the starting state
*	and the goal state.
*/
function solveBFS(startPos) {
	let startNode = startPos;
	startNode.parent = 0;

	let goal1 = new Tower(plates, 0, 0, 0, 0, "#000000", false);
	let goal2 = new Tower(plates, 0, 0, 0, 0, "#000000", true );
	let goal3 = new Tower(plates, 0, 0, 0, 0, "#000000", false);

	let goalNode = new Pos(goal1, goal2, goal3);

	let frontierNodes = [startNode];
	let exploredNodes = [];

	let findingSolution = true;

	let watchdog = 0;
	while(findingSolution) {
		watchdog++;

		if(watchdog > 1000) {
			console.log("watchdog has been activated");
			return [];
		}

		if(frontierNodes.length == 0) {
			console.log("No solution");
			return [];
		}

		let tempFrontiers = [];
		for(let nodeIndex = 0; nodeIndex < frontierNodes.length; ++nodeIndex) {
			let currentNode = frontierNodes[nodeIndex];

			if(currentNode.isEqualTo(goalNode)) {
				goalNode = currentNode;
				findingSolution = false;
				exploredNodes.push(currentNode);
				break;
			}
			let neighbours = getNeighbours(currentNode);

			for(let i = 0; i < neighbours.length; ++i) {
				let neighbour = neighbours[i];
				let notChecked = true;

				if(contains(exploredNodes, neighbour)) {
					notChecked = false;
				} else if(contains(frontierNodes, neighbour)) {
					notChecked = false;
				} else if(contains(tempFrontiers, neighbour)) {
					notChecked = false;
				}

				if(notChecked) {
					neighbour.parent = currentNode;
					tempFrontiers.push(neighbour);
				}
			}
			exploredNodes.push(currentNode);
		}
		if(findingSolution) {
			arrayCopy(tempFrontiers, 0, frontierNodes, 0, tempFrontiers.length);
			tempFrontiers = [];
		}
	}
	// console.log("Explored nodes: ", exploredNodes);

	let currentNode = goalNode;
	let solution = [];
	solution.push(goalNode);

	while(currentNode.parent) {
		solution.push(currentNode.parent);
		currentNode = currentNode.parent;
	}

	solution.reverse();
	return solution;
}

/**
*	Function to solve the puzzle depending on the given starting state using
*	the A* Algortihm.
*
*	@returns {Array<Pos>} An array of all the states between the starting state
*	and the goal state.
*/
function solveAStar() {
	let startNode = currentPos();
	startNode.parent = 0;

	let goal1 = new Tower(plates, 0, 0, 0, 0, "#000000", false);
	let goal2 = new Tower(plates, 0, 0, 0, 0, "#000000", true );
	let goal3 = new Tower(plates, 0, 0, 0, 0, "#000000", false);

	let goalNode = new Pos(goal1, goal2, goal3);

	let frontierNodes = [startNode];
	let exploredNodes = [];

	let findingSolution = true;

	let watchdog = 0;

	return [];
}