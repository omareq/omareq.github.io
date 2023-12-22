let goalX = -1;
let goalY = -1;

async function checkForZero(robot) {
	if(!robot.hasWallLeft() && !robot.checkLeftVisit()) {
		await robot.turnLeft();
		return true;
	}

	if(!robot.hasWallFront() && !robot.checkFrontVisit()) {
		await delay(1);
		return true;
	}

	if(!robot.hasWallRight() && !robot.checkRightVisit()) {
		await robot.turnRight();
		return true;
	}

	if(!robot.hasWallBack() && !robot.checkBackVisit()) {
		await robot.turnLeft();
		await robot.turnLeft();
		return true;
	}

	return false;
}

function findNode() {
	for(let i = arena.tileCount; i > 0; i--) {
		for(let y = 0; y < mapSizeY; y++) {
			for(let x = 0; x < mapSizeX; x++) {
				const position = createVector(x, y);
				if(arena.getOrder(position) != i) {
					continue;
				}
				const posNorth = createVector(x, y - 1);

				if(!arena.hasWall(position, "north") && arena.getVisit(posNorth) == 0) {
					if(!posNorth.equals(createVector(robot.getX(), robot.getY()))) {
						goalX = x;
						goalY = y;
						console.debug("Node Found: (", x,",", y,")", " Order: ",i );
						return true;
					}
				}

				const posEast = createVector(x + 1, y);

				if(!arena.hasWall(position, "east") && arena.getVisit(posEast) == 0) {
					if(!posEast.equals(createVector(robot.getX(), robot.getY()))) {
						goalX = x;
						goalY = y;
						console.debug("Node Found: (", x,",", y,")", " Order: ",i );
						return true;
					}
				}

				const posSouth = createVector(x, y + 1);

				if(!arena.hasWall(position, "south") && arena.getVisit(posSouth) == 0) {
					if(!posSouth.equals(createVector(robot.getX(), robot.getY()))) {
						goalX = x;
						goalY = y;
						console.debug("Node Found: (", x,",", y,")", " Order: ",i );
						return true;
					}
				}

				const posWest = createVector(x - 1, y);

				if(!arena.hasWall(position, "west") && arena.getVisit(posWest) == 0) {
					if(!posWest.equals(createVector(robot.getX(), robot.getY()))) {
						goalX = x;
						goalY = y;
						console.debug("Node Found: (", x,",", y,")", " Order: ",i );
						return true;
					}
				}
				console.debug("No zeros found for Order: ", i, "in position: (", x, ",", y, ")");
			}
		}
	}
	console.debug("FindNode(): No zeros found for any positions");
	return false;
}

async function goTo(robot, x, y) {
	console.debug("Go TO: (", x,",", y,")");
	const goalPos = createVector(x, y);
	for(let goal = arena.tileCount; goal > arena.getOrder(goalPos) - 1; goal--) {
		if(!robot.hasWallLeft() && robot.checkLeftOrder() == goal) {
			await robot.turnLeft();
			await robot.moveForward();
		} else if(!robot.hasWallFront() && robot.checkFrontOrder() == goal) {
			await robot.moveForward();
		} else if(!robot.hasWallRight() && robot.checkRightOrder() == goal) {
			await robot.turnRight();
			await robot.moveForward();
		} else if(!robot.hasWallBack() && robot.checkBackOrder() == goal) {
			await robot.turnRight();
			await robot.turnRight();
			await robot.moveForward();
		}
		console.debug("Current Pos: (", robot.getX(),",", robot.getY(),")");
	}
	console.debug("End Go TO: (", x,",", y,")");
}


async function hybrid4(robot) {
	let finished = false;
	console.log("Starting Hybrid 4 Algorithm");

	while(!finished) {
		if(await checkForZero(robot)) {
			console.debug("Check for zero is true");
			await robot.moveForward();
			await checkForVictim(robot);
			console.debug("\n");
		} else {
			console.debug("Zero for zero is false");
			if(findNode()) {
				// input a*
				console.debug("findNode()");
				await goTo(robot, goalX, goalY);
				console.debug("\n");

			} else {
				// return to start
				console.debug("Return to start");
				goalX = 0; //startX;
				goalY = 0; //startY;
				await goTo(robot, goalX, goalY);
				goalX = -1;
				goalY = -1;
				finished = true;
				console.debug("Finished!!!\n\n");
			}
		}
	}

	console.log("Finished Hybrid 4 Algorithm");
}