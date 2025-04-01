


/**
 * TankGame namespace object
 */
var TankGame = TankGame || {};

TankGame.World = {};

// ground

TankGame.World.Terrain = class {
    constructor(width, minHeight, maxHeight, noiseDetail=1) {
        this.width = width;
        this.groundHeight = [];
        const heightRange = maxHeight - minHeight;
        for(let i = 0; i < width; i++) {
            let nextGroundHeight = heightRange * noise(i * noiseDetail) + minHeight;
            this.groundHeight.push(nextGroundHeight);
        }

        this.color = color(155, 155, 155);
    }

    draw() {
        const stepSize = 10;

        stroke(this.color);
        fill(this.color);
        beginShape(TRIANGLE_STRIP);
        vertex(0, height);
        for(let i = 0; i < this.groundHeight.length; i+= stepSize) {
            vertex(i, this.groundHeight[i]);
            vertex(i + stepSize / 2, height);
        }
        vertex(this.width, this.groundHeight[this.groundHeight.length - 1]);
        vertex(this.width, height);

        endShape();
    }
};

// wind