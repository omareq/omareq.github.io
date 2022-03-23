/*******************************************************************************
 *
 *	@file sketch.js Generate a random walk within a grid based on the work of
 *                  Dan from the coding train
 *
 *	@author Omar Essilfie-Quaye <omareq08@gmail.com>
 *	@version 1.0
 *	@date 11-June-2021
 *
 *****************************************************************************/

let spacing;
let nodes = [];
let walk = [];

function contains(nodesList, nodeIndecies) {
    for(let nodeIndex = 0; nodeIndex < nodesList.length; nodeIndex++) {
        const node = nodesList[nodeIndex];
        if(node.i == nodeIndecies[0] && node.j == nodeIndecies[1]) {
            return true;
        }
    }
    return false;
}

function getNodeFromList(nodesList, nodeIndecies) {
    for(let nodeIndex = 0; nodeIndex < nodesList.length; nodeIndex++) {
        const node = nodesList[nodeIndex];
        if(node.i == nodeIndecies[0] && node.j == nodeIndecies[1]) {
            return node;
        }
    }
}

/**
 * Generate a graph of nodes arranged in a triangular pattern
 */
function generateTriangleGrid() {
    const r1 = createVector(spacing * sqrt(3) / 2, -spacing / 2);
    const r2 = createVector(spacing * sqrt(3) / 2 , spacing / 2);
    console.log("R1: " + r1.x + " " + r1.y);
    console.log("R2: " + r2.x + " " + r2.y);

    for(let i = -25; i < 25; i++) {
        for(let j = 0; j < 60; j++) {
            let pnt = r1.copy().mult(i).add(r2.copy().mult(j));
            pnt.x = pnt.x + 0.5 * spacing;
            pnt.y = pnt.y + 0.5 * spacing;
            if(pnt.x <= 0.5 || pnt.y <= 0.5 || pnt.x >= width-0.5 || pnt.y >= height-0.5) {
                continue;
            }
            nodes.push(new GraphNode(i, j, pnt.x, pnt.y));
        }
    }

    for(let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
        const currentNode = nodes[nodeIndex];
        const i = currentNode.i;
        const j = currentNode.j;
        const possibleNeighbors = [
            [i, j + 1],
            [i, j - 1],
            [i + 1, j],
            [i - 1, j]
        ];

        for(let n = possibleNeighbors.length - 2; n >= 0; n--) {
            if(!contains(nodes, possibleNeighbors[n])) {
                possibleNeighbors.splice(1, n);
            }
        }
        nodes[nodeIndex].setNeighbours(possibleNeighbors);
    }
}


/**
 * Generates a random walk given a list of nodes in a grid
 */
function generateWalk() {
    randomNodeIndex = floor(random(nodes.length));
    let currentNode = nodes[randomNodeIndex];
    currentNode.visited = true;
    walk.push(currentNode);
    let watchdog = nodes.length;
    console.log("watchdog: " + watchdog);
    while(watchdog > 0) {
        watchdog--;

        orderedNeighbours = currentNode.neighbours;
        neighbours = shuffle(orderedNeighbours);
        let foundUnvisitedNeighbour = false;

        for(let n = 0; n < neighbours.length; n++) {
            if(!contains(nodes, neighbours[n])) {
                continue;
            }
            currentNeighbour = getNodeFromList(nodes, neighbours[n]);
            if(!currentNeighbour.visited) {
                currentNode = currentNeighbour;
                currentNode.visited = true;
                foundUnvisitedNeighbour = true;
                walk.push(currentNode);
                break;
            }
        }

        if(!foundUnvisitedNeighbour) {
            console.log("No more unvisited neighbours");
            console.log("watchdog: " + watchdog);
            break;
        }
    }
}

/**
 * p5.js setup function, creates canvas.
 */
function setup() {
	let cnvSize;
	if(windowWidth > windowHeight) {
		cnvSize = windowHeight;
	} else {
		cnvSize = windowWidth;
	}
	let cnv = createCanvas(cnvSize, 0.7 * cnvSize);
	cnv.parent('sketch');

    spacing = height / 10;
    generateTriangleGrid();
    generateWalk();
    console.log("Generated Walk:");
    console.log(walk);
 }

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(0);
    stroke(255);
    for(let i = 0; i < nodes.length; i++) {
        ellipse(nodes[i].x, nodes[i].y, spacing / 8, spacing / 8);
    }

    fill(255, 0, 0);
    stroke(255, 0, 0);
    ellipse(walk[0].x, walk[0].y, spacing / 8, spacing / 8);
    for(let i = 1; i < walk.length; i++) {
        noStroke();
        ellipse(walk[i].x, walk[i].y, spacing / 8, spacing / 8);
        stroke(0, 255, 0);
        strokeWeight(2);
        line(walk[i].x, walk[i].y, walk[i-1].x, walk[i-1].y);
    }
    noLoop();
}

