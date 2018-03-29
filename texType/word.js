function Word(val, ypos) {
  this.green = color(0, 2550, 0);
  this.amber = color(244, 244, 66);
  this.red = color(255, 0, 0);
  this.val = val;
  this.width = textWidth(this.val);
  this.y = ypos;
  this.x = 0;
  this.run = false;
  this.speed = 0;

  this.holdOn = function() {
    this.x = 0;
    this.y = floor(random(1, 22)) * textHeight;
    this.run = false;
  }

  this.holdOff = function() {
    this.run = true;
  }

  this.setSpeed = function(increment) {
    this.speed += increment;
  }

  this.runOffscreen = function() {
    return (this.x + this.width) > width;
  }

  this.intersects = function(word) {
  	if(!word.run || word === this) {
  		return false;
  	}

    if(word.y == this.y) {
      if(this.x + this.width > word.x && this.x + this.width < word.x + word.width) {
        return true;
      }
    }
    return false;
  }

  this.show = function() {
    if(this.run){
      fill(this.green);
      if(this.x > width * 0.6) {
        fill(this.amber);
      } 
      if(this.x > width * 0.85) {
        fill(this.red);
      }
      text(this.val, this.x, this.y);
      this.x += this.speed;;
    }
  }

}