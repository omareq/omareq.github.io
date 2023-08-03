/*******************************************************************************
 *
 *  @file sketch.js My take of on the classic hang man word guessing game
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 03-August-2023
 *  @link https://omareq.github.io/hang-man/
 *  @link https://omareq.github.io/hang-man/docs/
 *
*******************************************************************************/

class Hangman {

    /**
     * Constructs a new instance of Hangman
     *
     * @param      {p5.Vector}  pos            The top left position
     * @param      {number}  width             The width in pixels
     * @param      {number}  height            The height in pixels
     * @param      {number}  [strokeWeight=5]  The stroke weight
     * @param      {number}  [strokeCol=255]   The stroke col
     */
    constructor(pos, width, height, strokeWeight=5, strokeCol=255) {
        this.strokeWeight = strokeWeight;
        this.strokeCol = strokeCol;

        this.resize(pos, width, height);
        this.calculateLocations();
    }

    resize(pos, width, height) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.calculateLocations();
    }

    calculateLocations() {
        this.centreX = this.pos.x + 0.5 * this.width;
        this.centreY = this.pos.y + 0.5 * this.height;
        this.left = this.pos.x;
        this.right = this.pos.x + this.width;
        this.top = this.pos.y;
        this.bottom = this.pos.y + this.height;

        this.verticalPoleX = this.left + 0.25 * this.width;
        this.lowerSupprtY = this.bottom - 0.25 * this.height;
        this.upperSupprtY = this.top + 0.25 * this.height;
        this.hangX = this.verticalPoleX + 0.5 * this.width;
        this.hangY = this.top + 0.15 * this.height;

        this.headSize = 0.1 * this.height;
        this.torsoY = this.top + 0.45 * this.height;
        this.armLeft = this.hangX - 0.15 * this.height;
        this.armRight = this.hangX + 0.15 * this.height;
        this.armTopY = this.top + 0.25 * this.height;
        this.armBottomY = this.top + 0.4 * this.height;
        this.legBottom = this.top + 0.7 * this.height
    }

    drawBase() {
        line(this.left, this.bottom, this.right, this.bottom);
    }

    drawVerticalPole() {
        line(this.verticalPoleX, this.bottom, this.verticalPoleX, this.top);
    }

    drawHorizontalPole() {
        line(this.verticalPoleX, this.top, this.hangX, this.top);
    }

    drawTriangleSupportLowerLeft() {
        line(this.left, this.bottom, this.verticalPoleX, this.lowerSupprtY);
    }

    drawTriangleSupportLowerRight() {
        line(this.centreX, this.bottom, this.verticalPoleX, this.lowerSupprtY);
    }

    drawTriangleSupportUpper() {
        line(this.centreX, this.top, this.verticalPoleX, this.upperSupprtY);
    }

    drawHangingVertical() {
        line(this.hangX, this.top, this.hangX, this.hangY);
    }

    drawHead() {
        ellipse(this.hangX, this.hangY, this.headSize, this.headSize);
    }

    drawTorso() {
        line(this.hangX, this.hangY, this.hangX, this.torsoY);
    }

    drawLeftArm() {
        line(this.hangX, this.armTopY, this.armLeft, this.armBottomY);
    }

    drawRightArm() {
        line(this.hangX, this.armTopY, this.armRight, this.armBottomY);
    }

    drawLeftLeg() {
        line(this.hangX, this.torsoY, this.armLeft, this.legBottom);
    }

    drawRightLeg() {
        line(this.hangX, this.torsoY, this.armRight, this.legBottom);
    }

    draw(numberOfLinesToDraw) {
        push();
        strokeWeight(this.strokeWeight);
        stroke(this.strokeCol);
        switch(numberOfLinesToDraw) {
          default:
            console.log("Default Draw All Lines In Hangman");
          case 13:
            this.drawRightLeg();
          case 12:
            this.drawLeftLeg();
          case 11:
            this.drawRightArm();
          case 10:
            this.drawLeftArm();
          case 9:
            this.drawTorso();
          case 8:
            this.drawHead();
          case 7:
            this.drawHangingVertical();
          case 6:
            this.drawTriangleSupportUpper();
          case 5:
            this.drawHorizontalPole();
          case 4:
            this.drawTriangleSupportLowerRight();
          case 3:
            this.drawTriangleSupportLowerLeft();
          case 2:
            this.drawVerticalPole();
          case 1:
            this.drawBase();
          case 0:
        }
        pop();

    }

}
