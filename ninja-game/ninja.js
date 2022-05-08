/*******************************************************************************
*	@file       Ninja.js contains the ninja class
* 	@author     Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
* 	@version    1.0
* 	@date 		24-Aug-2018
*
*******************************************************************************/

/**
 * This class describes a ninja.
 *
 * @class      Ninja ()
 * @author     Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 */
class Ninja {

	/**
	 * Constructs an instance of a Ninja object
	 *
	 * @param      {number}  x            The x position of the ninja
	 * @param      {number}  y            The y position of the ninja
	 * @param      {number}  w            The width of the ninja
	 * @param      {number}  h            The height of the ninja
	 * @param      {number}  floorHeight  The floor height
	 * @param      {number}  g            The strength of gravity on the ninja
	 */
	constructor(x, y, w, h, floorHeight, g) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.floorHeight = floorHeight;
		this.g = g;
		this.jumpNum = 1;
		this.vy = 0;
		this.spritesLoaded = false;
		this.spriteIdle = [];
		this.spriteRun = [];
		this.spriteJump = [];

		this.idleMode = 0;
		this.runMode = 1;
		this.jumpMode = 2;
		this.moveMode = this.idleMode; // 0 = idle, 1 = run, 2 = jump
		this.moveCounter = 0;

		this.omega = 0;
		this.theta = 0;
	}

	/**
	 * Resets the ninja.
	 */
	reset() {
		this.idleMode = 0;
		this.runMode = 1;
		this.jumpMode = 2;
		this.moveMode = this.runMode; // 0 = idle, 1 = run, 2 = jump
		this.moveCounter = 0;

		this.omega = 0;
		this.theta = 0;

		this.jumpNum = 1;
		this.vy = 0;
	}

	/**
	 * Sets the sprite images for the idle, running an jumping positions.
	 *
	 * @param      {Array<p5.Image>}  spriteIdle  The sprite idle images
	 * @param      {Array<p5.Image>}  spriteRun   The sprite run images
	 * @param      {Array<p5.Image>}  spriteJump  The sprite jump images
	 */
	setSprites(spriteIdle, spriteRun, spriteJump) {
		this.spriteRun = spriteRun;
		this.spriteJump = spriteJump;
		this.spriteIdle = spriteIdle;
		this.spritesLoaded = true;
	}

	/**
	 * Sets the sounds for the ninja.
	 *
	 * @param      {Array<p5.SoundFile>}  sounds  The sounds the ninja makes
	 */
	setSounds(sounds) {
		this.sounds = sounds;
		this.jumpSoundIndex = 0;
		this.loadedSounds = true;
	}

	/**
	 * Updates the objects location during the physics loop.  This function will
	 * calculate the height of the object during jumps as well as the spin angle
	 */
	update() {
		if(this.jumpNum) {
			this.vy += this.g;
			this.y += this.vy;

			this.theta += this.omega;
			if(this.theta > TWO_PI) {
				this.theta = 0;
				this.omega = 0;
			}

			// on final move of the jump stay in with that position
			if(this.moveCounter == 9) {
				this.moveCounter = 8;
			}

			if(this.y + this.h >= this.floorHeight) {
				this.jumpNum = 0;
				this.vy = 0;
				this.y = this.floorHeight - this.h;
				this.moveMode = this.runMode;

				this.theta = 0;
				this.omega = 0;
			}
		}

		this.moveCounter += 0.5;
		this.moveCounter %= 10;
	}

	/**
	 * Checks to see if the ninja has collided with a specified obstacle.  This
	 * is done by checking to see if any boundaries overlap.
	 *
	 * @param      {Obstacle}   obstacle  The obstacle to check for collision
	 * @return     {boolean}  True when the objects has collided with the ninja
	 */
	collideWith(obstacle) {
		// reduce the size of collision box around the ninja
		let buffer = 3;
		if(this.x + buffer > obstacle.x + obstacle.w) {
			return false;
		}

		if(this.y + buffer > obstacle.y + obstacle.h) {
			return false;
		}

		if(this.x + this.w - buffer < obstacle.x) {
			return false;
		}

		if(this.y + this.h - buffer < obstacle.y) {
			return false;
		}
		return true;
	}

	/**
	 * Makes the ninja jump.  This is done by giving the ninja an upwards
	 * velocity of 15.<br>
	 * Also plays the sound file for jumping.
	 */
	jump() {
		// optimal gravity 0.8, optimal jump vy = -15
		if(this.jumpNum < 3) {
			this.vy = -15;
			this.jumpNum++;
			this.moveMode = this.jumpMode;
			this.moveCounter = 0;

			if(this.jumpNum == 2) {
				this.omega = 0.2;
				this.theta = 0;
			}

			if(this.loadedSounds) {
				this.sounds[this.jumpSoundIndex].play();
			}
		}
	}

	/**
	 * Drops the ninja back down to the ground from a jump faster than usual.
	 * This is done by setting a large downward velocity of 25.  Gravity and
	 * other physics will then act as normal to bring the ninja to the ground.
	 */
	drop() {
		this.vy = 25;
	}

	/**
	 * Draws the ninja on the canvas in the appropriate position.  If the sprite
	 * images have not loaded properly this will adjust and just draw a simple
	 * rectangle in it's place.
	 */
	draw() {
		if(!this.spritesLoaded) {
			stroke(255);
			fill(0);
			rect(this.x, this.y, this.w, this.h);
		} else {
			let moveCounter = floor(this.moveCounter);

			push();
			translate(this.x + 0.5 * this.w, this.y + 0.5 * this.h);
			rotate(this.theta);
			if(this.moveMode == this.runMode) {
				image(this.spriteRun[moveCounter], -0.5 * this.w, -0.5 * this.h,
				 this.w, this.h);
			} else if(this.moveMode == this.jumpMode) {
				image(this.spriteJump[moveCounter], -0.5 * this.w, -0.5 * this.h,
				 this.w, this.h);
			} else {
				image(this.spriteIdle[moveCounter], -0.5 * this.w, -0.5 * this.h,
				 this.w, this.h);
			}
			pop();
		}
	}
}