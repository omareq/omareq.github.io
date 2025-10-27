

var UI = UI || {};

UI.Button = class {
    constructor(pos, width, height, text, bg_color) {
        this.pos = pos.copy();
        this.width = width;
        this.height = height;
        this.text = text;
        this.bg_color = bg_color;
        this.isTicked = false;
    }

    isPressed() {
        if(!mouseIsPressed) {
            return false;
        }

        if(mouseX < this.pos.x || mouseX > this.pos.x + this.width) {
            return false;
        }

        if(mouseY < this.pos.y || mouseY > this.pos.y + this.height) {
            return false;
        }

        return true;
    }

    tick() {
        this.isTicked = true;
    }

    untick() {
        this.isTicked = false;
    }

    draw() {
        push();
        fill(this.bg_color);
        stroke(0);
        strokeWeight(0.07 * this.height);
        rectMode(CORNER);
        rect(this.pos.x, this.pos.y, this.width, this.height);

        if(this.isTicked) {
            stroke(55);
            // strokeWeight()
            line(this.pos.x, this.pos.y,
                this.pos.x + this.width, this.pos.y + this.height);
        }

        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(0.5 * this.height);
        text(this.text, this.pos.x + this.width/2, this.pos.y + this.height / 2);
        pop();
    }
}