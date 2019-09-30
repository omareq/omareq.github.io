/*******************************************************************************
 *
 *  @file sketch.js Grid Class
 *
 *  @author Omar Essilfie-Quaye <omareq08@gmail.com>
 *  @version 1.0
 *  @date 30-September-2019
 *
*******************************************************************************/

/**
 * Class for grid.
 *
 * @class      Grid
 */
class Grid {

    /**
     * Constructs for the Grid object.
     *
     * @param      {Integer}   size               The number of rows and columns
     * @param      {Integer}   numColours         The number of possible colours
     * @param      {boolean}   [randomise=false]  If the grid should be given a
     *  random initial value
     */
    constructor(size, numColours, randomise=true) {
        this.size = size;
        this.numColours = numColours;

        this.grid = [];
        for(let row = 0; row < this.size; ++row) {
            this.grid.push([]);
            for(let col = 0; col < this.size; ++ col) {
                this.grid[row].push(0);
            }
        }

        if(randomise) {
            this.randomiseGrid();
        }
    }

    /**
     * Method that randomly selects colours for each tile in the grid
     */
    randomiseGrid() {
        for(let row = 0; row < this.size; ++row) {
            for(let col = 0; col < this.size; ++ col) {
                this.grid[row][col] = Math.floor(Math.random() * this.numColours);
            }
        }
    }

    /**
     * Method that draws the grid in the given position at the given size
     *
     * @param      {Float}   x       Horizontal position of the grid
     * @param      {Float}   y       Vertical position of the grid
     * @param      {Float}   s       Size of the grid in pixels
     */
    draw(x, y, s) {
        const boxSize = s / this.size;

        push();
        colorMode(HSB, 100);
        noStroke();
        for(let row = 0; row < this.size; ++row) {
            for(let col = 0; col < this.size; ++ col) {
                const colourVal = this.grid[row][col];
                const hue = 100 * colourVal / this.numColours;
                fill(hue, 100, 100);
                rect(x + row * boxSize, y + col * boxSize, boxSize, boxSize);
            }
        }
        pop();
    }
}