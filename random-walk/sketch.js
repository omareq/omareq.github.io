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

function contains(nodesList, nodeIndecies) {
    for(let nodeIndex = 0; nodeIndex < nodesList.length; nodeIndex++) {
        const node = nodesList[nodeIndex];
        if(node.i == nodeIndecies[0] && node.j == nodeIndecies[1]) {
            return true;
        }
    }
    return false;
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
            if(pnt.y <= 0 || pnt.x >= width || pnt.y >= height) {
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
    noLoop();
}

