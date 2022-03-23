/*******************************************************************************
 *
 *	@file graph-node.js Class for graph node on the grid
 *
 *	@author Omar Essilfie-Quaye <omareq08@gmail.com>
 *	@version 1.0
 *	@date 11-June-2021
 *
 *****************************************************************************/

class GraphNode {

    constructor(i, j, x, y) {
        this.i = i;
        this.j = j;
        this.x = x;
        this.y = y;
        this.visited = false;
        this.neighbours = [];
    }

    setNeighbours(neighbourList) {
        this.neighbours = neighbourList;
    }
}