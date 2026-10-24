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
     * @param      {Integer}  gridSize            The number of rows and columns
     * @param      {Integer}  numColours          The number of possible colours
     * @param      {Float}    x                   Horizontal position of the
     *                                            grid in pixels
     * @param      {Float}    y                   Vertical position of the grid
     *                                            in pixels
     * @param      {Float}    sizePixels          Size of the grid in pixels
     * @param      {boolean}  [randomise=false]   If the grid should be given a
     *                                            random initial value
     * @param      {boolean}  [showNumbers=true]  The show numbers flag
     */
    constructor(gridSize,
      numColours,
      x, y,
      sizePixels,
      randomise = true,
      showNumbers = false) {

        this.gridSize = gridSize;
        this.numColours = numColours;
        this.x = x;
        this.y = y;
        this.sizePixels = sizePixels;
        this.boxSize = this.sizePixels / this.gridSize;
        this.showNumbers = showNumbers;
        this.showOutline = true;
        this.showAllInsideAreaLines = false;
        this.outlineWeight = 0.08 * this.boxSize;
        this.insideArea = [[0, 0]];

        this.lastRow = -1;
        this.lastCol = -1;
        this.visited = [];
        this.frontier = [[0, 0]];
        this.maxclick = 50.0 * this.gridSize * this.numColours;
        this.maxclick = Math.floor(this.maxclick / 168) + 1;

        this.grid = [];
        for(let row = 0; row < this.gridSize; ++row) {
            this.grid.push([]);
            for(let col = 0; col < this.gridSize; ++col) {
                this.grid[row].push(0);
            }
        }

        if(randomise) {
            this.randomiseGrid();
        }
        this.calculateInsideArea();
    }

    /**
     * Finds the colour of the tile at the given position in pixels.
     *
     * @param      {Integer}  xPos    The x position in pixels
     * @param      {Integer}  yPos    The y position in pixels
     * @return     {Integer}  Number representing the colour of the tile.
     */
    colourAt(xPos, yPos) {
        const lastRow = Math.floor(yPos / this.boxSize);
        const lastCol = Math.floor(xPos / this.boxSize);
        return this.grid[lastRow][lastCol];
    }

    /**
     * Finds the Manhattan neighbours of a given tile in the grid
     *
     * @param      {Array}  gridIndex  The grid index values in an array.  The
     *                                 first value of each index is the row
     *                                 index and the second value is the column
     *                                 index.
     * @return     {Array}  The index values of all the neighbours as a 2D array
     */
    getNeighbours(gridIndex) {
        const rowIndex = gridIndex[0];
        const colIndex = gridIndex[1];

        // Manhattan directions
        // Add diagonal directions to get faster fill
        let directions = [[0, 1],
                          [0, -1],
                          [1, 0],
                          [-1, 0]];

        let neighbourList = [];
        for(let i = 0; i < directions.length; ++i) {
            const neighbourRow = rowIndex + directions[i][0];
            const neighbourCol = colIndex + directions[i][1];

            if(neighbourRow < 0 || neighbourRow >= this.gridSize) {
                continue;
            }

            if(neighbourCol < 0 || neighbourCol >= this.gridSize) {
                continue;
            }

            neighbourList.push([neighbourRow, neighbourCol]);
        }
        return neighbourList;
    }

    /**
     * Determines if the given tile is the colour of any of the values in the
     * wanted colour list stored in the object.  This wanted colour list is
     * determined when the mouse is clicked and is given by the colour value of
     * the tile at the cursor location as well as the colour value of the tile
     * at the top left position (this.grid[0][0]).
     *
     * @param      {Array}   tileIndex  The tile index with the first value
     *                                  being the row index and the second value
     *                                  being the column index
     * @return     {boolean}  true when the given tile is one of the colours in
     *                        the this.wantedColours array.
     * @see colourAt
     */
    tileHasColour(tileIndex) {
        const rowIndex = tileIndex[0];
        const colIndex = tileIndex[1];
        const checkingColour = this.grid[rowIndex][colIndex];

        for(let i = 0; i < this.wantedColours.length; ++i) {
            if(checkingColour == this.wantedColours[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determines if the given tile has been previously visited during the flood
     * fill algorithm.  This is done my comparing the given index to an array
     * of indices of previously traversed tiles in the grid.  This array is
     * updated as each tile is "explored" and is reset to [] every time the
     * mouse is pressed at the beginning of this.fill.
     *
     * @param      {Array}   tileIndex  The tile index with the first value
     *                                  being the row index and the second value
     *                                  being the column index
     * @return     {boolean}  { description_of_the_return_value }
     *
     * @see fill
     * @see notBeenNeighbour
     */
    notBeenVisited(tileIndex) {
        const rowIndex = tileIndex[0];
        const colIndex = tileIndex[1];

        for(let i = 0; i < this.visited.length; i++) {
            if(tileIndex[0] == this.visited[i][0] && tileIndex[1] == this.visited[i][1]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Determines if the given tile is already a neighbour encountered in the
     * previous steps of the flood fill algorithm.  This is done my comparing
     * the given index to an array of indices of previously traversed tiles in
     * the grid.  This array is updated as each tile is encountered as a
     * neighbour to an explored tile and is reset to [] every time the
     * mouse is pressed at the beginning of this.fill.
     *
     * @param      {Array}   tileIndex  The tile index with the first value
     *                                   being the row index and the second value
     *                                   being the column index
     * @return     {boolean}  { description_of_the_return_value }
     *
     * @see fill
     * @see notBeenVisited
     */
    notBeenNeighbour(tileIndex) {
        const rowIndex = tileIndex[0];
        const colIndex = tileIndex[1];

        if(this.neighbours.length == 0) {
            return true;
        }

        for(let i = 0; i < this.neighbours.length; ++i) {
            if(tileIndex[0] == this.neighbours[i][0] && tileIndex[1] == this.neighbours[i][1]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Implements the flood fill algorithm
     *
     * @param      {Integer}  selectedColour  Number representing the selected
     *                                        colour
     * @return     {Integer}  Integer indicating the success condition of the
     *                        function.  The only error condition resulting in
     *                        -1 occurs when the selected colour is equal to the
     *                        colour of the top left tile (this.grid[0][0]). All
     *                        other condition result in success and return 0.
     */
    fill(selectedColour) {
        const prevColour = this.grid[0][0];
        if(selectedColour == prevColour) {
            return -1;
        }
        this.wantedColours = [selectedColour, prevColour];
        let boundColourFilter = this.tileHasColour.bind(this);
        let boundVisitFilter = this.notBeenVisited.bind(this);
        let boundNeighbourFilter = this.notBeenNeighbour.bind(this);
        this.frontier = [[0,0]];
        this.visited = [];

        let watchdog = 0;
        while(this.frontier.length) {
            watchdog++;
            if(watchdog > 100) {
                break;
            }
            //console.log("\nLOOP COUNT: ", watchdog, "\n");

            this.neighbours = [];
            for(let i = this.frontier.length - 1; i >= 0; --i) {
                const frontierRow = this.frontier[i][0];
                const frontierCol = this.frontier[i][1];
                const currentColour = this.grid[frontierRow][frontierCol];
                this.grid[frontierRow][frontierCol] = selectedColour;

                if(currentColour != prevColour) {
                    continue;
                }

                let currentNeighbours = this.getNeighbours(this.frontier[i]);
                let colourFilter = currentNeighbours.filter(boundColourFilter);
                let visitFilter = colourFilter.filter(boundVisitFilter);
                let finalNeighbours = visitFilter.filter(boundNeighbourFilter);

                this.neighbours = this.neighbours.concat(finalNeighbours);

                this.visited.push(this.frontier.splice(i, 1)[0]);
                this.visited = [...new Set(this.visited)];
            }
            //console.log("Visited: ", this.visited);
            //console.log("Neighbours: ", this.neighbours);

            this.frontier = [];
            this.frontier = this.frontier.concat(this.neighbours);
            //console.log("New Frontier: ", this.frontier);
        }
        this.calculateInsideArea();
        //console.log("Exit");
        return 0;
    }

    /**
    * A method to calculate all of the boxes that are currently inside the
    * filled area.  This needs to be explicitly calculated separetely to
    * the filling algorithm because if there are boxes which are adjacent
    * to the fill area with the correct color this fill algorithm will
    * ignore them to prevent visiting unecessary boxes.
    */
    calculateInsideArea() {
        this.wantedColours = [this.grid[0][0]];
        let boundColourFilter = this.tileHasColour.bind(this);
        let boundVisitFilter = this.notBeenVisited.bind(this);
        let boundNeighbourFilter = this.notBeenNeighbour.bind(this);
        this.frontier = [[0,0]];
        this.visited = [];
        this.insdeArea = [];
        let insideAreaSet = new Set();

        let watchdog = 0;
        while(this.frontier.length) {
            watchdog++;
            if(watchdog > 100) {
                break;
            }
            this.neighbours = [];
            for(let i = this.frontier.length - 1; i >= 0; --i) {
                const frontierRow = this.frontier[i][0];
                const frontierCol = this.frontier[i][1];
                const currentColour = this.grid[frontierRow][frontierCol];
                insideAreaSet.add(str(frontierRow) + "," + str(frontierCol));

                if(! this.notBeenVisited(this.frontier[i])) {
                    console.log("ASSERT Weird: calculateInsideArea(): tile "
                        + this.frontier[i] + "has been visited - skipping");
                    continue;
                }

                let currentNeighbours = this.getNeighbours(this.frontier[i]);
                let colourFilter = currentNeighbours.filter(boundColourFilter);
                let visitFilter = colourFilter.filter(boundVisitFilter);
                let finalNeighbours = visitFilter.filter(boundNeighbourFilter);

                this.neighbours = this.neighbours.concat(finalNeighbours);

                this.visited.push(this.frontier.splice(i, 1)[0]);
                this.visited = [...new Set(this.visited)];
            }
            this.frontier = [];
            this.frontier = this.frontier.concat(this.neighbours);
        }


        this.insideArea = [... insideAreaSet];
        for(let i = 0; i < this.insideArea.length; i++) {
            const splitStr = this.insideArea[i].split(",");
            this.insideArea[i] = [parseInt(splitStr[0]), parseInt(splitStr[1])];
        }
        return 0;
    }

    /**
     * Method that randomly selects colours for each tile in the grid
     */
    randomiseGrid() {
        for(let row = 0; row < this.gridSize; ++row) {
            for(let col = 0; col < this.gridSize; ++ col) {
                const newColor = Math.floor(Math.random() * this.numColours);
                this.grid[row][col] = newColor;
            }
        }
    }

    /**
     * Determines if all of the grid has the same colour.
     *
     * @return     {boolean}  true when the whole grid is the same colour
     */
    winState() {
        const firstColour = this.grid[0][0];
        for(let row = 0; row < this.gridSize; ++row) {
            for(let col = 0; col < this.gridSize; ++col) {
                if(this.grid[row][col] != firstColour) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Toggle the internal state of the show numbers flag
     */
    toggleShowNumbers() {
        this.showNumbers = !this.showNumbers;
    }

    /**
     * Method that draws the grid in the given position at the given dimensions
     */
    draw() {
        const halfBoxSize = 0.5 * this.boxSize;

        if(this.showNumbers) {
            textSize(halfBoxSize);
            textAlign(CENTER, CENTER);
        }

        push();
        colorMode(HSB, 100);
        noStroke();
        for(let row = 0; row < this.gridSize; ++row) {
            for(let col = 0; col < this.gridSize; ++ col) {
                const yPos = this.y + row * this.boxSize;
                const xPos = this.x + col * this.boxSize;

                const colourVal = this.grid[row][col];
                const hue = 100 * colourVal / this.numColours;
                fill(hue, 100, 100);
                rect(xPos, yPos, this.boxSize, this.boxSize);

                if(this.showNumbers) {
                    push();
                    fill(hue, 25, 75);
                    text(colourVal, xPos + halfBoxSize, yPos + halfBoxSize);
                    pop();
                }
            }
        }
        pop();
        if(this.showOutline) {
            this.drawOutline();
        }
    }

     /**
     * Method that draws a line above the given box coordinates
     *
     * @param      {Float}  xPos  x pixel coordinate of the top left of the box
     * @param      {Float}  yPos  y pixel coordinate of the top left of the box
     */
    drawLineUp(xPos, yPos) {
        strokeWeight(this.outlineWeight);
        if(yPos == 0) {
            strokeWeight(this.outlineWeight * 2);
        }
        line(xPos, yPos, xPos + this.boxSize, yPos);
    }

    /**
     * Method that draws a line to the right of the given box coordinates
     *
     * @param      {Float}  xPos  x pixel coordinate of the top left of the box
     * @param      {Float}  yPos  y pixel coordinate of the top left of the box
     */
    drawLineRight(xPos, yPos) {
        strokeWeight(this.outlineWeight);
        if(xPos == this.gridSize - 1) {
            strokeWeight(this.outlineWeight * 2);
        }
        line(xPos + this.boxSize, yPos, xPos + this.boxSize, yPos + this.boxSize);
    }

    /**
     * Method that draws a line below the given box coordinates
     *
     * @param      {Float}  xPos  x pixel coordinate of the top left of the box
     * @param      {Float}  yPos  y pixel coordinate of the top left of the box
     */
    drawLineDown(xPos, yPos) {
        strokeWeight(this.outlineWeight);
        if(yPos == this.gridSize - 1) {
            strokeWeight(this.outlineWeight * 2);
        }
        line(xPos, yPos + this.boxSize, xPos + this.boxSize, yPos + this.boxSize);
    }

    /**
     * Method that draws a line to the left of the given box coordinates
     *
     * @param      {Float}  xPos  x pixel coordinate of the top left of the box
     * @param      {Float}  yPos  y pixel coordinate of the top left of the box
     */
    drawLineLeft(xPos, yPos) {
        strokeWeight(this.outlineWeight);
        if(xPos == 0) {
            strokeWeight(this.outlineWeight * 2);
        }
        line(xPos, yPos, xPos, yPos + this.boxSize);
    }

    /**
     * Method that draws a boundary line around all of the boxes within the
     * filled area
     */
    drawOutline() {
        push();
        const startCol = this.grid[0][0];

        stroke(0);
        strokeCap(SQUARE);

        for(let i = 0; i < this.insideArea.length; i++) {
            const yPos = this.y + this.insideArea[i][0] * this.boxSize;
            const xPos = this.x + this.insideArea[i][1] * this.boxSize;

            if(this.showAllInsideAreaLines) {
                this.drawLineUp(xPos, yPos);
                this.drawLineDown(xPos, yPos);
                this.drawLineLeft(xPos, yPos);
                this.drawLineRight(xPos, yPos);
                continue;
            }

            if(this.insideArea[i][0] == 0) {
                this.drawLineUp(xPos, yPos);
            } else if (this.grid[this.insideArea[i][0] - 1][this.insideArea[i][1]] != startCol) {
                this.drawLineUp(xPos, yPos);
            }

            if(this.insideArea[i][0] == this.gridSize - 1) {
                this.drawLineDown(xPos, yPos);
            } else if (this.grid[this.insideArea[i][0] + 1][this.insideArea[i][1]] != startCol) {
                this.drawLineDown(xPos, yPos);
            }

            if(this.insideArea[i][1] == 0) {
                this.drawLineLeft(xPos, yPos);
            } else if (this.grid[this.insideArea[i][0]][this.insideArea[i][1] - 1] != startCol) {
                this.drawLineLeft(xPos, yPos);
            }

            if(this.insideArea[i][1] == this.gridSize - 1) {
                this.drawLineRight(xPos, yPos);
            } else if (this.grid[this.insideArea[i][0]][this.insideArea[i][1] + 1] != startCol) {
                this.drawLineRight(xPos, yPos);
            }
        }
        pop();
    }
}
