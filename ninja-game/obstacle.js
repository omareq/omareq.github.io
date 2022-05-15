/*******************************************************************************
*	@file       Obstacle.js contains the obstacle class
* 	@author     Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
* 	@version    1.0
* 	@date 		24-Aug-2018
*
*******************************************************************************/

/**
 * This class describes an obstacle.
 *
 * @class      Obstacle ()
 * @author     Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 */
class Obstacle {

	/**
	 * Constructs a new obstacle.
	 *
	 * @param      {number}  x       The x position of the obstacle
	 * @param      {number}  y       The y position of the obstacle
	 * @param      {number}  vx      The horizontal velocity of the obstacle
	 * @param      {number}  w       The width of the obstacle
	 * @param      {number}  h       The height of the obstacle
	 */
	constructor(x, y, vx, w, h) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.w = w;
		this.h = h;
		this.img = null;
		this.spriteLoaded = false;
	}

	/**
	 * Resets the obstacle
	 */
	reset() {
		this.setPos(width);
		this.setVel(fgScrollSpeed);
	}

	/**
	 * Sets the horizontal position of the obstacle.
	 *
	 * @param      {number}  x       The new horizontal position
	 */
	setPos(x) {
		this.x = x;
	}

	/**
	 * Sets the horizontal velocity of the obstacle.
	 *
	 * @param      {number}  vx      The new horizontal velocity
	 */
	setVel(vx) {
		this.vx = vx;
	}

	/**
	 * Updates the object during the physics loop by moving it to the side.  If
	 * The object goes off the canvas it will be wrapped around to the other
	 * side.
	 */
	update() {
		this.x += this.vx;

		if(this.x < 0) {
			this.x = width;
		}
	}

	/**
	 * Sets the sprite image for the obstacle.
	 *
	 * @param      {p5.Image}  img     The new sprite image
	 */
	setSprite(img) {
		this.sprite = img;
		this.spriteLoaded = true;
	}

	/**
	 * Draws the obstacle at the correct location on the canvas.  If the
	 * obstacle image was not loaded correctly a rectangle will be drawn in its
	 * place.
	 */
	draw() {
		if(this.spriteLoaded) {
			image(this.sprite, this.x, this.y, this.w, this.h);
		} else {
			stroke(255, 0, 0);
			fill(0);
			rect(this.x, this.y, this.w, this.h);
		}
	}
}