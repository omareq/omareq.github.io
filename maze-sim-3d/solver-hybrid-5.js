let goalX_5 = -1;
let goalY_5 = -1;

async function checkForZero_5(robot) {

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

function findNode_5() {
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
                        goalX_5 = x;
                        goalY_5 = y;
                        console.debug("Node Found: (", x,",", y,")", " Order: ",i );
                        return true;
                    }
                }

                const posEast = createVector(x + 1, y);

                if(!arena.hasWall(position, "east") && arena.getVisit(posEast) == 0) {
                    if(!posEast.equals(createVector(robot.getX(), robot.getY()))) {
                        goalX_5 = x;
                        goalY_5 = y;
                        console.debug("Node Found: (", x,",", y,")", " Order: ",i );
                        return true;
                    }
                }

                const posSouth = createVector(x, y + 1);

                if(!arena.hasWall(position, "south") && arena.getVisit(posSouth) == 0) {
                    if(!posSouth.equals(createVector(robot.getX(), robot.getY()))) {
                        goalX_5 = x;
                        goalY_5 = y;
                        console.debug("Node Found: (", x,",", y,")", " Order: ",i );
                        return true;
                    }
                }

                const posWest = createVector(x - 1, y);

                if(!arena.hasWall(position, "west") && arena.getVisit(posWest) == 0) {
                    if(!posWest.equals(createVector(robot.getX(), robot.getY()))) {
                        goalX_5 = x;
                        goalY_5 = y;
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


async function goTo_5(robot, x, y) {
    console.debug("Go TO: (", x,",", y,")");
    const goalPos = createVector(x, y);

    if(robot.getX() == goalPos.x && robot.getY() == goalPos.y) {
        console.debug("goTo: The start position is the goal position.");
        return;
    }

    for(let goal = arena.tileCount; goal > arena.getOrder(goalPos) - 1; goal--) {
        if(endSimulationFlag) {
            console.debug("goTO: end endSimulationFlag");
            return;
        }

        if(robot.getX() == goalPos.x && robot.getY() == goalPos.y) {
            console.debug("goTo: at goal position.");
            break;
        }

        let left = !robot.hasWallLeft() ? robot.checkLeftOrder() : arena.tileCount + 10;
        let forward = !robot.hasWallFront() ? robot.checkFrontOrder() : arena.tileCount + 10;
        let right = !robot.hasWallRight() ? robot.checkRightOrder() : arena.tileCount + 10;
        let back = !robot.hasWallBack() ? robot.checkBackOrder() : arena.tileCount + 10;
        let orders = [left, forward, right, back];

        let direction;
        let done = false;
        console.debug("Orders before: ", orders);
        while(!done) {
            let smallest = orders.indexOf(Math.min(...orders));

            if(orders[smallest] >= arena.getOrder(goalPos)) {
                direction = smallest;
                done = true;
                break;
            } else {
                orders[smallest] = arena.tileCount + 1;
            }
        }
        console.debug("Selected Direction: ", direction,
            " Selected Order: ", orders[direction]);

        if(direction == 0) {
            await robot.turnLeft();
            await robot.moveForward();
        } else if(direction == 1) {
            await robot.moveForward();
        } else if(direction == 2) {
            await robot.turnRight();
            await robot.moveForward();
        } else if(direction == 3) {
            await robot.turnRight();
            await robot.turnRight();
            await robot.moveForward();
        }
        console.debug("Current Pos: (", robot.getX(),",", robot.getY(),")");
    }
    console.debug("End Go TO: (", x,",", y,")");
}


async function hybrid5(robot) {
    let finished = false;
    console.log("Starting Hybrid 5 Algorithm");

    while(!finished) {
        if(endSimulationFlag) {
            console.debug("hybrid5: end endSimulationFlag");
            return;
        }
        if(await checkForZero_5(robot)) {
            console.debug("Check for zero is true");
            await robot.moveForward();
            await checkForVictim(robot);
            console.debug("\n");
        } else {
            console.debug("Zero for zero is false");
            if(findNode_5()) {
                // input a*
                console.debug("findNode()");
                await goTo_5(robot, goalX_5, goalY_5);
                console.debug("\n");

            } else {
                // return to start
                console.debug("Return to start");
                goalX_5 = 0; //startX;
                goalY_5 = 0; //startY;
                await goTo_5(robot, goalX_5, goalY_5);
                goalX_5 = -1;
                goalY_5 = -1;
                finished = true;
                console.debug("Finished!!!\n\n");
            }
        }
    }

    console.log("Finished Hybrid 5 Algorithm");
}