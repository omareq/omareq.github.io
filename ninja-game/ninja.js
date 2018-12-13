class Ninja {
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
	}

	setSprites(spriteIdle, spriteRun, spriteJump) {
		this.spriteRun  = spriteRun;
		this.spriteJump = spriteJump;
		this.spriteIdle = spriteIdle;
		this.spritesLoaded = true;
	}

	update() {
		if(this.jumpNum) {
			this.vy += this.g;
			this.y += this.vy;

			// on final move of the jump stay in with that position
			if(this.moveCounter == 9) {
				this.moveCounter = 8;
			}

			if(this.y + this.h >= this.floorHeight) {
				this.jumpNum = 0;
				this.vy = 0;
				this.y = this.floorHeight - this.h;
				this.moveMode = this.runMode;
			}
		}	

		this.moveCounter ++;
		this.moveCounter %= 10;	
	}

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

	// optimal gravity 0.8, optimal jump vy = -15
	jump() {
		if(this.jumpNum < 3) {
			this.vy = -15;
			this.jumpNum++;
			this.moveMode = this.jumpMode;
			this.moveCounter = 0;
		}
	}

	drop() {
		this.vy = 25;
	}

	draw() {
		if(!this.spritesLoaded) {
			stroke(255);
			fill(0);
			rect(this.x, this.y, this.w, this.h);
		} else {
			if(this.moveMode == this.runMode) {
				image(this.spriteRun[this.moveCounter], this.x, this.y, this.w, this.h);
			} else if(this.moveMode == this.jumpMode) {
				image(this.spriteJump[this.moveCounter], this.x, this.y, this.w, this.h);
			} else {
				image(this.spriteIdle[this.moveCounter], this.x, this.y, this.w, this.h);
			}
		}
	}
}