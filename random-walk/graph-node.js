/*******************************************************************************
 *
 *	@file graph-node.js Class for graph node on the grid
 *
 *	@author Omar Essilfie-Quaye <omareq08@gmail.com>
 *	@version 1.0
 *	@date 11-June-2021
 *
 *****************************************************************************/

/**
 * This class describes a graph node.  This stores the information about each
 * lattice node.
 *
 * @class      GraphNode (name)
 */
class GraphNode {

    /**
     * Constructs a new instance of GraphNode.
     *
     * @param      {Integer}  i       Lattice Index corresponding to the r1
     *                                lattice vector
     * @param      {Integer}  j       Lattice Index corresponding to the r1
     *                                lattice vector
     * @param      {float}  x       x Coordinate corresponding to the position
     *                              of the node in pixel coordinates on the
     *                              canvas.
     * @param      {float}  y       y Coordinate corresponding to the position
     *                              of the node in pixel coordinates on the
     *                              canvas.
     */
    constructor(i, j, x, y) {
        this.i = i;
        this.j = j;
        this.x = x;
        this.y = y;
        this.visited = false;
        this.neighbours = [];
    }

    /**
     * Sets the neighbours list.
     *
     * @param      {Array<Array<Integers> >}  neighbourList  The neighbour list
     *             . Each neighbour should have 2 elements corresponding to the
     *             lattice vectors.  Example neighbour list for the node [0,0]
     *             is:
     *                  [[0, 1], [0, -1], [1, 0], [-1, 0]]
     */
    setNeighbours(neighbourList) {
        this.neighbours = neighbourList;
    }
}