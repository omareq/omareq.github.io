class Rain{
	constructor(col, width, maxLen, speed) {
		this.col = col;
		this.width = width;
		this.maxLen = maxLen;
		this.randomLength();
		this.speed = speed;
		this.scale = 0.45;
		this.setHeight();
	}

	setHeight() {
		let newHeight = random(-height, 0)
		this.symbols = []

		this.symbols.push(new Heart(this.col * this.width,
		  newHeight,
		  this.width * this.scale,
		  "pink"));
		
		for (let i = this.len - 2; i >= 0; i--) {
			this.symbols.push(new Heart(this.col * this.width,
			 newHeight - 2 * (this.len - 1) * this.width + 2 * i * this.width,
			 this.width * this.scale,
			 "red"));
		}
	}

	randomLength() {
		this.len = floor(random(1, this.maxLen));
	}

	reset() {
		this.randomLength;
		this.setHeight();
		this.symbols[0].stopPulse();
		//console.log("Reseting rain at col: ", this.col);
	}

	draw() {
		for (let i = this.len - 1; i >= 0; i--) {
			this.symbols[i].draw();
			let pos = this.symbols[i].getPos();
			this.symbols[i].setPos(pos.x, pos.y + this.speed);

			if(i == this.len - 1) {
				if(pos.y > height) {
					this.reset();
				}
			}
		}

		// 5% chance of starting a new pulse
		if(random() < 0.05) {
			this.symbols[0].pulse(0.05 * this.width);
		}
	}
}