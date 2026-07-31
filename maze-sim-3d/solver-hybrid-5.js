"use strict";

/**
 * Solver Namespace Object
 */
var Solver = Solver || {};

/**
 * Solver.Hybrid5 Namespace Object
 */
Solver.Hybrid5 = Solver.Hybrid5 || {};

Solver.Hybrid5.goalX = -1;
Solver.Hybrid5.goalY = -1;

Solver.Hybrid5.checkForUnvisitedNeighbourAround = async function(robot) {

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
};

Solver.Hybrid5.findTileWallOrderCheck = function(currentPos, adjacentPos, direction, order) {
    if(!arena.hasWall(currentPos, direction) && arena.getVisit(adjacentPos) == 0) {
        if(!adjacentPos.equals(createVector(robot.getX(), robot.getY()))) {
            Solver.Hybrid5.goalX = currentPos.x;
            Solver.Hybrid5.goalY = currentPos.y;
            console.debug("Node Found: (",
                currentPos.x,",", currentPos.y,")",
                " Order: ", order);
            return true;
        }
    }
    return false;
};

Solver.Hybrid5.findTileWithUnvisitedNeighbour = function() {
    for(let i = arena.tileCount; i > 0; i--) {
        for(let y = 0; y < mapSizeY; y++) {
            for(let x = 0; x < mapSizeX; x++) {
                const position = createVector(x, y);
                if(arena.getOrder(position) != i) {
                    continue;
                }

                const posNorth = createVector(x, y - 1);
                const northCheck = Solver.Hybrid5.findTileWallOrderCheck(
                    position, posNorth, "north", i);
                if(northCheck) return true;

                const posEast = createVector(x + 1, y);
                const eastCheck = Solver.Hybrid5.findTileWallOrderCheck(
                    position, posEast, "east", i);
                if(eastCheck) return true;

                const posSouth = createVector(x, y + 1);
                const southCheck = Solver.Hybrid5.findTileWallOrderCheck(
                    position, posSouth, "south", i);
                if(southCheck) return true;

                const posWest = createVector(x - 1, y);
                const westCheck = Solver.Hybrid5.findTileWallOrderCheck(
                    position, posWest, "west", i);
                if(westCheck) return true;

                console.debug("No zeros found for Order: ", i, "in position: (", x, ",", y, ")");
            }
        }
    }
    console.debug("findTileWithUnvisitedNeighbour(): No zeros found for any positions");
    return false;
};

Solver.Hybrid5.selectDirection = function(robot, goalPositionOrder) {
    const left = !robot.hasWallLeft() ? robot.checkLeftOrder() : Infinity;
    const forward = !robot.hasWallFront() ? robot.checkFrontOrder() : Infinity;
    const right = !robot.hasWallRight() ? robot.checkRightOrder() : Infinity;
    const back = !robot.hasWallBack() ? robot.checkBackOrder() : Infinity;

    let orders = [left, forward, right, back];
    console.debug("Orders before: ", orders);

    for(let i= 0; i < 4; i++) {
        const direction = orders.indexOf(Math.min(...orders));

        if(orders[direction] >= goalPositionOrder) {
            console.debug("Selected Direction: ", direction,
                " Selected Order: ", orders[direction]);
            return direction;
        }
        orders[direction] = Infinity;
    }
};

Solver.Hybrid5.turnToDirection = async function (robot, directionNumber) {
    if(directionNumber == 0) {
        await robot.turnLeft();
        await robot.moveForward();
    } else if(directionNumber == 1) {
        await robot.moveForward();
    } else if(directionNumber == 2) {
        await robot.turnRight();
        await robot.moveForward();
    } else if(directionNumber == 3) {
        await robot.turnRight();
        await robot.turnRight();
        await robot.moveForward();
    }
};


Solver.Hybrid5.goTo = async function (robot, x, y) {
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

        const direction = Solver.Hybrid5.selectDirection(robot,
            arena.getOrder(goalPos));

        await Solver.Hybrid5.turnToDirection(robot, direction);

        console.debug("Current Pos: (", robot.getX(),",", robot.getY(),")");
    }
    console.debug("End Go TO: (", x,",", y,")");
};


Solver.Hybrid5.solve = async function(robot) {
    let finished = false;
    console.log("Starting Hybrid 5 Algorithm");

    while(!finished) {
        if(endSimulationFlag) {
            console.debug("Hybrid 5: end endSimulationFlag");
            return;
        }

        if(await Solver.Hybrid5.checkForUnvisitedNeighbourAround(robot)) {
            console.debug("Check for unvisited neighbour around robot is true");
            console.debug("Current Pos: (", robot.getX(),",", robot.getY(),")");
            await robot.moveForward();
            await checkForVictim(robot);
            console.debug("\n");
            continue;
        }

        console.debug("Check for unvisited neighbour around robot is false");
        console.debug("Current Pos: (", robot.getX(),",", robot.getY(),")");

        if(Solver.Hybrid5.findTileWithUnvisitedNeighbour()) {
            console.debug("found Tile With Unvisited Neighbour()");
            await Solver.Hybrid5.goTo(robot,
                Solver.Hybrid5.goalX,
                Solver.Hybrid5.goalY);
            console.debug("\n");
            continue;
        }

        {
            console.debug("Return to start");
            Solver.Hybrid5.goalX = 0; //startX;
            Solver.Hybrid5.goalY = 0; //startY;

            await Solver.Hybrid5.goTo(robot,
                Solver.Hybrid5.goalX,
                Solver.Hybrid5.goalY);

            Solver.Hybrid5.goalX = -1;
            Solver.Hybrid5.goalY = -1;
        }

        finished = true;
        console.debug("Finished!!!\n\n");
    }

    console.log("Finished Hybrid 5 Algorithm");
};